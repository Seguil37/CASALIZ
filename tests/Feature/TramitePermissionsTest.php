<?php

namespace Tests\Feature;

use App\Models\Tramite;
use App\Models\TramitePhase;
use App\Models\TramiteTask;
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

    public function test_responsible_operator_can_edit_planning_fields_and_delete_tasks(): void
    {
        /** @var User $responsible */
        $responsible = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);
        /** @var User $assignee */
        $assignee = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);

        $tramite = $this->createBasicTramite($responsible);
        $task = TramiteTask::create([
            'tramite_id' => $tramite->id,
            'title' => 'Tarea original',
            'description' => 'Descripcion original',
            'assigned_to' => null,
            'created_by' => $assignee->id,
            'status' => TramiteTask::STATUS_PENDING,
            'progress' => 0,
        ]);

        $this
            ->actingAs($responsible, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/tasks/{$task->id}", [
                'title' => 'Tarea actualizada',
                'description' => 'Descripcion actualizada',
                'assigned_to' => $assignee->id,
                'status' => TramiteTask::STATUS_IN_PROGRESS,
                'progress' => 50,
                'observations' => 'Avance responsable',
            ])
            ->assertOk()
            ->assertJsonPath('title', 'Tarea actualizada')
            ->assertJsonPath('assigned_to', $assignee->id);

        $this->assertDatabaseHas('tramite_tasks', [
            'id' => $task->id,
            'title' => 'Tarea actualizada',
            'description' => 'Descripcion actualizada',
            'assigned_to' => $assignee->id,
            'status' => TramiteTask::STATUS_IN_PROGRESS,
            'progress' => 50,
        ]);

        $this
            ->actingAs($responsible, 'sanctum')
            ->deleteJson("/api/v1/tramites/{$tramite->id}/tasks/{$task->id}")
            ->assertOk();

        $this->assertDatabaseMissing('tramite_tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_assigned_operator_can_update_progress_but_not_rename_or_delete_tasks(): void
    {
        /** @var User $responsible */
        $responsible = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);
        /** @var User $assignee */
        $assignee = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
        ]);

        $tramite = $this->createBasicTramite($responsible);
        $task = TramiteTask::create([
            'tramite_id' => $tramite->id,
            'title' => 'Tarea original',
            'description' => 'Descripcion original',
            'assigned_to' => $assignee->id,
            'created_by' => $responsible->id,
            'status' => TramiteTask::STATUS_PENDING,
            'progress' => 0,
        ]);

        $this
            ->actingAs($assignee, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/tasks/{$task->id}", [
                'title' => 'Nombre no permitido',
                'description' => 'Descripcion no permitida',
                'status' => TramiteTask::STATUS_IN_PROGRESS,
                'progress' => 35,
                'observations' => 'Avance del asignado',
            ])
            ->assertOk();

        $this->assertDatabaseHas('tramite_tasks', [
            'id' => $task->id,
            'title' => 'Tarea original',
            'description' => 'Descripcion original',
            'status' => TramiteTask::STATUS_IN_PROGRESS,
            'progress' => 35,
            'observations' => 'Avance del asignado',
        ]);

        $this
            ->actingAs($assignee, 'sanctum')
            ->deleteJson("/api/v1/tramites/{$tramite->id}/tasks/{$task->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('tramite_tasks', [
            'id' => $task->id,
        ]);
    }

    private function createBasicTramite(User $responsible): Tramite
    {
        $type = TramiteType::create([
            'code' => 'TASK-' . $responsible->id,
            'name' => 'Tramite Tareas',
            'is_active' => true,
        ]);

        return Tramite::create([
            'code' => 'TASK-' . $responsible->id . '-' . now()->format('His'),
            'tramite_type_id' => $type->id,
            'client_name' => 'Cliente Demo',
            'project_name' => 'Proyecto Tareas',
            'location' => 'Cusco, Cusco, Cusco',
            'responsible_id' => $responsible->id,
            'status' => Tramite::STATUS_PENDING,
        ]);
    }
}
