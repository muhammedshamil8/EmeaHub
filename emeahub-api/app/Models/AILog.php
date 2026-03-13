<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AILog extends Model
{
    protected $table = 'ai_logs';

    protected $fillable = [
        'user_id',
        'query',
        'response',
        'resources_suggested'
    ];
}
