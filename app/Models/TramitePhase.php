<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TramitePhase extends Model
{
    use HasFactory;

    protected $fillable = [
        'tramite_type_id',
        'name',
        'order',
        'description',
    ];

    public function type()
    {
        return $this->belongsTo(TramiteType::class, 'tramite_type_id');
    }

    public function subphases()
    {
        return $this->hasMany(TramiteSubphase::class)->orderBy('order');
    }
}

