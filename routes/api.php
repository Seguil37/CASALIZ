<?php

use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);

    Route::get('/services', [ServiceController::class, 'index']);

    Route::post('/contact', [ContactMessageController::class, 'store']);
});
