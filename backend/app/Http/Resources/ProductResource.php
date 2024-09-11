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
      'total_qty' => $this->total_qty,
      'total_sold' => $this->total_sold,
      'qty_left' => $this->qtyLeft,
      'total_reviews' => $this->totalReviews,
      'average_rating' => $this->averageRating,
      'colors' => $this->colors->map(fn($color) => $color->name),
      'sizes' => $this->sizes->map(fn($size) => $size->name),
    ];
  }
}
