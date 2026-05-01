<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tramite;
use App\Models\TramiteTask;
use App\Support\DataNormalizer;
use App\Support\TramiteNotificationService;
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
            if ((int) $tramite->responsible_id !== (int) $user->id) {
                $query->where('assigned_to', $user->id);
            }
        } elseif (!$user->isAdmin() && (int) $tramite->responsible_id !== (int) $user->id) {
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

        $data = $this->normalizeTaskData($data);
        $data = $this->normalizePhaseSelection($tramite, $data);

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

        app(TramiteNotificationService::class)->notifyTaskAssigned($tramite, $task, null, $request->user());

        return response()->json($task->load(['assignee', 'creator', 'phase', 'subphase']), 201);
    }

    public function update(Request $request, Tramite $tramite, TramiteTask $task)
    {
        $user = auth()->user();
        if ($task->tramite_id !== $tramite->id) {
            abort(404);
        }

        $isOwner = $user && $task->assigned_to && (int) $task->assigned_to === (int) $user->id;
        $isResponsible = $user && (int) $tramite->responsible_id === (int) $user->id;
        $isCreator = $user && (int) $task->created_by === (int) $user->id;

        if (!$user || (!$user->isAdmin() && !$isOwner && !$isResponsible)) {
            abort(403);
        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'tramite_phase_instance_id' => 'nullable|exists:tramite_instance_phases,id',
            'tramite_subphase_instance_id' => 'nullable|exists:tramite_instance_subphases,id',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => ['nullable', Rule::in($this->statusList())],
            'progress' => 'nullable|integer|min:0|max:100',
            'due_date' => 'nullable|date',
            'observations' => 'nullable|string',
        ]);

        $data = $this->normalizeTaskData($data);
        $data = $this->normalizePhaseSelection($tramite, $data, $task);

        $previousAssigneeId = $task->assigned_to;
        $previousStatus = $task->status;
        $previousObservation = $task->observations;

        if ($user->isOperator()) {
            if (!$isOwner && !($isResponsible && $isCreator)) {
                abort(403);
            }

            $updates = [];

            if ($isOwner) {
                $nextStatus = $data['status'] ?? $task->status;
                $updates = [
                    'status' => $nextStatus,
                    'progress' => $data['progress'] ?? $task->progress,
                    'observations' => $data['observations'] ?? $task->observations,
                    'completed_at' => $nextStatus === TramiteTask::STATUS_DONE ? now() : $task->completed_at,
                ];
            }

            if ($isResponsible && ($isCreator || $isOwner)) {
                $updates['tramite_phase_instance_id'] = $data['tramite_phase_instance_id'];
                $updates['tramite_subphase_instance_id'] = $data['tramite_subphase_instance_id'];

                if (array_key_exists('due_date', $data)) {
                    $updates['due_date'] = $data['due_date'];
                }
            }

            $task->update($updates);
        } else {
            $task->update(array_merge($data, [
                'completed_at' => ($data['status'] ?? $task->status) === TramiteTask::STATUS_DONE ? now() : $task->completed_at,
            ]));
        }

        $freshTask = $task->fresh(['assignee', 'creator', 'phase', 'subphase']);
        $notifications = app(TramiteNotificationService::class);
        $notifications->notifyTaskAssigned($tramite, $freshTask, $previousAssigneeId, $user);
        $notifications->notifyTaskStatusChanged($tramite, $freshTask, $previousStatus, $user);
        $notifications->notifyTaskObservationChanged($tramite, $freshTask, $previousObservation, $user);

        return $freshTask;
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

        if ($user->isAdmin() || $user->isMasterAdmin() || (int) $tramite->responsible_id === (int) $user->id) {
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

    private function normalizePhaseSelection(Tramite $tramite, array $data, ?TramiteTask $task = null): array
    {
        $phaseId = array_key_exists('tramite_phase_instance_id', $data)
            ? $data['tramite_phase_instance_id']
            : $task?->tramite_phase_instance_id;

        $subphaseId = array_key_exists('tramite_subphase_instance_id', $data)
            ? $data['tramite_subphase_instance_id']
            : $task?->tramite_subphase_instance_id;

        if ($phaseId) {
            $phase = $tramite->phases()->whereKey($phaseId)->first();
            if (!$phase) {
                abort(422, 'La fase seleccionada no pertenece a este tramite.');
            }
        }

        if ($subphaseId) {
            $subphase = $tramite->subphases()
                ->with('phase:id,tramite_id')
                ->whereKey($subphaseId)
                ->first();

            if (!$subphase) {
                abort(422, 'La subfase seleccionada no pertenece a este tramite.');
            }

            $phaseId = $subphase->tramite_phase_instance_id;
        }

        $data['tramite_phase_instance_id'] = $phaseId ?: null;
        $data['tramite_subphase_instance_id'] = $subphaseId ?: null;

        return $data;
    }

    private function normalizeTaskData(array $data): array
    {
        if (array_key_exists('title', $data)) {
            $data['title'] = DataNormalizer::sentence($data['title']);
        }

        foreach (['description', 'observations'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = DataNormalizer::text($data[$field]);
            }
        }

        return $data;
    }
}
