<?php

namespace Tests\Feature;

use App\Models\Tramite;
use App\Models\TramitePhase;
use App\Models\TramiteType;
use App\Models\User;
use App\Support\ModuleAccess;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TramitePermissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_with_tramites_manage_permission_can_create_and_delete_tramites(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        ModuleAccess::syncUser($admin, [
            ...ModuleAccess::forRole('admin'),
            ModuleAccess::TRAMITES_MANAGE => true,
        ]);

        $type = TramiteType::create([
            'code' => 'LIC-OBRA',
            'name' => 'Licencia De Obra',
            'is_active' => true,
        ]);

        TramitePhase::create([
            'tramite_type_id' => $type->id,
            'name' => 'Revision Documental',
            'order' => 1,
        ]);

        $payload = [
            'tramite_type_id' => $type->id,
            'client_name' => 'Cliente Demo',
            'project_name' => 'Licencia Vivienda',
            'property_name' => 'Lote 1',
            'location' => 'Cusco, Cusco, Cusco',
            'responsible_id' => $admin->id,
            'status' => 'pending',
        ];

        $createResponse = $this
            ->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/tramites', $payload);

        $createResponse->assertCreated();
        $this->assertDatabaseHas('tramites', [
            'code' => 'LIC-OBRA-' . now()->format('Y') . '-001',
            'responsible_id' => $admin->id,
        ]);
        $this->assertDatabaseHas('tramite_instance_phases', [
            'tramite_id' => $createResponse->json('id'),
            'name' => 'Revision Documental',
        ]);

        $deleteResponse = $this
            ->actingAs($admin, 'sanctum')
            ->deleteJson('/api/v1/tramites/' . $createResponse->json('id'));

        $deleteResponse->assertOk();
        $this->assertDatabaseMissing('tramites', [
            'code' => 'LIC-OBRA-' . now()->format('Y') . '-001',
        ]);
    }

    public function test_operator_cannot_create_tramites(): void
    {
        /** @var User $operator */
        $operator = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);

        ModuleAccess::syncUser($operator, [
            ...ModuleAccess::forRole('operator'),
            ModuleAccess::TRAMITES_MANAGE => false,
        ]);

        $type = TramiteType::create([
            'code' => 'LIC-OBRA',
            'name' => 'Licencia De Obra',
            'is_active' => true,
        ]);

        $this
            ->actingAs($operator, 'sanctum')
            ->postJson('/api/v1/tramites', [
                'tramite_type_id' => $type->id,
                'project_name' => 'Licencia Vivienda',
                'location' => 'Cusco, Cusco, Cusco',
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('tramites', [
            'project_name' => 'Licencia Vivienda',
        ]);
    }

    public function test_operator_with_manage_permission_can_manage_records_but_not_unassigned_phase_progress(): void
    {
        /** @var User $operator */
        $operator = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);
        /** @var User $responsible */
        $responsible = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);

        ModuleAccess::syncUser($operator, [
            ...ModuleAccess::forRole('operator'),
            ModuleAccess::TRAMITES_MANAGE => true,
            ModuleAccess::TRAMITES_CONTROL => true,
        ]);

        $type = TramiteType::create([
            'code' => 'LIC-OBRA',
            'name' => 'Licencia De Obra',
            'is_active' => true,
        ]);

        TramitePhase::create([
            'tramite_type_id' => $type->id,
            'name' => 'Revision Documental',
            'order' => 1,
        ]);

        $createResponse = $this
            ->actingAs($operator, 'sanctum')
            ->postJson('/api/v1/tramites', [
                'tramite_type_id' => $type->id,
                'client_name' => 'Cliente Demo',
                'project_name' => 'Licencia Vivienda',
                'location' => 'Cusco, Cusco, Cusco',
                'responsible_id' => $responsible->id,
                'status' => Tramite::STATUS_PENDING,
            ]);

        $createResponse->assertCreated();

        $tramite = Tramite::with('phases')->findOrFail($createResponse->json('id'));

        $this
            ->actingAs($operator, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}", [
                'tramite_type_id' => $type->id,
                'client_name' => 'Cliente Demo',
                'project_name' => 'Licencia Actualizada',
                'location' => 'Cusco, Cusco, Cusco',
                'responsible_id' => $responsible->id,
                'status' => Tramite::STATUS_PENDING,
            ])
            ->assertOk()
            ->assertJsonPath('project_name', 'Licencia Actualizada');

        $phaseInstance = $tramite->phases->first();

        $this
            ->actingAs($operator, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/phases/{$phaseInstance->id}", [
                'status' => Tramite::STATUS_COMPLETED,
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('tramite_instance_phases', [
            'id' => $phaseInstance->id,
            'status' => Tramite::STATUS_PENDING,
        ]);
    }
}
