<?php
// app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Resource;
use App\Models\Department;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get admin dashboard stats
     */
    public function dashboard()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'total_students' => User::where('role', 'student')->count(),
                'total_teachers' => User::where('role', 'teacher')->count(),
                'pending_teachers' => User::where('role', 'teacher')->where('is_verified', false)->count(),
                
                'total_resources' => Resource::count(),
                'verified_resources' => Resource::where('status', 'verified')->count(),
                'pending_resources' => Resource::where('status', 'pending')->count(),
                'hidden_resources' => Resource::where('visibility', 'hidden')->count(),
                
                'total_downloads' => \App\Models\Download::count(),
                'total_ratings' => \App\Models\Rating::count(),
            ];

            // Recent activity
            $recent = [
                'new_users' => User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']),
                'new_resources' => Resource::with(['uploader', 'subject'])
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function($r) {
                        return [
                            'id' => $r->id,
                            'title' => $r->title,
                            'type' => $r->type,
                            'uploader' => $r->uploader?->name,
                            'status' => $r->status,
                            'created_at' => $r->created_at->diffForHumans()
                        ];
                    })
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'recent' => $recent
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all teachers (pending and verified)
     */
    public function getTeachers(Request $request)
    {
        $query = User::where('role', 'teacher')
            ->with('department');

        // Filter by verification status
        if ($request->has('status')) {
            if ($request->status === 'pending') {
                $query->where('is_verified', false);
            } elseif ($request->status === 'verified') {
                $query->where('is_verified', true);
            }
        }

        $teachers = $query->latest()
            ->get()
            ->map(function($teacher) {
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                    'department' => $teacher->department?->name,
                    'is_verified' => $teacher->is_verified,
                    'reputation_points' => $teacher->reputation_points,
                    'total_uploads' => $teacher->total_uploads,
                    'joined_at' => $teacher->created_at->format('d M Y')
                ];
            });

        return response()->json([
            'success' => true,
            'teachers' => $teachers
        ]);
    }

    /**
     * Verify a teacher
     */
    public function verifyTeacher($id)
    {
        try {
            $teacher = User::where('role', 'teacher')->findOrFail($id);
            
            $teacher->is_verified = true;
            $teacher->save();

            return response()->json([
                'success' => true,
                'message' => 'Teacher verified successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify teacher'
            ], 500);
        }
    }

    /**
     * Get all resources with filters
     */
    public function getResources(Request $request)
    {
        $query = Resource::with(['uploader', 'verifier', 'subject', 'department']);

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('visibility')) {
            $query->where('visibility', $request->visibility);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $resources = $query->latest()
            ->paginate(20)
            ->through(function($resource) {
                return [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'type' => $resource->type,
                    'subject' => $resource->subject?->name,
                    'department' => $resource->department?->name,
                    'uploader' => $resource->uploader?->name,
                    'status' => $resource->status,
                    'visibility' => $resource->visibility,
                    'downloads' => $resource->download_count,
                    'rating' => round($resource->rating_avg, 1),
                    'created_at' => $resource->created_at->format('d M Y')
                ];
            });

        return response()->json([
            'success' => true,
            'resources' => $resources
        ]);
    }

    /**
     * Toggle resource visibility (hide/show)
     */
    public function toggleVisibility($id, Request $request)
    {
        try {
            $request->validate([
                'visibility' => 'required|in:visible,hidden,featured',
                'reason' => 'required_if:visibility,hidden|string|max:255'
            ]);

            $resource = Resource::findOrFail($id);
            
            $resource->visibility = $request->visibility;
            if ($request->visibility === 'hidden') {
                $resource->hide_reason = $request->reason;
            } else {
                $resource->hide_reason = null;
            }
            $resource->save();

            return response()->json([
                'success' => true,
                'message' => "Resource is now {$request->visibility}",
                'resource' => [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'visibility' => $resource->visibility
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update visibility',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all departments with stats
     */
    public function getDepartmentsWithStats()
    {
        $departments = Department::withCount(['users', 'subjects', 'resources'])
            ->get()
            ->map(function($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code,
                    'total_students' => $dept->users()->where('role', 'student')->count(),
                    'total_teachers' => $dept->users()->where('role', 'teacher')->count(),
                    'total_subjects' => $dept->subjects_count,
                    'total_resources' => $dept->resources_count,
                    'is_active' => $dept->is_active
                ];
            });

        return response()->json([
            'success' => true,
            'departments' => $departments
        ]);
    }
}