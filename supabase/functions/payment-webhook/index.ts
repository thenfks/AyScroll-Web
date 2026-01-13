import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            // Supabase API URL - Env var automatically populated by Supabase
            Deno.env.get('SUPABASE_URL') ?? '',
            // Supabase Service Role Key - Env var automatically populated by Supabase
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get the Request Body
        const body = await req.json()
        console.log("PAYMENT WEBHOOK RECEIVED:", JSON.stringify(body, null, 2));

        // 2. Validate Event Type
        const eventType = body.event || body.type; // Adapt to gateway format
        if (eventType !== 'payment.success' && eventType !== 'checkout.session.completed') {
            return new Response(
                JSON.stringify({ message: 'Event ignored', event: eventType }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // 3. Extract User & Plan Details
        // Adjust this based on exactly what NFKS Gateway sends. 
        // Assuming standard format: payload.customer.user_id OR payload.metadata.user_id
        const data = body.payload || body.data || body;

        // Look for user_id in likely places
        const userId = data.customer?.user_id || data.metadata?.user_id || data.user_id;
        const planId = data.plan_id || data.metadata?.plan_id || 'pro'; // Default to Pro if missing

        if (!userId) {
            throw new Error("Missing user_id in webhook payload");
        }

        console.log(`Processing Upgrade for User: ${userId} to Plan: ${planId}`);

        // 4. Update Database (RLS Bypassed via Service Role)
        const { error: dbError } = await supabaseClient
            .from('user_profiles')
            .update({
                subscription_tier: planId,
                subscription_status: 'active',
                subscription_start_date: new Date().toISOString(),
                subscription_end_date: null, // or calculate +1 month/year
            })
            .eq('id', userId);

        if (dbError) {
            console.error("DB Update Failed:", dbError);
            throw dbError;
        }

        // 5. Update Auth Metadata (Optional but recommended)
        const { error: authError } = await supabaseClient.auth.admin.updateUserById(
            userId,
            { user_metadata: { is_pro: true, tier: planId } }
        )

        if (authError) {
            console.error("Auth Metadata Update Failed:", authError);
            // We don't throw here, as DB update is more critical
        }

        // 6. Trigger Subscription Email
        try {
            const { data: userData } = await supabaseClient.auth.admin.getUserById(userId);
            if (userData?.user) {
                const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
                const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

                console.log(`Sending Upgrade Email to: ${userData.user.email}`);

                fetch(`${supabaseUrl}/functions/v1/subscription-emails`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${serviceRoleKey}`
                    },
                    body: JSON.stringify({
                        type: 'upgrade',
                        email: userData.user.email,
                        userName: userData.user.user_metadata?.full_name || 'User',
                        planName: planId === 'go' ? 'AyScroll Go' : 'AyScroll Pro',
                        price: planId === 'go' ? '₹299' : '₹499'
                    })
                }).catch(e => console.error("Email trigger failed:", e));
            }
        } catch (emailErr) {
            console.error("Failed to trigger subscription email:", emailErr);
        }

        return new Response(
            JSON.stringify({ success: true, message: "User upgraded successfully" }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        console.error("Webhook Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
