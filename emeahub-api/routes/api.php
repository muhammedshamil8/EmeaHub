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
    
Route::prefix('v1')->group(function () {
    
    Route::get('/test', function() {
        return response()->json(['message' => 'API is working']);
    });
    
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register/teacher', [AuthController::class, 'registerTeacher']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/timetable', [TimetableController::class, 'show']);
    Route::get('/analytics', [AdminController::class, 'analytics']);
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/departments/{id}/subjects', [DepartmentController::class, 'getWithSubjects']);
    Route::get('/subjects/by-department', [SubjectController::class, 'getByDepartment']);
    Route::get('/subjects/{subjectId}/modules', [SubjectController::class, 'getModules']);
    Route::post('/subjects/add', [SubjectController::class, 'store']);
    Route::get('/resources', [ResourceController::class, 'publicIndex']);
    Route::get('/resources/{id}', [ResourceController::class, 'publicShow'])->where('id', '[0-9]+');
    Route::get('/resources/{id}/download', [ResourceController::class, 'download'])->where('id', '[0-9]+');
    Route::get('/leaderboard', [GamificationController::class, 'leaderboard']);
    Route::get('/leaderboard/top-uploaders', [GamificationController::class, 'topUploaders']);
    Route::get('/leaderboard/top-verified', [GamificationController::class, 'topVerified']);
    Route::get('/achievements', [GamificationController::class, 'achievements']);
    Route::get('/users/{id}', [GamificationController::class, 'publicProfile'])->where('id', '[0-9]+');
});

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    
    Route::get('/test-role', function() {
        return response()->json(['message' => 'Role middleware working']);
    })->middleware('role:teacher,admin');

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/resources/upload', [ResourceController::class, 'upload']);
    Route::get('/resources/my-uploads', [ResourceController::class, 'myUploads']);
    Route::delete('/resources/{id}', [ResourceController::class, 'delete']);
    Route::post('/resources/{id}/rate', [ResourceController::class, 'rate']);
    Route::get('/search/all', [ResourceController::class, 'globalSearch']);
    Route::get('/user/bookmarks', [ResourceController::class, 'getUserBookmarks']);
    Route::post('/resources/{id}/bookmark', [ResourceController::class, 'toggleBookmark']);
    
    Route::prefix('user')->group(function () {
        Route::get('/stats', [GamificationController::class, 'myStats']);
        Route::get('/achievements', [GamificationController::class, 'myAchievements']);
        Route::get('/activity', [GamificationController::class, 'myActivity']);
        Route::get('/rank', [GamificationController::class, 'myRank']);
    });
    
    Route::prefix('student')->middleware('role:student')->group(function () {
        Route::get('/dashboard', [GamificationController::class, 'studentDashboard']);
        Route::get('/recommendations', [ResourceController::class, 'recommendations']);
        Route::get('/download-history', [ResourceController::class, 'downloadHistory']);
    });
    
    Route::prefix('teacher')->middleware('role:teacher')->group(function () {
        Route::get('/dashboard', [ResourceController::class, 'teacherDashboard']);
        Route::get('/pending', [ResourceController::class, 'pendingVerifications']);
        Route::post('/verify/{id}', [ResourceController::class, 'verify']);
        Route::post('/timetable', [TimetableController::class, 'store']);
        Route::delete('/timetable/{id}', [TimetableController::class, 'destroy']);
        Route::get('/timetable/my-classes', [TimetableController::class, 'myClasses']);
        Route::get('/stats', [GamificationController::class, 'teacherStats']);
        Route::get('/contributions', [GamificationController::class, 'teacherContributions']);
    });
    
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/teachers', [AdminController::class, 'getTeachers']);
        Route::post('/verify-teacher/{id}', [AdminController::class, 'verifyTeacher']);
        Route::delete('/teacher/{id}', [AdminController::class, 'deleteTeacher']);
        Route::get('/resources', [AdminController::class, 'getResources']);
        Route::post('/resource/{id}/visibility', [AdminController::class, 'toggleVisibility']);
        Route::delete('/resource/{id}', [AdminController::class, 'deleteResource']);
        Route::get('/departments/stats', [AdminController::class, 'getDepartmentsWithStats']);
        Route::post('/departments', [AdminController::class, 'createDepartment']);
        Route::put('/departments/{id}', [AdminController::class, 'updateDepartment']);
        Route::delete('/departments/{id}', [AdminController::class, 'deleteDepartment']); 
        Route::get('/subjects', [SubjectController::class, 'index']);
        Route::post('/subjects', [SubjectController::class, 'store']);
        Route::put('/subjects/{id}', [SubjectController::class, 'update']);
        Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);
        Route::get('/system/stats', [AdminController::class, 'systemStats']);
        Route::get('/reports', [AdminController::class, 'generateReports']);
        Route::get('/leaderboard/admin-view', [GamificationController::class, 'adminLeaderboard']);
        Route::post('/achievements/create', [GamificationController::class, 'createAchievement']);
        Route::put('/achievements/{id}', [GamificationController::class, 'updateAchievement']);
    });

    Route::prefix('ai')->group(function () {
        Route::post('/search', [AIController::class, 'smartSearch']);
        Route::get('/trending-topics', [AIController::class, 'trendingTopics']);
        Route::post('/chat', [AIController::class, 'chat']);
        Route::post('/study-plan', [AIController::class, 'studyPlan']);
        Route::post('/summarize', [AIController::class, 'summarize']);
        Route::post('/recommend', [AIController::class, 'recommendResources']);
        Route::get('/chat-history', [AIController::class, 'chatHistory']);
    });
});
