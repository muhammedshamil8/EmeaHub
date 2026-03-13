<?php
// app/Http/Controllers/ResourceController.php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\Subject;
use App\Models\Module;
use App\Models\Download;
use App\Models\ResourceReport;
use App\Models\Leaderboard;
use App\Models\ContributionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ResourceController extends Controller
{
    /**
     * Upload a new resource
     */
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'type' => 'required|in:note,pyq,syllabus,timetable,other',
                'category' => 'nullable|in:major,minor,mdc,vac,sec,aec,other',
                'subject_id' => 'required|exists:subjects,id',
                'module_id' => 'nullable|exists:modules,id',
                'semester' => 'required|integer|min:1|max:8',
                'file' => 'required|file|max:20480', // 20MB max
            ]);

            $user = $request->user();
            
            // Check if user can upload (students and teachers can)
            if (!in_array($user->role, ['student', 'teacher', 'admin'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only students and teachers can upload'
                ], 403);
            }

            // Handle file upload
            $file = $request->file('file');
            $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            
            // Store file locally (we'll add cloud storage later)
            $path = $file->storeAs('resources', $fileName, 'public');
            
            // Get subject to get department
            $subject = Subject::find($request->subject_id);
            
            // Create resource record
            $resource = Resource::create([
                'title' => $request->title,
                'description' => $request->description,
                'type' => $request->type,
                'category' => $request->category ?? 'other',
                'file_url' => Storage::url($path),
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize() / 1024, // Convert to KB
                'department_id' => $subject->department_id,
                'subject_id' => $request->subject_id,
                'module_id' => $request->module_id,
                'semester' => $request->semester,
                'uploaded_by' => $user->id,
                'status' => 'pending', // Needs verification
                'visibility' => 'visible',
                'version' => 1,
                'is_latest' => true
            ]);

            // Update user stats
            $user->increment('total_uploads');
            $user->increment('reputation_points', 5); // Award points for uploading
            $user->updateLeaderboard();

            return response()->json([
                'success' => true,
                'message' => 'Resource uploaded successfully. Pending verification.',
                'resource' => [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'type' => $resource->type,
                    'file_url' => $resource->file_url,
                    'status' => $resource->status
                ]
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
                'message' => 'Upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's uploaded resources
     */
    public function myUploads(Request $request)
    {
        $user = $request->user();
        
        $resources = Resource::where('uploaded_by', $user->id)
            ->with(['subject', 'module'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($resource) {
                return [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'type' => $resource->type,
                    'subject' => $resource->subject?->name,
                    'module' => $resource->module?->name,
                    'status' => $resource->status,
                    'visibility' => $resource->visibility,
                    'downloads' => $resource->download_count,
                    'created_at' => $resource->created_at->diffForHumans()
                ];
            });

        return response()->json([
            'success' => true,
            'resources' => $resources
        ]);
    }

    /**
     * Delete a resource (only if you uploaded it or are admin)
     */
    public function delete($id, Request $request)
    {
        try {
            $resource = Resource::findOrFail($id);
            $user = $request->user();
            
            // Check permission
            if ($resource->uploaded_by !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this resource'
                ], 403);
            }
            
            // Delete file from storage
            $path = str_replace('/storage/', '', parse_url($resource->file_url, PHP_URL_PATH));
            Storage::disk('public')->delete($path);
            
            // Delete record
            $resource->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Resource deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


/**
 * Get all verified resources for public view
 */
public function publicIndex(Request $request)
{
    try {
        $query = Resource::where('status', 'verified')
            ->where('visibility', 'visible')
            ->with(['subject', 'department', 'uploader' => function($q) {
                $q->select('id', 'name');
            }]);

        // Filter by type
        if ($request->has('type') && $request->type != '') {
            $query->where('type', $request->type);
        }

        // Filter by department
        if ($request->has('department_id') && $request->department_id != '') {
            $query->where('department_id', $request->department_id);
        }

        // Filter by subject
        if ($request->has('subject_id') && $request->subject_id != '') {
            $query->where('subject_id', $request->subject_id);
        }

        // Filter by semester
        if ($request->has('semester') && $request->semester != '') {
            $query->where('semester', $request->semester);
        }

        // Search by title/description
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Sort
        $sort = $request->get('sort', 'latest');
        switch($sort) {
            case 'popular':
                $query->orderBy('download_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating_avg', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default: // latest
                $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $resources = $query->paginate($perPage);

        // Transform data
        $transformed = $resources->map(function($resource) {
            return [
                'id' => $resource->id,
                'title' => $resource->title,
                'description' => $resource->description,
                'type' => $resource->type,
                'file_url' => $resource->file_url,
                'file_size' => $this->formatFileSize($resource->file_size),
                'subject' => $resource->subject?->name,
                'department' => $resource->department?->name,
                'semester' => $resource->semester,
                'uploaded_by' => $resource->uploader?->name,
                'download_count' => $resource->download_count,
                'rating_avg' => round($resource->rating_avg, 1),
                'created_at' => $resource->created_at->diffForHumans()
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformed,
            'pagination' => [
                'total' => $resources->total(),
                'per_page' => $resources->perPage(),
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage()
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch resources',
            'error' => $e->getMessage()
        ], 500);
    }
}

/**
 * Get single resource details
 */
public function publicShow($id)
{
    try {
        $resource = Resource::where('status', 'verified')
            ->where('visibility', 'visible')
            ->with(['subject', 'department', 'module', 'uploader' => function($q) {
                $q->select('id', 'name');
            }])
            ->findOrFail($id);

        // Increment view count
        $resource->increment('view_count');

        return response()->json([
            'success' => true,
            'resource' => [
                'id' => $resource->id,
                'title' => $resource->title,
                'description' => $resource->description,
                'type' => $resource->type,
                'file_url' => $resource->file_url,
                'file_name' => $resource->file_name,
                'file_size' => $this->formatFileSize($resource->file_size),
                'subject' => $resource->subject?->name,
                'module' => $resource->module?->name,
                'department' => $resource->department?->name,
                'semester' => $resource->semester,
                'uploaded_by' => $resource->uploader?->name,
                'uploaded_at' => $resource->created_at->format('d M Y'),
                'download_count' => $resource->download_count,
                'view_count' => $resource->view_count,
                'rating_avg' => round($resource->rating_avg, 1),
                'rating_count' => $resource->rating_count
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Resource not found'
        ], 404);
    }
}

/**
 * Download resource (tracks download)
 */
public function download($id, Request $request)
{
    try {
        $resource = Resource::where('status', 'verified')
            ->where('visibility', 'visible')
            ->findOrFail($id);

        // Track download
        \App\Models\Download::create([
            'resource_id' => $id,
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        // Increment download count
        $resource->increment('download_count');

        // Award points to uploader if they're a user
        if ($resource->uploader) {
            $resource->uploader->increment('reputation_points', 1);
            $resource->uploader->updateLeaderboard();
        }

        return response()->json([
            'success' => true,
            'download_url' => $resource->file_url,
            'file_name' => $resource->file_name
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Resource not found'
        ], 404);
    }
}

/**
 * Rate a resource (requires login)
 */
public function rate(Request $request, $id)
{
    try {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:500'
        ]);

        $resource = Resource::findOrFail($id);
        $user = $request->user();

        // Check if already rated
        $existing = $resource->ratings()
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            $existing->update([
                'rating' => $request->rating,
                'review' => $request->review
            ]);
            $message = 'Rating updated';
        } else {
            $resource->ratings()->create([
                'user_id' => $user->id,
                'rating' => $request->rating,
                'review' => $request->review
            ]);
            $message = 'Rating added';
            
            // Award points for rating
            $user->increment('reputation_points', 2);
            $user->updateLeaderboard();
        }

        // Update resource average rating
        $resource->updateRating();

        return response()->json([
            'success' => true,
            'message' => $message,
            'rating_avg' => $resource->rating_avg,
            'rating_count' => $resource->rating_count
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Rating failed: ' . $e->getMessage()
        ], 500);
    }
}

/**
 * Helper function to format file size
 */
private function formatFileSize($sizeInKB)
{
    if ($sizeInKB < 1024) {
        return round($sizeInKB) . ' KB';
    } elseif ($sizeInKB < 1048576) {
        return round($sizeInKB / 1024, 1) . ' MB';
    } else {
        return round($sizeInKB / 1048576, 1) . ' GB';
    }
}


/**
 * Get pending resources for teachers to verify
 */
public function pendingVerifications(Request $request)
{
    try {
        $user = $request->user();
        
        // Only teachers and admins can access
        if (!in_array($user->role, ['teacher', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $query = Resource::where('status', 'pending')
            ->with(['uploader' => function($q) {
                $q->select('id', 'name', 'email');
            }, 'subject', 'department']);

        // Filter by type if specified
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $pending = $query->orderBy('created_at', 'desc')
            ->get()
            ->map(function($resource) {
                return [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'description' => $resource->description,
                    'type' => $resource->type,
                    'subject' => $resource->subject?->name,
                    'department' => $resource->department?->name,
                    'semester' => $resource->semester,
                    'file_name' => $resource->file_name,
                    'file_size' => $this->formatFileSize($resource->file_size),
                    'uploaded_by' => $resource->uploader?->name,
                    'uploaded_at' => $resource->created_at->diffForHumans(),
                    'uploader_email' => $resource->uploader?->email
                ];
            });

        return response()->json([
            'success' => true,
            'total' => $pending->count(),
            'pending' => $pending
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch pending resources',
            'error' => $e->getMessage()
        ], 500);
    }
}

/**
 * Verify a resource (teacher/admin only)
 */
    public function verify(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            // Authorization check
            if (!in_array($user->role, ['teacher', 'admin'])) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            // Validation
            $request->validate([
                'action' => 'required|in:approve,reject',
                'rejection_reason' => 'required_if:action,reject|string|max:500'
            ]);

            $resource = Resource::findOrFail($id);

            // Check if already processed
            if ($resource->status !== 'pending') {
                return response()->json(['success' => false, 'message' => 'Resource already processed'], 400);
            }

            // Process Verification
            if ($request->action === 'approve') {
                $resource->status = 'verified';
                $resource->verified_by = $user->id;
                $resource->verified_at = now();
                $resource->save();

                // Update Leaderboard points for uploader
                if ($resource->uploader) {
                    $resource->uploader->updateLeaderboard();
                }

                // Update points for verifier
                $user->updateLeaderboard();

                $message = 'Resource verified successfully';
            } else {
                $resource->status = 'rejected';
                $resource->rejection_reason = $request->rejection_reason;
                $resource->verified_by = $user->id;
                $resource->verified_at = now();
                $resource->save();

                $message = 'Resource rejected';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'resource' => [
                    'id' => $resource->id,
                    'status' => $resource->status
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Verification failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

/**
 * Get teacher's dashboard stats
 */
public function teacherDashboard(Request $request)
{
    try {
        $user = $request->user();
        
        // Stats
        $totalUploads = Resource::where('uploaded_by', $user->id)->count();
        $verifiedUploads = Resource::where('uploaded_by', $user->id)
            ->where('status', 'verified')
            ->count();
        $pendingUploads = Resource::where('uploaded_by', $user->id)
            ->where('status', 'pending')
            ->count();
        
        $totalDownloads = Resource::where('uploaded_by', $user->id)
            ->sum('download_count');
        
        $totalVerifications = Resource::where('verified_by', $user->id)
            ->where('status', 'verified')
            ->count();
        
        $pendingToVerify = Resource::where('status', 'pending')->count();

        // Recent activity
        $recentVerifications = Resource::where('verified_by', $user->id)
            ->with(['subject'])
            ->latest('verified_at')
            ->limit(5)
            ->get()
            ->map(function($r) {
                return [
                    'title' => $r->title,
                    'type' => $r->type,
                    'verified_at' => $r->verified_at?->diffForHumans()
                ];
            });

        return response()->json([
            'success' => true,
            'stats' => [
                'my_uploads' => [
                    'total' => $totalUploads,
                    'verified' => $verifiedUploads,
                    'pending' => $pendingUploads
                ],
                'my_downloads' => $totalDownloads,
                'verifications_done' => $totalVerifications,
                'pending_to_verify' => $pendingToVerify,
                'reputation' => $user->reputation_points
            ],
            'recent_verifications' => $recentVerifications
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
     * Get recommended resources for student based on department/subjects
     */
    public function recommendations(Request $request)
    {
        try {
            $user = $request->user();
            
            // Get user's department
            $departmentId = $user->department_id;
            
            // If user has no department, just return popular verified resources
            if (!$departmentId) {
                $resources = Resource::where('status', 'verified')
                    ->where('visibility', 'visible')
                    ->orderBy('download_count', 'desc')
                    ->take(10)
                    ->with(['subject', 'department'])
                    ->get();
            } else {
                // Get popular resources from user's department
                $resources = Resource::where('status', 'verified')
                    ->where('visibility', 'visible')
                    ->where('department_id', $departmentId)
                    ->orderBy('download_count', 'desc')
                    ->take(10)
                    ->with(['subject', 'department'])
                    ->get();
            }

            return response()->json([
                'success' => true,
                'data' => $resources->map(function($r) {
                    return [
                        'id' => $r->id,
                        'title' => $r->title,
                        'type' => $r->type,
                        'subject' => $r->subject?->name,
                        'department' => $r->department?->name,
                        'file_url' => $r->file_url,
                        'download_count' => $r->download_count,
                        'rating_avg' => round($r->rating_avg, 1)
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recommendations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's download history
     */
    public function downloadHistory(Request $request)
    {
        try {
            $user = $request->user();

            $downloads = Download::where('user_id', $user->id)
                ->with(['resource' => function($q) {
                    $q->with(['subject', 'department']);
                }])
                ->orderBy('id', 'desc')
                ->get()
                ->unique('resource_id') // Avoid duplicates if downloaded multiple times
                ->values();

            return response()->json([
                'success' => true,
                'data' => $downloads->map(function($d) {
                    $r = $d->resource;
                    if (!$r) return null;
                    return [
                        'id' => $r->id,
                        'title' => $r->title,
                        'type' => $r->type,
                        'subject' => $r->subject?->name,
                        'department' => $r->department?->name,
                        'file_url' => $r->file_url,
                        'downloaded_at' => $d->created_at ? $d->created_at->diffForHumans() : 'Recently'
                    ];
                })->filter()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch download history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Global search across subjects, modules, and resources
     */
    public function globalSearch(Request $request)
    {
        try {
            $q = $request->get('q', '');
            
            if (empty($q)) {
                return response()->json(['success' => true, 'data' => []]);
            }

            // Search resources
            $resources = Resource::where('status', 'verified')
                ->where('visibility', 'visible')
                ->where(function($query) use ($q) {
                    $query->where('title', 'LIKE', "%{$q}%")
                          ->orWhere('description', 'LIKE', "%{$q}%");
                })
                ->with(['subject'])
                ->take(10)
                ->get()
                ->map(function($r) {
                    return [
                        'id' => $r->id,
                        'type' => 'resource',
                        'title' => $r->title,
                        'subtitle' => $r->subject?->name,
                        'url' => "/resources/{$r->id}"
                    ];
                });

            // Search subjects
            $subjects = Subject::where('name', 'LIKE', "%{$q}%")
                ->orWhere('code', 'LIKE', "%{$q}%")
                ->with('department')
                ->take(5)
                ->get()
                ->map(function($s) {
                    return [
                        'id' => $s->id,
                        'type' => 'subject',
                        'title' => $s->name,
                        'subtitle' => 'Subject - ' . ($s->department?->name ?? ''),
                        'url' => "/resources?subject_id={$s->id}"
                    ];
                });

            $results = $subjects->concat($resources)->values();

            return response()->json([
                'success' => true,
                'data' => $results
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Report an inappropriate or broken resource
     */
    public function reportResource(Request $request, $id)
    {
        try {
            $request->validate([
                'reason' => 'required|string|max:255',
                'details' => 'nullable|string|max:1000'
            ]);

            $user = $request->user();
            $resource = Resource::findOrFail($id);

            // Prevent duplicate reports from the same user
            $existing = ResourceReport::where('resource_id', $id)
                ->where('user_id', $user->id)
                ->where('status', 'pending')
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reported this resource.'
                ], 400);
            }

            ResourceReport::create([
                'resource_id' => $id,
                'user_id' => $user->id,
                'reason' => $request->reason,
                'details' => $request->details,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Resource reported successfully. Our team will review it.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle bookmark for a resource
     */
    public function toggleBookmark(Request $request, $id)
    {
        try {
            $resource = Resource::findOrFail($id);
            $user = $request->user();

            $existing = \App\Models\Bookmark::where('user_id', $user->id)
                ->where('resource_id', $resource->id)
                ->first();

            if ($existing) {
                // Remove bookmark
                $existing->delete();
                $isBookmarked = false;
                $message = 'Bookmark removed';
            } else {
                // Add bookmark
                \App\Models\Bookmark::create([
                    'user_id' => $user->id,
                    'resource_id' => $resource->id
                ]);
                $isBookmarked = true;
                $message = 'Resource bookmarked';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'is_bookmarked' => $isBookmarked
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle bookmark',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user bookmarks
     */
    public function getUserBookmarks(Request $request)
    {
        try {
            $user = $request->user();

            $bookmarks = Resource::whereHas('bookmarkedBy', function($q) use ($user) {
                    $q->where('user_id', $user->id);
                })
                ->where('status', 'verified')
                ->where('visibility', 'visible')
                ->with(['subject', 'department', 'uploader'])
                ->paginate(20)
                ->through(function($resource) {
                    return [
                        'id' => $resource->id,
                        'title' => $resource->title,
                        'description' => $resource->description,
                        'type' => $resource->type,
                        'subject_name' => $resource->subject?->name,
                        'department_name' => $resource->department?->name,
                        'uploader_name' => $resource->uploader?->name,
                        'rating_avg' => $resource->rating_avg,
                        'download_count' => $resource->download_count,
                        'created_at' => $resource->created_at,
                        'is_bookmarked' => true
                    ];
                });

            return response()->json([
                'success' => true,
                'bookmarks' => $bookmarks
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get bookmarks',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}