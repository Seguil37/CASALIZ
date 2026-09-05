<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Tramite;
use App\Models\TramiteTask;
use App\Models\TramiteType;
use App\Models\User;
use App\Support\ModuleAccess;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PlanDePruebasCaracteristicasTest extends TestCase
{
    use RefreshDatabase;

    public function test_inicio_de_sesion_valida_credenciales_correctas_e_incorrectas(): void
    {
        User::factory()->create([
            'name' => 'Usuario Prueba',
            'email' => 'usuario@example.com',
            'password' => Hash::make('ClaveSegura123'),
            'role' => 'client',
            'is_active' => true,
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => ' USUARIO@EXAMPLE.COM ',
            'password' => 'ClaveSegura123',
        ])
            ->assertOk()
            ->assertJsonPath('user.email', 'usuario@example.com')
            ->assertJsonStructure(['token']);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'usuario@example.com',
            'password' => 'clave-incorrecta',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_gestion_de_usuarios_registra_actualiza_consulta_y_elimina_cuentas(): void
    {
        $master = $this->staffUser('master_admin');

        $createResponse = $this->actingAs($master, 'sanctum')
            ->postJson('/api/v1/users', [
                'name' => ' operador de prueba ',
                'email' => ' OPERADOR@EXAMPLE.COM ',
                'password' => 'Password123',
                'role' => 'operator',
                'phone' => '00 51 999-111-222',
                'is_active' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('name', 'Operador De Prueba')
            ->assertJsonPath('email', 'operador@example.com')
            ->assertJsonPath('role', 'operator');

        $userId = $createResponse->json('id');

        $this->actingAs($master, 'sanctum')
            ->putJson("/api/v1/users/{$userId}", [
                'name' => 'operador actualizado',
                'role' => 'operator',
                'is_active' => false,
            ])
            ->assertOk()
            ->assertJsonPath('user.name', 'Operador Actualizado')
            ->assertJsonPath('user.is_active', false);

        $this->actingAs($master, 'sanctum')
            ->getJson('/api/v1/users?search=Operador')
            ->assertOk()
            ->assertJsonFragment(['email' => 'operador@example.com']);

        $this->actingAs($master, 'sanctum')
            ->deleteJson("/api/v1/users/{$userId}")
            ->assertOk();

        $this->assertSoftDeleted('users', ['id' => $userId]);
    }

    public function test_gestion_de_roles_asigna_permisos_por_rol_y_por_usuario(): void
    {
        $master = $this->staffUser('master_admin');
        $operator = $this->staffUser('operator');

        $rolePermissions = [
            ...ModuleAccess::forRole('operator'),
            ModuleAccess::PROJECTS => true,
            ModuleAccess::ADMIN_USERS => false,
        ];

        $this->actingAs($master, 'sanctum')
            ->putJson('/api/v1/module-permissions', [
                'role' => 'operator',
                'permissions' => $rolePermissions,
            ])
            ->assertOk()
            ->assertJsonPath('role', 'operator')
            ->assertJsonPath('permissions.' . ModuleAccess::PROJECTS, true);

        $this->assertDatabaseHas('module_permissions', [
            'role' => 'operator',
            'module_key' => ModuleAccess::PROJECTS,
            'enabled' => true,
        ]);

        $userPermissions = [
            ...ModuleAccess::forRole('operator'),
            ModuleAccess::PROJECTS => false,
            ModuleAccess::TRAMITES_MANAGE => true,
        ];

        $this->actingAs($master, 'sanctum')
            ->putJson("/api/v1/module-permissions/users/{$operator->id}", [
                'permissions' => $userPermissions,
            ])
            ->assertOk()
            ->assertJsonPath('user_id', $operator->id)
            ->assertJsonPath('permissions.' . ModuleAccess::TRAMITES_MANAGE, true)
            ->assertJsonPath('permissions.' . ModuleAccess::PROJECTS, false);

        $this->assertTrue(ModuleAccess::can($operator->fresh(), ModuleAccess::TRAMITES_MANAGE));
        $this->assertFalse(ModuleAccess::can($operator->fresh(), ModuleAccess::PROJECTS));
    }

    public function test_gestion_de_proyectos_crea_actualiza_consulta_y_elimina_proyectos(): void
    {
        $admin = $this->staffUser('admin', [
            ModuleAccess::PROJECTS => true,
        ]);

        $createResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/projects', [
                'title' => ' casa modelo ',
                'type' => 'vivienda',
                'city' => 'cusco',
                'state' => 'cusco',
                'country' => 'peru',
                'status' => 'published',
                'is_featured' => true,
                'summary' => ' proyecto residencial publicado ',
                'description' => ' vivienda de prueba para el plan de pruebas ',
                'hero_image' => 'https://example.com/hero.jpg',
                'images' => [
                    [
                        'path' => 'https://example.com/galeria.jpg',
                        'caption' => 'vista principal',
                    ],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('title', 'Casa Modelo')
            ->assertJsonPath('status', 'published');

        $projectId = $createResponse->json('id');

        $this->assertDatabaseHas('projects', [
            'id' => $projectId,
            'title' => 'Casa Modelo',
            'status' => 'published',
        ]);
        $this->assertDatabaseHas('project_images', [
            'project_id' => $projectId,
            'caption' => 'vista principal',
        ]);

        $this->getJson("/api/v1/projects/{$projectId}")
            ->assertOk()
            ->assertJsonPath('title', 'Casa Modelo');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/projects/{$projectId}", [
                'title' => 'vivienda multifamiliar',
                'status' => 'draft',
            ])
            ->assertOk()
            ->assertJsonPath('title', 'Vivienda Multifamiliar')
            ->assertJsonPath('status', 'draft');

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/projects/{$projectId}")
            ->assertOk();

        $this->assertSoftDeleted('projects', ['id' => $projectId]);
    }

    public function test_gestion_de_tramites_registra_actualiza_y_da_seguimiento_con_tareas(): void
    {
        $admin = $this->staffUser('admin', [
            ModuleAccess::TRAMITES_MANAGE => true,
            ModuleAccess::TRAMITES_CONTROL => true,
            ModuleAccess::TASKS_SUMMARY => true,
        ]);
        $type = $this->tramiteType();

        $createResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/tramites', [
                'tramite_type_id' => $type->id,
                'client_name' => 'cliente demo',
                'project_name' => 'licencia vivienda',
                'property_name' => 'lote 1',
                'location' => 'cusco, cusco, wanchaq',
                'responsible_id' => $admin->id,
                'status' => Tramite::STATUS_PENDING,
            ])
            ->assertCreated()
            ->assertJsonPath('project_name', 'Licencia Vivienda')
            ->assertJsonPath('phases.0.name', 'Carga De Documentos')
            ->assertJsonPath('phases.0.subphases.0.name', 'Recepcion Documental');

        $tramiteId = $createResponse->json('id');
        $phaseId = $createResponse->json('phases.0.id');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramiteId}", [
                'tramite_type_id' => $type->id,
                'client_name' => 'cliente demo',
                'project_name' => 'licencia vivienda actualizada',
                'property_name' => 'lote 1',
                'location' => 'cusco, cusco, wanchaq',
                'responsible_id' => $admin->id,
                'status' => Tramite::STATUS_PENDING,
            ])
            ->assertOk()
            ->assertJsonPath('project_name', 'Licencia Vivienda Actualizada');

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/tramites/{$tramiteId}/tasks", [
                'title' => 'REVISION DE PLANOS',
                'description' => 'validar documentos tecnicos',
                'assigned_to' => $admin->id,
                'status' => TramiteTask::STATUS_PENDING,
                'due_date' => now()->addDays(3)->toDateString(),
            ])
            ->assertCreated()
            ->assertJsonPath('title', 'Revision de planos');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramiteId}/phases/{$phaseId}", [
                'status' => Tramite::STATUS_IN_PROGRESS,
            ])
            ->assertOk()
            ->assertJsonPath('status', Tramite::STATUS_IN_PROGRESS);

        $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/tramites/{$tramiteId}")
            ->assertOk()
            ->assertJsonPath('tasks.0.title', 'Revision de planos');
    }

    public function test_consulta_de_tramites_muestra_estado_publico_por_codigo(): void
    {
        $admin = $this->staffUser('admin', [
            ModuleAccess::TRAMITES_MANAGE => true,
            ModuleAccess::TRAMITES_CONTROL => true,
        ]);
        $tramite = $this->createTramite($admin);

        $this->getJson("/api/v1/public/tramites/{$tramite->code}")
            ->assertOk()
            ->assertJsonPath('code', $tramite->code)
            ->assertJsonPath('status_label', 'Pendiente')
            ->assertJsonPath('phases.0.name', 'Carga De Documentos');
    }

    public function test_gestion_documental_registra_y_visualiza_etapa_de_carga_de_documentos(): void
    {
        $admin = $this->staffUser('admin', [
            ModuleAccess::TRAMITES_MANAGE => true,
            ModuleAccess::TRAMITES_CONTROL => true,
        ]);
        $tramite = $this->createTramite($admin);
        $phase = $tramite->phases()->firstOrFail();

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/notes", [
                'notes' => 'se recibio expediente municipal y planos firmados',
                'due_date' => now()->addWeek()->toDateString(),
            ])
            ->assertOk()
            ->assertJsonPath('notes', 'se recibio expediente municipal y planos firmados');

        $this->assertDatabaseHas('tramite_instance_phases', [
            'id' => $phase->id,
            'name' => 'Carga De Documentos',
        ]);
        $this->assertDatabaseHas('tramites', [
            'id' => $tramite->id,
            'notes' => 'se recibio expediente municipal y planos firmados',
        ]);

        $this->getJson("/api/v1/public/tramites/{$tramite->code}")
            ->assertOk()
            ->assertJsonPath('next_action', 'Etapa actual: Recepcion Documental.');
    }

    public function test_gestion_de_imagenes_carga_almacena_y_visualiza_galeria_de_proyecto(): void
    {
        Storage::fake('public');

        $admin = $this->staffUser('admin', [
            ModuleAccess::PROJECTS => true,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->post('/api/v1/projects', [
                'title' => 'proyecto con imagenes',
                'type' => 'residencial',
                'city' => 'cusco',
                'state' => 'cusco',
                'country' => 'peru',
                'status' => 'published',
                'summary' => 'proyecto con archivos graficos',
                'description' => 'validacion de carga de imagenes del sistema',
                'hero_image_file' => $this->fakePng('hero.png'),
                'images' => [
                    [
                        'file' => $this->fakePng('galeria.png'),
                        'caption' => 'Detalle de fachada',
                    ],
                ],
            ], ['Accept' => 'application/json'])
            ->assertCreated();

        $project = Project::with('images')->findOrFail($response->json('id'));
        $heroPath = str_replace('/storage/', '', $project->hero_image);
        $galleryPath = str_replace('/storage/', '', $project->images->first()->path);

        Storage::disk('public')->assertExists($heroPath);
        Storage::disk('public')->assertExists($galleryPath);

        $this->getJson("/api/v1/projects/{$project->id}")
            ->assertOk()
            ->assertJsonCount(1, 'images')
            ->assertJsonPath('images.0.caption', 'Detalle de fachada');
    }

    public function test_reportes_generan_resumen_de_tramites_y_tareas(): void
    {
        $admin = $this->staffUser('admin', [
            ModuleAccess::TRAMITES_MANAGE => true,
            ModuleAccess::TRAMITES_CONTROL => true,
            ModuleAccess::TASKS_SUMMARY => true,
        ]);
        $tramite = $this->createTramite($admin, null, [
            'due_date' => now()->addDays(2)->toDateString(),
        ]);

        TramiteTask::create([
            'tramite_id' => $tramite->id,
            'title' => 'Tarea completada',
            'assigned_to' => $admin->id,
            'created_by' => $admin->id,
            'status' => TramiteTask::STATUS_DONE,
            'progress' => 100,
            'completed_at' => now(),
        ]);

        TramiteTask::create([
            'tramite_id' => $tramite->id,
            'title' => 'Tarea pendiente',
            'assigned_to' => $admin->id,
            'created_by' => $admin->id,
            'status' => TramiteTask::STATUS_PENDING,
            'progress' => 0,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/tramites-dashboard/overview')
            ->assertOk()
            ->assertJsonFragment([
                'code' => $tramite->code,
                'tasks_total' => 2,
                'tasks_done' => 1,
                'tasks_open' => 1,
            ]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/tramites-dashboard/assigned-tasks')
            ->assertOk()
            ->assertJsonCount(2);
    }

    public function test_persistencia_de_datos_almacena_y_recupera_registros_relacionados(): void
    {
        $admin = $this->staffUser('admin', [
            ModuleAccess::TRAMITES_MANAGE => true,
        ]);
        $tramite = $this->createTramite($admin);

        $this->assertDatabaseHas('tramites', [
            'id' => $tramite->id,
            'code' => $tramite->code,
            'project_name' => 'Licencia Vivienda',
        ]);

        $stored = Tramite::query()
            ->with(['type', 'phases.subphases'])
            ->where('code', $tramite->code)
            ->firstOrFail();

        $this->assertSame('Licencia Vivienda', $stored->project_name);
        $this->assertSame('Licencia De Obra', $stored->type->name);
        $this->assertCount(1, $stored->phases);
        $this->assertCount(1, $stored->phases->first()->subphases);
    }

    private function staffUser(string $role, array $permissions = []): User
    {
        $user = User::factory()->create([
            'role' => $role,
            'is_active' => true,
            'password' => Hash::make('Password123'),
        ]);

        if ($role !== 'client') {
            ModuleAccess::syncUser($user, [
                ...ModuleAccess::forRole($role),
                ...$permissions,
            ]);
        }

        return $user->fresh();
    }

    private function tramiteType(string $code = 'LIC-OBRA', string $name = 'Licencia De Obra'): TramiteType
    {
        $type = TramiteType::create([
            'code' => $code,
            'name' => $name,
            'description' => 'Flujo de prueba para expedientes tecnicos.',
            'is_active' => true,
        ]);

        $phase = $type->phases()->create([
            'name' => 'Carga De Documentos',
            'order' => 1,
            'description' => 'Recepcion y validacion inicial del expediente.',
        ]);

        $phase->subphases()->create([
            'name' => 'Recepcion Documental',
            'order' => 1,
            'description' => 'Revision de documentos entregados por el cliente.',
        ]);

        return $type;
    }

    private function createTramite(User $admin, ?TramiteType $type = null, array $overrides = []): Tramite
    {
        $type ??= $this->tramiteType();

        $payload = [
            'tramite_type_id' => $type->id,
            'client_name' => 'cliente demo',
            'project_name' => 'licencia vivienda',
            'property_name' => 'lote 1',
            'location' => 'cusco, cusco, wanchaq',
            'responsible_id' => $admin->id,
            'status' => Tramite::STATUS_PENDING,
        ];

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/tramites', [...$payload, ...$overrides])
            ->assertCreated();

        return Tramite::with(['type', 'phases.subphases', 'tasks'])
            ->findOrFail($response->json('id'));
    }

    private function fakePng(string $name): UploadedFile
    {
        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII='
        );

        return UploadedFile::fake()->createWithContent($name, $png);
    }
}
