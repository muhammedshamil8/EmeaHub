<?php
// app/Models/Subject.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['department_id', 'name', 'code', 'semester', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }
}