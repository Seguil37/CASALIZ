<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'short_description',
        'description',
        'status',
        'featured',
        'cover_image',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'featured' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Service $service) {
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->title) . '-' . Str::random(4);
            }
        });
    }

    public function images()
    {
        return $this->hasMany(ServiceImage::class);
    }

    public function gallery()
    {
        return $this->images()->orderBy('position');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
