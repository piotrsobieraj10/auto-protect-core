import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const PDFDocument = require("pdfkit");

// Roboto font bundled with pdfmake — full Polish character support
const FONT_DIR = path.join(process.cwd(), "node_modules", "pdfmake", "build", "fonts", "Roboto");
const FONT_REGULAR = path.join(FONT_DIR, "Roboto-Regular.ttf");
const FONT_BOLD = path.join(FONT_DIR, "Roboto-Medium.ttf");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// ── Model label lookup ────────────────────────────────────────────────────────
const MODEL_LABELS: Record<string, string> = {
  "seo-cani-u333-76-10": "Seo Cani U333_76_10",
  "seo-cani-u335-76-10": "Seo Cani U335_76_10",
  "seo-canblu-u335-77-12": "Seo Canblu U335_77_12 z 2 brelokami",
  "seo-canblu-u335-77-a1": "Seo Canblu U335_77_A1 z 2 brelokami",
  "seo-canblu-u335-77-a2-2": "Seo Canblu U335_77_A2 z 2 brelokami",
  "seo-canblu-u335-77-a2": "Seo Canblu U335_77_A2",
  "seo-cani-u122-50-05": "Seo Cani U122_50_05",
  "seo-cani-u122-50-10": "Seo Cani U122_50_10",
  "gps-model-pro": "GPS Model Pro",
  "gps-model-smart": "GPS Model Smart",
  "fuel-block-v1": "Fuel Block V1",
  "gps-etoll": "GPS e-TOLL",
  "immobilizer-can": "Immobilizer CAN",
  "fuel-blocking": "Blokada paliwa",
  "combined": "System złożony",
};

function getLabel(v: string): string { return MODEL_LABELS[v] || v || "—"; }
function str(v: any): string { return v ? String(v) : "—"; }

// ── PDF helpers ───────────────────────────────────────────────────────────────
const C = {
  bg: "#080f1a",
  header: "#0f172a",
  sectionBg: "#0f2744",
  rowEven: "#0d1929",
  rowOdd: "#0a1220",
  primary: "#3b82f6",
  accent: "#93c5fd",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  border: "#1e3a5f",
  green: "#22c55e",
  red: "#ef4444",
  warn: "#f59e0b",
  amber: "#fcd34d",
  amberBg: "#78350f",
};

function drawSectionHeader(doc: any, title: string, y: number, w: number, x = 40): number {
  doc.rect(x, y, w, 22).fill(C.sectionBg);
  doc.font(FONT_BOLD).fontSize(9).fillColor(C.accent);
  doc.text(title.toUpperCase(), x + 6, y + 7, { lineBreak: false });
  return y + 30;
}

function drawDataRow(
  doc: any, label: string, value: string,
  y: number, w: number, shade: boolean, x = 40
): number {
  const bg = shade ? C.rowEven : C.rowOdd;
  doc.rect(x, y, w, 18).fill(bg);
  doc.font(FONT_REGULAR).fontSize(8).fillColor(C.textMuted);
  doc.text(label, x + 6, y + 5, { width: 155, lineBreak: false });
  doc.fillColor(C.text).fontSize(9);
  doc.text(value || "—", x + 164, y + 5, { width: w - 168, lineBreak: false });
  return y + 18;
}

