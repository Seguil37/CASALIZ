<?php

namespace App\Policies;

use App\Models\ProjectReview;
use App\Models\User;

class ProjectReviewPolicy
{
    public function create(User $user): bool
    {
        return $user->isClient();
    }

    public function delete(User $user, ProjectReview $review): bool
    {
        return $user->isAdmin() || $user->id === $review->user_id;
    }
}
