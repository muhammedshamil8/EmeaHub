<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceReport extends Model
{
    protected $fillable = ['resource_id', 'user_id', 'reason', 'details', 'status'];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
