<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'date',
        'views',
        'whatsapp_clicks',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
