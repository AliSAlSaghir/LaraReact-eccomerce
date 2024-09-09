<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole {
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @param  string  ...$roles
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function handle(Request $request, Closure $next, ...$roles): Response {

    if (!in_array(auth('api')->user()->role, $roles)) {
      return response()->json([
        'error' => 'Unauthorized action',
        'message' => 'You do not have permission to access this resource'
      ], 403);
    }

    return $next($request);
  }
}
