<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\Owner\PropertyController as OwnerPropertyController;
use App\Http\Controllers\Api\Owner\KycController as OwnerKycController;
use App\Http\Controllers\Api\Admin\VerificationController;
use App\Http\Controllers\Api\Admin\UpdateLogController;
use App\Http\Controllers\Api\Admin\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::get('/facilities', [FacilityController::class, 'index']);

Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::post('/properties/{id}/click', [PropertyController::class, 'recordClick']);
Route::post('/properties/{id}/report', [PropertyController::class, 'report'])->middleware('throttle:3,1');

// Public Changelog
Route::get('/changelog', [UpdateLogController::class, 'publicIndex']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Bookmarks
    Route::get('/bookmarks', [BookmarkController::class, 'index']);
    Route::post('/bookmarks/{propertyId}/toggle', [BookmarkController::class, 'toggle']);
    Route::get('/bookmarks/{propertyId}/status', [BookmarkController::class, 'status']);
    // Owner Routes
    Route::prefix('owner')->group(function () {
        Route::post('/kyc', [OwnerKycController::class, 'submit'])->middleware('throttle:5,1');
        Route::get('/kyc/status', [OwnerKycController::class, 'status']);
        
        Route::apiResource('properties', OwnerPropertyController::class);
        Route::get('/stats', [OwnerPropertyController::class, 'stats']);
    });

    // Admin Routes
    Route::prefix('admin')->group(function () {
        // Dashboard Stats
        Route::get('/stats', [AdminController::class, 'stats']);

        // User Management
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

        Route::get('/verifications/kyc', [VerificationController::class, 'listKyc']);
        Route::post('/verifications/kyc/{id}', [VerificationController::class, 'verifyKyc']);

        Route::get('/verifications/properties', [VerificationController::class, 'listProperties']);
        Route::post('/verifications/properties/{id}', [VerificationController::class, 'verifyProperty']);

        // Update Logs CRUD
        Route::get('/update-logs', [UpdateLogController::class, 'index']);
        Route::post('/update-logs', [UpdateLogController::class, 'store']);
        Route::put('/update-logs/{id}', [UpdateLogController::class, 'update']);
        Route::delete('/update-logs/{id}', [UpdateLogController::class, 'destroy']);
    });
});
