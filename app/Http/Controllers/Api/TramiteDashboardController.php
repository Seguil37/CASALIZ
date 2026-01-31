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
            'phases' => fn($q) => $q->orderBy('order'),
        ])
            ->withCount('tasks')
            ->orderByDesc('registered_at')
            ->get()
            ->map(function (Tramite $tramite) {
                $currentPhase = $tramite->currentPhase();
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
                ];
            });

        return response()->json($tramites);
    }
}
