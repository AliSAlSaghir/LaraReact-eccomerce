<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource {
  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return array
   */
  public function toArray($request) {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'description' => $this->description,
      'brand_id' => $this->brand_id,
      'category_id' => $this->category_id,
      'user_id' => $this->user_id,
      'images' => $this->images,
      'price' => $this->price,
      'quantity' => $this->quantity,
      'total_sold' => $this->total_sold,
      'total_qty' => $this->totalQty,
      'total_reviews' => $this->totalReviews,
      'average_rating' => $this->averageRating,
      'brand' => $this->brand->name,
      'category' => $this->category->name,
      'color_id' => $this->colors->map(fn($color) => $color->id),
      'size_id' => $this->sizes->map(fn($size) => $size->id),
      'reviews' => $this->reviews->map(fn($review) => [
        'id' => $review->id,
        'user_id' => $review->user_id,
        'message' => $review->message,
        'rating' => $review->rating,
        'created_at' => $review->created_at,
      ])
    ];
  }
}
