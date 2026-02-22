<?php
// database/migrations/2024_01_01_000007_create_downloads_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('downloads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ip_address', 45);
            $table->text('user_agent')->nullable();
            $table->timestamp('downloaded_at')->useCurrent();
            
            $table->index('resource_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('downloads');
    }
};