<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TramitePhase;
use App\Models\TramiteSubphase;
use App\Models\TramiteType;
use App\Support\DataNormalizer;
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

        $data = $this->normalizeTypeData($data);

        return DB::transaction(function () use ($data, $request) {
            $type = TramiteType::create([
                'code' => $this->generateUniqueTypeCode($data['name']),
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

        $data = $this->normalizeTypeData($data);

        return DB::transaction(function () use ($tramiteType, $data, $request) {
            $tramiteType->update([
                'code' => $this->generateUniqueTypeCode($data['name'], $tramiteType->id),
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

    private function normalizeTypeData(array $data): array
    {
        $data['name'] = DataNormalizer::title($data['name']);
        $data['description'] = DataNormalizer::text($data['description'] ?? null);

        $data['phases'] = array_map(function (array $phase): array {
            $phase['name'] = DataNormalizer::title($phase['name']);
            $phase['description'] = DataNormalizer::text($phase['description'] ?? null);
            $phase['subphases'] = array_map(function (array $subphase): array {
                $subphase['name'] = DataNormalizer::title($subphase['name']);
                $subphase['description'] = DataNormalizer::text($subphase['description'] ?? null);

                return $subphase;
            }, $phase['subphases'] ?? []);

            return $phase;
        }, $data['phases'] ?? []);

        return $data;
    }

    private function generateUniqueTypeCode(string $name, ?int $ignoreId = null): string
    {
        $baseCode = $this->buildTypeCodeBase($name);
        $candidate = $baseCode;
        $suffix = 2;

        while ($this->typeCodeExists($candidate, $ignoreId)) {
            $candidate = "{$baseCode}-{$suffix}";
            $suffix++;
        }

        return $candidate;
    }

    private function buildTypeCodeBase(string $name): string
    {
        $words = preg_split('/\s+/', trim($name)) ?: [];
        $segments = collect($words)
            ->filter()
            ->take(3)
            ->map(function (string $word): string {
                return substr(DataNormalizer::code($word) ?? '', 0, 4);
            })
            ->filter()
            ->values();

        return $segments->isNotEmpty()
            ? $segments->implode('-')
            : 'TRAM';
    }

    private function typeCodeExists(string $code, ?int $ignoreId = null): bool
    {
        return TramiteType::query()
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->where('code', $code)
            ->exists();
    }
}
