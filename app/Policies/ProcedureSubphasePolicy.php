<?php

namespace App\Policies;

use App\Models\ProcedureSubphase;
use App\Models\User;

class ProcedureSubphasePolicy
{
    public function update(User $user, ProcedureSubphase $subphase): bool
    {
        if ($user->isMasterAdmin()) {
            return true;
        }

        $procedure = $subphase->phase->procedure;

        if ($procedure->general_responsible_id === $user->id) {
            return true;
        }

        return $subphase->assigned_to_id === $user->id;
    }
}
