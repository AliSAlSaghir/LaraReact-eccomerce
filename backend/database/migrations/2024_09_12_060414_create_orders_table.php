<?php

use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('orders', function (Blueprint $table) {
      $table->id();
      $table->foreignIdFor(User::class)->cascadeOnDelete();
      $table->foreignIdFor(ShippingAddress::class)->cascadeOnDelete();
      $table->string('order_number')->unique();
      $table->string('payment_status')->default('Not paid');
      $table->string('payment_method')->default('Not specified');
      $table->decimal('total_price', 8, 2)->default(0.00);
      $table->string('currency')->default('Not specified');
      $table->enum('status', ['pending', 'processing', 'shipped', 'delivered'])->default('pending');
      $table->datetime('delivered_at')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    Schema::dropIfExists('orders');
  }
};
