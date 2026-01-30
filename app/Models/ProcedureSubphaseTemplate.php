<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcedureSubphaseTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'procedure_phase_template_id',
        'name',
        'position',
        'is_required',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function phaseTemplate()
    {
        return $this->belongsTo(ProcedurePhaseTemplate::class, 'procedure_phase_template_id');
    }
}
