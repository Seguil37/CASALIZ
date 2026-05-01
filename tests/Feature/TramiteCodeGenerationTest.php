<?php

namespace Tests\Feature;

use App\Models\Tramite;
use App\Models\TramitePhase;
use App\Models\TramiteType;
use App\Models\User;
use App\Support\ModuleAccess;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TramiteCodeGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_type_code_from_name_and_avoids_duplicates(): void
    {
        $master = User::factory()->create([
            'role' => 'master_admin',
            'is_active' => true,
        ]);

        ModuleAccess::syncUser($master, ModuleAccess::forRole('master_admin'));

        $payload = [
            'name' => 'Licencia de Obra',
            'description' => 'Permite iniciar obras nuevas',
            'is_active' => true,
            'phases' => [
                [
                    'name' => 'Revision Documental',
                    'order' => 1,
                    'subphases' => [],
                ],
            ],
        ];

        $this->actingAs($master, 'sanctum')
            ->postJson('/api/v1/tramite-types', $payload)
            ->assertCreated()
            ->assertJsonPath('code', 'LICE-DE-OBRA');

        $this->actingAs($master, 'sanctum')
            ->postJson('/api/v1/tramite-types', $payload)
            ->assertCreated()
            ->assertJsonPath('code', 'LICE-DE-OBRA-2');
    }

    public function test_it_generates_tramite_codes_with_year_and_sequence(): void
    {
        $admin = $this->createAdminWithTramitesPermission();

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

        $first = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/tramites', $payload);

        $second = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/tramites', [
                ...$payload,
                'project_name' => 'Licencia Vivienda Dos',
            ]);

        $year = now()->format('Y');

        $first->assertCreated()
            ->assertJsonPath('code', "LIC-OBRA-{$year}-001");
        $second->assertCreated()
            ->assertJsonPath('code', "LIC-OBRA-{$year}-002");
    }

    public function test_it_regenerates_tramite_code_when_type_changes(): void
    {
        $admin = $this->createAdminWithTramitesPermission();

        $firstType = TramiteType::create([
            'code' => 'LIC-OBRA',
            'name' => 'Licencia De Obra',
            'is_active' => true,
        ]);

        $secondType = TramiteType::create([
            'code' => 'DECL-FABR',
            'name' => 'Declaratoria De Fabrica',
            'is_active' => true,
        ]);

        TramitePhase::create([
            'tramite_type_id' => $firstType->id,
            'name' => 'Revision Documental',
            'order' => 1,
        ]);

        TramitePhase::create([
            'tramite_type_id' => $secondType->id,
            'name' => 'Revision Tecnica',
            'order' => 1,
        ]);

        Tramite::create([
            'code' => 'DECL-FABR-' . now()->format('Y') . '-001',
            'tramite_type_id' => $secondType->id,
            'client_name' => 'Cliente Existente',
            'project_name' => 'Declaratoria Existente',
            'location' => 'Cusco, Cusco, Cusco',
            'status' => 'pending',
            'registered_at' => now()->toDateString(),
        ]);

        $createResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/tramites', [
                'tramite_type_id' => $firstType->id,
                'client_name' => 'Cliente Demo',
                'project_name' => 'Licencia Vivienda',
                'property_name' => 'Lote 1',
                'location' => 'Cusco, Cusco, Cusco',
                'responsible_id' => $admin->id,
                'status' => 'pending',
            ]);

        $tramiteId = $createResponse->json('id');
        $year = now()->format('Y');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramiteId}", [
                'tramite_type_id' => $secondType->id,
                'client_name' => 'Cliente Demo',
                'project_name' => 'Licencia Vivienda',
                'property_name' => 'Lote 1',
                'location' => 'Cusco, Cusco, Cusco',
                'responsible_id' => $admin->id,
                'status' => 'pending',
            ])
            ->assertOk()
            ->assertJsonPath('code', "DECL-FABR-{$year}-002");
    }

    private function createAdminWithTramitesPermission(): User
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        ModuleAccess::syncUser($admin, [
            ...ModuleAccess::forRole('admin'),
            ModuleAccess::TRAMITES_MANAGE => true,
        ]);

        return $admin;
    }
}
