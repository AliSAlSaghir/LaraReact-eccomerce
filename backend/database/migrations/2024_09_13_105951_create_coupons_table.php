<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateCouponsTable extends Migration {
  public function up() {
    Schema::create('coupons', function (Blueprint $table) {
      $table->id();
      $table->string('code')->unique();
      $table->date('start_date');
      $table->date('end_date');
      $table->integer('discount')->default(0);
      $table->foreignIdFor(User::class);
      $table->timestamps();
    });
  }

  public function down() {
    Schema::dropIfExists('coupons');
  }
}
