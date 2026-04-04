<?php

namespace App\Notifications;

use App\Models\Tramite;
use App\Models\TramiteTask;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskAssignedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Tramite $tramite,
        private readonly TramiteTask $task,
        private readonly string $message
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'task_assigned',
            'tramite_id' => $this->tramite->id,
            'tramite_code' => $this->tramite->code,
            'tramite_project_name' => $this->tramite->project_name,
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'task_status' => $this->task->status,
            'message' => $this->message,
            'url' => "/tramites/{$this->tramite->id}/tareas",
        ];
    }
}
