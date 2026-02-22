<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_achievements_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->string('icon');
            $table->integer('points_required')->nullable();
            $table->integer('uploads_required')->nullable();
            $table->integer('verifications_required')->nullable();
            $table->timestamps();
        });

        // Pivot table for user achievements
        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('achievement_id')->constrained()->onDelete('cascade');
            $table->timestamp('earned_at');
            $table->timestamps();
            
            $table->unique(['user_id', 'achievement_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_achievements');
        Schema::dropIfExists('achievements');
    }
};