<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientProgress extends Model
{
    protected $table = 'client_progress';
    public $timestamps = false; // Usually updated_at is manually handled or mapped, but let's see.

    protected $fillable = [
        'client_id',
        'onboard',
        'presprint',
        'sprint',
        'alacarte',
        'alacarte_titles',
        'client_view',
        'sprint_week_focus',
        'sprint_week_to',
        'alacarte_focus',
        'alacarte_to',
        'updated_at'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
