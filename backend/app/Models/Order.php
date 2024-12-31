<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model {
  use HasFactory;

  protected $fillable = [
    'user_id',
    'shipping_address_id',
    'payment_status',
    'payment_method',
    'total_price',
    'currency',
    'status',
    'delivered_at',
    'applied_coupon_id',
  ];

  protected static function boot() {
    parent::boot();

    static::creating(function ($order) {
      $randomTxt = Str::upper(Str::random(7)); // Uppercase random string
      $randomNumbers = random_int(1000, 99999); // Generate a random 4-5 digit number
      $order->order_number = $randomTxt . $randomNumbers;
    });
  }

  public function shippingAddress() {
    return $this->hasOne(ShippingAddress::class, 'id', 'shipping_address_id');
  }

  public function products() {
    return $this->belongsToMany(Product::class)
      ->withPivot('quantity', 'price', 'color', 'size')
      ->withTimestamps();
  }
}
