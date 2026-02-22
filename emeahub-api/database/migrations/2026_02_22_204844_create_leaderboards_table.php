<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_leaderboards_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('leaderboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->integer('total_points')->default(0);
            $table->integer('upload_count')->default(0);
            $table->integer('verification_count')->default(0);
            $table->integer('rating_count')->default(0);
            $table->decimal('avg_rating', 3, 2)->default(0);
            $table->integer('download_count')->default(0);
            $table->integer('rank')->nullable();
            $table->string('badge')->nullable(); // Bronze, Silver, Gold, Platinum
            $table->timestamps();
            
            $table->index('total_points');
            $table->index('rank');
        });
    }

    public function down()
    {
        Schema::dropIfExists('leaderboards');
    }
};