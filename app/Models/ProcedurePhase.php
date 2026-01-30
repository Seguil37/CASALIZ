<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcedurePhase extends Model
{
    use HasFactory;

    protected $fillable = [
        'procedure_id',
        'name',
        'position',
        'is_required',
        'status',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function procedure()
    {
        return $this->belongsTo(Procedure::class);
    }

    public function subphases()
    {
        return $this->hasMany(ProcedureSubphase::class)->orderBy('position');
    }
}
