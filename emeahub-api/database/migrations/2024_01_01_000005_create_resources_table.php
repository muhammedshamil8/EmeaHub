<?php
// database/migrations/2024_01_01_000005_create_resources_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            
            // Basic Info
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->enum('type', ['note', 'pyq', 'syllabus', 'timetable', 'other']);
            
            // File Info
            $table->string('file_url', 500);
            $table->string('file_name', 255);
            $table->unsignedInteger('file_size'); // in KB
            
            // Organization
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('module_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedTinyInteger('semester')->nullable();
            
            // IMPORTANT: Visibility Control
            $table->enum('visibility', ['visible', 'hidden', 'featured'])->default('visible');
            $table->string('hide_reason')->nullable();
            
            // Version Control
            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_latest')->default(true);
            
            // Verification
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // Stats
            $table->unsignedInteger('download_count')->default(0);
            $table->unsignedInteger('view_count')->default(0);
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->unsignedInteger('rating_count')->default(0);
            
            $table->timestamps();
            
            // Indexes for fast queries (REMOVED FULLTEXT)
            $table->index(['type', 'status']);
            $table->index('visibility');
            $table->index('semester');
            $table->index('subject_id');
            $table->index('download_count');
            
            // For search, we'll use LIKE queries instead
            // $table->fullText(['title', 'description']);  // ← REMOVE THIS LINE
        });
    }

    public function down()
    {
        Schema::dropIfExists('resources');
    }
};