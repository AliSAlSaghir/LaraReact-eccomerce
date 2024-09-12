<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddConstraintsToReviewsTable extends Migration {
  public function up(): void {
    // Add CHECK constraint using raw SQL
    DB::statement('ALTER TABLE reviews ADD CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5)');
  }

  public function down(): void {
    // Remove the CHECK constraint before dropping the table
    DB::statement('ALTER TABLE reviews DROP CHECK rating_check');
  }
}
