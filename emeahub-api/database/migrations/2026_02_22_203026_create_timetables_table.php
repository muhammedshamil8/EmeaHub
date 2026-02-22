<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_timetables_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('timetables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('semester');
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
            $table->string('time_slot', 20); // e.g., "09:00-10:00"
            $table->foreignId('subject_id')->nullable()->constrained()->onDelete('set null');
            $table->string('teacher_name', 100)->nullable();
            $table->string('room', 50)->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Indexes for fast lookup
            $table->index(['department_id', 'semester', 'day_of_week']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('timetables');
    }
};