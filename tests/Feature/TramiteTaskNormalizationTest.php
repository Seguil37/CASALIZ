<?php

namespace Tests\Feature;

use App\Models\Tramite;
use App\Models\TramiteType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TramiteTaskNormalizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_task_title_and_description_are_normalized_when_created(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $type = TramiteType::create([
            'code' => 'LIC-OBRA',
            'name' => 'Licencia De Obra',
            'is_active' => true,
        ]);

        $tramite = Tramite::create([
            'code' => 'LIC-OBRA-' . now()->format('Y') . '-001',
            'tramite_type_id' => $type->id,
            'client_name' => 'Cliente Demo',
            'project_name' => 'Licencia Vivienda',
            'location' => 'Cusco, Cusco, Cusco',
            'responsible_id' => $admin->id,
            'status' => Tramite::STATUS_PENDING,
            'registered_at' => now()->toDateString(),
        ]);

        $this
            ->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/tramites/{$tramite->id}/tasks", [
                'title' => '  desarrollo DE PLANOS arquitectonicos  ',
                'description' => '  revisar EL ENTREGABLE final  ',
                'status' => 'pending',
            ])
            ->assertCreated()
            ->assertJsonPath('title', 'Desarrollo de planos arquitectonicos')
            ->assertJsonPath('description', 'Revisar el entregable final');

        $this->assertDatabaseHas('tramite_tasks', [
            'tramite_id' => $tramite->id,
            'title' => 'Desarrollo de planos arquitectonicos',
            'description' => 'Revisar el entregable final',
        ]);
    }
}
