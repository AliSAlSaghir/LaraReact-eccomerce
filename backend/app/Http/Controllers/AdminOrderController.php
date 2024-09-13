<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class AdminOrderController extends Controller {
  /**
   * Display a listing of the orders.
   *
   * @return \Illuminate\Http\Response
   */
  public function index() {
    $orders = Order::with('products')->get();
    return response()->json($orders);
  }

  /**
   * Display the specified order.
   *
   * @param  \App\Models\Order  $order
   * @return \Illuminate\Http\Response
   */
  public function show(Order $order) {

    $order->load(['shippingAddress', 'products']);
    return response()->json($order);
  }

  /**
   * Update the status of multiple orders.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function updateOrdersStatus(Request $request, $orderIds) {
    $validated = $request->validate([
      'status' => 'required|string|in:pending,processing,shipped,delivered'
    ]);

    try {
      DB::beginTransaction();

      // Split order IDs into an array
      $orderIdsArray = explode(',', $orderIds);

      $status = $validated['status'];

      // Prepare data for updating
      $updateData = ['status' => $status];
      if ($status === 'delivered') {
        $updateData['delivered_at'] = now();
      }

      // Update orders status
      Order::whereIn('id', $orderIdsArray)
        ->update($updateData);

      $updatedOrder = Order::whereIn('id', $orderIdsArray)->first();

      DB::commit();

      return response()->json($updatedOrder);
    } catch (Throwable $e) {
      DB::rollBack();
      return response()->json([
        'message' => 'Failed to update orders status.',
        'error' => $e->getMessage()
      ], 500);
    }
  }


  /**
   * Remove the specified order from storage.
   *
   * @param  \App\Models\Order  $order
   * @return \Illuminate\Http\Response
   */
  public function destroy(Order $order) {
    $order->delete();
    return response()->noContent();
  }
}
