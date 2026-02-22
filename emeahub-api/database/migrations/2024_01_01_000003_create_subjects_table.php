<?php
// database/migrations/2024_01_01_000003_create_subjects_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('name', 200);
            $table->string('code', 50);
            $table->unsignedTinyInteger('semester'); // 1-8
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['department_id', 'code', 'semester']);
            $table->index('semester');
        });
    }

    public function down()
    {
        Schema::dropIfExists('subjects');
    }
};