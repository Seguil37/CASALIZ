<?php

namespace App\Policies;

use App\Models\ProcedureTemplate;
use App\Models\User;

class ProcedureTemplatePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, ProcedureTemplate $template): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isMasterAdmin();
    }

    public function update(User $user, ProcedureTemplate $template): bool
    {
        return $user->isMasterAdmin();
    }

    public function delete(User $user, ProcedureTemplate $template): bool
    {
        return $user->isMasterAdmin();
    }
}
