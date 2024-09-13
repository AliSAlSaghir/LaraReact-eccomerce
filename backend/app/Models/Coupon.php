<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Validation\Rule;

class Coupon extends Model {
  use HasFactory;

  protected $fillable = [
    'code',
    'start_date',
    'end_date',
    'discount',
    'user_id'
  ];

  protected $casts = [
    'start_date' => 'datetime',
    'end_date' => 'datetime',
  ];

  // Append custom attributes to the model's JSON representation
  protected $appends = ['is_expired', 'days_left'];

  // Accessor for isExpired
  public function getIsExpiredAttribute() {
    return $this->end_date < now();
  }

  // Accessor for daysLeft
  public function getDaysLeftAttribute() {
    $daysLeft = ceil(($this->end_date->timestamp - now()->timestamp) / (60 * 60 * 24)) . ' Days left';
    return $daysLeft;
  }
}
