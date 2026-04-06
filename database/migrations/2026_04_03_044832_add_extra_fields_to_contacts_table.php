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
        Schema::table('contacts', function (Blueprint $table) {
            $table->json('business_goals')->nullable()->after('phone');
            $table->string('others_text')->nullable()->after('business_goals');
            $table->string('business_stage')->nullable()->after('others_text');
            $table->string('budget')->nullable()->after('business_stage');
            $table->string('timeline')->nullable()->after('budget');
            $table->text('additional_details')->nullable()->after('timeline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn([
                'business_goals',
                'others_text',
                'business_stage',
                'budget',
                'timeline',
                'additional_details',
            ]);
        });
    }
};
