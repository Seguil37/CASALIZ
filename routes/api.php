<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SystemSettingsController;

/*
|--------------------------------------------------------------------------
| API Routes - CASALIZ
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ===== AUTENTICACIÓN =====
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
        });
    });

    // ===== RUTAS PÚBLICAS =====
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);

    Route::post('/contact', [ContactController::class, 'store']);

    // Configuraciones públicas del sistema
    Route::get('/settings/public', [SystemSettingsController::class, 'public']);
});
