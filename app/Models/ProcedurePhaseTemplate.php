<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcedurePhaseTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'procedure_template_id',
        'name',
        'position',
        'is_required',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function template()
    {
        return $this->belongsTo(ProcedureTemplate::class, 'procedure_template_id');
    }

    public function subphases()
    {
        return $this->hasMany(ProcedureSubphaseTemplate::class, 'procedure_phase_template_id')
            ->orderBy('position');
    }
}
