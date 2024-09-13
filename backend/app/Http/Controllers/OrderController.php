<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Throwable;

class OrderController extends Controller {

  // Get all orders for a specific user
  public function index(User $user) {
    if (auth('api')->user()->id !== $user->id) {
      return response()->json(['message' => 'User mismatching!'], 403);
    }
    $orders = $user->orders()->with(['shippingAddress', 'products'])->get();
    return response()->json($orders);
  }

  // Get a specific order of a user
  public function show(User $user, Order $order) {
    if (auth('api')->user()->id !== $user->id) {
      return response()->json(['message' => 'User mismatching!'], 403);
    }

    return response()->json($order->load(['shippingAddress', 'products']));
  }


  public function store(CreateOrderRequest $request, User $user) {

    if (auth('api')->user()->id !== $user->id) {
      return response()->json(['message' => 'User mismatching!'], 403);
    }

    try {
      // Start a transaction to ensure data consistency
      DB::beginTransaction();

      // Validate the request data
      $data = $request->validated();

      // Ensure the user has a shipping address
      if (!$user->shippingAddress) {
        return response()->json(['message' => 'User does not have a shipping address set.'], 400);
      }

      // Merge duplicate products by summing quantities
      $mergedProducts = [];
      foreach ($request->products as $product) {
        $productId = $product['id'];
        $quantity = $product['quantity'];

        // If the product already exists, sum the quantities
        if (isset($mergedProducts[$productId])) {
          $mergedProducts[$productId]['quantity'] += $quantity;
        } else {
          // Otherwise, add the product to the mergedProducts array
          $mergedProducts[$productId] = $product;
        }
      }

      $productsToSync = [];
      foreach ($mergedProducts as $product) {
        $productModel = Product::findOrFail($product['id']);
        $quantity = $product['quantity'];

        // Calculate qty_left and check if requested quantity exceeds it
        $qtyLeft = $productModel->total_qty;
        if ($quantity > $qtyLeft) {
          return response()->json([
            'message' => "Insufficient stock for product {$productModel->name}. Only {$qtyLeft} left."
          ], 400);
        }

        // Adjust the total sold and available quantity
        $productModel->increment('total_sold', $quantity);
        $productModel->decrement('total_qty', $quantity);

        $productsToSync[$product['id']] = [
          'quantity' => $quantity,
          'price' => $productModel->price // Store the product price at the time of order
        ];
      }

      // Create the order with the user's shipping address (without total price)
      $order = $user->orders()->create([
        'shipping_address_id' => $user->shippingAddress->id,
      ]);

      // Sync the products to the order
      $order->products()->sync($productsToSync);

      // Commit the transaction
      DB::commit();

      return response()->json($order->load('products'), 201);
    } catch (Throwable $e) {
      // Rollback the transaction in case of error
      DB::rollBack();

      // Log the error and return a server error response
      return response()->json([
        'message' => 'Something went wrong while creating the order. Please try again.',
        'error' => $e->getMessage()
      ], 500);
    }
  }




  public function update(UpdateOrderRequest $request, User $user, Order $order) {
    try {
      // Start a transaction to ensure data consistency
      DB::beginTransaction();

      // Ensure the order belongs to the user
      if (auth('api')->user()->id !== $user->id) {
        return response()->json(['message' => 'User mismatching!'], 403);
      }

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
          // Otherwise, add the product to the mergedProducts array
          $mergedProducts[$productId] = $product;
        }
      }

      // Initialize variables for product syncing (no total price calculation)
      $productsToSync = [];

      // Loop through each product in the mergedProducts array
      foreach ($mergedProducts as $product) {
        $productModel = Product::findOrFail($product['id']);
        $newQuantity = $product['quantity'];
        $oldQuantity = $order->products()->find($product['id'])->pivot->quantity ?? 0;

        // Calculate qty_left (total_qty + oldQuantity because the old quantity is reserved in the order)
        $qtyLeft = $productModel->total_qty + $oldQuantity;

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
          $productModel->decrement('total_qty', $diff);
        } else {
          $diff = $oldQuantity - $newQuantity;
          $productModel->decrement('total_sold', $diff);
          $productModel->increment('total_qty', $diff);
        }

        // Prepare the data for syncing with the order
        $productsToSync[$product['id']] = [
          'quantity' => $newQuantity,
          'price' => $productModel->price // Store the product price at the time of order
        ];
      }

      // Sync the updated products with the order
      $order->products()->sync($productsToSync);

      // Set the shipping address from the user
      $data['shipping_address_id'] = $user->shippingAddress->id;

      // Update the order with the validated data
      $order->update($data);

      // Commit the transaction
      DB::commit();

      // Return the updated order
      return response()->json($order->load('products'));
    } catch (Throwable $e) {
      // Rollback the transaction in case of error
      DB::rollBack();

      // Log the error and return a server error response
      return response()->json([
        'message' => 'Something went wrong while updating the order. Please try again.',
        'error' => $e->getMessage()
      ], 500);
    }
  }





  // Delete an order
  public function destroy(User $user, Order $order) {
    // Ensure the order belongs to the user
    if (auth('api')->user()->id !== $user->id) {
      return response()->json(['message' => 'User mismatching!'], 403);
    }

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
        $product->increment('total_qty', $quantity);
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

  public function createStripeSession(Request $request, User $user, Order $order) {
    if (auth('api')->user()->id !== $user->id) {
      return response()->json(['message' => 'User mismatching!'], 403);
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
