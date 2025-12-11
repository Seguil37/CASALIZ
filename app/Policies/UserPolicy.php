<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isMasterAdmin();
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
}
