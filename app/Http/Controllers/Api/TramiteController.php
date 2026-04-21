<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tramite;
use App\Models\TramitePhase;
use App\Models\TramitePhaseInstance;
use App\Models\TramiteSubphaseInstance;
use App\Models\TramiteType;
use App\Support\DataNormalizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TramiteController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin();

        $query = Tramite::with([
            'type',
            'client:id,name,email',
            'responsible:id,name,email',
            'phases.subphases',
        ])->orderByDesc('id');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = DataNormalizer::text($request->search);
            $matchingStatuses = $this->matchingStatusesForSearch($search);

            $query->where(function ($q) use ($search, $matchingStatuses) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%")
                    ->orWhere('client_name', 'like', "%{$search}%")
                    ->orWhere('property_name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('type', function ($typeQuery) use ($search) {
                        $typeQuery->where('code', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    })
                    ->orWhereHas('responsible', function ($responsibleQuery) use ($search) {
                        $responsibleQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });

                if ($matchingStatuses !== []) {
                    $q->orWhereIn('status', $matchingStatuses);
                }
            });
        }

        return $query->paginate($request->get('per_page', 15));
    }

    public function store(Request $request)
    {
        $this->ensureMaster();

        $request->merge([
            'code' => DataNormalizer::code($request->input('code')),
        ]);

        $data = $request->validate([
            'code' => 'required|string|max:50|unique:tramites,code',
            'tramite_type_id' => 'required|exists:tramite_types,id',
            'client_id' => 'nullable|exists:users,id',
            'client_name' => 'nullable|string|max:255',
            'project_name' => 'required|string|max:255',
            'property_name' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'responsible_id' => 'nullable|exists:users,id',
            'status' => ['nullable', Rule::in($this->statusList())],
            'registered_at' => 'nullable|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $data = $this->normalizeTramiteData($data);

        return DB::transaction(function () use ($data) {
            $tramite = Tramite::create([
                'code' => $data['code'],
                'tramite_type_id' => $data['tramite_type_id'],
                'client_id' => $data['client_id'] ?? null,
                'client_name' => $data['client_name'] ?? null,
                'project_name' => $data['project_name'],
                'property_name' => $data['property_name'] ?? null,
                'location' => $data['location'],
                'responsible_id' => $data['responsible_id'] ?? null,
                'status' => $data['status'] ?? Tramite::STATUS_PENDING,
                'registered_at' => $data['registered_at'] ?? now()->toDateString(),
                'due_date' => $data['due_date'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $this->instantiatePhases($tramite);

            return response()->json($tramite->load(['type', 'phases.subphases']), 201);
        });
    }

    public function show(Tramite $tramite)
    {
        $this->ensureCanView($tramite);

        return $tramite->load([
            'type.phases.subphases',
            'client:id,name,email',
            'responsible:id,name,email',
            'phases.subphases',
            'tasks.assignee:id,name,email',
        ]);
    }

    public function update(Request $request, Tramite $tramite)
    {
        $this->ensureCanManage($tramite);

        $request->merge([
            'code' => DataNormalizer::code($request->input('code')),
        ]);

        $data = $request->validate([
            'code' => 'required|string|max:50|unique:tramites,code,' . $tramite->id,
            'client_id' => 'nullable|exists:users,id',
            'client_name' => 'nullable|string|max:255',
            'project_name' => 'required|string|max:255',
            'property_name' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'responsible_id' => 'nullable|exists:users,id',
            'status' => ['nullable', Rule::in($this->statusList())],
            'registered_at' => 'nullable|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $data = $this->normalizeTramiteData($data);

        $tramite->update($data);

        return $tramite->load(['type', 'phases.subphases']);
    }

    public function updatePhaseStatus(Request $request, Tramite $tramite, TramitePhaseInstance $phaseInstance)
    {
        $this->ensureCanManage($tramite);

        if ($phaseInstance->tramite_id !== $tramite->id) {
            abort(404);
        }

        $data = $request->validate([
            'status' => ['required', Rule::in($this->statusList())],
            'notes' => 'nullable|string',
        ]);

        if (array_key_exists('notes', $data)) {
            $data['notes'] = DataNormalizer::text($data['notes']);
        }

        $phaseInstance->update([
            'status' => $data['status'],
            'notes' => $data['notes'] ?? $phaseInstance->notes,
            'started_at' => $phaseInstance->started_at ?? now(),
            'completed_at' => $data['status'] === Tramite::STATUS_COMPLETED ? now() : null,
        ]);

        $this->recalculateStatus($tramite);

        return $phaseInstance->fresh('subphases');
    }

    public function updateSubphaseStatus(Request $request, Tramite $tramite, TramiteSubphaseInstance $subphaseInstance)
    {
        $this->ensureCanManage($tramite);

        if ($subphaseInstance->phase->tramite_id !== $tramite->id) {
            abort(404);
        }

        $data = $request->validate([
            'status' => ['required', Rule::in($this->statusList())],
            'notes' => 'nullable|string',
        ]);

        if (array_key_exists('notes', $data)) {
            $data['notes'] = DataNormalizer::text($data['notes']);
        }

        $subphaseInstance->update([
            'status' => $data['status'],
            'notes' => $data['notes'] ?? $subphaseInstance->notes,
            'started_at' => $subphaseInstance->started_at ?? now(),
            'completed_at' => $data['status'] === Tramite::STATUS_COMPLETED ? now() : null,
        ]);

        // Si todas las subfases de la fase están completadas, marcar fase como completada
        $phase = $subphaseInstance->phase;
        $phase->loadMissing('subphases');
        $allSubCompleted = $phase->subphases->every(fn($s) => $s->status === Tramite::STATUS_COMPLETED);
        if ($allSubCompleted && $phase->status !== Tramite::STATUS_COMPLETED) {
            $phase->update([
                'status' => Tramite::STATUS_COMPLETED,
                'completed_at' => now(),
                'started_at' => $phase->started_at ?? now(),
            ]);
        }

        $this->recalculateStatus($tramite);

        return $subphaseInstance->fresh();
    }

    public function updateNotes(Request $request, Tramite $tramite)
    {
        $this->ensureCanManage($tramite);

        $data = $request->validate([
            'notes' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        if (array_key_exists('notes', $data)) {
            $data['notes'] = DataNormalizer::text($data['notes']);
        }

        $tramite->update([
            'notes' => $data['notes'] ?? $tramite->notes,
            'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : $tramite->due_date,
        ]);

        return $tramite->fresh();
    }

    public function destroy(Tramite $tramite)
    {
        $this->ensureMaster();
        $tramite->delete();

        return response()->json(['message' => 'Trámite eliminado']);
    }

    private function instantiatePhases(Tramite $tramite): void
    {
        $type = TramiteType::with('phases.subphases')->find($tramite->tramite_type_id);

        foreach ($type->phases as $phase) {
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
        }
    }

    private function ensureAdmin(): void
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
            abort(403, 'Solo administradores pueden acceder a los trámites.');
        }
    }

    private function ensureMaster(): void
    {
        $user = auth()->user();
        if (!$user || !$user->isMasterAdmin()) {
            abort(403, 'Solo el Administrador Master puede realizar esta acción.');
        }
    }

    private function ensureCanView(Tramite $tramite): void
    {
        $user = auth()->user();
        if (!$user) abort(401);

        // Admin y master: acceso total
        if ($user->isAdmin()) return;

        // Operador: permitir visualización aunque no tenga tareas (solo lectura)
        if ($user->isOperator()) return;

        abort(403);
    }

    private function ensureCanManage(Tramite $tramite): void
    {
        $user = auth()->user();
        if (!$user) abort(401);

        if ($user->isAdmin()) {
            return;
        }

        if ($tramite->responsible_id && (int) $tramite->responsible_id === (int) $user->id) {
            return;
        }

        abort(403, 'No tienes permisos para editar este trámite');
    }

    private function statusList(): array
    {
        return [
            Tramite::STATUS_PENDING,
            Tramite::STATUS_IN_PROGRESS,
            Tramite::STATUS_OBSERVED,
            Tramite::STATUS_COMPLETED,
        ];
    }

    private function matchingStatusesForSearch(?string $search): array
    {
        $term = strtolower(str_replace('_', ' ', iconv('UTF-8', 'ASCII//TRANSLIT', $search ?? '') ?: ''));
        $term = preg_replace('/\s+/', ' ', trim($term));

        if ($term === '') {
            return [];
        }

        $aliases = [
            Tramite::STATUS_PENDING => ['pendiente', 'pending'],
            Tramite::STATUS_IN_PROGRESS => ['en proceso', 'proceso', 'progress', 'in progress'],
            Tramite::STATUS_OBSERVED => ['observado', 'observada', 'observed'],
            Tramite::STATUS_COMPLETED => ['finalizado', 'finalizada', 'completado', 'completada', 'completed'],
        ];

        return collect($aliases)
            ->filter(fn ($terms) => collect($terms)->contains(fn ($alias) => str_contains($alias, $term) || str_contains($term, $alias)))
            ->keys()
            ->values()
            ->all();
    }

    private function normalizeTramiteData(array $data): array
    {
        if (array_key_exists('code', $data)) {
            $data['code'] = DataNormalizer::code($data['code']);
        }

        foreach (['client_name', 'project_name', 'property_name'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = DataNormalizer::title($data[$field]);
            }
        }

        if (array_key_exists('location', $data)) {
            $data['location'] = DataNormalizer::location($data['location']);
        }

        if (array_key_exists('notes', $data)) {
            $data['notes'] = DataNormalizer::text($data['notes']);
        }

        return $data;
    }

    private function recalculateStatus(Tramite $tramite): void
    {
        $tramite->loadMissing('phases.subphases');

        $phases = $tramite->phases;
        if ($phases->isEmpty()) {
            return;
        }

        $completedPhases = $phases->where('status', Tramite::STATUS_COMPLETED)->count();
        $totalPhases = $phases->count();

        $allCompleted = $completedPhases === $totalPhases;
        $hasObserved = $phases->contains(fn($p) => $p->status === Tramite::STATUS_OBSERVED);
        $hasInProgress = $phases->contains(fn($p) => $p->status === Tramite::STATUS_IN_PROGRESS);

        $newStatus = Tramite::STATUS_PENDING;
        if ($allCompleted) {
            $newStatus = Tramite::STATUS_COMPLETED;
        } elseif ($hasObserved) {
            $newStatus = Tramite::STATUS_OBSERVED;
        } elseif ($hasInProgress || $completedPhases > 0) {
            $newStatus = Tramite::STATUS_IN_PROGRESS;
        }

        if ($tramite->status !== $newStatus) {
            $tramite->update(['status' => $newStatus]);
        }
    }
}
