<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShippingAddress;
use App\Models\User;

class ShippingAddressController extends Controller {
  /**
   * Display the user's current shipping address.
   */

  /**
   * Store a new shipping address.
   */
  public function store(Request $request) {
    $request->validate([
      'first_name' => 'required|string|max:255',
      'last_name' => 'required|string|max:255',
      'address' => 'required|string|max:255',
      'city' => 'required|string|max:255',
      'postal_code' => 'required|string|max:10',
      'province' => 'nullable|string|max:255',
      'country' => 'required|string|max:255',
      'phone' => 'required|string|max:15',
    ]);

    $user = User::findOrFail(auth('api')->id());
    if ($user->shippingAddress) {
      return response()->json(['message' => 'Shipping address already set'], 400);
    }

    // Create the new shipping address
    $shippingAddress = ShippingAddress::create($request->all());

    $user->shipping_address_id = $shippingAddress->id;
    $user->save();

    $user->load('shippingAddress');

    return response()->json($user, 201);
  }


  /**
   * Update the user's shipping address.
   */
  public function update(Request $request) {
    // Validate the request data
    $request->validate([
      'first_name' => 'string|max:255',
      'last_name' => 'string|max:255',
      'address' => 'string|max:255',
      'city' => 'string|max:255',
      'postal_code' => 'string|max:10',
      'province' => 'string|max:255',
      'country' => 'string|max:255',
      'phone' => 'string|max:15',
    ]);

    // Find the authenticated user
    $user = User::findOrFail(auth('api')->id());

    // Check if the user has an existing shipping address
    $shippingAddress = $user->shippingAddress;
    if (!$shippingAddress) {
      return response()->json(['message' => 'No shipping address found to update'], 404);
    }

    // Update the existing shipping address with the new data
    $shippingAddress->update($request->all());

    $user->load('shippingAddress');

    return response()->json($user, 200);
  }


  /**
   * Delete the user's shipping address.
   */
  public function destroy() {
    $shippingAddress = auth('api')->user()->shippingAddress;

    if (!$shippingAddress) {
      return response()->json(['message' => 'Shipping address not set'], 404);
    }

    $shippingAddress->delete();

    return response()->json(['message' => 'Shipping address deleted'], 200);
  }
}
