<?php

namespace Database\Seeders;

use App\Models\Tramite;
use App\Models\TramitePhase;
use App\Models\TramiteSubphase;
use App\Models\TramiteTask;
use App\Models\TramiteType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TramiteDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $master = User::where('role', 'master_admin')->first();
            $operator = User::where('role', 'operator')->first();
            $client = User::where('role', 'client')->first();

            $type = TramiteType::updateOrCreate(
                ['code' => 'LIC-OBRA'],
                [
                    'name' => 'Licencia de Obra',
                    'description' => 'Flujo base para trámites municipales de licencia de obra.',
                    'is_active' => true,
                    'created_by' => $master?->id,
                ]
            );

            // Limpiar y recrear fases demo
            $type->phases()->delete();

            $identificacion = TramitePhase::create([
                'tramite_type_id' => $type->id,
                'name' => 'Identificación del trámite',
                'order' => 1,
            ]);
            TramiteSubphase::insert([
                [
                    'tramite_phase_id' => $identificacion->id,
                    'name' => 'Revisión requisitos',
                    'order' => 1,
                ],
                [
                    'tramite_phase_id' => $identificacion->id,
                    'name' => 'Carga de documentos',
                    'order' => 2,
                ],
            ]);

            $evaluacion = TramitePhase::create([
                'tramite_type_id' => $type->id,
                'name' => 'Evaluación municipal',
                'order' => 2,
            ]);
            TramiteSubphase::insert([
                [
                    'tramite_phase_id' => $evaluacion->id,
                    'name' => 'Observaciones',
                    'order' => 1,
                ],
                [
                    'tramite_phase_id' => $evaluacion->id,
                    'name' => 'Subsanación',
                    'order' => 2,
                ],
            ]);

            $aprobacion = TramitePhase::create([
                'tramite_type_id' => $type->id,
                'name' => 'Aprobación final',
                'order' => 3,
            ]);
            TramiteSubphase::create([
                'tramite_phase_id' => $aprobacion->id,
                'name' => 'Recepción de licencia',
                'order' => 1,
            ]);

            // Crear trámite asignado a cliente/proyecto
            $tramite = Tramite::updateOrCreate(
                ['code' => 'TR-001'],
                [
                    'tramite_type_id' => $type->id,
                    'client_id' => $client?->id,
                    'client_name' => $client?->name,
                    'project_name' => 'Edificio Residencial San Isidro',
                    'property_name' => 'Torre A',
                    'location' => 'San Isidro, Lima',
                    'responsible_id' => $master?->id,
                    'status' => Tramite::STATUS_IN_PROGRESS,
                    'registered_at' => now()->toDateString(),
                    'notes' => 'Trámite demo generado por seeder.',
                ]
            );

            // Instanciar fases/subfases
            $tramite->phases()->delete();
            $type->load('phases.subphases');
            foreach ($type->phases as $phase) {
                $phaseInstance = $tramite->phases()->create([
                    'tramite_phase_id' => $phase->id,
                    'name' => $phase->name,
                    'order' => $phase->order,
                    'status' => Tramite::STATUS_PENDING,
                ]);

                foreach ($phase->subphases as $sub) {
                    $tramiteSubInstance = $phaseInstance->subphases()->create([
                        'tramite_subphase_id' => $sub->id,
                        'name' => $sub->name,
                        'order' => $sub->order,
                        'status' => Tramite::STATUS_PENDING,
                    ]);

                    // Crear tareas demo ligadas a cada subfase
                    TramiteTask::create([
                        'tramite_id' => $tramite->id,
                        'tramite_phase_instance_id' => $phaseInstance->id,
                        'tramite_subphase_instance_id' => $tramiteSubInstance->id,
                        'title' => 'Tarea ' . $sub->name,
                        'description' => 'Completar ' . strtolower($sub->name),
                        'assigned_to' => $operator?->id,
                        'created_by' => $master?->id,
                        'status' => TramiteTask::STATUS_PENDING,
                        'progress' => 0,
                        'due_date' => now()->addDays(3)->toDateString(),
                    ]);
                }
            }
        });
    }
}

