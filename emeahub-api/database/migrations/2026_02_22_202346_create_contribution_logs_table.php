<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_contribution_logs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contribution_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('resource_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('action', ['upload', 'verify', 'rate', 'download', 'report']);
            $table->integer('points_earned')->default(0);
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('contribution_logs');
    }
};