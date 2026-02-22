<?php
// app/Http/Controllers/SubjectController.php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Module;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Get subjects by department and semester
     */
    public function getByDepartment(Request $request)
    {
        $request->validate([
            'department_id' => 'required|exists:departments,id',
            'semester' => 'required|integer|min:1|max:8'
        ]);

        $subjects = Subject::where('department_id', $request->department_id)
            ->where('semester', $request->semester)
            ->where('is_active', true)
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'subjects' => $subjects
        ]);
    }

    /**
     * Get modules for a subject
     */
    public function getModules($subjectId)
    {
        $modules = Module::where('subject_id', $subjectId)
            ->orderBy('module_number')
            ->select('id', 'name', 'module_number')
            ->get();

        return response()->json([
            'success' => true,
            'modules' => $modules
        ]);
    }
}