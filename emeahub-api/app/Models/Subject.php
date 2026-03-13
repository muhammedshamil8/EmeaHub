<?php
// app/Models/Subject.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'code',
        'type',
        'department_id',
        'semester',
        'is_active',
        'syllabus_path'
    ];

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