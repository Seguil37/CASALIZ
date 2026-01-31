<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TramitePhaseInstance extends Model
{
    use HasFactory;

    protected $table = 'tramite_instance_phases';

    protected $fillable = [
        'tramite_id',
        'tramite_phase_id',
        'name',
        'order',
        'status',
        'started_at',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function tramite()
    {
        return $this->belongsTo(Tramite::class);
    }

    public function definition()
    {
        return $this->belongsTo(TramitePhase::class, 'tramite_phase_id');
    }

    public function subphases()
    {
        return $this->hasMany(TramiteSubphaseInstance::class, 'tramite_phase_instance_id')->orderBy('order');
    }

    public function tasks()
    {
        return $this->hasMany(TramiteTask::class, 'tramite_phase_instance_id');
    }
}

