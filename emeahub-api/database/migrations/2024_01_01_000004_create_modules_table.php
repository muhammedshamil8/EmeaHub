<?php
// database/migrations/2024_01_01_000004_create_modules_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->string('name', 200);
            $table->unsignedInteger('module_number');
            $table->timestamps();
            
            $table->unique(['subject_id', 'module_number']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('modules');
    }
};