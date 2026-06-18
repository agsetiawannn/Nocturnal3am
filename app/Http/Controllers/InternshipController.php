<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InternshipApplicant;
use Illuminate\Support\Facades\Storage;
use Google_Client;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;
use Google_Service_Sheets;
use Google_Service_Sheets_ValueRange;
use Exception;

class InternshipController extends Controller
{
    public function store(Request $request)
    {
        \Log::info("Incoming Internship Apply Request:", $request->all());
        \Log::info("Files attached:", $request->allFiles());

        try {
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error("Validation Error in Internship Apply:", $e->errors());
            throw $e; // Rethrow to return standard 422 response
        }

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

        // Integrate with Google Sheets
        try {
            $client = new Google_Client();
            $client->setApplicationName('Studio Tigapagi Internship');
            $client->setScopes([\Google\Service\Sheets::SPREADSHEETS]);
            $client->setAuthConfig(base_path('bot-tigapagi-067ddc692b59.json'));
            $client->setAccessType('offline');

            // Generate direct download URLs using the explicit download route
            $cvFilename = basename($cvPath);
            $portfolioFilename = basename($portfolioPath);

            $cvUrl = url('/internship/download/cvs/' . $cvFilename);
            $portfolioUrl = url('/internship/download/portfolios/' . $portfolioFilename);


            $sheetsService = new Google_Service_Sheets($client);
            $spreadsheetId = '1Hd1BCGpgczXyc6YkyFgv3yc46W7MAsysZdKENUUsyRg';
            $range = 'DATABASE!A:A';

            $values = [
                [
                    date('Y-m-d H:i:s'),
                    $request->name,
                    $request->dob,
                    $request->email,
                    $request->whatsapp,
                    $request->instagram,
                    $request->domicile . ($request->domicileDetail ? ' (' . $request->domicileDetail . ')' : ''),
                    $request->semester,
                    $request->role,
                    $request->wfo,
                    $cvUrl,
                    $portfolioUrl,
                    $request->reason
                ]
            ];

            $body = new Google_Service_Sheets_ValueRange([
                'values' => $values
            ]);
            $params = [
                'valueInputOption' => 'USER_ENTERED'
            ];
            $sheetsService->spreadsheets_values->append($spreadsheetId, $range, $body, $params);

        } catch (Exception $e) {
            \Log::error('Google API Error: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'applicant' => $applicant], 201);
    }
}
