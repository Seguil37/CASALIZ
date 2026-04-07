<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tramite extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_OBSERVED = 'observed';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'code',
        'tramite_type_id',
        'client_id',
        'client_name',
        'project_name',
        'property_name',
        'location',
        'responsible_id',
        'status',
        'registered_at',
        'due_date',
        'notes',
    ];

    protected $casts = [
        'registered_at' => 'date',
        'due_date' => 'date',
    ];

    public function type()
    {
        return $this->belongsTo(TramiteType::class, 'tramite_type_id');
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function responsible()
    {
        return $this->belongsTo(User::class, 'responsible_id');
    }

    public function phases()
    {
        return $this->hasMany(TramitePhaseInstance::class)->orderBy('order');
    }

    public function subphases()
    {
        return $this->hasManyThrough(
            TramiteSubphaseInstance::class,
            TramitePhaseInstance::class,
            'tramite_id',
            'tramite_phase_instance_id',
            'id',
            'id'
        )->orderBy('order');
    }

    public function tasks()
    {
        return $this->hasMany(TramiteTask::class);
    }

    public function currentPhase()
    {
        return $this->phases()
            ->orderBy('order')
            ->get()
            ->firstWhere('status', '!=', self::STATUS_COMPLETED)
            ?? $this->phases()->orderByDesc('order')->first();
    }
}
