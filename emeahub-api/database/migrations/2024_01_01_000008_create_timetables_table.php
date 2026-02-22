<?php
// database/migrations/2024_01_01_000008_create_timetables_table.php

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
            $table->string('time_slot', 20); // "09:00-10:00"
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
            $table->string('teacher_name', 100)->nullable();
            $table->string('room', 50)->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('timetables');
    }
};