<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public function index() {
    // Retrieve all coupons and return them
    $coupons = Coupon::all();
    return response()->json($coupons);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request) {
    $data = $request->validate([
      'code' => 'required|string|unique:coupons,code',
      'start_date' => 'date|after_or_equal:today',
      'end_date' => 'date|after:start_date',
      'discount' => 'required|integer|min:1|max:100',
    ]);

    $coupon = Coupon::create([
      'code' => strtoupper($data['code']),
      'start_date' => $data['start_date'] ?? now(),
      'end_date' => $data['end_date'] ?? now()->addDays(7),
      'discount' => $data['discount'],
      'user_id' => auth('api')->user()->id,
    ]);

    return response()->json($coupon, 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(Coupon $coupon) {
    // Return the specified coupon
    return response()->json($coupon);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Coupon $coupon) {
    $data = $request->validate([
      'code' => 'required|string|unique:coupons,code,' . $coupon->id, // Make sure the code is unique, except for the current coupon
      'start_date' => 'date|after_or_equal:today',
      'end_date' => 'date|after:start_date',
      'discount' => 'required|integer|min:1|max:100',
    ]);

    // Update coupon with new data
    $coupon->update([
      'code' => strtoupper($data['code']),
      'start_date' => $data['start_date'] ?? now(),
      'end_date' => $data['end_date'] ?? now()->addDays(7),
      'discount' => $data['discount'],
    ]);

    return response()->json($coupon);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Coupon $coupon) {
    // Delete the specified coupon
    $coupon->delete();

    return response()->json(['message' => 'Coupon deleted successfully']);
  }
}
