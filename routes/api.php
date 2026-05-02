<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SystemSettingsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ModulePermissionController;
use App\Http\Controllers\Api\TramiteTypeController;
use App\Http\Controllers\Api\TramiteController;
use App\Http\Controllers\Api\TramiteTaskController;
use App\Http\Controllers\Api\TramiteDashboardController;

Route::prefix('v1')->group(function () {
    // Autenticación
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
        });
    });

    // Rutas públicas
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/featured', [ProjectController::class, 'featured']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service:slug}', [ServiceController::class, 'show']);
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/settings/public', [SystemSettingsController::class, 'public']);
    Route::get('/public/tramites/{code}', [TramiteController::class, 'publicShow']);

    // Rutas protegidas
    Route::middleware('auth:sanctum')->group(function () {
        Route::middleware(['module:projects', 'can:create,App\\Models\\Project'])->group(function () {
            Route::post('/projects', [ProjectController::class, 'store']);
        });

        Route::middleware(['module:services', 'can:create,App\\Models\\Service'])->group(function () {
            Route::post('/services', [ServiceController::class, 'store']);
        });

        Route::middleware(['module:projects', 'can:update,project'])->group(function () {
            Route::put('/projects/{project}', [ProjectController::class, 'update']);
        });

        Route::middleware(['module:services', 'can:update,service'])->group(function () {
            Route::put('/services/{service}', [ServiceController::class, 'update']);
        });

        Route::middleware(['module:projects', 'can:delete,project'])->group(function () {
            Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
        });

        Route::middleware(['module:services', 'can:delete,service'])->group(function () {
            Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
        });

        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        Route::middleware(['module:admin_users,tramites_manage,tasks_summary', 'can:viewAny,App\\Models\\User'])->group(function () {
            Route::get('/users', [UserController::class, 'index']);
        });

        Route::middleware(['module:tramites_manage', 'can:viewAny,App\\Models\\User'])->group(function () {
            Route::get('/clients', [UserController::class, 'clients']);
        });

        Route::middleware(['module:admin_users', 'can:create,App\\Models\\User'])->group(function () {
            Route::post('/users', [UserController::class, 'store']);
        });

        Route::middleware(['module:admin_users', 'can:update,user'])->group(function () {
            Route::put('/users/{user}', [UserController::class, 'update']);
        });

        Route::middleware(['module:admin_users', 'can:delete,user'])->group(function () {
            Route::delete('/users/{user}', [UserController::class, 'destroy']);
        });

        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::post('/favorites', [FavoriteController::class, 'store']);
        Route::delete('/favorites/{project}', [FavoriteController::class, 'destroy']);
        Route::get('/client/tramites', [TramiteController::class, 'clientIndex']);
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/preferences', [NotificationController::class, 'preferences']);
        Route::put('/notifications/preferences', [NotificationController::class, 'updatePreferences']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::post('/notifications/{notificationId}/read', [NotificationController::class, 'markAsRead']);

        Route::get('/module-permissions', [ModulePermissionController::class, 'index']);
        Route::put('/module-permissions', [ModulePermissionController::class, 'update']);
        Route::put('/module-permissions/users/{user}', [ModulePermissionController::class, 'updateUser']);

        // Trámites - solo módulos autorizados por Master
        Route::middleware('module:tramite_types,tramites_manage')->group(function () {
            Route::get('/tramite-types', [TramiteTypeController::class, 'index']);
            Route::get('/tramite-types/{tramiteType}', [TramiteTypeController::class, 'show']);
        });

        Route::middleware('module:tramite_types')->group(function () {
            Route::post('/tramite-types', [TramiteTypeController::class, 'store']);
            Route::put('/tramite-types/{tramiteType}', [TramiteTypeController::class, 'update']);
            Route::delete('/tramite-types/{tramiteType}', [TramiteTypeController::class, 'destroy']);
        });

        Route::middleware('module:tramites_manage')->group(function () {
            Route::get('/tramites', [TramiteController::class, 'index']);
            Route::post('/tramites', [TramiteController::class, 'store']);
            Route::put('/tramites/{tramite}', [TramiteController::class, 'update']);
            Route::delete('/tramites/{tramite}', [TramiteController::class, 'destroy']);
        });

        Route::middleware('module:tramites_control')->group(function () {
            Route::get('/tramites/{tramite}', [TramiteController::class, 'show']);
            Route::put('/tramites/{tramite}/phases/{phaseInstance}', [TramiteController::class, 'updatePhaseStatus']);
            Route::put('/tramites/{tramite}/subphases/{subphaseInstance}', [TramiteController::class, 'updateSubphaseStatus']);
            Route::put('/tramites/{tramite}/notes', [TramiteController::class, 'updateNotes']);
            Route::get('/tramites-dashboard/overview', [TramiteDashboardController::class, 'overview']);
        });

        Route::middleware('module:tasks_summary')->group(function () {
            Route::get('/tramites/{tramite}/tasks', [TramiteTaskController::class, 'index']);
            Route::post('/tramites/{tramite}/tasks', [TramiteTaskController::class, 'store']);
            Route::put('/tramites/{tramite}/tasks/{task}', [TramiteTaskController::class, 'update']);
            Route::delete('/tramites/{tramite}/tasks/{task}', [TramiteTaskController::class, 'destroy']);
            Route::get('/tramites-dashboard/assigned-tasks', [TramiteDashboardController::class, 'assignedTasks']);
        });
    });
});
