<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id');
            $table->unsignedBigInteger('user_id');
            $table->tinyInteger('rating'); // 1-5
            $table->text('body')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->index('property_id');
            $table->unique(['property_id', 'user_id']); // 1 review per user per property
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
