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
        
        $query = Leaderboard::with('user:id,name,email,department_id')
            ->with('user.department:id,name');
        
        switch($type) {
            case 'uploads':
                $query->orderBy('upload_count', 'desc');
                break;
            case 'verifications':
                $query->orderBy('verification_count', 'desc');
                break;
            default:
                $query->orderBy('total_points', 'desc');
        }
        
        $leaders = $query->paginate(20);
        
        // Add rank numbers
        $leaders->through(function($item, $key) use ($leaders) {
            $rank = ($leaders->currentPage() - 1) * $leaders->perPage() + $key + 1;
            
            return [
                'rank' => $rank,
                'name' => $item->user->name,
                'department' => $item->user->department->name ?? 'N/A',
                'points' => $item->total_points,
                'uploads' => $item->upload_count,
                'verifications' => $item->verification_count,
                'avg_rating' => $item->avg_rating,
                'badge' => $item->badge,
                'avatar' => null // Add avatar URL later
            ];
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
        
        // Get or create leaderboard entry
        $stats = Leaderboard::firstOrCreate(
            ['user_id' => $user->id],
            [
                'total_points' => 0,
                'upload_count' => 0,
                'verification_count' => 0
            ]
        );
        
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
}