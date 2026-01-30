<?php

namespace App\Policies;

use App\Models\Procedure;
use App\Models\User;

class ProcedurePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Procedure $procedure): bool
    {
        if ($user->isMasterAdmin()) {
            return true;
        }

        return $user->isAdmin() && ($procedure->general_responsible_id === $user->id || $procedure->created_by === $user->id);
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Procedure $procedure): bool
    {
        if ($user->isMasterAdmin()) {
            return true;
        }

        return $user->isAdmin() && ($procedure->general_responsible_id === $user->id || $procedure->created_by === $user->id);
    }

    public function delete(User $user, Procedure $procedure): bool
    {
        return $user->isMasterAdmin();
    }
}
