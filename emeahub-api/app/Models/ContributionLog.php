<?php
// app/Models/ContributionLog.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContributionLog extends Model
{
    protected $table = 'contribution_logs';
    
    protected $fillable = [
        'user_id',
        'resource_id',
        'action',
        'points_earned'
    ];

    protected $casts = [
        'created_at' => 'datetime'
    ];

    public $timestamps = true;

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }
}