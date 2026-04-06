<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Mail\NewContactNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ContactController extends Controller
{
    /**
     * Display all contacts for admin
     */
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        
        // Calculate statistics
        $todayCount = Contact::whereDate('created_at', Carbon::today())->count();
        $weekCount = Contact::whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->count();
        
        return view('admin.contacts', compact('contacts', 'todayCount', 'weekCount'));
    }

    /**
     * Store a newly created contact in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'business_goals' => 'nullable|array',
            'others_text' => 'nullable|string|max:255',
            'business_stage' => 'nullable|string|max:255',
            'budget' => 'nullable|string|max:255',
            'timeline' => 'nullable|string|max:255',
            'additional_details' => 'nullable|string|max:2000',
        ]);

        $contact = Contact::create($validated);

        // Send email notification
        try {
            // Send to admin email from .env
            $adminEmail = config('mail.admin_address', 'produksitigapagi@gmail.com');
            Mail::to($adminEmail)->send(new NewContactNotification($contact));
        } catch (\Exception $e) {
            // Log error but don't fail the submission
            Log::error('Failed to send contact notification email: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Your message has been sent successfully!'], 200);
    }

    /**
     * Remove the specified contact from storage
     */
    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return redirect()->route('admin.contacts')->with('success', 'Contact deleted successfully!');
    }
}
