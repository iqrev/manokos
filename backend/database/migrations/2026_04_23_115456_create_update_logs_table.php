<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('update_logs', function (Blueprint $table) {
            $table->id();
            $table->string('version');                        // e.g. "1.2.0"
            $table->string('title');                          // Short title
            $table->text('description');                      // Markdown content
            $table->enum('type', ['feature', 'fix', 'improvement', 'breaking'])->default('feature');
            $table->boolean('is_published')->default(true);
            $table->date('release_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('update_logs');
    }
};
