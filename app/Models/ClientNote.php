<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientNote extends Model
{
    protected $fillable = ['client_id', 'note_text', 'created_by'];
    const UPDATED_AT = null; // Assuming no updated_at

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
