<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TramiteSubphaseInstance extends Model
{
    use HasFactory;

    protected $table = 'tramite_instance_subphases';

    protected $fillable = [
        'tramite_phase_instance_id',
        'tramite_subphase_id',
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

    public function phase()
    {
        return $this->belongsTo(TramitePhaseInstance::class, 'tramite_phase_instance_id');
    }

    public function definition()
    {
        return $this->belongsTo(TramiteSubphase::class, 'tramite_subphase_id');
    }

    public function tasks()
    {
        return $this->hasMany(TramiteTask::class, 'tramite_subphase_instance_id');
    }
}

