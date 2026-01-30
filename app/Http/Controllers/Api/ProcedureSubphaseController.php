<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Procedure;
use App\Models\ProcedureSubphase;
use App\Models\ProcedureSubphaseUpdate;
use Illuminate\Http\Request;

class ProcedureSubphaseController extends Controller
{
    public function update(Request $request, Procedure $procedure, ProcedureSubphase $subphase)
    {
        $this->ensureSubphaseBelongsToProcedure($procedure, $subphase);
        $this->authorize('update', $subphase);

        $validated = $request->validate([
            'assigned_to_id' => 'nullable|exists:users,id',
            'due_at' => 'nullable|date',
            'priority' => 'nullable|string|in:low,medium,high,critical',
            'status' => 'nullable|in:pending,in_progress,done,observed',
            'progress' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $status = $validated['status'] ?? $subphase->status;
        $progress = $validated['progress'] ?? $subphase->progress;
        $completedAt = $subphase->completed_at;

        if ($status === 'done') {
            $progress = 100;
            $completedAt = $subphase->completed_at ?? now();
        }

        if ($status !== 'done') {
            $completedAt = null;
        }

        $subphase->update([
            ...$validated,
            'status' => $status,
            'progress' => $progress,
            'completed_at' => $completedAt,
        ]);

        $procedure->update(['last_activity_at' => now()]);

        return response()->json($subphase->load('assignedUser'));
    }

    public function storeUpdate(Request $request, Procedure $procedure, ProcedureSubphase $subphase)
    {
        $this->ensureSubphaseBelongsToProcedure($procedure, $subphase);
        $this->authorize('update', $subphase);

        $validated = $request->validate([
            'comment' => 'required|string',
            'status' => 'nullable|in:pending,in_progress,done,observed',
            'progress' => 'nullable|integer|min:0|max:100',
            'attachments' => 'nullable|array',
            'attachments.*' => 'string|max:2048',
        ]);

        $update = ProcedureSubphaseUpdate::create([
            'procedure_subphase_id' => $subphase->id,
            'user_id' => $request->user()->id,
            'status' => $validated['status'] ?? null,
            'progress' => $validated['progress'] ?? null,
            'comment' => $validated['comment'],
            'attachments' => $validated['attachments'] ?? null,
        ]);

        if (isset($validated['status']) || isset($validated['progress'])) {
            $status = $validated['status'] ?? $subphase->status;
            $progress = $validated['progress'] ?? $subphase->progress;
            $completedAt = $subphase->completed_at;

            if ($status === 'done') {
                $progress = 100;
                $completedAt = $subphase->completed_at ?? now();
            }

            if ($status !== 'done') {
                $completedAt = null;
            }

            $subphase->update([
                'status' => $status,
                'progress' => $progress,
                'completed_at' => $completedAt,
            ]);
        }

        $subphase->update(['last_commented_at' => now()]);
        $procedure->update(['last_activity_at' => now()]);

        return response()->json($update->load('user'), 201);
    }

    protected function ensureSubphaseBelongsToProcedure(Procedure $procedure, ProcedureSubphase $subphase): void
    {
        if ($subphase->phase->procedure_id !== $procedure->id) {
            abort(404);
        }
    }
}
