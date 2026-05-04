<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\ModuleAccess;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserPermissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_operator_with_admin_users_permission_cannot_delete_users(): void
    {
        /** @var User $operator */
        $operator = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);
        /** @var User $target */
        $target = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);

        ModuleAccess::syncUser($operator, [
            ...ModuleAccess::forRole('operator'),
            ModuleAccess::ADMIN_USERS => true,
        ]);

        $this
            ->actingAs($operator, 'sanctum')
            ->deleteJson("/api/v1/users/{$target->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('users', [
            'id' => $target->id,
        ]);
    }
}
