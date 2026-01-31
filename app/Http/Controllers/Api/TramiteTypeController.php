<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TramitePhase;
use App\Models\TramiteSubphase;
use App\Models\TramiteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TramiteTypeController extends Controller
{
    public function index()
    {
        $this->ensureAdminOrMaster();

        $types = TramiteType::with(['phases.subphases'])
            ->orderBy('name')
            ->get();

        return response()->json($types);
    }

    public function store(Request $request)
    {
        $this->ensureMaster();

        $data = $request->validate([
            'code' => 'required|string|max:50|unique:tramite_types,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'phases' => 'array',
            'phases.*.name' => 'required_with:phases|string|max:255',
            'phases.*.order' => 'nullable|integer|min:1',
            'phases.*.description' => 'nullable|string',
            'phases.*.subphases' => 'array',
            'phases.*.subphases.*.name' => 'required_with:phases.*.subphases|string|max:255',
            'phases.*.subphases.*.order' => 'nullable|integer|min:1',
            'phases.*.subphases.*.description' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $type = TramiteType::create([
                'code' => $data['code'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'created_by' => $request->user()->id ?? null,
            ]);

            $this->syncPhases($type, $data['phases'] ?? []);

            return response()->json($type->load('phases.subphases'), 201);
        });
    }

    public function show(TramiteType $tramiteType)
    {
        $this->ensureAdminOrMaster();

        return $tramiteType->load('phases.subphases');
    }

    public function update(Request $request, TramiteType $tramiteType)
    {
        $this->ensureMaster();

        $data = $request->validate([
            'code' => 'required|string|max:50|unique:tramite_types,code,' . $tramiteType->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'phases' => 'array',
            'phases.*.name' => 'required_with:phases|string|max:255',
            'phases.*.order' => 'nullable|integer|min:1',
            'phases.*.description' => 'nullable|string',
            'phases.*.subphases' => 'array',
            'phases.*.subphases.*.name' => 'required_with:phases.*.subphases|string|max:255',
            'phases.*.subphases.*.order' => 'nullable|integer|min:1',
            'phases.*.subphases.*.description' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($tramiteType, $data, $request) {
            $tramiteType->update([
                'code' => $data['code'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? $tramiteType->is_active,
                'updated_by' => $request->user()->id ?? null,
            ]);

            if (array_key_exists('phases', $data)) {
                $this->syncPhases($tramiteType, $data['phases'] ?? []);
            }

            return response()->json($tramiteType->load('phases.subphases'));
        });
    }

    public function destroy(TramiteType $tramiteType)
    {
        $this->ensureMaster();

        if ($tramiteType->tramites()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar porque existen trámites usando este tipo.'
            ], 409);
        }

        $tramiteType->delete();

        return response()->json(['message' => 'Tipo de trámite eliminado.']);
    }

    private function ensureMaster(): void
    {
        if (!auth()->check() || !auth()->user()->isMasterAdmin()) {
            abort(403, 'Solo el Administrador Master puede gestionar tipos de trámite.');
        }
    }

    private function ensureAdminOrMaster(): void
    {
        $user = auth()->user();
        if (!$user || (!$user->isMasterAdmin() && !$user->isAdmin())) {
            abort(403, 'Solo staff autorizado puede ver tipos de trámite.');
        }
    }

    private function syncPhases(TramiteType $type, array $phases): void
    {
        // Estrategia simple: limpiar y recrear para mantener integridad
        $type->phases()->delete();

        foreach ($phases as $index => $phaseData) {
            $phase = TramitePhase::create([
                'tramite_type_id' => $type->id,
                'name' => $phaseData['name'],
                'order' => $phaseData['order'] ?? ($index + 1),
                'description' => $phaseData['description'] ?? null,
            ]);

            foreach ($phaseData['subphases'] ?? [] as $sIndex => $subphaseData) {
                TramiteSubphase::create([
                    'tramite_phase_id' => $phase->id,
                    'name' => $subphaseData['name'],
                    'order' => $subphaseData['order'] ?? ($sIndex + 1),
                    'description' => $subphaseData['description'] ?? null,
                ]);
            }
        }
    }
}
