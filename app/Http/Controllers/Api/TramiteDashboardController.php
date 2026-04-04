<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tramite;
use App\Models\TramiteTask;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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
            'tasks'
        ])
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

                $tasks = $tramite->tasks;
                $tasksTotal = $tasks->count();
                $tasksDone = $tasks->where('status', 'done')->count();
                $tasksOpen = $tasksTotal - $tasksDone;
                $tasksProgress = $tasksTotal > 0 ? round(($tasksDone / $tasksTotal) * 100) : 0;

                $due = $tramite->due_date ? Carbon::parse($tramite->due_date) : null;
                $today = Carbon::today();
                $sla = 'none';
                if ($due) {
                    if ($tramite->status === Tramite::STATUS_COMPLETED) {
                        $sla = 'green';
                    } elseif ($today->greaterThan($due)) {
                        $sla = 'red';
                    } elseif ($today->diffInDays($due) <= 3) {
                        $sla = 'yellow';
                    } else {
                        $sla = 'green';
                    }
                }

                $lastPhaseUpdate = $phases->max('updated_at');
                $lastSubUpdate = $subphases->max('updated_at');
                $lastProgress = Carbon::parse(max($lastPhaseUpdate ?? '1970-01-01', $lastSubUpdate ?? '1970-01-01'))->toDateTimeString();

                return [
                    'id' => $tramite->id,
                    'code' => $tramite->code,
                    'client' => $tramite->client_name ?? $tramite->client?->name,
                    'project' => $tramite->project_name,
                    'location' => $tramite->location,
                    'responsible' => $tramite->responsible?->name,
                    'current_phase' => $currentPhase?->name,
                    'registered_at' => optional($tramite->registered_at)->toDateString(),
                    'updated_at' => optional($tramite->updated_at)->toDateTimeString(),
                    'due_date' => $tramite->due_date ? $tramite->due_date->toDateString() : null,
                    'status' => $tramite->status,
                    'notes' => $tramite->notes,
                    'tasks_total' => $tasksTotal,
                    'tasks_done' => $tasksDone,
                    'tasks_open' => $tasksOpen,
                    'tasks_progress' => $tasksProgress,
                    'phases_progress' => [
                        'completed' => $completedPhases,
                        'total' => $totalPhases,
                    ],
                    'subphases_progress' => [
                        'completed' => $completedSubphases,
                        'total' => $totalSubphases,
                    ],
                    'progress_percent' => $progressPercent,
                    'sla' => $sla,
                    'last_progress_at' => $lastProgress,
                ];
            });

        return response()->json($tramites);
    }

    public function assignedTasks(Request $request)
    {
        $user = auth()->user();
        if (!$user || (!$user->isAdmin() && !$user->isOperator())) {
            abort(403);
        }

        $query = TramiteTask::with([
            'tramite:id,code,project_name,client_name,responsible_id,due_date,status',
            'tramite.responsible:id,name',
            'assignee:id,name,email,role',
            'creator:id,name',
            'phase:id,name',
            'subphase:id,name',
        ])->orderByDesc('id');

        if ($user->isOperator()) {
            $query->where('assigned_to', $user->id);
        }

        $tasks = $query->get()->map(function (TramiteTask $task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'progress' => $task->progress,
                'due_date' => optional($task->due_date)->toDateString(),
                'completed_at' => optional($task->completed_at)->toDateTimeString(),
                'observations' => $task->observations,
                'assigned_to' => $task->assignee ? [
                    'id' => $task->assignee->id,
                    'name' => $task->assignee->name,
                    'email' => $task->assignee->email,
                    'role' => $task->assignee->role,
                ] : null,
                'creator' => $task->creator ? [
                    'id' => $task->creator->id,
                    'name' => $task->creator->name,
                ] : null,
                'phase' => $task->phase ? [
                    'id' => $task->phase->id,
                    'name' => $task->phase->name,
                ] : null,
                'subphase' => $task->subphase ? [
                    'id' => $task->subphase->id,
                    'name' => $task->subphase->name,
                ] : null,
                'tramite' => $task->tramite ? [
                    'id' => $task->tramite->id,
                    'code' => $task->tramite->code,
                    'project_name' => $task->tramite->project_name,
                    'client_name' => $task->tramite->client_name,
                    'status' => $task->tramite->status,
                    'due_date' => optional($task->tramite->due_date)->toDateString(),
                    'responsible' => $task->tramite->responsible?->name,
                ] : null,
                'created_at' => optional($task->created_at)->toDateTimeString(),
                'updated_at' => optional($task->updated_at)->toDateTimeString(),
            ];
        });

        return response()->json($tasks);
    }
}
