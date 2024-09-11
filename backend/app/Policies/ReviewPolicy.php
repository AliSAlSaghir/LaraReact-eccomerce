<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReviewPolicy {

  public function modify(User $user, Review $review): bool {
    return $user->id === $review->user_id || $user->role === "admin";
  }
}
