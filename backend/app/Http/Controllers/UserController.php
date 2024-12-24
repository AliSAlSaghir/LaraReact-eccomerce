<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public function index() {
    // Fetch users and append the custom attributes
    $users = User::latest()
      ->get()
      ->map(function ($user) {
        $user->append(['orders_count', 'total_money_paid']);
        return $user;
      });

    return response()->json($users);
  }
}
