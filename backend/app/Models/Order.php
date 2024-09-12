<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model {
  use HasFactory;

  protected $fillable = [
    'user_id',
    'shipping_address_id',
    'order_number',
    'payment_status',
    'payment_method',
    'total_price',
    'currency',
    'status',
    'delivered_at',
  ];

  public function shippingAddress() {
    return $this->hasOne(ShippingAddress::class, 'id', 'shipping_address_id');
  }

  public function products() {
    return $this->belongsToMany(Product::class, 'order_product')
      ->withPivot('quantity', 'price')
      ->withTimestamps();
  }
}
