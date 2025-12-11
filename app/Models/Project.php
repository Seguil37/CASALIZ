<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'type',
        'city',
        'state',
        'country',
        'is_featured',
        'hero_image',
        'status',
        'published_at',
        'summary',
        'description',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title) . '-' . Str::random(4);
            }
        });
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class);
    }

    public function featuredImages()
    {
        return $this->images()->orderBy('position');
    }

    public function reviews()
    {
        return $this->hasMany(ProjectReview::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
