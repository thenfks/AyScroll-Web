// Supabase Edge Function: send-welcome-email
// Sends a welcome email to new users via Brevo's transactional email API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { email, firstName, lastName } = await req.json()

        // Send welcome email via Brevo's transactional email API
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: "AyScroll Team",
                    email: "support@ayscroll.com"
                },
                to: [
                    {
                        email: email,
                        name: firstName ? `${firstName} ${lastName || ''}`.trim() : email
                    }
                ],
                subject: "Welcome to AyScroll! 🎉",
                htmlContent: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                            }
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                background-color: #ffffff;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 40px 20px;
                            }
                            .logo-section {
                                text-align: center;
                                margin-bottom: 40px;
                            }
                            .logo-section img {
                                width: 120px;
                                height: auto;
                                margin-bottom: 30px;
                            }
                            .greeting {
                                font-size: 32px;
                                font-weight: 600;
                                color: #2d3748;
                                text-align: center;
                                margin-bottom: 10px;
                            }
                            .greeting .firstname {
                                background-color: #f7fafc;
                                padding: 2px 8px;
                                border-radius: 4px;
                            }
                            .welcome-text {
                                text-align: center;
                                font-size: 16px;
                                color: #4a5568;
                                margin-bottom: 10px;
                            }
                            .welcome-text .emoji {
                                font-size: 20px;
                            }
                            .tagline {
                                text-align: center;
                                font-size: 15px;
                                color: #4a5568;
                                margin-bottom: 40px;
                            }
                            .mission-statement {
                                text-align: center;
                                margin: 30px 0;
                            }
                            .mission-statement p {
                                font-size: 15px;
                                color: #4a5568;
                                margin-bottom: 5px;
                            }
                            .mission-statement .highlight {
                                font-weight: 600;
                                color: #2d3748;
                            }
                            .welcome-image {
                                width: 100%;
                                max-width: 550px;
                                height: auto;
                                margin: 30px auto;
                                display: block;
                                border-radius: 8px;
                            }
                            .section-title {
                                font-size: 20px;
                                font-weight: 600;
                                color: #2d3748;
                                text-align: center;
                                margin: 40px 0 20px;
                            }
                            .description {
                                text-align: center;
                                font-size: 15px;
                                color: #4a5568;
                                margin-bottom: 15px;
                                line-height: 1.7;
                            }
                            .info-box {
                                background-color: #f7fafc;
                                border: 2px dashed #cbd5e0;
                                border-radius: 8px;
                                padding: 20px;
                                margin: 30px 0;
                                text-align: center;
                                font-size: 14px;
                                color: #4a5568;
                                line-height: 1.7;
                            }
                            .divider {
                                height: 1px;
                                background-color: #e2e8f0;
                                margin: 30px 0;
                            }
                            .cta-button {
                                display: inline-block;
                                background-color: #2d3748;
                                color: #ffffff !important;
                                text-decoration: none;
                                padding: 14px 50px;
                                border-radius: 6px;
                                font-weight: 500;
                                font-size: 15px;
                                margin: 20px 0;
                                text-align: center;
                            }
                            .cta-section {
                                text-align: center;
                                margin: 30px 0;
                            }
                            .support-text {
                                text-align: center;
                                font-size: 15px;
                                color: #4a5568;
                                margin: 30px 0;
                                line-height: 1.7;
                            }
                            .support-text a {
                                color: #4a5568;
                                text-decoration: none;
                            }
                            .closing {
                                text-align: center;
                                font-size: 15px;
                                color: #4a5568;
                                margin: 30px 0 10px;
                            }
                            .signature {
                                text-align: center;
                                font-size: 15px;
                                color: #2d3748;
                                font-weight: 500;
                            }
                            .footer {
                                margin-top: 50px;
                                padding: 30px 20px;
                                background-color: #f7fafc;
                                border: 2px dashed #cbd5e0;
                                border-radius: 8px;
                                text-align: center;
                            }
                            .footer-logo {
                                width: 60px;
                                height: auto;
                                margin-bottom: 15px;
                            }
                            .footer-brand {
                                font-size: 18px;
                                font-weight: 600;
                                color: #2d3748;
                                margin-bottom: 10px;
                            }
                            .footer-location {
                                font-size: 13px;
                                color: #718096;
                                margin-bottom: 15px;
                            }
                            .footer-email {
                                font-size: 13px;
                                color: #718096;
                                margin-bottom: 5px;
                            }
                            .footer-disclaimer {
                                font-size: 12px;
                                color: #a0aec0;
                                margin-top: 15px;
                            }
                            .footer-unsubscribe {
                                font-size: 13px;
                                color: #4a5568;
                                margin-top: 10px;
                            }
                            .footer-unsubscribe a {
                                color: #4a5568;
                                text-decoration: underline;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <!-- Logo Section -->
                            <div class="logo-section">
                                <img src="https://ayscroll.com/ayscroll-official-logo.png" alt="AyScroll Logo">
                            </div>
                            
                            <!-- Greeting -->
                            <h1 class="greeting">Hey <span class="firstname">${firstName || 'there'}</span>,</h1>
                            
                            <!-- Welcome Text -->
                            <p class="welcome-text">Welcome to AyScroll <span class="emoji">👋</span></p>
                            <p class="tagline">We're excited to have you on board.</p>
                            
                            <!-- Mission Statement -->
                            <div class="mission-statement">
                                <p>AyScroll is built with a simple but powerful idea:</p>
                                <p class="highlight">scrolling shouldn't be mindless — it should be meaningful</p>
                            </div>
                            
                            <!-- Welcome Image -->
                            <img src="https://ayscroll.com/images/welcome-onboard.png" alt="Welcome on Board" class="welcome-image">
                            
                            <!-- What is AyScroll Section -->
                            <h2 class="section-title">What is AyScroll?</h2>
                            <p class="description">
                                AyScroll is a next-generation content discovery platform designed to help you.
                            </p>
                            <p class="description">
                                It means <strong>you're part of shaping AyScroll from the ground up.</strong>
                            </p>
                            
                            <!-- Info Box -->
                            <div class="info-box">
                                We're excited to have you join our community. You can expect exclusive offers and newsletter to learn more about our activity.
                            </div>
                            
                            <!-- Divider -->
                            <div class="divider"></div>
                            
                            <!-- CTA Button -->
                            <div class="cta-section">
                                <a href="https://ayscroll.com" class="cta-button">Scroll to Learn</a>
                            </div>
                            
                            <!-- Support Text -->
                            <p class="support-text">
                                We're here to make your experience amazing.
                            </p>
                            <p class="support-text">
                                If you have any questions or feedback send up a mail on<br>
                                <a href="mailto:support@ayscroll.com">support@ayscroll.com</a>
                            </p>
                            <p class="support-text">
                                we'd love to hear from you!
                            </p>
                            
                            <!-- Closing -->
                            <p class="closing">Thanks and Regards,</p>
                            <p class="signature">Mayank Kumar Jha,</p>
                            
                            <!-- Footer -->
                            <div class="footer">
                                <img src="https://ayscroll.com/ayscroll-official-logo.png" alt="AyScroll Logo" class="footer-logo">
                                <div class="footer-brand">AyScroll</div>
                                <div class="footer-location">Bhopal, Madhya Pradesh, India</div>
                                <div class="footer-email">This email was sent to <strong>${email}</strong>.</div>
                                <div class="footer-disclaimer">You've received this email because you've subscribed to our newsletter.</div>
                                <div class="footer-unsubscribe">
                                    <a href="https://ayscroll.com/unsubscribe">Unsubscribe</a>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                textContent: `
Hey ${firstName || 'there'},

Welcome to AyScroll 👋
We're excited to have you on board.

AyScroll is built with a simple but powerful idea:
scrolling shouldn't be mindless — it should be meaningful

What is AyScroll?

AyScroll is a next-generation content discovery platform designed to help you.

It means you're part of shaping AyScroll from the ground up.

We're excited to have you join our community. You can expect exclusive offers and newsletter to learn more about our activity.

---

Scroll to Learn: https://ayscroll.com

We're here to make your experience amazing.

If you have any questions or feedback send up a mail on
support@ayscroll.com

we'd love to hear from you!

Thanks and Regards,
Mayank Kumar Jha,

---

AyScroll
Bhopal, Madhya Pradesh, India

This email was sent to ${email}.
You've received this email because you've subscribed to our newsletter.

Unsubscribe: https://ayscroll.com/unsubscribe
                `.trim()
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send welcome email')
        }

        return new Response(
            JSON.stringify({ message: 'Welcome email sent successfully', email }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )
    } catch (error) {
        console.error('Error sending welcome email:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
