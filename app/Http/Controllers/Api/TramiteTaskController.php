<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tramite;
use App\Models\TramiteTask;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TramiteTaskController extends Controller
{
    public function index(Request $request, Tramite $tramite)
    {
        $user = auth()->user();
        if (!$user) abort(401);

        $query = $tramite->tasks()->with([
            'assignee:id,name,email',
            'creator:id,name,email',
            'phase',
            'subphase',
        ])->orderByDesc('id');

        if ($user->isOperator()) {
            $query->where('assigned_to', $user->id);
        } elseif (!$user->isAdmin() && $tramite->responsible_id !== $user->id) {
            abort(403);
        }

        return $query->get();
    }

    public function store(Request $request, Tramite $tramite)
    {
        $this->ensureCanManage($tramite);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'tramite_phase_instance_id' => 'nullable|exists:tramite_instance_phases,id',
            'tramite_subphase_instance_id' => 'nullable|exists:tramite_instance_subphases,id',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => ['nullable', Rule::in($this->statusList())],
            'progress' => 'nullable|integer|min:0|max:100',
            'due_date' => 'nullable|date',
            'observations' => 'nullable|string',
        ]);

        $task = $tramite->tasks()->create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'tramite_phase_instance_id' => $data['tramite_phase_instance_id'] ?? null,
            'tramite_subphase_instance_id' => $data['tramite_subphase_instance_id'] ?? null,
            'assigned_to' => $data['assigned_to'] ?? null,
            'created_by' => $request->user()->id,
            'status' => $data['status'] ?? TramiteTask::STATUS_PENDING,
            'progress' => $data['progress'] ?? 0,
            'due_date' => $data['due_date'] ?? null,
            'observations' => $data['observations'] ?? null,
        ]);

        return response()->json($task->load(['assignee', 'creator', 'phase', 'subphase']), 201);
    }

    public function update(Request $request, Tramite $tramite, TramiteTask $task)
    {
        $user = auth()->user();
        if ($task->tramite_id !== $tramite->id) {
            abort(404);
        }

        $isOwner = $task->assigned_to && $task->assigned_to === $user?->id;

        if (!$user || (!$user->isAdmin() && !$isOwner && $tramite->responsible_id !== $user->id)) {
            abort(403);
        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => ['nullable', Rule::in($this->statusList())],
            'progress' => 'nullable|integer|min:0|max:100',
            'due_date' => 'nullable|date',
            'observations' => 'nullable|string',
        ]);

        // Operativo solo puede actualizar estado, progreso y observaciones
        if ($user->isOperator() && $isOwner) {
            $task->update([
                'status' => $data['status'] ?? $task->status,
                'progress' => $data['progress'] ?? $task->progress,
                'observations' => $data['observations'] ?? $task->observations,
                'completed_at' => ($data['status'] ?? $task->status) === TramiteTask::STATUS_DONE ? now() : $task->completed_at,
            ]);
        } else {
            $task->update(array_merge($data, [
                'completed_at' => ($data['status'] ?? $task->status) === TramiteTask::STATUS_DONE ? now() : $task->completed_at,
            ]));
        }

        return $task->fresh(['assignee', 'creator']);
    }

    public function destroy(Tramite $tramite, TramiteTask $task)
    {
        $this->ensureCanManage($tramite);

        if ($task->tramite_id !== $tramite->id) {
            abort(404);
        }

        $task->delete();

        return response()->json(['message' => 'Tarea eliminada']);
    }

    private function ensureCanManage(Tramite $tramite): void
    {
        $user = auth()->user();
        if (!$user) abort(401);

        // Permiten crear/gestionar tareas: master, admin o responsable del trámite (sin importar rol)
        if ($user->isAdmin() || $user->isMasterAdmin() || $tramite->responsible_id === $user->id) {
            return;
        }

        abort(403);
    }

    private function statusList(): array
    {
        return [
            TramiteTask::STATUS_PENDING,
            TramiteTask::STATUS_IN_PROGRESS,
            TramiteTask::STATUS_BLOCKED,
            TramiteTask::STATUS_DONE,
        ];
    }
}
