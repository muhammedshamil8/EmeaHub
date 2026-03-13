<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Leaderboard extends Model
{
    protected $fillable = [
        'user_id',
        'total_points',
        'upload_count',
        'verification_count',
        'avg_rating',
        'badge'
    ];

    protected $casts = [
        'total_points' => 'integer',
        'upload_count' => 'integer',
        'verification_count' => 'integer',
        'avg_rating' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
