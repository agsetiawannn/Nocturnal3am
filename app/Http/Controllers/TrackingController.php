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
            session(['client_id' => $client->id, 'client_name' => $client->name]);
            return response()->json(['success' => true, 'client' => $client]);
        }
        
        return response()->json(['success' => false, 'message' => 'Email tidak terdaftar atau tidak aktif.'], 401);
    }

    public function adminLogin(Request $request)
    {
        $request->validate(['password' => 'required']);
        
        // Admin logic mapping from old system (or use hardcoded password if it was)
        $admin = DB::table('admins')->where('password', md5($request->password))->first();
        
        if ($admin) {
            session(['admin' => true, 'admin_id' => $admin->id]);
            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false, 'message' => 'Password salah.'], 401);
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

    public function saveProgress(Request $request, $id)
    {
        if (!session()->has('admin')) return response()->json(['message' => 'Unauthorized'], 401);

        $progress = ClientProgress::firstOrNew(['client_id' => $id]);
        $progress->onboard = json_encode($request->onboard ?? []);
        $progress->presprint = json_encode($request->presprint ?? []);
        $progress->sprint = json_encode($request->sprint ?? []);
        $progress->client_view = $request->client_view ?? 'onboard';
        $progress->sprint_week_focus = $request->sprint_week_focus ?? 1;
        $progress->updated_at = now();
        $progress->save();

        if ($request->has('note_text') && !empty($request->note_text)) {
            ClientNote::create([
                'client_id' => $id,
                'note_text' => $request->note_text,
                'created_by' => 'admin'
            ]);
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
}
