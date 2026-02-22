<?php
// app/Models/Download.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    protected $table = 'downloads';
    
    public $timestamps = false;
    
    protected $fillable = ['resource_id', 'user_id', 'ip_address', 'user_agent', 'downloaded_at'];

    protected $casts = [
        'downloaded_at' => 'datetime'
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}