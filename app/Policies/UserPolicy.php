<?php

namespace App\Policies;

use App\Models\User;

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
        return $user->isMasterAdmin();
    }

    public function update(User $user, User $model): bool
    {
        if ($user->isMasterAdmin()) {
            return true;
        }

        return $user->isAdmin() && $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        if (!$user->isMasterAdmin()) {
            return false;
        }

        return $user->id !== $model->id;
    }
}
