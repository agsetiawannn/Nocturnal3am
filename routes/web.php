<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;

// React SPA - All frontend routes
Route::get('/', function () {
    return view('app');
});

Route::get('/work', function () {
    return view('app');
})->name('work');

Route::get('/work/{slug}', function () {
    return view('app');
})->where('slug', '.*')->name('work.detail');

Route::get('/team', function () {
    return view('app');
})->name('team');

Route::get('/clients', function () {
    return view('app');
})->name('client');

Route::get('/landing', function () {
    return view('app');
})->name('landing');

use App\Http\Controllers\TrackingController;

// Tracking System API Routes (Stateful/Session-based)
Route::prefix('api/tracking')->group(function () {
    Route::post('/client/login', [TrackingController::class, 'clientLogin']);
    Route::post('/admin/login', [TrackingController::class, 'adminLogin']);
    Route::get('/auth/check', [TrackingController::class, 'checkAuth']);
    Route::post('/logout', [TrackingController::class, 'logout']);
    
    Route::get('/client/dashboard', [TrackingController::class, 'getClientDashboard']);
    
    Route::get('/admin/dashboard', [TrackingController::class, 'getAdminDashboard']);
    Route::post('/admin/client', [TrackingController::class, 'addClient']);
    Route::delete('/admin/client/{id}', [TrackingController::class, 'deleteClient']);
    Route::get('/admin/client/{id}', [TrackingController::class, 'getClientDetails']);
    Route::post('/admin/client/{id}/progress', [TrackingController::class, 'saveProgress']);
    Route::post('/client/{id}/note', [TrackingController::class, 'addNote']);
    
    // Admin Accounts Management
    Route::get('/admin/accounts', [TrackingController::class, 'getAdmins']);
    Route::post('/admin/account', [TrackingController::class, 'addAdmin']);
    Route::put('/admin/account/{id}/password', [TrackingController::class, 'updateAdminPassword']);
    Route::delete('/admin/account/{id}', [TrackingController::class, 'deleteAdmin']);
    
    // Landing Page Settings
    Route::get('/admin/landing-settings', [TrackingController::class, 'getLandingSettings']);
    Route::post('/admin/landing-settings', [TrackingController::class, 'saveLandingSettings']);
    Route::get('/public/landing-settings', [TrackingController::class, 'getPublicLandingSettings']);
});

// React SPA - Tracking System Routes
Route::get('/tracking/login', function () { return view('app'); });
Route::get('/tracking/dashboard', function () { return view('app'); });
Route::get('/tracking/admin/login', function () { return view('app'); });
Route::get('/tracking/admin/dashboard', function () { return view('app'); });
Route::get('/tracking/admin/client/{id}', function () { return view('app'); });
Route::get('/tracking/admin/settings', function () { return view('app'); });

// API Routes for React
Route::post('/api/contact', [ContactController::class, 'store'])->name('contact.store');

// Admin Contact Management Routes
Route::get('/admin/contacts', [ContactController::class, 'index'])->name('admin.contacts');
Route::delete('/admin/contacts/{id}', [ContactController::class, 'destroy'])->name('admin.contacts.destroy');