// ── PDF Generation ────────────────────────────────────────────────────────────
app.post("/api/generate-protocol-pdf", (req, res) => {
  try {
    const { protocolData: d, isArchive } = req.body;

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: { Title: "Protokół Odbioru Prac — AutoSafe" },
    });

    const lastName = (d.client_name || "Klient").split(" ").pop() || "Klient";
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `${dateStr}_${d.vehicle_registration || "BEZ_REJ"}_${lastName}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    doc.registerFont("Regular", FONT_REGULAR);
    doc.registerFont("Bold", FONT_BOLD);

    const pw = doc.page.width;
    const ph = doc.page.height;
    const mx = 40;
    const cw = pw - 2 * mx;

    // ── PAGE BACKGROUND ───────────────────────────────────────────────────────
    doc.rect(0, 0, pw, ph).fill(C.bg);

    // ── HEADER BAR ────────────────────────────────────────────────────────────
    doc.rect(0, 0, pw, 90).fill(C.header);
    doc.rect(0, 88, pw, 2).fill(C.border);

    // Left: Brand
    doc.font("Bold").fontSize(24).fillColor(C.primary);
    doc.text("AutoSafe", mx, 16, { lineBreak: false });
    doc.font("Regular").fontSize(8).fillColor(C.textDim);
    doc.text("Systemy bezpieczenstwa pojazdow", mx, 44, { lineBreak: false });

    // Right: Order info
    const today = new Date();
    const df = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()} r.`;
    const rightInfo = [
      { l: "Data:", v: df },
      { l: "Nr zlecenia:", v: str(d.order_number) },
      { l: "Realizujacy:", v: str(d.technician) },
      { l: "Lokalizacja:", v: str(d.location) },
    ];
    let ry = 10;
    rightInfo.forEach(({ l, v }) => {
      doc.font("Regular").fontSize(8).fillColor(C.textDim);
      doc.text(l, pw - mx - 210, ry, { width: 70, lineBreak: false });
      doc.fillColor("#cbd5e1");
      doc.text(v, pw - mx - 136, ry, { width: 130, lineBreak: false });
      ry += 16;
    });

    // ── TITLE ─────────────────────────────────────────────────────────────────
    doc.rect(0, 90, pw, 32).fill("#0f1e36");
    doc.font("Bold").fontSize(13).fillColor(C.text);
    doc.text("PROTOKOL ODBIORU PRAC", 0, 99, { align: "center", lineBreak: false });
    if (isArchive) {
      doc.font("Regular").fontSize(8).fillColor(C.warn);
      doc.text("WERSJA ARCHIWALNA — POUFNE", 0, 113, { align: "center", lineBreak: false });
    }

    // ── BODY ──────────────────────────────────────────────────────────────────
    let y = 136;

    // 1. Dane klienta
    y = drawSectionHeader(doc, "1. Dane klienta", y, cw);
    y = drawDataRow(doc, "Nazwa / Imie i nazwisko:", str(d.client_name), y, cw, true);
    y = drawDataRow(doc, "Adres:", str(d.client_address), y, cw, false);
    y += 6;

    // 2. Dane pojazdu
    y = drawSectionHeader(doc, "2. Dane pojazdu", y, cw);
    const vRows = [
      ["Marka:", str(d.vehicle_brand)],
      ["Model:", str(d.vehicle_model)],
      ["Nr rejestracyjny:", str(d.vehicle_registration)],
      ["Rok produkcji:", str(d.vehicle_year)],
      ["VIN:", str(d.vehicle_vin)],
      ["Przebieg:", d.vehicle_mileage ? `${d.vehicle_mileage} km` : "—"],
      ["Rodzaj paliwa:", str(d.fuel_type)],
    ];
    vRows.forEach(([l, v], i) => { y = drawDataRow(doc, l, v, y, cw, i % 2 === 0); });
    y += 6;

    // 3. Komponenty systemu
    y = drawSectionHeader(doc, "3. Komponenty systemu", y, cw);
    const sRows = [
      ["Typ zabezpieczenia:", getLabel(d.security_type)],
      ["Model urzadzenia:", getLabel(d.device_model)],
      ["Nr fabryczny:", str(d.serial_number)],
      ["Nr homologacji:", "E20"],
    ];
    sRows.forEach(([l, v], i) => { y = drawDataRow(doc, l, v, y, cw, i % 2 === 0); });
    y += 6;

    // 4. Testy funkcjonalne
    y = drawSectionHeader(doc, "4. Testy funkcjonalne", y, cw);

    // Table header
    doc.rect(mx, y, cw, 18).fill("#0f2744");
    doc.font("Bold").fontSize(8).fillColor(C.textMuted);
    doc.text("Test", mx + 6, y + 5, { width: cw - 70, lineBreak: false });
    doc.text("Wynik", pw - mx - 64, y + 5, { width: 60, align: "center", lineBreak: false });
    y += 18;

    const tests = [
      { l: "Rozbrojenie immobilizera brelokiem", v: d.test_disarm_key },
      { l: "Rozbrojenie immobilizera kodem PIN", v: d.test_disarm_pin },
      { l: "Sprawdzenie trybu serwisowego", v: d.test_service_mode },
      { l: "Brak bledow OBD", v: d.test_obd },
    ];
    tests.forEach(({ l, v }, i) => {
      const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
      doc.rect(mx, y, cw, 18).fill(bg);
      doc.font("Regular").fontSize(9).fillColor(C.text);
      doc.text(l, mx + 6, y + 5, { width: cw - 70, lineBreak: false });
      const statusText = v === true ? "TAK" : v === false ? "NIE" : "N/A";
      const statusColor = v === true ? C.green : v === false ? C.red : C.textDim;
      doc.font("Bold").fillColor(statusColor);
      doc.text(statusText, pw - mx - 64, y + 5, { width: 60, align: "center", lineBreak: false });
      y += 18;
    });
    y += 6;

    // 5. Zdjecia
    if (y > ph - 160) { doc.addPage(); doc.rect(0, 0, pw, ph).fill(C.bg); y = 30; }
    y = drawSectionHeader(doc, "5. Zdjecia dokumentacyjne", y, cw);

    const photoSlots = [
      { label: "Przod pojazdu z nr rej.", field: "vehicle_photo_front" },
      { label: "Numer VIN", field: "vehicle_photo_vin" },
      { label: "Zegary po uruchomieniu", field: "vehicle_photo_gauges" },
    ];
    const photoW = (cw - 12) / 3;
    const photoH = 90;
    photoSlots.forEach(({ label, field }, i) => {
      const px = mx + i * (photoW + 6);
      doc.rect(px, y, photoW, photoH).fill(C.rowOdd).stroke(C.border);
      const imgData = d[field];
      if (imgData && typeof imgData === "string" && imgData.startsWith("data:image")) {
        try {
          const base64 = imgData.split(",")[1];
          const buf = Buffer.from(base64, "base64");
          doc.image(buf, px + 2, y + 2, {
            width: photoW - 4,
            height: photoH - 4,
            cover: [photoW - 4, photoH - 4],
            align: "center",
            valign: "center",
          });
        } catch (_) { /* placeholder shown */ }
      } else {
        doc.font("Regular").fontSize(7).fillColor(C.textDim);
        doc.text("Brak zdjecia", px, y + photoH / 2 - 4, { width: photoW, align: "center", lineBreak: false });
      }
      doc.font("Regular").fontSize(7).fillColor(C.textDim);
      doc.text(label, px, y + photoH + 3, { width: photoW, align: "center", lineBreak: false });
    });
    y += photoH + 18;

    // 6. Dane serwisowe (archive only)
    if (isArchive) {
      if (y > ph - 160) { doc.addPage(); doc.rect(0, 0, pw, ph).fill(C.bg); y = 30; }
      doc.rect(mx, y, cw, 22).fill(C.amberBg);
      doc.font("Bold").fontSize(9).fillColor(C.amber);
      doc.text("6. DANE SERWISOWE (POUFNE — TYLKO ARCHIWUM)", mx + 6, y + 7, { lineBreak: false });
      y += 30;

      const svcRows = [
        ["Miejsce montazu urzadzenia:", str(d.control_unit_location)],
        ["Lokalizacja anteny GPS:", str(d.gps_antenna_location)],
        ["Punkt wpiecia w instalacje:", str(d.installation_connection_point)],
        ["Uwagi instalacyjne:", str(d.service_notes)],
        ["Link do wideo z montazu:", str(d.installation_video_url)],
      ];
      svcRows.forEach(([l, v], i) => { y = drawDataRow(doc, l, v, y, cw, i % 2 === 0); });
      y += 6;
    }

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const fy = ph - 28;
    doc.rect(0, fy, pw, 28).fill(C.header);
    doc.font("Regular").fontSize(8).fillColor(C.textDim);
    doc.text("AutoSafe | NIP: — | www.autosafe.pl", 0, fy + 10, { align: "center", lineBreak: false });

    doc.end();
  } catch (err) {
    console.error("PDF Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "PDF generation failed" });
    }
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
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
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Nr rejestracyjny:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_registration}</td></tr>
        </table>
      </div>
    `;

    const apiRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
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
