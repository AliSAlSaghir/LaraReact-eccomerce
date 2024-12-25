<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Throwable;

class OrderController extends Controller {

  // Get all orders for a specific user
  public function index() {
    /** @var \App\Models\User $user */
    $user = auth('api')->user(); // Explicitly declare the user type for IDE
    $orders = $user->orders()->with(['products'])->get();
    return response()->json($orders);
  }

  // Get a specific order of a user
  public function show(Order $order) {
    Gate::authorize('access', $order);

    return response()->json($order->load(['shippingAddress', 'products']));
  }


  public function store(CreateOrderRequest $request) {
    try {
      DB::beginTransaction();

      $request->validated();

      /** @var \App\Models\User $user */
      $user = auth('api')->user(); // Explicitly declare the user type

      if (!$user->shippingAddress) {
        return response()->json(['message' => 'User does not have a shipping address set.'], 400);
      }

      // Merge duplicate products by summing quantities
      $mergedProducts = [];
      foreach ($request->products as $product) {
        $productId = $product['id'];
        $quantity = $product['quantity'];

        if (isset($mergedProducts[$productId])) {
          $mergedProducts[$productId]['quantity'] += $quantity;
        } else {
          $mergedProducts[$productId] = $product;
        }
      }

      $productsToSync = [];
      $orderTotal = 0;

      // Calculate the total price and prepare products to sync
      foreach ($mergedProducts as $product) {
        $productModel = Product::findOrFail($product['id']);
        $quantity = $product['quantity'];
        $qtyLeft = $productModel->quantity;

        if ($quantity > $qtyLeft) {
          return response()->json([
            'message' => "Insufficient stock for product {$productModel->name}. Only {$qtyLeft} left."
          ], 400);
        }

        $productModel->increment('total_sold', $quantity);
        $productModel->decrement('quantity', $quantity);

        $productsToSync[$product['id']] = [
          'quantity' => $quantity,
          'price' => $productModel->price // Original price
        ];

        // Calculate the total order amount (before applying the coupon)
        $orderTotal += $productModel->price * $quantity;
      }

      // Check if the coupon is provided in the query string
      $couponCode = $request->query('coupon');

      if ($couponCode) {
        $coupon = Coupon::where('code', strtoupper($couponCode))
          ->where('start_date', '<=', now())
          ->where('end_date', '>=', now())
          ->first();

        // If coupon is invalid or expired
        if (!$coupon || $coupon->isExpired) {
          return response()->json(['message' => 'Invalid or expired coupon.'], 400);
        }

        // Apply the coupon discount to each product price
        $discount = $coupon->discount / 100;
        foreach ($productsToSync as $productId => $syncData) {
          $productsToSync[$productId]['price'] = $syncData['price'] * (1 - $discount);
        }

        // Recalculate the order total after applying the coupon
        $orderTotal = 0;
        foreach ($productsToSync as $syncData) {
          $orderTotal += $syncData['price'] * $syncData['quantity'];
        }
      }

      // Create the order with the user's shipping address and total price
      $order = $user->orders()->create([
        'shipping_address_id' => $user->shippingAddress->id,
        'total_price' => $orderTotal, // Total price after discount
      ]);

      // Sync the products to the order
      $order->products()->sync($productsToSync);

      DB::commit();

      return response()->json($order->load('products'), 201);
    } catch (Throwable $e) {
      DB::rollBack();

      return response()->json([
        'message' => 'Something went wrong while creating the order. Please try again.',
        'error' => $e->getMessage()
      ], 500);
    }
  }



