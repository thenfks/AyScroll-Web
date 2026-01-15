import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BRAND_GRADIENT = "linear-gradient(135deg, #ec4899 0%, #f97316 100%)";
const LOGO_URL = "https://ayscroll.com/ayscroll-official-logo.png";
const PRIMARY_COLOR = "#ec4899";

const generateFooter = (email: string, currentYear: number) => {
    const uniqueId = Math.random().toString(36).substring(7);
    return `
    <div style="margin-top: 60px; text-align: center;">
        <p style="color: #4a5568; margin-bottom: 24px; font-size: 15px; line-height: 1.6;">We're here to make your experience amazing.</p>
        <p style="color: #4a5568; margin-bottom: 24px; font-size: 15px; line-height: 1.6;"> If you have any questions or feedback send up a mail on<br>
            <a href="mailto:support@ayscroll.com" style="color: #4a5568; text-decoration: none; font-weight: 600;">support@ayscroll.com</a>
        </p>
        <p style="color: #4a5568; margin-bottom: 32px; font-size: 15px;">we'd love to hear from you!</p>
        
        <p style="color: #4a5568; margin-bottom: 8px; font-size: 15px;">Thanks and Regards,</p>
        <p style="color: #1a202c; font-weight: 800; font-size: 16px; margin-bottom: 40px; margin-top: 0;">Mayank Kumar Jha</p>
        
        <div style="border-top: 1px solid #e2e8f0; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto;"></div>

        <img src="${LOGO_URL}" alt="AyScroll" style="width: 45px; margin-bottom: 12px;">
        <div style="font-size: 16px; font-weight: 800; color: #1a202c; margin-bottom: 4px; letter-spacing: -0.02em;">AyScroll</div>
        <div style="font-size: 13px; color: #718096; margin-bottom: 16px;">Bhopal, Madhya Pradesh, India</div>
        <div style="font-size: 13px; color: #718096; margin-bottom: 8px;">This email was sent to <a href="mailto:${email}" style="color: #3182ce; text-decoration: none; font-weight: 600;">${email}</a>.</div>
        <div style="font-size: 12px; color: #a0aec0; margin-bottom: 24px;">You've received this email because you've subscribed to our newsletter.</div>
        <div style="font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 24px;">
            <a href="https://ayscroll.com/privacy" style="color: #4a5568; text-decoration: none;">Privacy</a> &nbsp; • &nbsp; 
            <a href="https://ayscroll.com/terms" style="color: #4a5568; text-decoration: none;">Terms</a> &nbsp; • &nbsp; 
            <a href="mailto:support@ayscroll.com" style="color: #4a5568; text-decoration: none;">Help</a>
        </div>
        <div style="font-size: 12px; color: #a0aec0; padding-bottom: 20px;">© ${currentYear} AyScroll. All Rights Reserved.</div>
        <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${uniqueId} </div>
    </div>
`;
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { type, email, userName, planName, price, invoiceId, date } = await req.json()

        let subject = ""
        let htmlContent = ""
        let textContent = ""

        const currentYear = new Date().getFullYear()

        if (type === 'upgrade') {
            subject = `Welcome to AyScroll Pro! 🚀`
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a202c; margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                        table { border-collapse: collapse; }
                        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                        .container { max-width: 600px; margin: 0 auto; width: 100%; }
                        .header { padding: 40px 20px 20px; text-align: center; }
                        .logo { width: 45px; margin-bottom: 12px; }
                        .brand-name { color: #1a202c; font-size: 18px; font-weight: 900; letter-spacing: 0.1em; margin: 0; }
                        .hero { padding: 20px 20px 40px; text-align: center; color: #1a202c; }
                        .hero-title { font-size: 32px; font-weight: 900; margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.2; color: #1a202c; }
                        .hero-subtitle { color: #4a5568; font-size: 16px; margin: 0 auto; max-width: 450px; }
                        .content { padding: 0 20px 40px; }
                        .invoice-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px; margin-bottom: 40px; }
                        .invoice-table { width: 100%; }
                        .invoice-label { color: #718096; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; padding-bottom: 12px; }
                        .invoice-value { color: #1a202c; font-weight: 800; font-size: 15px; text-align: right; padding-bottom: 12px; }
                        .total-row-cell { border-top: 1px dashed #e2e8f0; padding-top: 20px; margin-top: 20px; }
                        .total-label { font-size: 14px; font-weight: 900; color: #718096; text-transform: uppercase; }
                        .total-value { font-size: 28px; font-weight: 900; color: ${PRIMARY_COLOR}; text-align: right; }
                        .feature-grid { margin-bottom: 40px; }
                        .feature-item { display: table; width: 100%; margin-bottom: 24px; }
                        .feature-icon-cell { display: table-cell; width: 56px; vertical-align: top; }
                        .feature-icon { width: 44px; height: 44px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
                        .feature-text-cell { display: table-cell; vertical-align: top; padding-left: 16px; }
                        .feature-text h4 { margin: 0 0 4px; font-size: 16px; font-weight: 800; color: #1a202c; }
                        .feature-text p { margin: 0; font-size: 14px; color: #718096; line-height: 1.6; }
                        .button { display: block; text-align: center; padding: 20px; background: ${BRAND_GRADIENT}; color: #ffffff !important; text-decoration: none; border-radius: 18px; font-weight: 800; font-size: 17px; box-shadow: 0 10px 20px rgba(236, 72, 153, 0.15); }
                        
                        @media screen and (max-width: 600px) {
                            .hero-title { font-size: 26px !important; }
                            .hero-subtitle { font-size: 15px !important; }
                            .content { padding: 0 15px 30px !important; }
                            .invoice-card { padding: 24px !important; }
                            .total-value { font-size: 24px !important; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="${LOGO_URL}" alt="AyScroll" class="logo">
                            <h2 class="brand-name">AYSCROLL</h2>
                        </div>
                        <div class="hero">
                            <h1 class="hero-title">Welcome to the Pro Experience! 🚀</h1>
                            <p class="hero-subtitle">Hi ${userName}, you've successfully upgraded to ${planName}. Your micro-learning adventure just leveled up.</p>
                        </div>
                        <div class="content">
                            <div class="invoice-card">
                                <table class="invoice-table">
                                    <tr>
                                        <td class="invoice-label">Invoice ID</td>
                                        <td class="invoice-value">#${invoiceId || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td class="invoice-label">Billing Date</td>
                                        <td class="invoice-value">${date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                    </tr>
                                    <tr>
                                        <td class="invoice-label" style="padding-bottom: 20px;">Plan details</td>
                                        <td class="invoice-value" style="padding-bottom: 20px;">${planName}</td>
                                    </tr>
                                    <tr>
                                        <td class="total-row-cell total-label">Total Paid</td>
                                        <td class="total-row-cell total-value">${price}</td>
                                    </tr>
                                </table>
                            </div>

                            <h3 style="margin-bottom: 24px; font-weight: 900; font-size: 20px; color: #1a202c; letter-spacing: -0.01em;">Your New Superpowers:</h3>
                            <div class="feature-grid">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                                    <tr>
                                        <td width="60" valign="top" style="padding-bottom: 24px;">
                                            <div style="width: 44px; height: 44px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; text-align: center; line-height: 44px; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">🧠</div>
                                        </td>
                                        <td valign="top" style="padding-left: 16px; padding-bottom: 24px;">
                                            <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 800; color: #1a202c;">AI Knowledge Analyser</h4>
                                            <p style="margin: 0; font-size: 14px; color: #718096; line-height: 1.6;">Get deep insights and automatically generated mind-maps from every video you watch.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="60" valign="top" style="padding-bottom: 24px;">
                                            <div style="width: 44px; height: 44px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; text-align: center; line-height: 44px; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">📁</div>
                                        </td>
                                        <td valign="top" style="padding-left: 16px; padding-bottom: 24px;">
                                            <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 800; color: #1a202c;">Unlimited Resources</h4>
                                            <p style="margin: 0; font-size: 14px; color: #718096; line-height: 1.6;">Access full PDF summaries, reference materials, and source links for all lessons.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="60" valign="top" style="padding-bottom: 20px;">
                                            <div style="width: 44px; height: 44px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; text-align: center; line-height: 44px; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">📱</div>
                                        </td>
                                        <td valign="top" style="padding-left: 16px; padding-bottom: 20px;">
                                            <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 800; color: #1a202c;">Smart Flashcards</h4>
                                            <p style="margin: 0; font-size: 14px; color: #718096; line-height: 1.6;">Spaced repetition flashcards generated specifically for your learning profile.</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <a href="https://ayscroll.com/profile" class="button">Access Pro Dashboard</a>
                        </div>
                        ${generateFooter(email, currentYear)}
                    </div>
                </body>
                </html>
            `
            textContent = `Hi ${userName}, Welcome to AyScroll Pro! You've successfully upgraded to ${planName}. Invoice #${invoiceId}. Access your dashboard at https://ayscroll.com`
        } else if (type === 'downgrade') {
            subject = "Confirmation: Your Pro access has changed 🕊️"
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #1a202c; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; width: 100%; }
                        .header { padding: 40px 20px 0; text-align: center; }
                        .logo { width: 45px; }
                        .content { padding: 30px 20px 40px; text-align: center; }
                        .title { font-size: 24px; font-weight: 900; color: #1a202c; margin-bottom: 20px; line-height: 1.2; }
                        .text { color: #4a5568; margin-bottom: 30px; font-size: 15px; text-align: center; }
                        .card { background: #fffcf0; border: 1px solid #feebc8; border-radius: 16px; padding: 24px; margin-bottom: 30px; text-align: left; }
                        .card-title { font-weight: 800; color: #c05621; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
                        .button { display: inline-block; padding: 18px 40px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 15px; }
                        @media screen and (max-width: 600px) {
                            .title { font-size: 20px !important; }
                            .content { padding: 20px 15px 30px !important; }
                            .button { display: block; padding: 16px 20px !important; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><img src="${LOGO_URL}" alt="AyScroll" class="logo"></div>
                        <div class="content">
                            <h1 class="title">We're sorry to see you go!</h1>
                            <p class="text">Hi ${userName}, this is to confirm that your ${planName} subscription has been cancelled. You will still have access to your features until the end of your current billing period.</p>
                            
                            <div class="card">
                                <div class="card-title">💡 Did you know?</div>
                                <p style="margin: 0; font-size: 14px; color: #744210; line-height: 1.6;">All your saved flashcards and AI insights will be archived. You can reactivate your subscription anytime to unlock them again.</p>
                            </div>

                            <p class="text">Your account has been moved to the Free plan.</p>
                            <a href="https://ayscroll.com/profile" class="button">Manage Account</a>
                        </div>
                        ${generateFooter(email, currentYear)}
                    </div>
                </body>
                </html>
            `
            textContent = `Hi ${userName}, your AyScroll ${planName} subscription has been cancelled. You've been moved to the Free plan.`
        } else if (type === 'failed') {
            subject = "Action Required: Payment Failed ⚠️"
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #1a202c; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; width: 100%; }
                        .header { padding: 40px 20px 0; text-align: center; }
                        .icon { font-size: 48px; margin-bottom: 10px; }
                        .content { padding: 20px 20px 40px; text-align: center; }
                        .title { font-size: 26px; font-weight: 900; color: #c53030; margin-bottom: 20px; line-height: 1.2; }
                        .text { color: #4a5568; margin-bottom: 30px; font-size: 15px; }
                        .button { display: block; padding: 18px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 16px; }
                        @media screen and (max-width: 600px) {
                            .title { font-size: 22px !important; }
                            .content { padding: 20px 15px 30px !important; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><div class="icon">⚠️</div></div>
                        <div class="content">
                            <h1 class="title">Payment Unsuccessful</h1>
                            <p class="text">Hi ${userName}, we were unable to process your recent payment for the ${planName} plan. Don't worry, your progress is safe!</p>
                            <p class="text" style="font-weight: 600;">This usually happens due to temporary bank restrictions. You can try again using the button below.</p>
                            <a href="https://ayscroll.com/profile" class="button">Update Payment Method</a>
                        </div>
                        ${generateFooter(email, currentYear)}
                    </div>
                </body>
                </html>
            `
            textContent = `Hi ${userName}, your payment for AyScroll ${planName} failed. Please update your payment method at https://ayscroll.com/profile`
        } else if (type === 'interrupted') {
            subject = "Don't miss your upgrade! ✨"
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #1a202c; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; width: 100%; }
                        .header { padding: 40px 20px 10px; text-align: center; }
                        .logo { width: 45px; }
                        .content { padding: 20px 20px 40px; text-align: center; }
                        .title { font-size: 28px; font-weight: 900; color: #1a202c; margin-bottom: 20px; line-height: 1.2; letter-spacing: -0.02em; }
                        .text { color: #4a5568; margin-bottom: 30px; font-size: 15px; }
                        .button { display: block; padding: 20px; background: ${BRAND_GRADIENT}; color: #ffffff !important; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(236, 72, 153, 0.15); }
                        @media screen and (max-width: 600px) {
                            .title { font-size: 22px !important; }
                            .content { padding: 20px 15px 30px !important; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><img src="${LOGO_URL}" alt="AyScroll" class="logo"></div>
                        <div class="content">
                            <h1 class="title">Almost there, ${userName}!</h1>
                            <p class="text">We noticed you started your upgrade to ${planName} but didn't quite finish. We're holding your spot!</p>
                            <p style="font-weight: 700; color: #1a202c; margin-bottom: 30px; font-size: 15px;">Upgrade now to get 24/7 access to AI Knowledge Analyser and Smart Flashcards.</p>
                            <a href="https://ayscroll.com/profile" class="button">Finish Upgrading</a>
                        </div>
                        ${generateFooter(email, currentYear)}
                    </div>
                </body>
                </html>
            `
            textContent = `Hi ${userName}, you have an incomplete upgrade to AyScroll ${planName}. Complete it now at https://ayscroll.com`
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: "AyScroll", email: "noreply@ayscroll.com" },
                to: [{ email: email, name: userName || 'User' }],
                subject: subject,
                htmlContent: htmlContent,
                textContent: textContent
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Brevo Error:", errorText)
            throw new Error(`Failed to send email: ${errorText}`)
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Function Error:", msg)
        return new Response(JSON.stringify({ error: msg }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
