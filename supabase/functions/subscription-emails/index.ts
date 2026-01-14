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
        const { type, email, userName, planName, price, invoiceId, date } = await req.json()

        let subject = ""
        let htmlContent = ""
        let textContent = ""

        const logoUrl = "https://ayscroll.com/ayscroll-official-logo.png"
        const currentYear = new Date().getFullYear()

        if (type === 'upgrade') {
            subject = `Invoice for your AyScroll ${planName} Subscription 🧾`
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a202c; background-color: #f7fafc; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .header { background: #000000; padding: 40px; text-align: center; }
                        .header img { width: 140px; }
                        .content { padding: 40px; }
                        .greeting { font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #000; }
                        .sub-greeting { color: #718096; margin-bottom: 30px; }
                        .invoice-card { background: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 24px; margin-bottom: 30px; }
                        .invoice-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
                        .invoice-label { color: #718096; font-weight: 600; }
                        .invoice-value { color: #1a202c; font-weight: 700; }
                        .total-row { border-top: 1px solid #edf2f7; padding-top: 12px; margin-top: 12px; font-size: 18px; }
                        .total-label { font-weight: 800; }
                        .total-value { font-weight: 800; color: #ec4899; }
                        .button { display: inline-block; width: 100%; text-align: center; padding: 16px; background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; margin-top: 20px; box-sizing: border-box; }
                        .footer { padding: 30px; text-align: center; color: #a0aec0; font-size: 12px; background: #f8fafc; }
                        .feature-box { margin-top: 30px; border-left: 4px solid #f97316; padding-left: 20px; }
                        .feature-title { font-weight: 700; font-size: 14px; margin-bottom: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><img src="${logoUrl}" alt="AyScroll"></div>
                        <div class="content">
                            <h1 class="greeting">Welcome to the Pro Orbit! 🚀</h1>
                            <p class="sub-greeting">Hi ${userName}, your subscription to ${planName} is now active. Here is your transaction summary.</p>
                            
                            <div class="invoice-card">
                                <div class="invoice-row">
                                    <span class="invoice-label">Invoice ID</span>
                                    <span class="invoice-value">${invoiceId || 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                                </div>
                                <div class="invoice-row">
                                    <span class="invoice-label">Date</span>
                                    <span class="invoice-value">${date || new Date().toLocaleDateString()}</span>
                                </div>
                                <div class="invoice-row">
                                    <span class="invoice-label">Plan</span>
                                    <span class="invoice-value">${planName}</span>
                                </div>
                                <div class="total-row invoice-row">
                                    <span class="total-label">Total Amount</span>
                                    <span class="total-value">${price}</span>
                                </div>
                            </div>

                            <div class="feature-box">
                                <div class="feature-title">What's next?</div>
                                <p style="font-size: 14px; margin: 0; color: #4a5568;">You now have full access to AI recommendations, advanced analytics, and offline downloads. Start your journey now!</p>
                            </div>

                            <a href="https://ayscroll.com/topics" class="button">Start Learning</a>
                        </div>
                        <div class="footer">
                            <p>AyScroll • Global Learning Platform</p>
                            <p>© ${currentYear} AyScroll. All Rights Reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
            textContent = `Hi ${userName}, your AyScroll ${planName} subscription is active. Total: ${price}. Invoice: ${invoiceId}`
        } else if (type === 'downgrade') {
            subject = "Your AyScroll Subscription has been Cancelled 🕊️"
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; background-color: #f7fafc; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .header { background: #000000; padding: 30px; text-align: center; }
                        .header img { width: 100px; }
                        .content { padding: 40px; text-align: center; }
                        .title { font-size: 24px; font-weight: 800; color: #2d3748; margin-bottom: 20px; }
                        .text { color: #4a5568; margin-bottom: 30px; font-size: 16px; text-align: left; }
                        .button { display: inline-block; padding: 14px 30px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; }
                        .footer { padding: 30px; text-align: center; color: #a0aec0; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><img src="${logoUrl}" alt="AyScroll"></div>
                        <div class="content">
                            <h1 class="title">We're sorry to see you go!</h1>
                            <p class="text">Hi ${userName}, this is to confirm that your ${planName || 'Pro'} subscription has been cancelled. You will still have access to your features until the end of your current billing period.</p>
                            <p class="text">Your account has been moved to the Free plan. You can always come back and upgrade anytime!</p>
                            <a href="https://ayscroll.com/pricing" class="button">View Plans</a>
                        </div>
                        <div class="footer">
                            <p>The AyScroll Team</p>
                            <p>© ${currentYear} AyScroll. All Rights Reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
            textContent = `Hi ${userName}, your AyScroll subscription has been cancelled. You've been moved to the Free plan.`
        } else if (type === 'failed') {
            subject = "Payment Failed: Your AyScroll Subscription ⚠️"
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; background-color: #f7fafc; margin: 0; padding: 0 ; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .header { background: #000000; padding: 30px; text-align: center; }
                        .header img { width: 100px; }
                        .content { padding: 40px; }
                        .title { font-size: 24px; font-weight: 800; color: #e53e3e; margin-bottom: 20px; }
                        .text { color: #4a5568; margin-bottom: 30px; font-size: 16px; }
                        .button { display: inline-block; width: 100%; text-align: center; padding: 16px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-sizing: border-box; }
                        .footer { padding: 30px; text-align: center; color: #a0aec0; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><img src="${logoUrl}" alt="AyScroll"></div>
                        <div class="content">
                            <h1 class="title">Payment Unsuccessful</h1>
                            <p class="text">Hi ${userName}, we were unable to process your payment for the ${planName} plan. Don't worry, no charges were made from our side.</p>
                            <p class="text">This usually happens due to bank restrictions or temporary network issues. You can try again using a different payment method.</p>
                            <a href="https://ayscroll.com/pricing" class="button">Try Again</a>
                        </div>
                        <div class="footer">
                            <p>Need help? Reply to this email or contact support@ayscroll.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `
            textContent = `Hi ${userName}, your payment for AyScroll ${planName} failed. Please try again.`
        } else if (type === 'interrupted') {
            subject = "Complete your AyScroll Upgrade! ✨"
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; background-color: #f7fafc; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .header { background: #000000; padding: 30px; text-align: center; }
                        .header img { width: 100px; }
                        .content { padding: 40px; }
                        .title { font-size: 24px; font-weight: 800; color: #2d3748; margin-bottom: 20px; }
                        .text { color: #4a5568; margin-bottom: 30px; font-size: 16px; }
                        .button { display: inline-block; width: 100%; text-align: center; padding: 16px; background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-sizing: border-box; }
                        .footer { padding: 30px; text-align: center; color: #a0aec0; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><img src="${logoUrl}" alt="AyScroll"></div>
                        <div class="content">
                            <h1 class="title">Almost there!</h1>
                            <p class="text">Hi ${userName}, we noticed you started an upgrade to ${planName} but didn't finish the transaction. We've saved your progress!</p>
                            <p class="text">Complete your upgrade now to unlock all premium features and continue your learning journey.</p>
                            <a href="https://ayscroll.com/pricing" class="button">Complete Upgrade</a>
                        </div>
                        <div class="footer">
                            <p>© ${currentYear} AyScroll. All Rights Reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
            textContent = `Hi ${userName}, you have an incomplete upgrade to AyScroll ${planName}. Complete it now!`
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
                'cross-domain': 'true'
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
            console.error("Brevo Error:", error)
            throw new Error(error.message || 'Failed to send email')
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (error) {
        console.error("Function Error:", error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
