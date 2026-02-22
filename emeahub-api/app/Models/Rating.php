<?php
// app/Models/Rating.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = ['resource_id', 'user_id', 'rating', 'review'];

    protected $casts = [
        'rating' => 'integer'
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