<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'email', 'status', 'active_until', 'last_expiry_reminder'];

    public function progress()
    {
        return $this->hasOne(ClientProgress::class);
    }

    public function notes()
    {
        return $this->hasMany(ClientNote::class)->orderBy('created_at', 'desc');
    }
}
