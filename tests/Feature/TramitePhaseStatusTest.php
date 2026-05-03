<?php

namespace Tests\Feature;

use App\Models\Tramite;
use App\Models\TramitePhase;
use App\Models\TramiteSubphase;
use App\Models\TramiteType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TramitePhaseStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_completing_a_phase_also_completes_its_subphases(): void
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

        $phase = TramitePhase::create([
            'tramite_type_id' => $type->id,
            'name' => 'Revision Documental',
            'order' => 1,
        ]);

        TramiteSubphase::create([
            'tramite_phase_id' => $phase->id,
            'name' => 'Recepcion De Documentos',
            'order' => 1,
        ]);

        TramiteSubphase::create([
            'tramite_phase_id' => $phase->id,
            'name' => 'Validacion Municipal',
            'order' => 2,
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

        $phaseInstance = $tramite->phases()->create([
            'tramite_phase_id' => $phase->id,
            'name' => $phase->name,
            'order' => $phase->order,
            'status' => Tramite::STATUS_PENDING,
        ]);

        foreach ($phase->subphases as $subphase) {
            $phaseInstance->subphases()->create([
                'tramite_subphase_id' => $subphase->id,
                'name' => $subphase->name,
                'order' => $subphase->order,
                'status' => Tramite::STATUS_PENDING,
            ]);
        }

        $this
            ->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/tramites/{$tramite->id}/phases/{$phaseInstance->id}", [
                'status' => Tramite::STATUS_COMPLETED,
            ])
            ->assertOk()
            ->assertJsonPath('status', Tramite::STATUS_COMPLETED)
            ->assertJsonCount(2, 'subphases')
            ->assertJsonPath('subphases.0.status', Tramite::STATUS_COMPLETED)
            ->assertJsonPath('subphases.1.status', Tramite::STATUS_COMPLETED);

        $this->assertDatabaseMissing('tramite_instance_subphases', [
            'tramite_phase_instance_id' => $phaseInstance->id,
            'status' => Tramite::STATUS_PENDING,
        ]);

        $this->assertDatabaseHas('tramites', [
            'id' => $tramite->id,
            'status' => Tramite::STATUS_COMPLETED,
        ]);
    }
}
