<?php

use App\Support\ModuleAccess;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('module_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('role', 40);
            $table->string('module_key', 80);
            $table->boolean('enabled')->default(false);
            $table->timestamps();

            $table->unique(['role', 'module_key']);
            $table->index('role');
        });

        $now = now();
        $rows = [];

        foreach (ModuleAccess::defaults() as $role => $permissions) {
            if ($role === 'master_admin' || $role === 'client') {
                continue;
            }

            foreach ($permissions as $moduleKey => $enabled) {
                $rows[] = [
                    'role' => $role,
                    'module_key' => $moduleKey,
                    'enabled' => $enabled,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('module_permissions')->insert($rows);
    }

    public function down(): void
    {
        Schema::dropIfExists('module_permissions');
    }
};
