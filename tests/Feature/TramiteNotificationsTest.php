<?php

namespace Tests\Feature;

use App\Models\Tramite;
use App\Models\TramitePhase;
use App\Models\TramiteTask;
use App\Models\TramiteType;
use App\Models\User;
use App\Support\ModuleAccess;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class TramiteNotificationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_task_and_tramite_events_create_expected_notifications(): void
    {
        [$master, $admin, $operator, $responsible] = $this->staffUsers();
        $tramite = $this->createTramite($admin, $responsible);
        $phase = $tramite->phases()->first();
        $subphase = $phase->subphases()->first();

        $taskResponse = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/tramites/{$tramite->id}/tasks", [
                'title' => 'Revision de documentos',
                'assigned_to' => $operator->id,
                'status' => TramiteTask::STATUS_PENDING,
                'due_date' => now()->addDay()->toDateString(),
            ])
            ->assertCreated();

        $taskId = $taskResponse->json('id');
        $this->assertNotificationFor($operator, 'task_assigned');

        $this->actingAs($operator, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/tasks/{$taskId}", [
                'status' => TramiteTask::STATUS_DONE,
                'progress' => 100,
            ])
            ->assertOk();
        $this->assertNotificationFor($admin, 'task_completed');
        $this->assertNotificationFor($responsible, 'task_completed');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/tasks/{$taskId}", [
                'status' => TramiteTask::STATUS_IN_PROGRESS,
                'observations' => 'Se requiere subsanar documento municipal.',
            ])
            ->assertOk();
        $this->assertNotificationFor($responsible, 'task_reopened');
        $this->assertNotificationFor($operator, 'task_reopened');
        $this->assertNotificationFor($responsible, 'observation_added');

        $this->actingAs($operator, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/tasks/{$taskId}", [
                'status' => TramiteTask::STATUS_BLOCKED,
                'observations' => 'Falta partida registral.',
            ])
            ->assertOk();
        $this->assertNotificationFor($admin, 'task_blocked');
        $this->assertNotificationFor($responsible, 'task_blocked');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}", [
                'tramite_type_id' => $tramite->tramite_type_id,
                'client_name' => 'Cliente Demo',
                'project_name' => 'Licencia Vivienda',
                'property_name' => 'Lote 1',
                'location' => 'Cusco, Cusco, Cusco',
                'responsible_id' => $operator->id,
                'status' => 'observed',
                'notes' => 'Cliente agrego nueva informacion.',
            ])
            ->assertOk();
        $this->assertNotificationFor($operator, 'tramite_assigned');
        $this->assertNotificationFor($operator, 'tramite_status_changed');
        $this->assertNotificationFor($operator, 'note_added');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/phases/{$phase->id}", [
                'status' => 'in_progress',
            ])
            ->assertOk();
        $this->assertNotificationFor($operator, 'phase_status_changed');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/subphases/{$subphase->id}", [
                'status' => 'observed',
            ])
            ->assertOk();
        $this->assertNotificationFor($operator, 'subphase_status_changed');
    }

    public function test_due_notifications_are_generated_from_notification_index(): void
    {
        [$master, $admin, $operator, $responsible] = $this->staffUsers();
        $tramite = $this->createTramite($admin, $responsible);

        TramiteTask::create([
            'tramite_id' => $tramite->id,
            'title' => 'Tarea por vencer',
            'assigned_to' => $operator->id,
            'created_by' => $admin->id,
            'status' => TramiteTask::STATUS_PENDING,
            'due_date' => now()->addDay()->toDateString(),
        ]);

        TramiteTask::create([
            'tramite_id' => $tramite->id,
            'title' => 'Tarea vencida',
            'assigned_to' => $operator->id,
            'created_by' => $admin->id,
            'status' => TramiteTask::STATUS_PENDING,
            'due_date' => now()->subDay()->toDateString(),
        ]);

        $this->actingAs($operator, 'sanctum')
            ->getJson('/api/v1/notifications')
            ->assertOk();

        $this->assertNotificationFor($operator, 'task_due_soon');
        $this->assertNotificationFor($operator, 'task_overdue');
    }

    public function test_notification_preferences_can_disable_a_type(): void
    {
        [$master, $admin, $operator, $responsible] = $this->staffUsers();
        $tramite = $this->createTramite($admin, $responsible);

        $this->actingAs($operator, 'sanctum')
            ->putJson('/api/v1/notifications/preferences', [
                'preferences' => [
                    ['type' => 'task_assigned', 'enabled' => false],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('types.0.type', 'task_assigned');

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/tramites/{$tramite->id}/tasks", [
                'title' => 'Revision de planos',
                'assigned_to' => $operator->id,
            ])
            ->assertCreated();

        $this->assertDatabaseMissing('notifications', [
            'notifiable_id' => $operator->id,
            'type' => 'task_assigned',
        ]);
    }

    private function staffUsers(): array
    {
        $master = User::factory()->create(['role' => 'master_admin', 'is_active' => true]);
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $operator = User::factory()->create(['role' => 'operator', 'is_active' => true]);
        $responsible = User::factory()->create(['role' => 'operator', 'is_active' => true]);

        foreach ([$master, $admin, $operator, $responsible] as $user) {
            ModuleAccess::syncUser($user, [
                ...ModuleAccess::forRole($user->role),
                ModuleAccess::TRAMITES_MANAGE => true,
                ModuleAccess::TRAMITES_CONTROL => true,
                ModuleAccess::TASKS_SUMMARY => true,
            ]);
        }

        return [$master, $admin, $operator, $responsible];
    }

    private function createTramite(User $admin, User $responsible): Tramite
    {
        $type = TramiteType::create([
            'code' => 'LIC-OBRA',
            'name' => 'Licencia De Obra',
            'is_active' => true,
        ]);

        $phaseDefinition = TramitePhase::create([
            'tramite_type_id' => $type->id,
            'name' => 'Revision Documental',
            'order' => 1,
        ]);

        $subphaseDefinition = $phaseDefinition->subphases()->create([
            'name' => 'Validacion Inicial',
            'order' => 1,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/tramites', [
                'tramite_type_id' => $type->id,
                'client_name' => 'Cliente Demo',
                'project_name' => 'Licencia Vivienda',
                'property_name' => 'Lote 1',
                'location' => 'Cusco, Cusco, Cusco',
                'responsible_id' => $responsible->id,
                'status' => 'pending',
            ])
            ->assertCreated();

        return Tramite::with('phases.subphases')->findOrFail($response->json('id'));
    }

    private function assertNotificationFor(User $user, string $type): void
    {
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $user->id,
            'type' => $type,
        ]);
    }
}
