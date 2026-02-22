<?php
// app/Models/Timetable.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $fillable = [
        'department_id',
        'semester',
        'day_of_week',
        'time_slot',
        'subject_id',
        'teacher_name',
        'room',
        'created_by'
    ];

    protected $casts = [
        'semester' => 'integer'
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

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeForDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    public function scopeForSemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }

    public function scopeForDay($query, $day)
    {
        return $query->where('day_of_week', $day);
    }

    // Helper methods
    public function getFormattedTimeSlotAttribute()
    {
        return $this->time_slot;
    }
}