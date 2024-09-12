<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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

      // Calculate total price based on products
      $totalPrice = 0;
      $productsToSync = [];
      foreach ($request->products as $product) {
        $productModel = Product::findOrFail($product['id']);
        $price = $productModel->price;
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

        $totalPrice += $price * $quantity;
        $productsToSync[$product['id']] = [
          'quantity' => $quantity,
          'price' => $price
        ];
      }

      // Create the order with the user's shipping address and calculated total price
      $order = $user->orders()->create([
        'shipping_address_id' => $user->shippingAddress->id,
        'payment_method' => $data['payment_method'],
        'currency' => $data['currency'],
        'total_price' => $totalPrice,
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

      // Initialize variables for total price calculation and product syncing
      $totalPrice = 0;
      $productsToSync = [];

      // Loop through each product in the request
      foreach ($request->products as $product) {
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

        $price = $productModel->price;
        $totalPrice += $price * $newQuantity;

        // Prepare the data for syncing with the order
        $productsToSync[$product['id']] = [
          'quantity' => $newQuantity,
          'price' => $price
        ];
      }

      // Sync the updated products with the order
      $order->products()->sync($productsToSync);

      // Update the total price before saving the order
      $data['total_price'] = $totalPrice;

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
}
