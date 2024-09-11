<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ReviewController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public function index(Product $product) {
    return response()->json($product->reviews()->latest()->paginate(10));
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request, Product $product) {
    $exists = Review::where([
      'product_id' => $product->id,
      'user_id' => auth('api')->user()->id
    ])->first();

    if ($exists) {
      return response()->json([
        'error' => 'You have already reviewed this product'
      ], 409);
    }

    $request->validate([
      'message' => 'required|string',
      'rating' => 'required|integer|between:1,5',
    ]);

    $review = Review::create([
      'user_id' => auth('api')->user()->id,
      'product_id' => $product->id,
      'message' => $request->message,
      'rating' => $request->rating,
    ]);

    return response()->json($review, 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(Product $product, Review $review) {
    $result = $this->checkIfReviewBelongToProduct($review, $product);

    if ($result !== true) {
      return $result;
    }

    return response()->json($review);
  }


  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Product $product, Review $review) {
    $request->validate([
      'message' => 'nullable|string',
      'rating' => 'nullable|integer|between:1,5',
    ]);

    $result = $this->checkIfReviewBelongToProduct($review, $product);

    if ($result !== true) {
      return $result;
    }

    Gate::authorize('modify', $review);

    $review->update($request->only(['message', 'rating']));

    return response()->json($review);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Request $request, Product $product, Review $review) {
    $result = $this->checkIfReviewBelongToProduct($review, $product);

    if ($result !== true) {
      return $result;
    }

    Gate::authorize('modify', $review);

    $review->delete();

    return response()->noContent();
  }

  protected function checkIfReviewBelongToProduct(Review $review, Product $product) {
    if ($review->product_id !== $product->id) {
      return response()->json([
        'error' => 'This review does not belong to the specified product',
      ], 400);
    }

    return true;
  }
}
