<?php
// routes/api.php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GamificationController;
use App\Http\Controllers\AIController;
use Illuminate\Support\Facades\Route;

// ============= PUBLIC ROUTES (No Auth Required) =============
Route::prefix('v1')->group(function () {
    
    // Test route
    Route::get('/test', function() {
        return response()->json(['message' => 'API is working']);
    });
    
    // Authentication routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register/teacher', [AuthController::class, 'registerTeacher']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Public data routes
    Route::get('/timetable', [TimetableController::class, 'show']);

    // Departments routes
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/departments/{id}/subjects', [DepartmentController::class, 'getWithSubjects']);

    // Subject routes
    Route::get('/subjects/by-department', [SubjectController::class, 'getByDepartment']);
    Route::get('/subjects/{subjectId}/modules', [SubjectController::class, 'getModules']);

    // Resource routes (public)
    Route::get('/resources', [ResourceController::class, 'publicIndex']);
    Route::get('/resources/{id}', [ResourceController::class, 'publicShow']);
    Route::get('/resources/{id}/download', [ResourceController::class, 'download']);
    
    // ===== PUBLIC LEADERBOARD ROUTES =====
    Route::get('/leaderboard', [GamificationController::class, 'leaderboard']);
    Route::get('/leaderboard/top-uploaders', [GamificationController::class, 'topUploaders']);
    Route::get('/leaderboard/top-verified', [GamificationController::class, 'topVerified']);
    Route::get('/achievements', [GamificationController::class, 'achievements']);
});

// ============= AUTHENTICATED ROUTES (Token Required) =============
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    
    // Test role middleware
    Route::get('/test-role', function() {
        return response()->json(['message' => 'Role middleware working']);
    })->middleware('role:teacher,admin');

    // User routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Resource routes (authenticated)
    Route::post('/resources/upload', [ResourceController::class, 'upload']);
    Route::get('/resources/my-uploads', [ResourceController::class, 'myUploads']);
    Route::delete('/resources/{id}', [ResourceController::class, 'delete']);
    Route::post('/resources/{id}/rate', [ResourceController::class, 'rate']);
    
    // ===== USER STATS & GAMIFICATION (Any authenticated user) =====
    Route::prefix('user')->group(function () {
        Route::get('/stats', [GamificationController::class, 'myStats']);
        Route::get('/achievements', [GamificationController::class, 'myAchievements']);
        Route::get('/activity', [GamificationController::class, 'myActivity']);
        Route::get('/rank', [GamificationController::class, 'myRank']);
    });
    
    // ===== STUDENT ROUTES =====
    Route::prefix('student')->middleware('role:student')->group(function () {
        Route::get('/dashboard', [GamificationController::class, 'studentDashboard']);
        Route::get('/recommendations', [ResourceController::class, 'recommendations']);
        Route::get('/download-history', [ResourceController::class, 'downloadHistory']);
    });
    
    // ===== TEACHER ROUTES =====
    Route::prefix('teacher')->middleware('role:teacher')->group(function () {
        // Teacher dashboard
        Route::get('/dashboard', [ResourceController::class, 'teacherDashboard']);
        
        // Verification routes
        Route::get('/pending', [ResourceController::class, 'pendingVerifications']);
        Route::post('/verify/{id}', [ResourceController::class, 'verify']);
        
        // Timetable routes
        Route::post('/timetable', [TimetableController::class, 'store']);
        Route::delete('/timetable/{id}', [TimetableController::class, 'destroy']);
        Route::get('/timetable/my-classes', [TimetableController::class, 'myClasses']);
        
        // Teacher stats
        Route::get('/stats', [GamificationController::class, 'teacherStats']);
        Route::get('/contributions', [GamificationController::class, 'teacherContributions']);
    });
    
    // ===== ADMIN ROUTES =====
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        // Admin dashboard
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
        // Teacher management
        Route::get('/teachers', [AdminController::class, 'getTeachers']);
        Route::post('/verify-teacher/{id}', [AdminController::class, 'verifyTeacher']);
        Route::delete('/teacher/{id}', [AdminController::class, 'deleteTeacher']);
        
        // Resource management
        Route::get('/resources', [AdminController::class, 'getResources']);
        Route::post('/resource/{id}/visibility', [AdminController::class, 'toggleVisibility']);
        Route::delete('/resource/{id}', [AdminController::class, 'deleteResource']);
        
        // Department management
        Route::get('/departments/stats', [AdminController::class, 'getDepartmentsWithStats']);
        Route::post('/departments', [AdminController::class, 'createDepartment']);
        Route::put('/departments/{id}', [AdminController::class, 'updateDepartment']);
        
        // System stats
        Route::get('/system/stats', [AdminController::class, 'systemStats']);
        Route::get('/reports', [AdminController::class, 'generateReports']);
        
        // Admin gamification overview
        Route::get('/leaderboard/admin-view', [GamificationController::class, 'adminLeaderboard']);
        Route::post('/achievements/create', [GamificationController::class, 'createAchievement']);
        Route::put('/achievements/{id}', [GamificationController::class, 'updateAchievement']);
    });
});

// ============= AI ASSISTANT ROUTES =============
Route::prefix('v1/ai')->group(function () {
    // Public AI search (no login needed)
    Route::post('/search', [AIController::class, 'smartSearch']);
    Route::get('/trending-topics', [AIController::class, 'trendingTopics']);
    
    // Authenticated AI features
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/chat', [AIController::class, 'chat']);
        Route::post('/study-plan', [AIController::class, 'studyPlan']);
        Route::post('/summarize', [AIController::class, 'summarize']);
        Route::post('/recommend', [AIController::class, 'recommendResources']);
        Route::get('/chat-history', [AIController::class, 'chatHistory']);
    });
});

// ============= ADDITIONAL UTILITY ROUTES =============
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Notifications
    Route::get('/notifications', function() {
        return response()->json(['message' => 'Notifications endpoint']);
    });
    
    // Search (combined)
    Route::get('/search/all', [ResourceController::class, 'globalSearch']);
    
    // Reports
    Route::post('/report/resource/{id}', [ResourceController::class, 'reportResource']);
});