<?php
// app/Models/User.php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'department_id',
        'enrollment_no', 'semester', 'is_verified', 'is_active',
        'reputation_points', 'total_uploads'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_verified' => 'boolean',
        'is_active' => 'boolean'
    ];

    // Relationships
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function uploadedResources()
    {
        return $this->hasMany(Resource::class, 'uploaded_by');
    }

    public function verifiedResources()
    {
        return $this->hasMany(Resource::class, 'verified_by');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function downloads()
    {
        return $this->hasMany(Download::class);
    }
    // Add these relationships
public function leaderboard()
{
    return $this->hasOne(Leaderboard::class);
}

public function achievements()
{
    return $this->belongsToMany(Achievement::class, 'user_achievements')
        ->withPivot('earned_at')
        ->withTimestamps();
}

public function contributionLogs()
{
    return $this->hasMany(ContributionLog::class);
}

// Add method to update leaderboard
public function updateLeaderboard()
{
    $stats = Leaderboard::updateOrCreate(
        ['user_id' => $this->id],
        [
            'total_points' => $this->reputation_points,
            'upload_count' => $this->total_uploads,
            'verification_count' => $this->verifications_count ?? 0,
            'download_count' => $this->downloads()->count(),
            'avg_rating' => $this->uploadedResources()->avg('rating_avg') ?? 0
        ]
    );
    
    // Update badge based on points
    if ($stats->total_points >= 1000) $stats->badge = 'Platinum';
    elseif ($stats->total_points >= 500) $stats->badge = 'Gold';
    elseif ($stats->total_points >= 100) $stats->badge = 'Silver';
    elseif ($stats->total_points >= 50) $stats->badge = 'Bronze';
    
    $stats->save();
    
    return $stats;
}

    // Helper methods
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isTeacher()
    {
        return $this->role === 'teacher';
    }

    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function canVerify()
    {
        return in_array($this->role, ['teacher', 'admin']);
    }
}
