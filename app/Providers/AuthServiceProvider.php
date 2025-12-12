<?php

namespace App\Providers;

use App\Models\Favorite;
use App\Models\Project;
use App\Models\ProjectReview;
use App\Models\Service;
use App\Models\User;
use App\Policies\FavoritePolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ProjectReviewPolicy;
use App\Policies\ServicePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Project::class => ProjectPolicy::class,
        ProjectReview::class => ProjectReviewPolicy::class,
        Favorite::class => FavoritePolicy::class,
        Service::class => ServicePolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('manage-system', fn($user) => $user->isAdmin());
        Gate::define('manage-users', fn($user) => $user->isMasterAdmin());
        Gate::define('manage-settings', fn($user) => $user->isAdmin());
    }
}
