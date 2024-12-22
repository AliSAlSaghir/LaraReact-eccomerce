<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model {
  use HasFactory;

  protected $fillable = ['name', 'user_id', 'image'];
  protected $appends = ['product_count'];

  public function products() {
    return $this->hasMany(Product::class);
  }

  public function user() {
    return $this->belongsTo(User::class);
  }

  public function getUserNameAttribute() {
    return $this->user->name ?? null;
  }

  public function getProductCountAttribute() {
    return $this->products()->count();
  }
}
