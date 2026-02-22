<?php
// database/migrations/2024_01_01_000002_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->enum('role', ['public', 'student', 'teacher', 'admin'])->default('public');
            
            // Profile fields
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->string('enrollment_no', 50)->nullable()->unique();
            $table->unsignedTinyInteger('semester')->nullable();
            
            // Status
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            
            // Gamification
            $table->integer('reputation_points')->default(0);
            $table->integer('total_uploads')->default(0);
            
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes
            $table->index('role');
            $table->index('is_verified');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};