<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('internship_applicants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('dob');
            $table->string('email');
            $table->string('whatsapp');
            $table->string('instagram');
            $table->string('domicile');
            $table->string('domicile_detail')->nullable();
            $table->string('semester');
            $table->string('role');
            $table->string('wfo');
            $table->string('cv_path');
            $table->string('portfolio_path');
            $table->text('reason');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internship_applicants');
    }
};
