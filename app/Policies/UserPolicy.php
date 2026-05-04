<?php

namespace App\Policies;

use App\Models\User;
use App\Support\ModuleAccess;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        // Permite a admin, master y operadores ver el listado (para asignaciones)
        return $user->isAdmin() || $user->isOperator();
    }

    public function view(User $user, User $model): bool
    {
        return $user->isMasterAdmin() || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return ModuleAccess::can($user, ModuleAccess::ADMIN_USERS);
    }

    public function update(User $user, User $model): bool
    {
        if ($user->isMasterAdmin()) {
            return true;
        }

        return ModuleAccess::can($user, ModuleAccess::ADMIN_USERS) && !$model->isMasterAdmin();
    }

    public function delete(User $user, User $model): bool
    {
        if (!ModuleAccess::can($user, ModuleAccess::ADMIN_USERS)) {
            return false;
        }

        return $user->id !== $model->id && ($user->isMasterAdmin() || !$model->isMasterAdmin());
    }
}
