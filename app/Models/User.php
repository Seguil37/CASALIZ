<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'avatar',
        'bio', 'country', 'city', 'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

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
        return $this->hasMany(Review::class);
    }

    public function isMasterAdmin(): bool
    {
        return $this->role === 'master_admin';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'master_admin']);
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }
}
