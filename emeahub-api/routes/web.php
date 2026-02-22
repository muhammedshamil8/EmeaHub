<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-controllers', function() {
    $controllers = [
        'AuthController' => class_exists('App\Http\Controllers\AuthController'),
        'DepartmentController' => class_exists('App\Http\Controllers\DepartmentController'),
        'SubjectController' => class_exists('App\Http\Controllers\SubjectController'),
        'ResourceController' => class_exists('App\Http\Controllers\ResourceController'),
    ];
    
    return response()->json($controllers);
});
