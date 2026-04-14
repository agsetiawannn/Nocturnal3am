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
        'client_view',
        'sprint_week_focus',
        'updated_at'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
