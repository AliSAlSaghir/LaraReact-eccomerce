<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
    'brand_id',
    'category_id',
    'user_id',
    'images',
    'price',
    'quantity',
    'total_sold'
  ];

  protected $casts = [
    'images' => 'array',
  ];


  // Relationship with user
  public function user() {
    return $this->belongsTo(User::class);
  }

  // Relationship with category
  public function category() {
    return $this->belongsTo(Category::class);
  }

  public function brand() {
    return $this->belongsTo(Brand::class);
  }

  public function reviews() {
    return $this->hasMany(Review::class);
  }

  public function orders() {
    return $this->belongsToMany(Order::class, 'order_product');
  }

  public function colors() {
    return $this->belongsToMany(Color::class, 'color_product');
  }

  public function sizes() {
    return $this->belongsToMany(Size::class, 'product_size');
  }

  public function getTotalQtyAttribute() {
    return $this->quantity + $this->total_sold;
  }

  // totalReviews: count of reviews
  public function getTotalReviewsAttribute() {
    return $this->reviews()->count();
  }

  // averageRating: average of all review ratings
  public function getAverageRatingAttribute() {
    return (float) $this->reviews()->avg('rating');
  }
}
