<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
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
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service:slug}', [ServiceController::class, 'show']);
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/settings/public', [SystemSettingsController::class, 'public']);

    // Rutas protegidas
    Route::middleware('auth:sanctum')->group(function () {
        Route::middleware('can:create,App\\Models\\Project')->group(function () {
            Route::post('/projects', [ProjectController::class, 'store']);
        });

        Route::middleware('can:create,App\\Models\\Service')->group(function () {
            Route::post('/services', [ServiceController::class, 'store']);
        });

        Route::middleware('can:update,project')->group(function () {
            Route::put('/projects/{project}', [ProjectController::class, 'update']);
        });

        Route::middleware('can:update,service')->group(function () {
            Route::put('/services/{service}', [ServiceController::class, 'update']);
        });

        Route::middleware('can:delete,project')->group(function () {
            Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
        });

        Route::middleware('can:delete,service')->group(function () {
            Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
        });

        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        Route::middleware('can:viewAny,App\\Models\\User')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
        });

        Route::middleware('can:create,App\\Models\\User')->group(function () {
            Route::post('/users', [UserController::class, 'store']);
        });

        Route::middleware('can:update,user')->group(function () {
            Route::put('/users/{user}', [UserController::class, 'update']);
        });

        Route::middleware('can:delete,user')->group(function () {
            Route::delete('/users/{user}', [UserController::class, 'destroy']);
        });

        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::post('/favorites', [FavoriteController::class, 'store']);
        Route::delete('/favorites/{project}', [FavoriteController::class, 'destroy']);
    });
});
