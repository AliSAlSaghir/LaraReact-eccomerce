<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\StripeWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/webhook', [StripeWebhookController::class, 'handleWebhook']);

Route::middleware(['custom.guest'])->group(function () {
  Route::group(['prefix' => 'auth'], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
  });
});

Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);

Route::get('products/{product}/reviews', [ReviewController::class, 'index']);
Route::get('products/{product}/reviews/{review}', [ReviewController::class, 'show']);

Route::middleware(['cookie.auth'])->group(function () {
  Route::group(['prefix' => 'auth'], function ($router) {
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
  });
  Route::apiResource('products.reviews', ReviewController::class)->except(['index', 'show']);
  Route::post('createShippingAddress', [ShippingAddressController::class, 'store']);
  Route::put('updateShippingAddress', [ShippingAddressController::class, 'update']);
  Route::delete('deleteShippingAddress', [ShippingAddressController::class, 'destroy']);
  Route::apiResource('users.orders', OrderController::class);
  Route::post('users/{user}/orders/{order}/createStripeSession', [OrderController::class, 'createStripeSession']);
});

Route::middleware(['cookie.auth', 'role:admin'])->group(function () {
  Route::group(['prefix' => 'admin'], function ($router) {
    Route::apiResource('colors', ColorController::class);
    Route::apiResource('sizes', SizeController::class);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('brands', BrandController::class);
  });
});
