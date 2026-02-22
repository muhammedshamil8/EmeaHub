<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\User;
use App\Models\Subject;
use App\Models\Module;
use App\Models\Resource;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 1. Create Departments
        $cs = Department::create(['name' => 'Computer Science', 'code' => 'CS']);
        $it = Department::create(['name' => 'Information Technology', 'code' => 'IT']);
        
        // 2. Create Users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@emeahub.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_verified' => true
        ]);
        
        $teacher = User::create([
            'name' => 'Dr. Sharma',
            'email' => 'teacher@emeahub.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'department_id' => $cs->id,
            'is_verified' => true
        ]);
        
        $student = User::create([
            'name' => 'Rahul Kumar',
            'email' => 'student@emeahub.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'department_id' => $cs->id,
            'enrollment_no' => 'CS2024001',
            'semester' => 3,
            'is_verified' => true
        ]);
        
        // 3. Create Subjects
        $ds = Subject::create([
            'department_id' => $cs->id,
            'name' => 'Data Structures',
            'code' => 'CS301',
            'semester' => 3
        ]);
        
        $dbms = Subject::create([
            'department_id' => $cs->id,
            'name' => 'Database Management Systems',
            'code' => 'CS302',
            'semester' => 3
        ]);
        
        // 4. Create Modules
        $module1 = Module::create([
            'subject_id' => $ds->id,
            'name' => 'Arrays and Linked Lists',
            'module_number' => 1
        ]);
        
        $module2 = Module::create([
            'subject_id' => $ds->id,
            'name' => 'Stacks and Queues',
            'module_number' => 2
        ]);
        
        // 5. Create Sample Resources
        Resource::create([
            'title' => 'Arrays Complete Notes',
            'description' => 'Detailed notes on arrays with examples',
            'type' => 'note',
            'file_url' => '/storage/resources/arrays.pdf',
            'file_name' => 'arrays.pdf',
            'file_size' => 2048,
            'department_id' => $cs->id,
            'subject_id' => $ds->id,
            'module_id' => $module1->id,
            'semester' => 3,
            'visibility' => 'visible',
            'status' => 'verified',
            'uploaded_by' => $teacher->id,
            'verified_by' => $admin->id,
            'verified_at' => now(),
            'download_count' => 45,
            'rating_avg' => 4.5,
            'rating_count' => 12
        ]);
        
        Resource::create([
            'title' => 'Data Structures PYQ 2023',
            'description' => 'Previous year question paper with solutions',
            'type' => 'pyq',
            'file_url' => '/storage/resources/ds-pyq-2023.pdf',
            'file_name' => 'ds-pyq-2023.pdf',
            'file_size' => 1536,
            'department_id' => $cs->id,
            'subject_id' => $ds->id,
            'semester' => 3,
            'visibility' => 'visible',
            'status' => 'verified',
            'uploaded_by' => $student->id,
            'verified_by' => $teacher->id,
            'verified_at' => now(),
            'download_count' => 120,
            'rating_avg' => 4.2,
            'rating_count' => 8
        ]);
    }
}