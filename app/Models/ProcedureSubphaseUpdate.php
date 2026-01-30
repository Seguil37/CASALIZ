<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcedureSubphaseUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'procedure_subphase_id',
        'user_id',
        'status',
        'progress',
        'comment',
        'attachments',
    ];

    protected $casts = [
        'attachments' => 'array',
    ];

    public function subphase()
    {
        return $this->belongsTo(ProcedureSubphase::class, 'procedure_subphase_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
