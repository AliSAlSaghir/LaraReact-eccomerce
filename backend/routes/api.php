<?php

use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/webhook', [StripeWebhookController::class, 'handleWebhook']);

Route::middleware(['custom.guest'])->group(function () {
  Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
  });
});

Route::get('colors', [ColorController::class, 'index']);
Route::get('colors/{color}', [ColorController::class, 'show']);

Route::get('sizes', [SizeController::class, 'index']);
Route::get('sizes/{size}', [SizeController::class, 'show']);

Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);

Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{category}', [CategoryController::class, 'show']);

Route::get('brands', [BrandController::class, 'index']);
Route::get('brands/{brand}', [BrandController::class, 'show']);

Route::get('coupons', [CouponController::class, 'index']);
Route::get('coupons/{coupon}', [CouponController::class, 'show']);

Route::get('products/{product}/reviews', [ReviewController::class, 'index']);
Route::get('products/{product}/reviews/{review}', [ReviewController::class, 'show']);

Route::middleware(['cookie.auth'])->group(function () {
  Route::group(['prefix' => 'auth'], function () {
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
  });
  Route::apiResource('products.reviews', ReviewController::class)->except(['index', 'show']);
  Route::post('createShippingAddress', [ShippingAddressController::class, 'store']);
  Route::put('updateShippingAddress', [ShippingAddressController::class, 'update']);
  Route::delete('deleteShippingAddress', [ShippingAddressController::class, 'destroy']);
  Route::apiResource('orders', OrderController::class);
  Route::post('orders/{order}/createStripeSession', [OrderController::class, 'createStripeSession']);
  Route::post('orders/{order}/applyCoupon', [OrderController::class, 'applyCoupon']);
});

Route::middleware(['cookie.auth', 'role:admin'])->group(function () {
  Route::group(['prefix' => 'admin'], function () {
    Route::apiResource('colors', ColorController::class)->except(['index', 'show']);

    Route::apiResource('sizes', SizeController::class)->except(['index', 'show']);

    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);

    Route::apiResource('brands', BrandController::class)->except(['index', 'show']);

    Route::apiResource('coupons', CouponController::class)->except(['index', 'show']);

    Route::get('orders/getOrderStats', [AdminOrderController::class, 'getOrderStats']);
    Route::apiResource('orders', AdminOrderController::class)->except(['store', 'update']);
    Route::put('orders/{order}/updateOrdersStatus', [AdminOrderController::class, 'updateOrdersStatus']);

    Route::get('users', [UserController::class, 'index']);
  });
});
