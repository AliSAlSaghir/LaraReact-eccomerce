<?php

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('order_product', function (Blueprint $table) {
      $table->id();
      $table->foreignIdFor(Order::class)->cascadeOnDelete();
      $table->foreignIdFor(Product::class)->cascadeOnDelete();
      $table->integer('quantity')->default(1);
      $table->decimal('price', 8, 2);
      $table->string('color');
      $table->string('size');
      $table->unique(['order_id', 'product_id', 'color', 'size']);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    //
  }
};
