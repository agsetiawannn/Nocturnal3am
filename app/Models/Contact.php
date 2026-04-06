<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $phone
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'business_goals',
        'others_text',
        'business_stage',
        'budget',
        'timeline',
        'additional_details',
    ];

    protected $casts = [
        'business_goals' => 'array',
    ];
}
