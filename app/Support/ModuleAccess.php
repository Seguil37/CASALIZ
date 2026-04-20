<?php

namespace App\Support;

use App\Models\ModulePermission;
use App\Models\User;
use App\Models\UserModulePermission;
use Illuminate\Support\Facades\Schema;

class ModuleAccess
{
    public const PROJECTS = 'projects';
    public const SERVICES = 'services';
    public const TRAMITES_MANAGE = 'tramites_manage';
    public const TRAMITE_TYPES = 'tramite_types';
    public const TRAMITES_CONTROL = 'tramites_control';
    public const TASKS_SUMMARY = 'tasks_summary';
    public const ADMIN_USERS = 'admin_users';

    public static function modules(): array
    {
        return [
            self::PROJECTS => [
                'label' => 'Gestion de proyectos publicados',
                'group' => 'announcements',
            ],
            self::SERVICES => [
                'label' => 'Gestion de servicios',
                'group' => 'announcements',
            ],
            self::TRAMITES_MANAGE => [
                'label' => 'Gestion de tramites',
                'group' => 'operations',
            ],
            self::TRAMITE_TYPES => [
                'label' => 'Tipos de tramite',
                'group' => 'operations',
            ],
            self::TRAMITES_CONTROL => [
                'label' => 'Vista general tramites',
                'group' => 'operations',
            ],
            self::TASKS_SUMMARY => [
                'label' => 'Resumen de tareas',
                'group' => 'operations',
            ],
            self::ADMIN_USERS => [
                'label' => 'Gestion de administradores',
                'group' => 'operations',
            ],
        ];
    }

    public static function defaults(): array
    {
        return [
            'master_admin' => array_fill_keys(array_keys(self::modules()), true),
            'admin' => [
                self::PROJECTS => true,
                self::SERVICES => true,
                self::TRAMITES_MANAGE => true,
                self::TRAMITE_TYPES => false,
                self::TRAMITES_CONTROL => true,
                self::TASKS_SUMMARY => true,
                self::ADMIN_USERS => false,
            ],
            'operator' => [
                self::PROJECTS => false,
                self::SERVICES => false,
                self::TRAMITES_MANAGE => false,
                self::TRAMITE_TYPES => false,
                self::TRAMITES_CONTROL => true,
                self::TASKS_SUMMARY => true,
                self::ADMIN_USERS => false,
            ],
            'client' => array_fill_keys(array_keys(self::modules()), false),
        ];
    }

    public static function forRole(string $role): array
    {
        $defaults = self::defaults()[$role] ?? array_fill_keys(array_keys(self::modules()), false);

        if ($role === 'master_admin') {
            return $defaults;
        }

        if (!Schema::hasTable('module_permissions')) {
            return $defaults;
        }

        $stored = ModulePermission::query()
            ->where('role', $role)
            ->pluck('enabled', 'module_key')
            ->map(fn ($value) => (bool) $value)
            ->toArray();

        return array_replace($defaults, array_intersect_key($stored, self::modules()));
    }

    public static function forUser(?User $user): array
    {
        if (!$user || !$user->is_active) {
            return array_fill_keys(array_keys(self::modules()), false);
        }

        if ($user->isMasterAdmin()) {
            return self::forRole($user->role);
        }

        $defaults = self::forRole($user->role);

        if (!Schema::hasTable('user_module_permissions')) {
            return $defaults;
        }

        $stored = UserModulePermission::query()
            ->where('user_id', $user->id)
            ->pluck('enabled', 'module_key')
            ->map(fn ($value) => (bool) $value)
            ->toArray();

        if (!$stored) {
            return $defaults;
        }

        return array_replace($defaults, array_intersect_key($stored, self::modules()));
    }

    public static function can(?User $user, string $module): bool
    {
        if (!$user || !$user->is_active) {
            return false;
        }

        if ($user->isMasterAdmin()) {
            return true;
        }

        return (bool) (self::forUser($user)[$module] ?? false);
    }

    public static function syncRole(string $role, array $permissions): array
    {
        if ($role === 'master_admin') {
            return self::forRole($role);
        }

        $modules = array_keys(self::modules());

        foreach ($modules as $module) {
            ModulePermission::updateOrCreate(
                ['role' => $role, 'module_key' => $module],
                ['enabled' => (bool) ($permissions[$module] ?? false)]
            );
        }

        return self::forRole($role);
    }

    public static function syncUser(User $user, array $permissions): array
    {
        if ($user->isMasterAdmin()) {
            return self::forUser($user);
        }

        if (!Schema::hasTable('user_module_permissions')) {
            return self::forUser($user);
        }

        $base = self::forRole($user->role);
        $modules = array_keys(self::modules());

        foreach ($modules as $module) {
            UserModulePermission::updateOrCreate(
                ['user_id' => $user->id, 'module_key' => $module],
                ['enabled' => (bool) ($permissions[$module] ?? $base[$module] ?? false)]
            );
        }

        return self::forUser($user->fresh());
    }

    public static function syncUserDefaults(User $user): array
    {
        if (!Schema::hasTable('user_module_permissions')) {
            return self::forUser($user);
        }

        UserModulePermission::query()
            ->where('user_id', $user->id)
            ->delete();

        if ($user->isMasterAdmin()) {
            return self::forUser($user);
        }

        return self::syncUser($user, self::forRole($user->role));
    }
}
