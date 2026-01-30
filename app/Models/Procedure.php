<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Procedure extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'procedure_template_id',
        'code',
        'name',
        'client_name',
        'property_name',
        'location',
        'general_responsible_id',
        'status',
        'started_at',
        'estimated_end_at',
        'finished_at',
        'last_activity_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'started_at' => 'date',
        'estimated_end_at' => 'date',
        'finished_at' => 'date',
        'last_activity_at' => 'datetime',
    ];

    public function template()
    {
        return $this->belongsTo(ProcedureTemplate::class, 'procedure_template_id');
    }

    public function phases()
    {
        return $this->hasMany(ProcedurePhase::class)->orderBy('position');
    }

    public function generalResponsible()
    {
        return $this->belongsTo(User::class, 'general_responsible_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
