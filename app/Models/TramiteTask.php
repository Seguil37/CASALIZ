<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TramiteTask extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_BLOCKED = 'blocked';
    public const STATUS_DONE = 'done';

    protected $fillable = [
        'tramite_id',
        'tramite_phase_instance_id',
        'tramite_subphase_instance_id',
        'title',
        'description',
        'assigned_to',
        'created_by',
        'status',
        'progress',
        'due_date',
        'completed_at',
        'observations',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function tramite()
    {
        return $this->belongsTo(Tramite::class);
    }

    public function phase()
    {
        return $this->belongsTo(TramitePhaseInstance::class, 'tramite_phase_instance_id');
    }

    public function subphase()
    {
        return $this->belongsTo(TramiteSubphaseInstance::class, 'tramite_subphase_instance_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

