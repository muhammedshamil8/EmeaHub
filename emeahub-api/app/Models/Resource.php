<?php
// app/Models/Resource.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $table = 'resources';

    protected $fillable = [
        'title', 'description', 'type', 'file_url', 'file_name', 'file_size',
        'department_id', 'subject_id', 'module_id', 'semester',
        'visibility', 'hide_reason', 'version', 'is_latest',
        'status', 'uploaded_by', 'verified_by', 'verified_at', 'rejection_reason',
        'download_count', 'view_count', 'rating_avg', 'rating_count'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'is_latest' => 'boolean',
        'rating_avg' => 'decimal:2'
    ];

    // Relationships
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function downloads()
    {
        return $this->hasMany(Download::class);
    }

    // Scopes for easy querying
    public function scopeVisible($query)
    {
        return $query->where('visibility', 'visible');
    }

    public function scopeFeatured($query)
    {
        return $query->where('visibility', 'featured');
    }

    public function scopeHidden($query)
    {
        return $query->where('visibility', 'hidden');
    }

    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOfSemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }

    // Methods
    public function incrementDownloads()
    {
        $this->increment('download_count');
    }

    public function incrementViews()
    {
        $this->increment('view_count');
    }

    public function updateRating()
    {
        $this->rating_avg = $this->ratings()->avg('rating') ?? 0;
        $this->rating_count = $this->ratings()->count();
        $this->save();
    }

    public function hide($reason = null)
    {
        $this->visibility = 'hidden';
        $this->hide_reason = $reason;
        $this->save();
    }

    public function show()
    {
        $this->visibility = 'visible';
        $this->hide_reason = null;
        $this->save();
    }

    public function verify($userId)
    {
        $this->status = 'verified';
        $this->verified_by = $userId;
        $this->verified_at = now();
        $this->save();
        
        // Award points to uploader
        if ($this->uploader) {
            $this->uploader->increment('reputation_points', 10);
            $this->uploader->increment('total_uploads');
        }
    }

    public function reject($reason, $userId)
    {
        $this->status = 'rejected';
        $this->rejection_reason = $reason;
        $this->verified_by = $userId;
        $this->verified_at = now();
        $this->save();
    }
}