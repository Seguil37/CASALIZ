<?php

namespace App\Support;

use App\Models\Tramite;
use App\Models\TramitePhaseInstance;
use App\Models\TramiteSubphaseInstance;
use App\Models\TramiteTask;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TramiteNotificationService
{
    public const TYPES = [
        'task_assigned',
        'task_completed',
        'task_blocked',
        'task_reopened',
        'task_due_soon',
        'task_overdue',
        'tramite_assigned',
        'phase_status_changed',
        'subphase_status_changed',
        'tramite_status_changed',
        'note_added',
        'observation_added',
    ];

    public static function labels(): array
    {
        return [
            'task_assigned' => 'Tarea asignada',
            'task_completed' => 'Tarea finalizada',
            'task_blocked' => 'Tarea bloqueada',
            'task_reopened' => 'Tarea reabierta',
            'task_due_soon' => 'Tarea por vencer',
            'task_overdue' => 'Tarea vencida',
            'tramite_assigned' => 'Tramite asignado',
            'phase_status_changed' => 'Cambio de fase',
            'subphase_status_changed' => 'Cambio de subfase',
            'tramite_status_changed' => 'Cambio de estado del tramite',
            'note_added' => 'Nota agregada',
            'observation_added' => 'Observacion agregada',
        ];
    }

    public function notifyTaskAssigned(Tramite $tramite, TramiteTask $task, ?int $previousAssigneeId, ?User $actor): void
    {
        if (!$task->assigned_to || $previousAssigneeId === $task->assigned_to) {
            return;
        }

        $assignee = $task->assignee()->first();
        if (!$assignee) {
            return;
        }

        $message = $previousAssigneeId
            ? "Se te asigno la tarea '{$task->title}' en el tramite {$tramite->code}."
            : "Tienes una nueva tarea '{$task->title}' en el tramite {$tramite->code}.";

        $this->send('task_assigned', [$assignee], $tramite, $message, $actor, $task);
    }

    public function notifyTaskStatusChanged(Tramite $tramite, TramiteTask $task, ?string $previousStatus, ?User $actor): void
    {
        if (!$previousStatus || $previousStatus === $task->status) {
            return;
        }

        if ($task->status === TramiteTask::STATUS_DONE) {
            $this->send(
                'task_completed',
                $this->adminResponsibleRecipients($tramite),
                $tramite,
                "La tarea '{$task->title}' fue finalizada en el tramite {$tramite->code}.",
                $actor,
                $task
            );
        }

        if ($task->status === TramiteTask::STATUS_BLOCKED) {
            $this->send(
                'task_blocked',
                $this->adminResponsibleRecipients($tramite),
                $tramite,
                "La tarea '{$task->title}' fue marcada como bloqueada en el tramite {$tramite->code}.",
                $actor,
                $task
            );
        }

        if ($previousStatus === TramiteTask::STATUS_DONE && in_array($task->status, [TramiteTask::STATUS_PENDING, TramiteTask::STATUS_IN_PROGRESS], true)) {
            $this->send(
                'task_reopened',
                $this->taskOwnerRecipients($tramite, $task),
                $tramite,
                "La tarea '{$task->title}' fue reabierta en el tramite {$tramite->code}.",
                $actor,
                $task
            );
        }
    }

    public function notifyTaskObservationChanged(Tramite $tramite, TramiteTask $task, ?string $previousObservation, ?User $actor): void
    {
        if (!$task->observations || $previousObservation === $task->observations) {
            return;
        }

        $this->send(
            'observation_added',
            $this->adminResponsibleRecipients($tramite)->merge($this->taskOwnerRecipients($tramite, $task)),
            $tramite,
            "Se agrego una observacion a la tarea '{$task->title}' del tramite {$tramite->code}.",
            $actor,
            $task
        );
    }

    public function notifyTramiteAssigned(Tramite $tramite, ?int $previousResponsibleId, ?User $actor): void
    {
        if (!$tramite->responsible_id || $previousResponsibleId === $tramite->responsible_id) {
            return;
        }

        $responsible = $tramite->responsible()->first();
        if (!$responsible) {
            return;
        }

        $this->send(
            'tramite_assigned',
            [$responsible],
            $tramite,
            "Se te asigno como responsable del tramite {$tramite->code}.",
            $actor
        );
    }

    public function notifyTramiteStatusChanged(Tramite $tramite, ?string $previousStatus, ?User $actor): void
    {
        if (!$previousStatus || $previousStatus === $tramite->status) {
            return;
        }

        $this->send(
            'tramite_status_changed',
            $this->adminResponsibleRecipients($tramite),
            $tramite,
            "El tramite {$tramite->code} cambio de estado a {$this->statusLabel($tramite->status)}.",
            $actor
        );
    }

    public function notifyPhaseStatusChanged(Tramite $tramite, TramitePhaseInstance $phase, ?string $previousStatus, ?User $actor): void
    {
        if (!$previousStatus || $previousStatus === $phase->status) {
            return;
        }

        $this->send(
            'phase_status_changed',
            $this->adminResponsibleRecipients($tramite),
            $tramite,
            "La fase '{$phase->name}' cambio a {$this->statusLabel($phase->status)} en el tramite {$tramite->code}.",
            $actor,
            null,
            $phase
        );
    }

    public function notifySubphaseStatusChanged(Tramite $tramite, TramiteSubphaseInstance $subphase, ?string $previousStatus, ?User $actor): void
    {
        if (!$previousStatus || $previousStatus === $subphase->status) {
            return;
        }

        $this->send(
            'subphase_status_changed',
            $this->adminResponsibleRecipients($tramite),
            $tramite,
            "La subfase '{$subphase->name}' cambio a {$this->statusLabel($subphase->status)} en el tramite {$tramite->code}.",
            $actor,
            null,
            null,
            $subphase
        );
    }

    public function notifyNoteAdded(Tramite $tramite, ?string $previousNotes, ?User $actor): void
    {
        if (!$tramite->notes || $previousNotes === $tramite->notes) {
            return;
        }

        $this->send(
            'note_added',
            $this->adminResponsibleRecipients($tramite),
            $tramite,
            "Se agrego una nota al tramite {$tramite->code}.",
            $actor
        );
    }

    public function generateDueNotificationsFor(User $user): void
    {
        $today = now()->toDateString();
        $soon = now()->addDays(2)->toDateString();

        $tasks = TramiteTask::query()
            ->with(['assignee', 'tramite.responsible'])
            ->whereNotIn('status', [TramiteTask::STATUS_DONE])
            ->whereNotNull('due_date')
            ->where(function ($query) use ($user) {
                $query->where('assigned_to', $user->id)
                    ->orWhereHas('tramite', fn ($tramiteQuery) => $tramiteQuery->where('responsible_id', $user->id));
            })
            ->whereDate('due_date', '<=', $soon)
            ->get();

        foreach ($tasks as $task) {
            if (!$task->tramite) {
                continue;
            }

            $type = $task->due_date->toDateString() < $today ? 'task_overdue' : 'task_due_soon';
            $message = $type === 'task_overdue'
                ? "La tarea '{$task->title}' del tramite {$task->tramite->code} esta vencida."
                : "La tarea '{$task->title}' del tramite {$task->tramite->code} vence pronto.";

            $recipients = collect([$task->assignee, $task->tramite->responsible])->filter();
            $this->send($type, $recipients, $task->tramite, $message, null, $task, null, null, now()->toDateString());
        }
    }

    private function send(
        string $type,
        iterable $recipients,
        Tramite $tramite,
        string $message,
        ?User $actor = null,
        ?TramiteTask $task = null,
        ?TramitePhaseInstance $phase = null,
        ?TramiteSubphaseInstance $subphase = null,
        ?string $dedupeKey = null
    ): void {
        $labels = self::labels();

        collect($recipients)
            ->filter()
            ->unique('id')
            ->reject(fn (User $user) => $actor && $user->id === $actor->id)
            ->reject(fn (User $user) => !$this->isEnabled($user, $type))
            ->each(function (User $user) use ($type, $labels, $tramite, $message, $task, $phase, $subphase, $dedupeKey): void {
                $data = [
                    'type' => $type,
                    'label' => $labels[$type] ?? $type,
                    'tramite_id' => $tramite->id,
                    'tramite_code' => $tramite->code,
                    'tramite_project_name' => $tramite->project_name,
                    'message' => $message,
                    'url' => "/tramites/{$tramite->id}/tareas",
                    'dedupe_key' => $dedupeKey,
                ];

                if ($task) {
                    $data += [
                        'task_id' => $task->id,
                        'task_title' => $task->title,
                        'task_status' => $task->status,
                    ];
                }

                if ($phase) {
                    $data += ['phase_id' => $phase->id, 'phase_name' => $phase->name, 'phase_status' => $phase->status];
                    $data['url'] = "/tramites/{$tramite->id}/detalle";
                }

                if ($subphase) {
                    $data += ['subphase_id' => $subphase->id, 'subphase_name' => $subphase->name, 'subphase_status' => $subphase->status];
                    $data['url'] = "/tramites/{$tramite->id}/detalle";
                }

                if ($this->alreadySent($user, $type, $data)) {
                    return;
                }

                DB::table('notifications')->insert([
                    'type' => $type,
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'data' => json_encode($data, JSON_UNESCAPED_UNICODE),
                    'read_at' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });
    }

    private function adminResponsibleRecipients(Tramite $tramite): Collection
    {
        return User::query()
            ->whereIn('role', ['master_admin', 'admin'])
            ->where('is_active', true)
            ->get()
            ->push($tramite->responsible)
            ->filter();
    }

    private function taskOwnerRecipients(Tramite $tramite, TramiteTask $task): Collection
    {
        return collect([$tramite->responsible, $task->assignee, $task->creator])->filter();
    }

    private function isEnabled(User $user, string $type): bool
    {
        $preference = DB::table('notification_preferences')
            ->where('user_id', $user->id)
            ->where('type', $type)
            ->value('enabled');

        return $preference === null || (bool) $preference;
    }

    private function alreadySent(User $user, string $type, array $data): bool
    {
        $taskId = $data['task_id'] ?? null;
        $dedupeKey = $data['dedupe_key'] ?? null;

        if (!$taskId || !$dedupeKey) {
            return false;
        }

        return DB::table('notifications')
            ->where('notifiable_type', User::class)
            ->where('notifiable_id', $user->id)
            ->where('type', $type)
            ->where('data', 'like', '%"task_id":' . $taskId . '%')
            ->where('data', 'like', '%"dedupe_key":"' . $dedupeKey . '"%')
            ->exists();
    }

    private function statusLabel(string $status): string
    {
        return [
            'pending' => 'pendiente',
            'in_progress' => 'en proceso',
            'observed' => 'observado',
            'completed' => 'completado',
            'blocked' => 'bloqueado',
            'done' => 'finalizado',
        ][$status] ?? $status;
    }
}
