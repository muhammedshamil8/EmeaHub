<?php
// app/Http/Controllers/GamificationController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Leaderboard;
use App\Models\Achievement;
use App\Models\ContributionLog;
use Illuminate\Http\Request;

class GamificationController extends Controller
{
    /**
     * Get leaderboard with rankings
     */
    public function leaderboard(Request $request)
    {
        $type = $request->get('type', 'points'); // points, uploads, verifications
        
        if ($type === 'verifications' || $type === 'uploads') {
             $query = Leaderboard::with('user.department:id,name');
             if ($type === 'uploads') {
                 $query->orderBy('upload_count', 'desc');
             } else {
                 $query->orderBy('verification_count', 'desc');
             }
             $leaders = $query->paginate(20);
        } else {
             // Default: points (use User table to ensure sync)
             $query = User::where('reputation_points', '>', 0)
                ->where('role', '!=', 'admin')
                ->with(['department:id,name', 'leaderboard'])
                ->orderBy('reputation_points', 'desc');
             $leaders = $query->paginate(20);
        }
        
        // Add rank numbers and transform
        $leaders->through(function($item, $key) use ($leaders, $type) {
            $rank = ($leaders->currentPage() - 1) * $leaders->perPage() + $key + 1;
            
            if ($type === 'points') {
                $user = $item;
                $stats = $user->leaderboard;
                return [
                    'id' => $user->id,
                    'rank' => $rank,
                    'name' => $user->name,
                    'department' => $user->department->name ?? 'N/A',
                    'points' => $user->reputation_points,
                    'uploads' => $user->total_uploads,
                    'verifications' => $stats->verification_count ?? 0,
                    'avg_rating' => $stats->avg_rating ?? 0,
                    'badge' => $stats->badge ?? 'Newbie'
                ];
            } else {
                $stats = $item;
                return [
                    'id' => $stats->user->id,
                    'rank' => $rank,
                    'name' => $stats->user->name,
                    'department' => $stats->user->department->name ?? 'N/A',
                    'points' => $stats->total_points,
                    'uploads' => $stats->upload_count,
                    'verifications' => $stats->verification_count,
                    'avg_rating' => $stats->avg_rating,
                    'badge' => $stats->badge
                ];
            }
        });
        
        return response()->json([
            'success' => true,
            'type' => $type,
            'leaderboard' => $leaders
        ]);
    }

    /**
     * Get user's gamification stats
     */
    public function myStats(Request $request)
    {
        $user = $request->user();
        
        // Ensure stats are updated before fetching
        $stats = $user->updateLeaderboard();
        
        // Get achievements
        $achievements = $user->achievements()->get();
        
        // Get recent activity
        $recentActivity = ContributionLog::where('user_id', $user->id)
            ->with('resource:id,title')
            ->latest()
            ->take(10)
            ->get()
            ->map(function($log) {
                return [
                    'action' => $log->action,
                    'resource' => $log->resource->title ?? 'N/A',
                    'points' => $log->points_earned,
                    'time' => $log->created_at->diffForHumans()
                ];
            });
        
        // Calculate rank
        $rank = Leaderboard::where('total_points', '>', $stats->total_points)->count() + 1;
        
        return response()->json([
            'success' => true,
            'stats' => [
                'rank' => $rank,
                'total_points' => $stats->total_points,
                'uploads' => $stats->upload_count,
                'verifications' => $stats->verification_count,
                'downloads' => $stats->download_count,
                'avg_rating' => $stats->avg_rating,
                'badge' => $stats->badge,
                'next_badge' => $this->getNextBadge($stats->total_points)
            ],
            'achievements' => $achievements,
            'recent_activity' => $recentActivity
        ]);
    }

    /**
     * Get all achievements
     */
    public function achievements()
    {
        $achievements = Achievement::all();
        
        return response()->json([
            'success' => true,
            'achievements' => $achievements
        ]);
    }

    private function getNextBadge($points)
    {
        if ($points < 100) return ['name' => 'Bronze', 'points_needed' => 100 - $points];
        if ($points < 500) return ['name' => 'Silver', 'points_needed' => 500 - $points];
        if ($points < 1000) return ['name' => 'Gold', 'points_needed' => 1000 - $points];
        return ['name' => 'Platinum', 'points_needed' => 0];
    }

