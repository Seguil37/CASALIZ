<?php

namespace App\Providers;

use App\Models\Project;
use App\Models\ProjectReview;
use App\Policies\ProjectPolicy;
use App\Policies\ProjectReviewPolicy;
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
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('manage-system', fn($user) => $user->isAdmin());
        Gate::define('manage-users', fn($user) => $user->isAdmin());
        Gate::define('manage-settings', fn($user) => $user->isAdmin());
    }
}
