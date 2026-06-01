<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternshipApplicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'dob', 'email', 'whatsapp', 'instagram',
        'domicile', 'domicile_detail', 'semester', 'role',
        'wfo', 'cv_path', 'portfolio_path', 'reason'
    ];
}
