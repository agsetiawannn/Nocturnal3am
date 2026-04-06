<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
            border-top: none;
        }
        .info-row {
            margin: 15px 0;
            padding: 10px;
            background: white;
            border-radius: 4px;
        }
        .label {
            font-weight: bold;
            color: #667eea;
            display: inline-block;
            width: 140px;
        }
        .value {
            color: #333;
        }
        .section-title {
            font-weight: bold;
            color: #764ba2;
            font-size: 14px;
            margin-top: 25px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer {
            margin-top: 20px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 0 0 8px 8px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">🔔 New Contact Submission</h1>
    </div>
    
    <div class="content">
        <p>You have received a new contact form submission from your website.</p>
        
        <div class="section-title">Contact Info</div>
        
        <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">{{ $contact->name }}</span>
        </div>
        
        <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ $contact->email }}</span>
        </div>
        
        <div class="info-row">
            <span class="label">Phone:</span>
            <span class="value">{{ $contact->phone }}</span>
        </div>

        @if($contact->business_goals)
        <div class="section-title">Business Details</div>
        
        <div class="info-row">
            <span class="label">Business Goals:</span>
            <span class="value">{{ is_array($contact->business_goals) ? implode(', ', $contact->business_goals) : $contact->business_goals }}</span>
        </div>
        @endif

        @if($contact->others_text)
        <div class="info-row">
            <span class="label">Others (Custom):</span>
            <span class="value">{{ $contact->others_text }}</span>
        </div>
        @endif

        @if($contact->business_stage)
        <div class="info-row">
            <span class="label">Business Stage:</span>
            <span class="value">{{ $contact->business_stage }}</span>
        </div>
        @endif

        @if($contact->budget)
        <div class="info-row">
            <span class="label">Budget Range:</span>
            <span class="value">{{ $contact->budget }}</span>
        </div>
        @endif

        @if($contact->timeline)
        <div class="info-row">
            <span class="label">Timeline:</span>
            <span class="value">{{ $contact->timeline }}</span>
        </div>
        @endif

        @if($contact->additional_details)
        <div class="section-title">Additional Details</div>
        <div class="info-row">
            <span class="value">{{ $contact->additional_details }}</span>
        </div>
        @endif
        
        <div class="info-row">
            <span class="label">Submitted:</span>
            <span class="value">{{ $contact->created_at->format('d M Y, H:i') }}</span>
        </div>
        
        <p style="margin-top: 25px;">
            <a href="{{ url('/admin/contacts') }}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View All Contacts
            </a>
        </p>
    </div>
    
    <div class="footer">
        <p style="margin: 0;">This is an automated message from Studio Tigapagi website.</p>
    </div>
</body>
</html>
