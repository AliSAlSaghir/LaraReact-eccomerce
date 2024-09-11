<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('reviews', function (Blueprint $table) {
      $table->id();
      $table->foreignIdFor(User::class)->cascadeOnDelete();
      $table->foreignIdFor(Product::class)->cascadeOnDelete();
      $table->text('message');
      $table->integer('rating')->unsigned();
      $table->timestamps();

      $table->check('rating >= 1 AND rating <= 5');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    Schema::dropIfExists('reviews');
  }
};
