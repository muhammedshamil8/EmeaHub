<?php
// app/Http/Controllers/TimetableController.php

namespace App\Http\Controllers;

use App\Models\Timetable;
use App\Models\Department;
use App\Models\Subject;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    /**
     * Upload timetable (teacher only)
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'department_id' => 'required|exists:departments,id',
                'semester' => 'required|integer|min:1|max:8',
                'entries' => 'required|array|min:1',
                'entries.*.day' => 'required|in:monday,tuesday,wednesday,thursday,friday',
                'entries.*.time_slot' => 'required|string',
                'entries.*.subject_id' => 'nullable|exists:subjects,id',
                'entries.*.teacher_name' => 'nullable|string',
                'entries.*.room' => 'nullable|string'
            ]);

            $user = $request->user();

            // Delete existing timetable for this department/semester
            Timetable::where('department_id', $request->department_id)
                ->where('semester', $request->semester)
                ->delete();

            // Create new entries
            $created = [];
            foreach ($request->entries as $entry) {
                $timetable = Timetable::create([
                    'department_id' => $request->department_id,
                    'semester' => $request->semester,
                    'day_of_week' => $entry['day'],
                    'time_slot' => $entry['time_slot'],
                    'subject_id' => $entry['subject_id'] ?? null,
                    'teacher_name' => $entry['teacher_name'] ?? null,
                    'room' => $entry['room'] ?? null,
                    'created_by' => $user->id
                ]);
                $created[] = $timetable;
            }

            return response()->json([
                'success' => true,
                'message' => 'Timetable saved successfully',
                'entries_count' => count($created)
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save timetable',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get timetable for a department/semester (public)
     */
    public function show(Request $request)
    {
        try {
            $request->validate([
                'department_id' => 'required|exists:departments,id',
                'semester' => 'required|integer|min:1|max:8'
            ]);

            $timetable = Timetable::where('department_id', $request->department_id)
                ->where('semester', $request->semester)
                ->with('subject:id,name,code')
                ->orderBy('day_of_week')
                ->orderBy('time_slot')
                ->get()
                ->groupBy('day_of_week');

            return response()->json([
                'success' => true,
                'timetable' => $timetable
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch timetable',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}