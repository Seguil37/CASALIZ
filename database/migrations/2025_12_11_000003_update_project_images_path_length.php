<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE project_images MODIFY path TEXT');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE project_images MODIFY path VARCHAR(255)');
    }
};
