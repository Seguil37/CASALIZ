<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProcedurePhaseTemplate;
use App\Models\ProcedureSubphaseTemplate;
use App\Models\ProcedureTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProcedureTemplateController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', ProcedureTemplate::class);

        return response()->json(
            ProcedureTemplate::query()
                ->with('phases.subphases')
                ->orderBy('name')
                ->get()
        );
    }

    public function show(ProcedureTemplate $procedureTemplate)
    {
        $this->authorize('view', $procedureTemplate);

        return response()->json($procedureTemplate->load('phases.subphases'));
    }

    public function store(Request $request)
    {
        $this->authorize('create', ProcedureTemplate::class);

        $validated = $this->validateTemplate($request);

        return DB::transaction(function () use ($validated, $request) {
            $template = ProcedureTemplate::create([
                'name' => $validated['name'],
                'code' => $validated['code'] ?? null,
                'description' => $validated['description'] ?? null,
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            $this->syncTemplatePhases($template, $validated['phases'] ?? []);

            return response()->json($template->load('phases.subphases'), 201);
        });
    }

    public function update(Request $request, ProcedureTemplate $procedureTemplate)
    {
        $this->authorize('update', $procedureTemplate);

        $validated = $this->validateTemplate($request, true);

        return DB::transaction(function () use ($validated, $procedureTemplate, $request) {
            $procedureTemplate->update([
                'name' => $validated['name'] ?? $procedureTemplate->name,
                'code' => $validated['code'] ?? $procedureTemplate->code,
                'description' => $validated['description'] ?? $procedureTemplate->description,
                'updated_by' => $request->user()->id,
            ]);

            if (array_key_exists('phases', $validated)) {
                $procedureTemplate->phases()->delete();
                $this->syncTemplatePhases($procedureTemplate, $validated['phases'] ?? []);
            }

            return response()->json($procedureTemplate->load('phases.subphases'));
        });
    }

    public function destroy(ProcedureTemplate $procedureTemplate)
    {
        $this->authorize('delete', $procedureTemplate);
        $procedureTemplate->delete();

        return response()->json(['message' => 'Plantilla eliminada']);
    }

    protected function validateTemplate(Request $request, bool $isUpdate = false): array
    {
        $rules = [
            'name' => ($isUpdate ? 'sometimes' : 'required') . '|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'phases' => 'array',
            'phases.*.name' => 'required_with:phases|string|max:255',
            'phases.*.position' => 'nullable|integer|min:0',
            'phases.*.is_required' => 'boolean',
            'phases.*.subphases' => 'array',
            'phases.*.subphases.*.name' => 'required_with:phases.*.subphases|string|max:255',
            'phases.*.subphases.*.position' => 'nullable|integer|min:0',
            'phases.*.subphases.*.is_required' => 'boolean',
        ];

        return $request->validate($rules);
    }

    protected function syncTemplatePhases(ProcedureTemplate $template, array $phases): void
    {
        foreach ($phases as $phaseData) {
            $phase = ProcedurePhaseTemplate::create([
                'procedure_template_id' => $template->id,
                'name' => $phaseData['name'],
                'position' => $phaseData['position'] ?? 0,
                'is_required' => $phaseData['is_required'] ?? true,
            ]);

            foreach ($phaseData['subphases'] ?? [] as $subphaseData) {
                ProcedureSubphaseTemplate::create([
                    'procedure_phase_template_id' => $phase->id,
                    'name' => $subphaseData['name'],
                    'position' => $subphaseData['position'] ?? 0,
                    'is_required' => $subphaseData['is_required'] ?? true,
                ]);
            }
        }
    }
}
