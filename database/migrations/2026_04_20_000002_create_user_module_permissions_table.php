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
        Schema::create('user_module_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('module_key', 80);
            $table->boolean('enabled')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'module_key']);
            $table->index('user_id');
        });

        if (!Schema::hasTable('users')) {
            return;
        }

        $now = now();
        $rows = [];

        DB::table('users')
            ->whereIn('role', ['admin', 'operator'])
            ->whereNull('deleted_at')
            ->orderBy('id')
            ->get(['id', 'role'])
            ->each(function ($user) use (&$rows, $now) {
                foreach (ModuleAccess::forRole($user->role) as $moduleKey => $enabled) {
                    $rows[] = [
                        'user_id' => $user->id,
                        'module_key' => $moduleKey,
                        'enabled' => $enabled,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            });

        if ($rows) {
            DB::table('user_module_permissions')->insert($rows);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_module_permissions');
    }
};
