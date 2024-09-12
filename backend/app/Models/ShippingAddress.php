<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingAddress extends Model {
  use HasFactory;

  protected $fillable = [
    'first_name',
    'last_name',
    'address',
    'city',
    'postal_code',
    'province',
    'country',
    'phone',
  ];

  public function user() {
    return $this->belongsTo(User::class);
  }

  public function order() {
    return $this->belongsTo(Order::class);
  }
}
