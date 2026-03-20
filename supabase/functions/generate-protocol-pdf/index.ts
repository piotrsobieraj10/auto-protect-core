import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { protocol } = await req.json();
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(26, 115, 232);
    doc.text("AutoSafe", 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Protokół odbioru pracy", 20, 32);

    doc.setDrawColor(26, 115, 232);
    doc.line(20, 36, 190, 36);

    // Date
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Data: ${new Date(protocol.created_at).toLocaleDateString("pl-PL")}`, 150, 25);

    // Vehicle info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Dane pojazdu", 20, 48);

    doc.setFontSize(10);
    const fields = [
      ["Marka", protocol.vehicle_brand],
      ["Model", protocol.vehicle_model],
      ["VIN", protocol.vehicle_vin],
      ["Rocznik", String(protocol.vehicle_year)],
      ["Nr rejestracyjny", protocol.vehicle_registration],
    ];

    let y = 56;
    fields.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(0);
      doc.text(value || "—", 70, y);
      y += 7;
    });

    // Devices
    y += 5;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Montowane urządzenia", 20, y);
    y += 8;
    doc.setFontSize(10);
    (protocol.devices || []).forEach((device: string) => {
      doc.setTextColor(0);
      doc.text(`• ${device}`, 25, y);
      y += 6;
    });

    y += 3;
    doc.setTextColor(100);
    doc.text(`Data aktualizacji: ${protocol.device_update_date || "—"}`, 20, y);
    y += 7;
    doc.text(`Nr programu: ${protocol.program_number || "—"}`, 20, y);

    // Notes
    if (protocol.additional_notes) {
      y += 12;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Uwagi", 20, y);
      y += 8;
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(protocol.additional_notes, 170);
      doc.text(lines, 20, y);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("AutoSafe - Systemy zabezpieczeń pojazdów", 20, 285);

    const pdfOutput = doc.output("arraybuffer");

    return new Response(pdfOutput, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=protokol_${protocol.vehicle_registration}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF Error:", error);
    return new Response(JSON.stringify({ error: "PDF generation failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
