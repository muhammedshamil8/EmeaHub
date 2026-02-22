<?php
// app/Http/Controllers/DepartmentController.php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    // Get all active departments (public)
    public function index()
    {
        $departments = Department::where('is_active', true)
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'departments' => $departments
        ]);
    }

    // Get department with its subjects (for registration)
    public function getWithSubjects($id)
    {
        $department = Department::with(['subjects' => function($q) {
            $q->where('is_active', true)
              ->orderBy('semester')
              ->orderBy('name');
        }])->findOrFail($id);

        return response()->json([
            'success' => true,
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'subjects' => $department->subjects
            ]
        ]);
    }
}