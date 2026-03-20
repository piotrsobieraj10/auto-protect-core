import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a73e8">Nowy protokół odbioru - AutoSafe</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Marka:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_brand}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Model:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_model}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">VIN:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_vin}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Rocznik:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_year}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Nr rejestracyjny:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_registration}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Urządzenia:</td><td style="padding:8px;border-bottom:1px solid #eee">${(data.devices || []).join(', ')}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Data aktualizacji:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.device_update_date || '—'}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Nr programu:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.program_number || '—'}</td></tr>
        </table>
        ${data.additional_notes ? `<p style="margin-top:16px"><strong>Uwagi:</strong> ${data.additional_notes}</p>` : ''}
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'AutoSafe <onboarding@resend.dev>',
        to: ['piotrsobieraj10@gmail.com'],
        subject: `Protokół: ${data.vehicle_brand} ${data.vehicle_model} - ${data.vehicle_registration}`,
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error('Resend error:', result);
      return new Response(JSON.stringify({ error: 'Email failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
