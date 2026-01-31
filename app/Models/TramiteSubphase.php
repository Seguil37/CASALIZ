<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TramiteSubphase extends Model
{
    use HasFactory;

    protected $fillable = [
        'tramite_phase_id',
        'name',
        'order',
        'description',
    ];

    public function phase()
    {
        return $this->belongsTo(TramitePhase::class, 'tramite_phase_id');
    }
}

