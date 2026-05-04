<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;
use App\Support\ModuleAccess;

class ServicePolicy
{
    public function create(User $user): bool
    {
        return ModuleAccess::can($user, ModuleAccess::SERVICES);
    }

    public function update(User $user, Service $service): bool
    {
        return ModuleAccess::can($user, ModuleAccess::SERVICES);
    }

    public function delete(User $user, Service $service): bool
    {
        return ModuleAccess::can($user, ModuleAccess::SERVICES);
    }
}