  public function update(UpdateOrderRequest $request, Order $order) {
    Gate::authorize('access', $order);

    try {
      DB::beginTransaction();


      // Prevent updates to a paid order
      if (strtolower($order->payment_status) === 'paid') {
        return response()->json(['message' => 'Order has already been paid and cannot be updated! Contact support for help.'], 403);
      }

      // Validate the request data
      $data = $request->validated();

      // Merge duplicate products by summing quantities
      $mergedProducts = [];
      foreach ($request->products as $product) {
        $productId = $product['id'];
        $quantity = $product['quantity'];

        // If the product already exists, sum the quantities
        if (isset($mergedProducts[$productId])) {
          $mergedProducts[$productId]['quantity'] += $quantity;
        } else {
          $mergedProducts[$productId] = $product;
        }
      }

      // Initialize variables for product syncing and total order price calculation
      $productsToSync = [];
      $orderTotal = 0;

      foreach ($mergedProducts as $product) {
        $productModel = Product::findOrFail($product['id']);
        $newQuantity = $product['quantity'];
        $oldQuantity = $order->products()->find($product['id'])->pivot->quantity ?? 0;

        // Calculate qty_left (quantity + oldQuantity because the old quantity is reserved in the order)
        $qtyLeft = $productModel->quantity + $oldQuantity;

        // Check if the requested quantity exceeds the available quantity
        if ($newQuantity > $qtyLeft) {
          return response()->json([
            'message' => "Insufficient stock for product {$productModel->name}. Only {$qtyLeft} left."
          ], 400);
        }

        // Adjust total sold and available quantity
        if ($newQuantity > $oldQuantity) {
          $diff = $newQuantity - $oldQuantity;
          $productModel->increment('total_sold', $diff);
          $productModel->decrement('quantity', $diff);
        } else {
          $diff = $oldQuantity - $newQuantity;
          $productModel->decrement('total_sold', $diff);
          $productModel->increment('quantity', $diff);
        }

        // Add the product price and quantity to calculate total order price
        $productsToSync[$product['id']] = [
          'quantity' => $newQuantity,
          'price' => $productModel->price // Store the product price at the time of order
        ];

        // Add to the total price
        $orderTotal += $productModel->price * $newQuantity;
      }

      // Check if a coupon is provided in the query string
      $couponCode = $request->query('coupon');
      if ($couponCode) {
        $coupon = Coupon::where('code', strtoupper($couponCode))
          ->where('start_date', '<=', now())
          ->where('end_date', '>=', now())
          ->first();

        // If coupon is invalid or expired
        if (!$coupon || $coupon->isExpired) {
          return response()->json(['message' => 'Invalid or expired coupon.'], 400);
        }

        // Apply the coupon discount to each product price
        $discount = $coupon->discount / 100;
        foreach ($productsToSync as $productId => $syncData) {
          $productsToSync[$productId]['price'] = $syncData['price'] * (1 - $discount);
        }

        // Recalculate the order total after applying the coupon
        $orderTotal = 0;
        foreach ($productsToSync as $syncData) {
          $orderTotal += $syncData['price'] * $syncData['quantity'];
        }
      }

      // Sync the updated products with the order
      $order->products()->sync($productsToSync);

      // Set the shipping address from the user
      $data['shipping_address_id'] = auth('api')->user()->shippingAddress->id;
      $data['total_price'] = $orderTotal; // Update the total price after discount

      // Update the order with the validated data
      $order->update($data);

      DB::commit();

      // Return the updated order with the products
      return response()->json($order->load('products'));
    } catch (Throwable $e) {
      DB::rollBack();

      return response()->json([
        'message' => 'Something went wrong while updating the order. Please try again.',
        'error' => $e->getMessage()
      ], 500);
    }
  }






  // Delete an order
  public function destroy(Order $order) {
    Gate::authorize('access', $order);


    // Prevent deletion if the payment status is "paid"
    if (strtolower($order->payment_status) === 'paid') {
      return response()->json(['message' => 'Paid orders cannot be deleted! Contact support for help.'], 403);
    }

    DB::beginTransaction();

    try {
      // Restore the total sold and available quantity for each product
      foreach ($order->products as $product) {
        $quantity = $product->pivot->quantity;

        $product->decrement('total_sold', $quantity);
        $product->increment('quantity', $quantity);
      }

      // Detach products from the order
      $order->products()->detach();

      // Delete the order
      $order->delete();

      DB::commit();

      return response()->noContent();
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['message' => 'Order deletion failed'], 500);
    }
  }

  public function createStripeSession(Request $request, Order $order) {
    Gate::authorize('access', $order);

    if (strtolower($order->payment_status) === 'paid') {
      return response()->json(['message' => 'This order has already been paid.'], 403);
    }

    // Initialize Stripe with the secret key
    Stripe::setApiKey(env('STRIPE_SECRET'));

    // Prepare the order items for the Stripe session
    $orderItems = $order->products()->withPivot('quantity', 'price')->get();

    $convertedOrders = $orderItems->map(function ($item) {
      return [
        'price_data' => [
          'currency' => 'usd',
          'product_data' => [
            'name' => $item->name,
            'description' => $item->description,
          ],
          'unit_amount' => $item->pivot->price * 100, // Stripe expects amounts in cents
        ],
        'quantity' => $item->pivot->quantity,
      ];
    })->toArray();

    // Create the Stripe checkout session
    try {
      $session = Session::create([
        'line_items' => $convertedOrders,
        'metadata' => [
          'order_id' => $order->id,
        ],
        'mode' => 'payment',
        'success_url' => 'http://localhost:3000/success',
        'cancel_url' => 'http://localhost:3000/cancel',
      ]);

      // Return the session URL
      return response()->json(['url' => $session->url]);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Something went wrong creating the Stripe session'], 500);
    }
  }
}
