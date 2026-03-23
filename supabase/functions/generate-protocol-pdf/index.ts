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
    const { protocolData, isArchive } = await req.json();
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text("AutoSafe", 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(isArchive ? "PROTOKÓŁ MONTAŻU - ARCHIWUM" : "PROTOKÓŁ MONTAŻU", 20, y);
    y += 1;

    doc.setDrawColor(59, 130, 246);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;

    // Date
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Data: ${new Date().toLocaleDateString("pl-PL")}`, pageWidth - 80, 20);

    // Section: Identyfikacja
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Identyfikacja", 20, y);
    y += 7;

    doc.setFontSize(10);
    const identFields = [
      ["Klient", protocolData.client_name],
      ["Marka pojazdu", protocolData.vehicle_brand],
      ["Model pojazdu", protocolData.vehicle_model],
      ["VIN", protocolData.vehicle_vin],
      ["Nr rejestracyjny", protocolData.vehicle_registration],
      ["Przebieg", `${protocolData.vehicle_mileage} km`],
    ];

    identFields.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(0);
      doc.text(value || "—", 75, y);
      y += 5;
    });

    // Section: Specyfikacja
    y += 5;
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Specyfikacja", 20, y);
    y += 7;

    doc.setFontSize(10);
    const specFields = [
      ["Typ zabezpieczenia", protocolData.security_type],
      ["Model urządzenia", protocolData.device_model],
      ["IMEI/ID urządzenia", protocolData.imei_id],
    ];

    specFields.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(0);
      doc.text(value || "—", 75, y);
      y += 5;
    });

    // Service Data - Only in Archive version
    if (isArchive && (protocolData.control_unit_location || protocolData.installation_connection_point)) {
      y += 5;
      doc.setFontSize(13);
      doc.setTextColor(200, 100, 0);
      doc.text("DANE SERWISOWE (POUFNE)", 20, y);
      y += 7;

      doc.setFontSize(10);
      if (protocolData.control_unit_location) {
        doc.setTextColor(100);
        doc.text("Lokalizacja centralki:", 20, y);
        y += 5;
        doc.setTextColor(0);
        const lines1 = doc.splitTextToSize(protocolData.control_unit_location, 170);
        doc.text(lines1, 25, y);
        y += (lines1.length * 5) + 3;
      }

      if (protocolData.installation_connection_point) {
        doc.setTextColor(100);
        doc.text("Punkt wpięcia w instalację:", 20, y);
        y += 5;
        doc.setTextColor(0);
        const lines2 = doc.splitTextToSize(protocolData.installation_connection_point, 170);
        doc.text(lines2, 25, y);
        y += (lines2.length * 5) + 3;
      }
    }

    // Section: Testy i Odbiór
    y += 5;
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Testy i Odbiór", 20, y);
    y += 7;

    doc.setFontSize(10);
    const checks = [
      { label: "GPS pracuje poprawnie", value: protocolData.gps_working },
      { label: "Blokada paliwa pracuje poprawnie", value: protocolData.blocking_working },
      { label: "Brak błędów OBD", value: protocolData.no_obd_errors },
    ];

    checks.forEach(({ label, value }) => {
      const checkmark = value ? "✓" : "✗";
      if (value) {
        doc.setTextColor(34, 197, 94);
      } else {
        doc.setTextColor(239, 68, 68);
      }
      doc.text(checkmark, 22, y);
      doc.setTextColor(0);
      doc.text(label, 30, y);
      y += 5;
    });

    // Signature section - Only in customer version
    if (!isArchive && protocolData.signature) {
      y += 5;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Podpis klienta:", 20, y);
      y += 15;

      doc.setLineWidth(0.5);
      doc.line(20, y, 100, y);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("...........................", 20, y + 3);
    }

    // Footer
    y = pageHeight - 10;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("AutoSafe - Systemy zabezpieczeń pojazdów | www.autosafe.pl", 20, y);

    const pdfOutput = doc.output("arraybuffer");
    const filename = `protokol_${protocolData.vehicle_registration}_${new Date().toISOString().slice(0, 10)}.pdf`;

    return new Response(pdfOutput, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${filename}`,
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
