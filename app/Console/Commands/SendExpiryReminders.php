<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Client;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendExpiryReminders extends Command
{
    protected $signature = 'clients:send-expiry-reminders';
    protected $description = 'Send email reminders to clients whose active_until is approaching (7 days, 3 days, 1 day)';

    public function handle()
    {
        $today = now()->startOfDay();
        $reminderDays = [7, 3, 1];

        $clients = Client::where('status', 'active')
            ->whereNotNull('active_until')
            ->get();

        $sentCount = 0;

        foreach ($clients as $client) {
            $activeUntil = \Carbon\Carbon::parse($client->active_until)->startOfDay();
            $daysLeft = $today->diffInDays($activeUntil, false);

            // Only send if daysLeft matches one of our reminder milestones
            // and we haven't already sent a reminder for this milestone
            if (in_array((int)$daysLeft, $reminderDays) && (int)$client->last_expiry_reminder !== (int)$daysLeft) {
                try {
                    $this->sendReminderEmail($client, (int)$daysLeft);
                    
                    // Update last_expiry_reminder to prevent duplicate sends
                    $client->last_expiry_reminder = (int)$daysLeft;
                    $client->save();
                    
                    $sentCount++;
                    $this->info("Sent {$daysLeft}-day reminder to {$client->name} ({$client->email})");
                } catch (\Exception $e) {
                    Log::error("Expiry reminder failed for client {$client->id}: " . $e->getMessage());
                    $this->error("Failed to send to {$client->email}: " . $e->getMessage());
                }
            }
        }

        $this->info("Done. Sent {$sentCount} reminder(s).");
        return 0;
    }

    private function sendReminderEmail(Client $client, int $daysLeft)
    {
        $loginUrl = url('/tracking/login');
        
        if ($daysLeft === 1) {
            $subject = 'Your Service Expires Tomorrow - Studio Tigapagi';
            $heading = 'Your service expires tomorrow!';
            $urgencyColor = '#f00000';
            $message = "This is a final reminder that your active service with Studio Tigapagi will expire <strong>tomorrow</strong>. Please contact us if you'd like to extend your service.";
        } elseif ($daysLeft === 3) {
            $subject = 'Your Service Expires in 3 Days - Studio Tigapagi';
            $heading = 'Your service expires in 3 days';
            $urgencyColor = '#ff8c00';
            $message = "Just a heads up — your active service with Studio Tigapagi will expire in <strong>3 days</strong>. Please reach out to us if you'd like to continue.";
        } else {
            $subject = 'Your Service Expires in 7 Days - Studio Tigapagi';
            $heading = 'Your service expires in 7 days';
            $urgencyColor = '#16d110';
            $message = "This is a friendly reminder that your active service with Studio Tigapagi will expire in <strong>7 days</strong>. Contact us anytime to discuss renewal.";
        }

        $activeUntilFormatted = \Carbon\Carbon::parse($client->active_until)->format('d F Y');

        $htmlMessage = "
            <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;\">
                <h2 style=\"color: {$urgencyColor}; margin-bottom: 20px;\">{$heading}</h2>
                <p style=\"color: #333; font-size: 16px;\">Hello <strong>{$client->name}</strong>,</p>
                <p style=\"color: #555; font-size: 15px; line-height: 1.6;\">{$message}</p>
                <div style=\"margin: 25px 0; padding: 15px; background: #f8f8f8; border-radius: 8px; border-left: 4px solid {$urgencyColor};\">
                    <p style=\"color: #333; font-size: 15px; margin: 0;\">
                        <strong>Service Active Until:</strong> {$activeUntilFormatted}
                    </p>
                </div>
                <p style=\"color: #555; font-size: 15px; line-height: 1.6;\">You can check your project dashboard anytime:</p>
                <div style=\"margin: 25px 0; text-align: center;\">
                    <a href=\"{$loginUrl}\" style=\"background-color: #16d110; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;\">Open Client Dashboard</a>
                </div>
                <hr style=\"border: none; border-top: 1px solid #eee; margin: 30px 0;\">
                <p style=\"color: #888; font-size: 14px; line-height: 1.5;\">Warm regards,<br><strong style=\"color: #333;\">Studio Tigapagi</strong><br><em>Passionate Nocturnal Folks</em></p>
            </div>
        ";

        Mail::html($htmlMessage, function ($mail) use ($client, $subject) {
            $mail->to($client->email)->subject($subject);
        });
    }
}
