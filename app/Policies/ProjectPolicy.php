<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Support\ModuleAccess;

class ProjectPolicy
{
    public function create(User $user): bool
    {
        return ModuleAccess::can($user, ModuleAccess::PROJECTS);
    }

    public function update(User $user, Project $project): bool
    {
        return ModuleAccess::can($user, ModuleAccess::PROJECTS);
    }

    public function delete(User $user, Project $project): bool
    {
        return ModuleAccess::can($user, ModuleAccess::PROJECTS);
    }
}
