<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Exception;

class CookieAuthMiddleware {
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next) {
    try {
      // Get the token from the cookie
      $token = $request->cookie('jwt');

      // Attempt to authenticate the user using the token
      if (!$token || !JWTAuth::setToken($token)->check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
      }

      // Set the authenticated user
      $user = JWTAuth::setToken($token)->toUser();
      auth('api')->setUser($user);
    } catch (Exception $e) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }

    return $next($request);
  }
}
