<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
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
      $user = auth('api')->user();

      $productsToSync = [];
      $orderTotal = 0;

      foreach ($request->products as $product) {
        $productModel = Product::with(['colors', 'sizes'])->findOrFail($product['id']);
        $quantity = $product['quantity'];
        $color = $product['color'];
        $size = $product['size'];

        // Validate stock availability
        $qtyLeft = $productModel->quantity;
        if ($quantity > $qtyLeft) {
          return response()->json([
            'message' => "Insufficient stock for product {$productModel->name}. Only {$qtyLeft} left."
          ], 400);
        }

        if (!$productModel->colors->contains('name', $color)) {
          return response()->json([
            'message' => "Invalid color '{$color}' for product {$productModel->name}."
          ], 400);
        }

        if (!$productModel->sizes->contains('name', $size)) {
          return response()->json([
            'message' => "Invalid size '{$size}' for product {$productModel->name}."
          ], 400);
        }

        // Update product inventory
        $productModel->increment('total_sold', $quantity);
        $productModel->decrement('quantity', $quantity);

        // Prepare pivot table data
        $productsToSync[] = [
          'product_id' => $product['id'],
          'quantity' => $quantity,
          'price' => $productModel->price, // Original price
          'color' => $color,
          'size' => $size,
        ];

        $orderTotal += $productModel->price * $quantity;
      }

      // Create the order without a shipping address
      $order = $user->orders()->create([
        'total_price' => $orderTotal, // Total price before discount
      ]);

      // Sync the products to the order
      foreach ($productsToSync as $pivotData) {
        $order->products()->attach($pivotData['product_id'], $pivotData);
      }

      DB::commit();

      return response()->json($order->load(['shippingAddress', 'products']), 201);
    } catch (Throwable $e) {
      DB::rollBack();

      return response()->json([
        'message' => 'Something went wrong while creating the order. Please try again.',
        'error' => $e->getMessage()
      ], 500);
    }
  }




  public function applyCoupon(Request $request, $orderId) {
    $request->validate([
      'coupon' => 'required|string'
    ]);

    $couponCode = strtoupper($request->coupon);
    $order = Order::findOrFail($orderId);

    // Check if a coupon has already been applied
    if ($order->applied_coupon_id) {
      return response()->json(['message' => 'A coupon has already been applied to this order.'], 400);
    }

    $coupon = Coupon::where('code', $couponCode)
      ->where('start_date', '<=', now())
      ->where('end_date', '>=', now())
      ->first();

    if (!$coupon || $coupon->isExpired) {
      return response()->json(['message' => 'Invalid or expired coupon.'], 400);
    }

    $discount = $coupon->discount / 100;
    $productsToSync = [];
    $newTotalPrice = 0;

    foreach ($order->products as $product) {
      $price = $product->pivot->price; // Original price per unit
      $quantity = $product->pivot->quantity; // Original quantity
      $color = $product->pivot->color; // Color from pivot
      $size = $product->pivot->size;   // Size from pivot

      if (!$quantity || $quantity <= 0) {
        return response()->json(['message' => 'Invalid quantity detected for product ID: ' . $product->id], 400);
      }

      // Calculate discounted price
      $discountedPrice = round($price * (1 - $discount), 2);

      // Find the existing row in the pivot table
      $existingPivot = DB::table('order_product')
        ->where('order_id', $order->id)
        ->where('product_id', $product->id)
        ->where('color', $color)
        ->where('size', $size)
        ->first();

      if ($existingPivot) {
        // Update the existing pivot row
        DB::table('order_product')
          ->where('id', $existingPivot->id)
          ->update([
            'quantity' => $quantity,
            'price' => $discountedPrice,
            'updated_at' => now(),
          ]);
      } else {
        // Create a new pivot row
        DB::table('order_product')->insert([
          'order_id' => $order->id,
          'product_id' => $product->id,
          'quantity' => $quantity,
          'price' => $discountedPrice,
          'color' => $color,
          'size' => $size,
          'created_at' => now(),
          'updated_at' => now(),
        ]);
      }

      // Update the total price
      $newTotalPrice += $discountedPrice * $quantity;
    }

    // Update order total and applied coupon
    $order->update([
      'total_price' => round($newTotalPrice, 2),
      'applied_coupon_id' => $coupon->id,
    ]);

    return response()->json($order->load(['shippingAddress', 'products']), 200);
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

      $productsToSync = [];
      $orderTotal = 0;

      foreach ($request->products as $product) {
        $productModel = Product::with(['colors', 'sizes'])->findOrFail($product['id']);
        $newQuantity = $product['quantity'];
        $color = $product['color'];
        $size = $product['size'];

        // Find the existing pivot entry, if any
        $existingPivot = $order->products()->wherePivot('product_id', $product['id'])
          ->wherePivot('color', $color)
          ->wherePivot('size', $size)
          ->first();

        $oldQuantity = $existingPivot ? $existingPivot->pivot->quantity : 0;

        // Calculate available stock
        $qtyLeft = $productModel->quantity + $oldQuantity;

        // Check stock availability
        if ($newQuantity > $qtyLeft) {
          return response()->json([
            'message' => "Insufficient stock for product {$productModel->name} in {$size}/{$color}. Only {$qtyLeft} left."
          ], 400);
        }

        // Adjust inventory
        if ($newQuantity > $oldQuantity) {
          $diff = $newQuantity - $oldQuantity;
          $productModel->increment('total_sold', $diff);
          $productModel->decrement('quantity', $diff);
        } else {
          $diff = $oldQuantity - $newQuantity;
          $productModel->decrement('total_sold', $diff);
          $productModel->increment('quantity', $diff);
        }

        // Prepare pivot table data
        $productsToSync[] = [
          'product_id' => $product['id'],
          'quantity' => $newQuantity,
          'price' => $productModel->price,
          'color' => $color,
          'size' => $size,
        ];

        // Update total price
        $orderTotal += $productModel->price * $newQuantity;
      }

      // Delete old pivot entries
      $order->products()->detach();

      // Attach new entries
      foreach ($productsToSync as $pivotData) {
        $order->products()->attach($pivotData['product_id'], [
          'quantity' => $pivotData['quantity'],
          'price' => $pivotData['price'],
          'color' => $pivotData['color'],
          'size' => $pivotData['size'],
        ]);
      }

      // Update the order
      $data['total_price'] = $orderTotal; // Update the total price without any discount
      $order->update($data);

      DB::commit();

      // Return the updated order with products
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

    /** @var \App\Models\User $user */
    $user = auth('api')->user();

    // Check if the user has a shipping address
    if (!$user->shippingAddress) {
      return response()->json(['message' => 'User does not have a shipping address set.'], 400);
    }

    // Set the shipping_address_id on the order
    $order->shipping_address_id = $user->shippingAddress->id;
    $order->save();

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
        'success_url' => 'http://localhost:5173/customer-profile?success',
        'cancel_url' => 'http://localhost:5173/customer-profile?cancel',
      ]);

      // Return the session URL
      return response()->json(['url' => $session->url]);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Something went wrong creating the Stripe session'], 500);
    }
  }
}
