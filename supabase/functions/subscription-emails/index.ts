import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { type, email, userName, planName, price } = await req.json()

        let subject = ""
        let htmlContent = ""
        let textContent = ""

        if (type === 'upgrade') {
            subject = "Welcome to AyScroll Pro! 🎉"
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .header { text-align: center; margin-bottom: 40px; }
                        .header img { width: 120px; margin-bottom: 20px; }
                        .card { background: #101010; color: white; padding: 40px; border-radius: 32px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
                        .tier-badge { display: inline-block; padding: 6px 16px; border-radius: 99px; background: rgba(236, 72, 153, 0.1); color: #ec4899; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-size: 10px; margin-bottom: 20px; }
                        .title { font-size: 32px; font-weight: 900; margin-bottom: 10px; letter-spacing: -1px; }
                        .price { color: rgba(255,255,255,0.4); font-size: 14px; font-weight: 700; margin-bottom: 30px; }
                        .feature-list { text-align: left; background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin-bottom: 30px; }
                        .feature-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 14px; color: rgba(255,255,255,0.7); }
                        .footer { margin-top: 50px; text-align: center; color: #718096; font-size: 12px; }
                        .button { display: inline-block; padding: 16px 40px; background: linear-gradient(to right, #ec4899, #f97316); color: white !important; text-decoration: none; border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><img src="https://ayscroll.com/ayscroll-official-logo.png" alt="AyScroll"></div>
                        <div class="card">
                            <div class="tier-badge">${planName} Activated</div>
                            <h1 class="title">You're in the Orbit! 🦅</h1>
                            <p class="price">${price || '₹499'} / Monthly</p>
                            <div class="feature-list">
                                <div class="feature-item">✅ Unlimited lesson access</div>
                                <div class="feature-item">✅ AI-powered recommendations</div>
                                <div class="feature-item">✅ Advanced analytics</div>
                                <div class="feature-item">✅ Offline download</div>
                            </div>
                            <a href="https://ayscroll.com/topics" class="button">Access All Topics</a>
                        </div>
                        <div class="footer">
                            <p>AyScroll • Bhopal, Madhya Pradesh, India</p>
                            <p>© 2026 AyScroll. All Rights Reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
            textContent = `Welcome to AyScroll Pro, ${userName}! Your subscription is now active.`
        } else if (type === 'downgrade') {
            subject = "Your AyScroll Subscription has changed"
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .header { text-align: center; margin-bottom: 40px; }
                        .card { background: #f7fafc; padding: 40px; border-radius: 32px; text-align: center; border: 1px solid #e2e8f0; }
                        .title { font-size: 24px; font-weight: 800; color: #2d3748; margin-bottom: 15px; }
                        .text { color: #4a5568; margin-bottom: 25px; }
                        .button { display: inline-block; padding: 14px 30px; background: #2d3748; color: white !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; }
                        .footer { margin-top: 50px; text-align: center; color: #a0aec0; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><img src="https://ayscroll.com/ayscroll-official-logo.png" alt="AyScroll" width="80"></div>
                        <div class="card">
                            <h1 class="title">Subscription Canceled</h1>
                            <p class="text">Your ${planName || 'Pro'} subscription has been canceled and you've been moved to the Free plan. We're sorry to see you go!</p>
                            <p class="text">You can rejoin the Pro orbit anytime to get back your exclusive features.</p>
                            <a href="https://ayscroll.com/pricing" class="button">View Plans</a>
                        </div>
                        <div class="footer">
                            <p>AyScroll Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `
            textContent = `Your AyScroll subscription has been canceled. You have been moved to the Free plan.`
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: "AyScroll", email: "support@ayscroll.com" },
                to: [{ email: email, name: userName }],
                subject: subject,
                htmlContent: htmlContent,
                textContent: textContent
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to send email')
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
