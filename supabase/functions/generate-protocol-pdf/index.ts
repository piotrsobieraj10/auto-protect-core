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
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFont('Helvetica');

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    // Add logo area
    doc.setFillColor(30, 30, 40);
    doc.rect(0, 0, pageWidth, 30, 'F');

    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text('AutoSafe', 20, 15);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const headerText = isArchive ? 'PROTOKOL MONTAZU - ARCHIWUM' : 'PROTOKOL MONTAZU';
    doc.text(headerText, 20, 24);

    // Date
    doc.setFontSize(9);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString('pl-PL');
    doc.text(`Data: ${dateStr}`, pageWidth - 50, 15);

    y = 35;

    // Horizontal line
    doc.setDrawColor(59, 130, 246);
    doc.line(20, y - 2, pageWidth - 20, y - 2);
    y += 5;

    // Section: Identyfikacja
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Identyfikacja', 20, y);
    y += 7;

    doc.setFontSize(10);
    const identFields = [
      ['Klient', protocolData.client_name],
      ['Marka pojazdu', protocolData.vehicle_brand],
      ['Model pojazdu', protocolData.vehicle_model],
      ['Rocznik pojazdu', protocolData.vehicle_year || '—'],
      ['VIN', protocolData.vehicle_vin],
      ['Nr rejestracyjny', protocolData.vehicle_registration],
      ['Przebieg', `${protocolData.vehicle_mileage} km`],
    ];

    identFields.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(0);
      doc.text(String(value || '—'), 75, y);
      y += 5;
    });

    // Section: Specyfikacja
    y += 5;
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Specyfikacja', 20, y);
    y += 7;

    doc.setFontSize(10);
    const specFields = [
      ['Typ zabezpieczenia', protocolData.security_type],
      ['Model urzadzenia', protocolData.device_model],
      ['Nr homologacji', protocolData.homologation_number || 'E20'],
    ];

    specFields.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(0);
      doc.text(String(value || '—'), 75, y);
      y += 5;
    });

    // Service Data - Only in Archive version
    if (isArchive) {
      y += 5;
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(13);
      doc.setTextColor(200, 100, 0);
      doc.text('DANE SERWISOWE (POUFNE)', 20, y);
      y += 7;

      doc.setFontSize(10);
      if (protocolData.control_unit_location) {
        doc.setTextColor(100);
        doc.text('Lokalizacja centralki:', 20, y);
        y += 5;
        doc.setTextColor(0);
        const lines1 = doc.splitTextToSize(protocolData.control_unit_location, 170);
        doc.text(lines1, 25, y);
        y += (lines1.length * 5) + 3;
      }

      if (protocolData.installation_connection_point) {
        doc.setTextColor(100);
        doc.text('Punkt wpiecia w instalacje:', 20, y);
        y += 5;
        doc.setTextColor(0);
        const lines2 = doc.splitTextToSize(protocolData.installation_connection_point, 170);
        doc.text(lines2, 25, y);
        y += (lines2.length * 5) + 3;
      }

      if (protocolData.service_notes) {
        y += 3;
        doc.setTextColor(100);
        doc.text('Uwagi serwisowe:', 20, y);
        y += 5;
        doc.setTextColor(0);
        const lines3 = doc.splitTextToSize(protocolData.service_notes, 170);
        doc.text(lines3, 25, y);
        y += (lines3.length * 5) + 3;
      }
    }

    // Section: Testy i Odbior
    y += 5;
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Testy i Odbior', 20, y);
    y += 7;

    doc.setFontSize(10);
    const checks = [
      { label: 'Rozbrojenie immobilizera brelkiem', value: protocolData.test_disarm_key },
      { label: 'Rozbrojenie immobilizera kodem PIN', value: protocolData.test_disarm_pin },
      { label: 'Sprawdzenie trybu serwisowego', value: protocolData.test_service_mode },
    ];

    checks.forEach(({ label, value }) => {
      const status = value === true ? 'TAK' : value === false ? 'NIE' : 'N/A';
      const statusColor = value === true ? [34, 197, 94] : value === false ? [239, 68, 68] : [100, 100, 100];

      doc.setTextColor(...statusColor);
      doc.text(status, 22, y);
      doc.setTextColor(0);
      doc.text(label, 35, y);
      y += 5;
    });

    // Signature section - Only in customer version
    if (!isArchive) {
      y += 5;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Podpis klienta:', 20, y);
      y += 15;

      doc.setLineWidth(0.5);
      doc.line(20, y, 100, y);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('...........................', 20, y + 3);
    }

    // Footer
    y = pageHeight - 10;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('AutoSafe - Systemy bezpieczenstwa pojazdow | www.autosafe.pl', 20, y);

    const pdfOutput = doc.output('arraybuffer');
    const lastName = protocolData.client_name.split(' ').pop() || 'Klient';
    const filename = `${new Date().toISOString().slice(0, 10)}_${protocolData.vehicle_registration}_${lastName}.pdf`;

    return new Response(pdfOutput, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    console.error('PDF Error:', error);
    return new Response(JSON.stringify({ error: 'PDF generation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
