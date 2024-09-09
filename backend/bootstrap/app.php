<?php

use App\Http\Middleware\CheckRole;
use App\Http\Middleware\CookieAuthMiddleware;
use App\Http\Middleware\CustomGuest;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__ . '/../routes/web.php',
    api: __DIR__ . '/../routes/api.php',
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
      'cookie.auth' => CookieAuthMiddleware::class,
      'role' => CheckRole::class,
      'custom.guest' => CustomGuest::class,
    ]);
  })
  ->withExceptions(function (Exceptions $exceptions) {
    //
  })->create();
