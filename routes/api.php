<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SystemSettingsController;
use App\Http\Controllers\Api\UserController;

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
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/settings/public', [SystemSettingsController::class, 'public']);

    // Rutas protegidas
    Route::middleware('auth:sanctum')->group(function () {
        Route::middleware('can:create,App\Models\Project')->group(function () {
            Route::post('/projects', [ProjectController::class, 'store']);
        });

        Route::middleware('can:update,project')->group(function () {
            Route::put('/projects/{project}', [ProjectController::class, 'update']);
        });

        Route::middleware('can:delete,project')->group(function () {
            Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
        });

        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        Route::prefix('users')->middleware('can:manage-users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::put('/{user}', [UserController::class, 'update']);
        });

        Route::prefix('favorites')->middleware('can:manage-favorites')->group(function () {
            Route::get('/', [FavoriteController::class, 'index']);
            Route::post('/', [FavoriteController::class, 'store']);
            Route::delete('/{project}', [FavoriteController::class, 'destroy']);
        });
    });
});
