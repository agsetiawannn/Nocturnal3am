<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InternshipApplicant;
use Illuminate\Support\Facades\Storage;

class InternshipController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'dob' => 'required|string',
            'email' => 'required|email',
            'whatsapp' => 'required|string',
            'instagram' => 'required|string',
            'domicile' => 'required|string',
            'semester' => 'required|string',
            'role' => 'required|string',
            'wfo' => 'required|string',
            'cv' => 'required|file|mimes:pdf|max:10240',
            'portfolio' => 'required|file|mimes:pdf|max:20480',
            'reason' => 'required|string',
        ]);

        $cvPath = $request->file('cv')->store('internship_cvs', 'public');
        $portfolioPath = $request->file('portfolio')->store('internship_portfolios', 'public');

        $applicant = InternshipApplicant::create([
            'name' => $request->name,
            'dob' => $request->dob,
            'email' => $request->email,
            'whatsapp' => $request->whatsapp,
            'instagram' => $request->instagram,
            'domicile' => $request->domicile,
            'domicile_detail' => $request->domicileDetail,
            'semester' => $request->semester,
            'role' => $request->role,
            'wfo' => $request->wfo,
            'cv_path' => $cvPath,
            'portfolio_path' => $portfolioPath,
            'reason' => $request->reason,
        ]);

        return response()->json(['success' => true, 'applicant' => $applicant], 201);
    }
}