    /**
     * Get isolated user rank
     */
    public function myRank(Request $request)
    {
        $user = $request->user();
        $stats = Leaderboard::firstOrCreate(['user_id' => $user->id], ['total_points' => 0]);
        $rank = Leaderboard::where('total_points', '>', $stats->total_points)->count() + 1;
        
        return response()->json([
            'success' => true,
            'rank' => $rank,
            'points' => $stats->total_points,
            'badge' => $stats->badge
        ]);
    }

    /**
     * Get user's activity log separated
     */
    public function myActivity(Request $request)
    {
        $user = $request->user();
        
        $activity = ContributionLog::where('user_id', $user->id)
            ->with('resource:id,title')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'activity' => $activity
        ]);
    }

    /**
     * Get just the user's unlocked achievements
     */
    public function myAchievements(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'achievements' => $user->achievements()->get()
        ]);
    }

    /**
     * Student specific dashboard
     */
    public function studentDashboard(Request $request)
    {
        $user = $request->user();
        $stats = Leaderboard::firstOrCreate(['user_id' => $user->id], ['total_points' => 0]);
        
        $recentDownloads = \App\Models\Download::where('user_id', $user->id)
            ->with(['resource:id,title,type'])
            ->latest('created_at')
            ->take(5)
            ->get();
            
        $recentUploads = \App\Models\Resource::where('uploaded_by', $user->id)
            ->with(['subject:id,name'])
            ->latest('created_at')
            ->take(5)
            ->get();
            
        return response()->json([
            'success' => true,
            'dashboard' => [
                'points' => $stats->total_points,
                'badge' => $stats->badge,
                'recent_downloads' => $recentDownloads,
                'recent_uploads' => $recentUploads
            ]
        ]);
    }

    /**
     * Teacher specific gamification stats
     */
    public function teacherStats(Request $request)
    {
        $user = $request->user();
        $stats = Leaderboard::firstOrCreate(['user_id' => $user->id], ['total_points' => 0]);
        $rank = Leaderboard::where('total_points', '>', $stats->total_points)->count() + 1;

        return response()->json([
            'success' => true,
            'stats' => [
                'rank' => $rank,
                'total_points' => $stats->total_points,
                'verifications' => $stats->verification_count,
                'uploads' => $stats->upload_count,
                'badge' => $stats->badge
            ]
        ]);
    }

    /**
     * Teacher contributions log
     */
    public function teacherContributions(Request $request)
    {
        $user = $request->user();
        
        $contributions = ContributionLog::where('user_id', $user->id)
            ->whereIn('action', ['verify', 'upload'])
            ->with('resource:id,title')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'contributions' => $contributions
        ]);
    }

    /**
     * Admin view of leaderboard
     */
    public function adminLeaderboard(Request $request)
    {
        $leaders = Leaderboard::with('user:id,name,email,role')
            ->orderBy('total_points', 'desc')
            ->paginate(50);
            
        return response()->json([
            'success' => true,
            'leaderboard' => $leaders
        ]);
    }

    /**
     * Get public profile data for any user
     */
    public function publicProfile($id)
    {
        $user = User::with(['department:id,name', 'achievements'])
            ->where('role', '!=', 'admin')
            ->findOrFail($id);
            
        $stats = Leaderboard::firstOrCreate(
            ['user_id' => $user->id],
            [
                'total_points' => 0,
                'upload_count' => 0,
                'verification_count' => 0,
                'avg_rating' => 0.0,
                'badge' => 'Newbie'
            ]
        );
        
        $recentUploads = \App\Models\Resource::where('uploaded_by', $user->id)
            ->where('status', 'verified')
            ->with(['subject:id,name'])
            ->latest()
            ->take(6)
            ->get();
            
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'created_at' => $user->created_at,
                'department' => $user->department->name ?? 'N/A',
                'reputation_points' => $user->reputation_points,
                'total_uploads' => $user->total_uploads,
                'role' => $user->role
            ],
            'stats' => [
                'total_points' => $stats->total_points,
                'uploads' => $stats->upload_count,
                'badge' => $stats->badge,
                'rank' => Leaderboard::where('total_points', '>', $stats->total_points)->count() + 1
            ],
            'achievements' => $user->achievements,
            'recent_uploads' => $recentUploads
        ]);
    }
}