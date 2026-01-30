<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcedureSubphase extends Model
{
    use HasFactory;

    protected $fillable = [
        'procedure_phase_id',
        'name',
        'position',
        'is_required',
        'assigned_to_id',
        'due_at',
        'priority',
        'status',
        'progress',
        'notes',
        'completed_at',
        'last_commented_at',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'due_at' => 'date',
        'completed_at' => 'datetime',
        'last_commented_at' => 'datetime',
    ];

    public function phase()
    {
        return $this->belongsTo(ProcedurePhase::class, 'procedure_phase_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    public function updates()
    {
        return $this->hasMany(ProcedureSubphaseUpdate::class)->latest();
    }
}
