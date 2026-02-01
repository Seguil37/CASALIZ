<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tramite;
use Illuminate\Http\Request;

class TramiteDashboardController extends Controller
{
    public function overview(Request $request)
    {
        $user = auth()->user();
        if (!$user || (!$user->isAdmin() && !$user->isOperator())) {
            abort(403);
        }

        $tramites = Tramite::with([
            'client:id,name',
            'responsible:id,name',
            'phases' => fn($q) => $q->orderBy('order')->with('subphases'),
        ])
            ->withCount('tasks')
            ->orderByDesc('registered_at')
            ->get()
            ->map(function (Tramite $tramite) {
                $currentPhase = $tramite->currentPhase();
                $phases = $tramite->phases;
                $totalPhases = $phases->count();
                $completedPhases = $phases->where('status', Tramite::STATUS_COMPLETED)->count();
                $subphases = $phases->flatMap->subphases;
                $totalSubphases = $subphases->count();
                $completedSubphases = $subphases->where('status', Tramite::STATUS_COMPLETED)->count();

                $progressPercent = 0;
                if ($totalPhases > 0) {
                    $progressPercent = round(($completedPhases / $totalPhases) * 100);
                } elseif ($totalSubphases > 0) {
                    $progressPercent = round(($completedSubphases / $totalSubphases) * 100);
                }

                return [
                    'id' => $tramite->id,
                    'code' => $tramite->code,
                    'client' => $tramite->client_name ?? $tramite->client?->name,
                    'project' => $tramite->project_name,
                    'location' => $tramite->location,
                    'responsible' => $tramite->responsible?->name,
                    'current_phase' => $currentPhase?->name,
                    'registered_at' => optional($tramite->registered_at)->toDateString(),
                    'status' => $tramite->status,
                    'notes' => $tramite->notes,
                    'tasks_count' => $tramite->tasks_count,
                    'phases_progress' => [
                        'completed' => $completedPhases,
                        'total' => $totalPhases,
                    ],
                    'subphases_progress' => [
                        'completed' => $completedSubphases,
                        'total' => $totalSubphases,
                    ],
                    'progress_percent' => $progressPercent,
                ];
            });

        return response()->json($tramites);
    }
}
