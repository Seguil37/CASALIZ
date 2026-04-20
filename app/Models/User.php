<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Support\ModuleAccess;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'bio',
        'country',
        'state',
        'city',
        'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $appends = ['module_permissions'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    public function reviews()
    {
        return $this->hasMany(ProjectReview::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function favoriteProjects()
    {
        return $this->belongsToMany(Project::class, 'favorites');
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    public function isOperator(): bool
    {
        return $this->role === 'operator';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin' || $this->role === 'master_admin';
    }

    public function isMasterAdmin(): bool
    {
        return $this->role === 'master_admin';
    }

    public function getModulePermissionsAttribute(): array
    {
        return ModuleAccess::forUser($this);
    }

    public function canAccessModule(string $module): bool
    {
        return ModuleAccess::can($this, $module);
    }
}
