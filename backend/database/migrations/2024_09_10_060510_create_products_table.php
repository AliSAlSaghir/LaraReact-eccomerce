<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('products', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description');
      $table->foreignIdFor(Brand::class)->cascadeOnDelete();
      $table->foreignIdFor(Category::class)->cascadeOnDelete();
      $table->foreignIdFor(User::class)->cascadeOnDelete();
      $table->json('images'); // Store images as an array
      $table->decimal('price', 10, 2); // Price with two decimal precision
      $table->integer('total_qty'); // Total quantity of product
      $table->integer('total_sold')->default(0); // Total sold with a default of 0
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    Schema::dropIfExists('products');
  }
};
