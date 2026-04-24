<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'title',
        'slug',
        'description',
        'type',
        'price_monthly',
        'price_yearly',
        'address',
        'area',
        'latitude',
        'longitude',
        'main_image',
        'gallery',
        'is_verified',
        'is_boosted',
        'status',
        'whatsapp_number',
    ];

    protected $casts = [
        'gallery' => 'array',
        'is_verified' => 'boolean',
        'is_boosted' => 'boolean',
        'price_monthly' => 'decimal:2',
        'price_yearly' => 'decimal:2',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'property_facility');
    }

    public function stats(): HasMany
    {
        return $this->hasMany(PropertyStat::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function avgRating(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->reviews()->avg('rating')
                ? round($this->reviews()->avg('rating'), 1)
                : null
        );
    }
}
