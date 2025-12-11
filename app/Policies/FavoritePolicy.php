<?php

namespace App\Policies;

use App\Models\Favorite;
use App\Models\User;

class FavoritePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isClient();
    }

    public function create(User $user): bool
    {
        return $user->isClient();
    }

    public function delete(User $user, Favorite $favorite): bool
    {
        return $user->isClient() && $favorite->user_id === $user->id;
    }
}
