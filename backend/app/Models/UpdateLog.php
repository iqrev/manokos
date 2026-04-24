<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UpdateLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'version',
        'title',
        'description',
        'type',
        'is_published',
        'release_date',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'release_date' => 'date',
    ];
}
