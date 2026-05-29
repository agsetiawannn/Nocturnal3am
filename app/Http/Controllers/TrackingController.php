<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\ClientProgress;
use App\Models\ClientNote;
use Illuminate\Support\Facades\DB;

class TrackingController extends Controller
{
    // ====== AUTHENTICATION ======
    
    public function clientLogin(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        $client = Client::where('email', $request->email)->where('status', 'active')->first();
        
        if ($client) {
            session(['client_id' => $client->id, 'client_name' => $client->name, 'client_email' => $client->email]);
            return response()->json(['success' => true, 'client' => $client]);
        }
        
        return response()->json(['success' => false, 'message' => 'Email tidak terdaftar atau tidak aktif.'], 401);
    }

    public function adminLogin(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
        
        $admin = DB::table('admin')
            ->where('username', $request->username)
            ->where('password', md5($request->password))
            ->first();
        
        if ($admin) {
            session(['admin' => true, 'admin_id' => $admin->id]);
            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false, 'message' => 'Username atau password salah.'], 401);
    }

    public function checkAuth()
    {
        return response()->json([
            'isClient' => session()->has('client_id'),
            'isAdmin' => session()->has('admin'),
            'client_id' => session('client_id'),
            'client_name' => session('client_name')
        ]);
    }

    public function logout(Request $request)
    {
        $request->session()->forget(['client_id', 'client_name', 'admin', 'admin_id']);
        return response()->json(['success' => true]);
    }

    // ====== CLIENT ROUTES ======

    public function getClientDashboard()
    {
        if (!session()->has('client_id')) return response()->json(['message' => 'Unauthorized'], 401);
        
        $id = session('client_id');
        $client = Client::find($id);

        if (!$client || $client->email !== session('client_email')) {
            session()->forget(['client_id', 'client_name', 'client_email']);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $progress = ClientProgress::where('client_id', $id)->first();
        $notes = ClientNote::where('client_id', $id)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'client' => $client,
            'progress' => $progress,
            'notes' => $notes
        ]);
    }

    public function getPublicClientDashboard($id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $progress = ClientProgress::where('client_id', $id)->first();
        $notes = ClientNote::where('client_id', $id)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'client' => $client,
            'progress' => $progress,
            'notes' => $notes
        ]);
    }

    // ====== ADMIN ROUTES ======

    public function getAdminDashboard()
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        $clients = Client::orderBy('name', 'asc')->get();
        return response()->json(['clients' => $clients]);
    }

    public function addClient(Request $request)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);
        
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:clients,email'
        ]);

        $client = Client::create([
            'name' => $request->name,
            'email' => $request->email,
            'status' => 'active'
        ]);

        return response()->json(['success' => true, 'client' => $client]);
    }

    public function getPublicTracking()
    {
        $activeClients = Client::where('status', 'active')->get();
        $progressData = ClientProgress::whereIn('client_id', $activeClients->pluck('id'))->get();
        
        $trackingList = [];
        foreach ($activeClients as $client) {
            $prog = $progressData->firstWhere('client_id', $client->id);
            if ($prog) {
                $trackingList[] = [
                    'id' => $client->id,
                    'name' => $client->name,
                    'active_until' => $client->active_until,
                    'progress' => $prog
                ];
            }
        }
        
        return response()->json(['success' => true, 'tracking' => $trackingList]);
    }

    public function deleteClient($id)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);
        
        $client = Client::find($id);
        if ($client) {
            ClientProgress::where('client_id', $id)->delete();
            ClientNote::where('client_id', $id)->delete();
            $client->delete();
        }

        return response()->json(['success' => true]);
    }

    public function getClientDetails($id)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        $client = Client::find($id);
        $progress = ClientProgress::where('client_id', $id)->first();
        $notes = ClientNote::where('client_id', $id)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'client' => $client,
            'progress' => $progress,
            'notes' => $notes
        ]);
    }

    public function updateClientStatus(Request $request, $id)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        $client = Client::find($id);
        if (!$client) return response()->json(['success' => false, 'message' => 'Client not found.'], 404);

        if ($request->has('status')) {
            $client->status = $request->status;
        }
        if ($request->has('active_until')) {
            $client->active_until = $request->active_until ?: null;
        }
        if ($request->has('email')) {
            $client->email = $request->email;
        }
        $client->save();

        return response()->json(['success' => true, 'client' => $client]);
    }

    public function saveProgress(Request $request, $id)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        $progress = ClientProgress::firstOrNew(['client_id' => $id]);
        $progress->onboard = json_encode($request->onboard ?? []);
        $progress->presprint = json_encode($request->presprint ?? []);
        $progress->sprint = json_encode($request->sprint ?? []);
        $progress->alacarte = json_encode($request->alacarte ?? []);
        $progress->alacarte_titles = json_encode($request->alacarte_titles ?? (object)[]);
        $progress->client_view = $request->client_view ?? '["onboard"]';
        $progress->sprint_week_focus = $request->sprint_week_focus ?? 1;
        $progress->sprint_week_to = $request->sprint_week_to ?? $request->sprint_week_focus ?? 1;
        $progress->alacarte_focus = $request->alacarte_focus ?? 1;
        $progress->alacarte_to = $request->alacarte_to ?? $request->alacarte_focus ?? 1;
        $progress->updated_at = now();
        $progress->save();

        if ($request->has('note_text') && !empty($request->note_text)) {
            ClientNote::create([
                'client_id' => $id,
                'note_text' => $request->note_text,
                'created_by' => 'admin'
            ]);
        }

        if ($request->notify_client === true) {
            $client = Client::find($id);
            if ($client && $client->email) {
                try {
                    $dashboardUrl = url('/tracking/login');
                    $htmlMessage = "
                        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;\">
                            <h2 style=\"color: #16d110; margin-bottom: 20px;\">Project Progress Update</h2>
                            <p style=\"color: #333; font-size: 16px;\">Hello <strong>{$client->name}</strong>,</p>
                            <p style=\"color: #555; font-size: 15px; line-height: 1.6;\">There is a new update regarding your project progress, which has just been updated by the Studio Tigapagi team.</p>
                            <p style=\"color: #555; font-size: 15px; line-height: 1.6;\">Please log in to the Client Dashboard to view the current status, deadlines, and the latest phase of your project:</p>
                            <div style=\"margin: 35px 0; text-align: center;\">
                                <a href=\"{$dashboardUrl}\" style=\"background-color: #16d110; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;\">Open Client Dashboard</a>
                            </div>
                            <hr style=\"border: none; border-top: 1px solid #eee; margin: 30px 0;\">
                            <p style=\"color: #888; font-size: 14px; line-height: 1.5;\">Warm regards,<br><strong style=\"color: #333;\">Studio Tigapagi</strong><br><em>Passionate Nocturnal Folks</em></p>
                        </div>
                    ";
                    
                    \Illuminate\Support\Facades\Mail::html($htmlMessage, function ($message) use ($client) {
                        $message->to($client->email)
                                ->bcc('info@studiotigapagi.com')
                                ->subject('Your Project Progress Update - Studio Tigapagi');
                    });
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Email notification failed: ' . $e->getMessage());
                }
            }
        }

        return response()->json(['success' => true]);
    }

    public function addNote(Request $request, $id)
    {
        if (!session()->has('admin') && session('client_id') != $id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate(['note_text' => 'required']);

        $note = ClientNote::create([
            'client_id' => $id,
            'note_text' => $request->note_text,
            'created_by' => session()->has('admin') ? 'admin' : 'client'
        ]);

        return response()->json(['success' => true, 'note' => $note]);
    }

    // ====== ADMIN ACCOUNTS MANAGEMENT ======

    public function getAdmins()
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        $currentUserId = session('admin_id');
        $admins = DB::table('admin')->select('id', 'username')->get();
        return response()->json(['admins' => $admins, 'current_id' => $currentUserId]);
    }

    public function addAdmin(Request $request)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        $request->validate([
            'username' => 'required',
            'password' => 'required|min:6'
        ]);

        $existing = DB::table('admin')->where('username', $request->username)->first();
        if ($existing) {
            return response()->json(['success' => false, 'message' => 'Username already exists.'], 400);
        }

        DB::table('admin')->insert([
            'username' => $request->username,
            'password' => md5($request->password)
        ]);

        return response()->json(['success' => true]);
    }

    public function updateAdminPassword(Request $request, $id)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        $request->validate([
            'password' => 'required|min:6'
        ]);

        // Optional: you can restrict so that an admin can only alter their own password
        // Or if there's a master admin, etc. Currently any admin can change any admin password.
        DB::table('admin')
            ->where('id', $id)
            ->update(['password' => md5($request->password)]);

        return response()->json(['success' => true]);
    }

    public function deleteAdmin($id)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);
        
        $currentUserId = session('admin_id');
        if ($currentUserId == $id) {
            return response()->json(['success' => false, 'message' => 'Cannot delete your own account.'], 400);
        }

        DB::table('admin')->where('id', $id)->delete();

        return response()->json(['success' => true]);
    }

    // ====== LANDING PAGE SETTINGS ======

    private function getSettingsPath()
    {
        return storage_path('app/landing_settings.json');
    }

    private function readLandingSettings()
    {
        $path = $this->getSettingsPath();
        if (file_exists($path)) {
            return json_decode(file_get_contents($path), true);
        }
        return [
            'popup_title' => "Let's Get Started",
            'popup_subtitle' => "Fill this up, and tell us about your brand .\nWe will approach you soon"
        ];
    }

    public function getLandingSettings()
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);
        return response()->json(['settings' => $this->readLandingSettings()]);
    }

    public function getPublicLandingSettings()
    {
        return response()->json(['settings' => $this->readLandingSettings()]);
    }

    public function saveLandingSettings(Request $request)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);
        
        $request->validate([
            'popup_title' => 'required|string',
            'popup_subtitle' => 'required|string'
        ]);

        $settings = [
            'popup_title' => $request->popup_title,
            'popup_subtitle' => $request->popup_subtitle
        ];

        try {
            $path = $this->getSettingsPath();
            $dir = dirname($path);
            if (!is_dir($dir)) {
                mkdir($dir, 0775, true);
            }
            file_put_contents($path, json_encode($settings, JSON_PRETTY_PRINT));
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function sendExpiryReminders()
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        try {
            \Illuminate\Support\Facades\Artisan::call('clients:send-expiry-reminders');
            $output = \Illuminate\Support\Facades\Artisan::output();
            return response()->json(['success' => true, 'output' => trim($output)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
