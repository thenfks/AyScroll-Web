// Supabase Edge Function: brevo-add-contact
// Deploy this to: supabase/functions/brevo-add-contact/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!
const BREVO_LIST_ID = 2 // Your Brevo contact list ID

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

        // Add contact to Brevo
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email,
                attributes: {
                    FIRSTNAME: firstName || '',
                    LASTNAME: lastName || '',
                },
                listIds: [BREVO_LIST_ID],
                updateEnabled: true, // Update if contact already exists
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            // If contact already exists, that's okay
            if (data.code === 'duplicate_parameter') {
                return new Response(
                    JSON.stringify({ message: 'Contact already exists', email }),
                    {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200
                    }
                )
            }
            throw new Error(data.message || 'Failed to add contact')
        }

        return new Response(
            JSON.stringify({ message: 'Contact added successfully', email }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
