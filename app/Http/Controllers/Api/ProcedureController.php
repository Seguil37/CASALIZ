<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Procedure;
use App\Models\ProcedurePhase;
use App\Models\ProcedureSubphase;
use App\Models\ProcedureTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProcedureController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Procedure::class);

        $query = Procedure::query()
            ->with([
                'template',
                'generalResponsible',
                'phases.subphases',
            ]);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('responsible_id')) {
            $query->where('general_responsible_id', $request->input('responsible_id'));
        }

        if ($request->filled('template_id')) {
            $query->where('procedure_template_id', $request->input('template_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($inner) use ($search) {
                $inner->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('client_name', 'like', "%{$search}%")
                    ->orWhere('property_name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if (!$request->user()->isMasterAdmin()) {
            $query->where('general_responsible_id', $request->user()->id);
        }

        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);
        $paginated = $query->orderByDesc('created_at')->paginate($perPage);

        $paginated->setCollection(
            $paginated->getCollection()->map(fn ($procedure) => $this->mapProcedureSummary($procedure))
        );

        return response()->json($paginated);
    }

    public function show(Procedure $procedure)
    {
        $this->authorize('view', $procedure);

        return response()->json(
            $procedure->load([
                'template',
                'generalResponsible',
                'phases.subphases.assignedUser',
                'phases.subphases.updates.user',
            ])
        );
    }

    public function store(Request $request)
    {
        $this->authorize('create', Procedure::class);

        $validated = $request->validate([
            'procedure_template_id' => 'required|exists:procedure_templates,id',
            'code' => 'nullable|string|max:50|unique:procedures,code',
            'name' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'property_name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'general_responsible_id' => 'nullable|exists:users,id',
            'status' => 'nullable|in:pending,in_progress,observed,approved,completed',
            'started_at' => 'nullable|date',
            'estimated_end_at' => 'nullable|date',
            'finished_at' => 'nullable|date',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $procedure = Procedure::create([
                'procedure_template_id' => $validated['procedure_template_id'],
                'code' => $validated['code'] ?? 'TMP-' . now()->timestamp,
                'name' => $validated['name'],
                'client_name' => $validated['client_name'],
                'property_name' => $validated['property_name'],
                'location' => $validated['location'] ?? null,
                'general_responsible_id' => $validated['general_responsible_id'] ?? null,
                'status' => $validated['status'] ?? 'pending',
                'started_at' => $validated['started_at'] ?? null,
                'estimated_end_at' => $validated['estimated_end_at'] ?? null,
                'finished_at' => $validated['finished_at'] ?? null,
                'last_activity_at' => now(),
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            if (!isset($validated['code'])) {
                $procedure->update([
                    'code' => 'TRM-' . str_pad((string) $procedure->id, 6, '0', STR_PAD_LEFT),
                ]);
            }

            $template = ProcedureTemplate::with('phases.subphases')->findOrFail($validated['procedure_template_id']);

            foreach ($template->phases as $phaseTemplate) {
                $phase = ProcedurePhase::create([
                    'procedure_id' => $procedure->id,
                    'name' => $phaseTemplate->name,
                    'position' => $phaseTemplate->position,
                    'is_required' => $phaseTemplate->is_required,
                    'status' => 'pending',
                ]);

                foreach ($phaseTemplate->subphases as $subphaseTemplate) {
                    ProcedureSubphase::create([
                        'procedure_phase_id' => $phase->id,
                        'name' => $subphaseTemplate->name,
                        'position' => $subphaseTemplate->position,
                        'is_required' => $subphaseTemplate->is_required,
                        'status' => 'pending',
                        'progress' => 0,
                    ]);
                }
            }

            return response()->json(
                $procedure->load('template', 'phases.subphases'),
                201
            );
        });
    }

    public function update(Request $request, Procedure $procedure)
    {
        $this->authorize('update', $procedure);

        $validated = $request->validate([
            'code' => 'sometimes|string|max:50|unique:procedures,code,' . $procedure->id,
            'name' => 'sometimes|string|max:255',
            'client_name' => 'sometimes|string|max:255',
            'property_name' => 'sometimes|string|max:255',
            'location' => 'nullable|string|max:255',
            'general_responsible_id' => 'nullable|exists:users,id',
            'status' => 'nullable|in:pending,in_progress,observed,approved,completed',
            'started_at' => 'nullable|date',
            'estimated_end_at' => 'nullable|date',
            'finished_at' => 'nullable|date',
        ]);

        if (($validated['status'] ?? null) === 'completed' && empty($validated['finished_at'])) {
            $validated['finished_at'] = now()->toDateString();
        }

        $procedure->update([
            ...$validated,
            'updated_by' => $request->user()->id,
            'last_activity_at' => now(),
        ]);

        return response()->json($procedure->load('template', 'phases.subphases'));
    }

    public function destroy(Procedure $procedure)
    {
        $this->authorize('delete', $procedure);
        $procedure->delete();

        return response()->json(['message' => 'Trámite eliminado']);
    }

    protected function mapProcedureSummary(Procedure $procedure): array
    {
        $subphases = $procedure->phases
            ->sortBy('position')
            ->flatMap(fn ($phase) => $phase->subphases->sortBy('position'))
            ->values();

        $currentSubphase = $subphases->first(fn ($subphase) => $subphase->status !== 'done');
        $nextDue = $subphases
            ->whereIn('status', ['pending', 'in_progress', 'observed'])
            ->whereNotNull('due_at')
            ->sortBy('due_at')
            ->first();

        $lastUpdate = collect([
            $procedure->last_activity_at,
            $subphases->max('updated_at'),
            $subphases->max('last_commented_at'),
        ])->filter()->max();

        $overdueCount = $subphases
            ->where('status', '!=', 'done')
            ->whereNotNull('due_at')
            ->filter(fn ($subphase) => $subphase->due_at->isPast())
            ->count();

        return [
            'id' => $procedure->id,
            'code' => $procedure->code,
            'name' => $procedure->name,
            'client_name' => $procedure->client_name,
            'property_name' => $procedure->property_name,
            'location' => $procedure->location,
            'status' => $procedure->status,
            'template' => $procedure->template,
            'general_responsible' => $procedure->generalResponsible,
            'current_subphase' => $currentSubphase,
            'last_update_at' => $lastUpdate,
            'next_due_at' => optional($nextDue)->due_at,
            'alerts' => [
                'observed_count' => $subphases->where('status', 'observed')->count(),
                'overdue_count' => $overdueCount,
            ],
            'created_at' => $procedure->created_at,
            'updated_at' => $procedure->updated_at,
        ];
    }
}
