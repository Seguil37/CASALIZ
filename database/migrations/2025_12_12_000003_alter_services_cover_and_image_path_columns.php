<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Allow long image URLs for services and gallery items
        Schema::table('services', function () {
            DB::statement('ALTER TABLE services MODIFY cover_image TEXT NULL');
        });

        Schema::table('service_images', function () {
            DB::statement('ALTER TABLE service_images MODIFY path TEXT NOT NULL');
        });
    }

    public function down(): void
    {
        // Revert to varchar(255) if needed
        Schema::table('services', function () {
            DB::statement('ALTER TABLE services MODIFY cover_image VARCHAR(255) NULL');
        });

        Schema::table('service_images', function () {
            DB::statement('ALTER TABLE service_images MODIFY path VARCHAR(255) NOT NULL');
        });
    }
};
