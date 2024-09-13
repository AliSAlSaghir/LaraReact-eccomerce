<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;
use Stripe\Webhook;
use UnexpectedValueException;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends Controller {
  public function handleWebhook(Request $request) {
    // Set your Stripe secret key
    $stripe = new StripeClient(env('STRIPE_SECRET'));

    // This is your Stripe CLI webhook secret for testing your endpoint locally.
    $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

    $payload = @file_get_contents('php://input');
    $sig_header = $request->header('Stripe-Signature');
    $event = null;

    try {
      $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
    } catch (UnexpectedValueException $e) {
      // Invalid payload
      return response('Invalid payload', 400);
    } catch (SignatureVerificationException $e) {
      // Invalid signature
      return response('Invalid signature', 400);
    }

    // Handle the event
    if ($event['type'] === "checkout.session.completed") {
      // Retrieve session data
      $session = $event['data']['object']; // Fix: Access 'object' to get session data

      $orderId = $session['metadata']['order_id'];
      $paymentStatus = $session['payment_status'];
      $paymentMethod = $session['payment_method_types'][0];
      // $totalAmount = $session['amount_total'];
      $currency = $session['currency'];

      // Find and update the order
      $order = Order::find($orderId); // Simplified: Use `find()` for direct ID lookup

      if ($order) {
        $order->update([
          // 'total_price' => $totalAmount / 100, // Convert from cents
          'currency' => $currency,
          'payment_method' => $paymentMethod,
          'payment_status' => $paymentStatus,
        ]);

        Log::info('Order updated', ['order' => $order]);
      } else {
        Log::warning('Order not found', ['orderId' => $orderId]);
      }
    } else {
      return response()->json(['message' => 'Event not handled'], 200);
    }

    return response('Webhook handled', 200);
  }
}
