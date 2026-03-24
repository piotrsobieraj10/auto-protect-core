import express from "express";
import cors from "cors";
import { jsPDF } from "jspdf";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── PDF Generation ────────────────────────────────────────────────────────────
app.post("/api/generate-protocol-pdf", async (req, res) => {
  try {
    const { protocolData, isArchive } = req.body;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFont("Helvetica");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    doc.setFillColor(30, 30, 40);
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text("AutoSafe", 20, 15);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const headerText = isArchive ? "PROTOKOL MONTAZU - ARCHIWUM" : "PROTOKOL MONTAZU";
    doc.text(headerText, 20, 24);

    doc.setFontSize(9);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString("pl-PL");
    doc.text(`Data: ${dateStr}`, pageWidth - 50, 15);

    y = 35;

    doc.setDrawColor(59, 130, 246);
    doc.line(20, y - 2, pageWidth - 20, y - 2);
    y += 5;

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Identyfikacja", 20, y);
    y += 7;

    doc.setFontSize(10);
    const identFields: [string, string][] = [
      ["Klient", protocolData.client_name],
      ["Marka pojazdu", protocolData.vehicle_brand],
      ["Model pojazdu", protocolData.vehicle_model],
      ["Rocznik pojazdu", protocolData.vehicle_year || "—"],
      ["VIN", protocolData.vehicle_vin],
      ["Nr rejestracyjny", protocolData.vehicle_registration],
      ["Przebieg", `${protocolData.vehicle_mileage} km`],
    ];

    identFields.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(0);
      doc.text(String(value || "—"), 75, y);
      y += 5;
    });

    y += 5;
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Specyfikacja", 20, y);
    y += 7;

    doc.setFontSize(10);
    const specFields: [string, string][] = [
      ["Typ zabezpieczenia", protocolData.security_type],
      ["Model urzadzenia", protocolData.device_model],
      ["Nr homologacji", protocolData.homologation_number || "E20"],
    ];

    specFields.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(0);
      doc.text(String(value || "—"), 75, y);
      y += 5;
    });

    if (isArchive) {
      y += 5;
      if (y > pageHeight - 100) { doc.addPage(); y = 20; }

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
        doc.text("Punkt wpiecia w instalacje:", 20, y);
        y += 5;
        doc.setTextColor(0);
        const lines2 = doc.splitTextToSize(protocolData.installation_connection_point, 170);
        doc.text(lines2, 25, y);
        y += (lines2.length * 5) + 3;
      }

      if (protocolData.service_notes) {
        y += 3;
        doc.setTextColor(100);
        doc.text("Uwagi serwisowe:", 20, y);
        y += 5;
        doc.setTextColor(0);
        const lines3 = doc.splitTextToSize(protocolData.service_notes, 170);
        doc.text(lines3, 25, y);
        y += (lines3.length * 5) + 3;
      }
    }

    y += 5;
    if (y > pageHeight - 60) { doc.addPage(); y = 20; }

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Testy i Odbior", 20, y);
    y += 7;

    doc.setFontSize(10);
    const checks = [
      { label: "Rozbrojenie immobilizera brelkiem", value: protocolData.test_disarm_key },
      { label: "Rozbrojenie immobilizera kodem PIN", value: protocolData.test_disarm_pin },
      { label: "Sprawdzenie trybu serwisowego", value: protocolData.test_service_mode },
    ];

    checks.forEach(({ label, value }) => {
      const status = value === true ? "TAK" : value === false ? "NIE" : "N/A";
      const statusColor: [number, number, number] = value === true ? [34, 197, 94] : value === false ? [239, 68, 68] : [100, 100, 100];
      doc.setTextColor(...statusColor);
      doc.text(status, 22, y);
      doc.setTextColor(0);
      doc.text(label, 35, y);
      y += 5;
    });

    if (!isArchive) {
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

    y = pageHeight - 10;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("AutoSafe - Systemy bezpieczenstwa pojazdow | www.autosafe.pl", 20, y);

    const pdfOutput = doc.output("arraybuffer");
    const lastName = (protocolData.client_name || "Klient").split(" ").pop() || "Klient";
    const filename = `${new Date().toISOString().slice(0, 10)}_${protocolData.vehicle_registration}_${lastName}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${filename}`,
    });
    res.send(Buffer.from(pdfOutput));
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

// ── Contact email ─────────────────────────────────────────────────────────────
app.post("/api/send-contact-email", async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Imię i telefon są wymagane" });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return res.status(500).json({ error: "Serwer e-mail nie jest skonfigurowany" });
    }

    const emailHtml = `
      <h2>Nowe zapytanie z formularza kontaktowego</h2>
      <p><strong>Imię i nazwisko:</strong> ${name}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Wiadomość:</strong> ${message || "Brak wiadomości"}</p>
    `;

    const apiRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AutoSafe <onboarding@resend.dev>",
        to: ["piotrsobieraj10@gmail.com"],
        subject: `Zapytanie od ${name}`,
        html: emailHtml,
      }),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      console.error("Resend error:", data);
      return res.status(500).json({ error: "Nie udało się wysłać e-maila" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
});

// ── Protocol email ────────────────────────────────────────────────────────────
app.post("/api/send-protocol-email", async (req, res) => {
  try {
    const data = req.body;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
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
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Urządzenia:</td><td style="padding:8px;border-bottom:1px solid #eee">${(data.devices || []).join(", ")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Data aktualizacji:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.device_update_date || "—"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Nr programu:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.program_number || "—"}</td></tr>
        </table>
        ${data.additional_notes ? `<p style="margin-top:16px"><strong>Uwagi:</strong> ${data.additional_notes}</p>` : ""}
      </div>
    `;

    const apiRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AutoSafe <onboarding@resend.dev>",
        to: ["piotrsobieraj10@gmail.com"],
        subject: `Protokół: ${data.vehicle_brand} ${data.vehicle_model} - ${data.vehicle_registration}`,
        html,
      }),
    });

    const result = await apiRes.json();
    if (!apiRes.ok) {
      console.error("Resend error:", result);
      return res.status(500).json({ error: "Email failed" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Protocol email error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = parseInt(process.env.PORT || "3001");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});
