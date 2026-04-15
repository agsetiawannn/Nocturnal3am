<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'email', 'status'];

    public function progress()
    {
        return $this->hasOne(ClientProgress::class);
    }

    public function notes()
    {
        return $this->hasMany(ClientNote::class)->orderBy('created_at', 'desc');
    }
}
