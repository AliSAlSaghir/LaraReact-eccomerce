<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\JsonResponse;

class CustomGuest {
  public function handle($request, Closure $next) {
    try {
      $token = $request->cookie('jwt');

      if ($token && JWTAuth::setToken($token)->check()) {
        // User is authenticated; prevent access to guest routes
        return response()->json(['error' => 'Already authenticated'], JsonResponse::HTTP_FORBIDDEN);
      }
    } catch (\Exception $e) {
      // Optionally log the exception or handle it differently
    }

    return $next($request);
  }
}
