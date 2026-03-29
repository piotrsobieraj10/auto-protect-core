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
app.use(express.json({ limit: "25mb" }));

// ── Model label lookup ────────────────────────────────────────────────────────
const MODEL_LABELS: Record<string, string> = {
  "seo-cani-u333-76-10":    "Seo Cani U333_76_10",
  "seo-cani-u335-76-10":    "Seo Cani U335_76_10",
  "seo-canblu-u335-77-12":  "Seo Canblu U335_77_12 z 2 brelokami",
  "seo-canblu-u335-77-a1":  "Seo Canblu U335_77_A1 z 2 brelokami",
  "seo-canblu-u335-77-a2-2":"Seo Canblu U335_77_A2 z 2 brelokami",
  "seo-canblu-u335-77-a2":  "Seo Canblu U335_77_A2",
  "seo-cani-u122-50-05":    "Seo Cani U122_50_05",
  "seo-cani-u122-50-10":    "Seo Cani U122_50_10",
  "immobilizer-can": "Immobilizer CAN",
  "gps": "GPS",
};

function getLabel(v: string): string { return MODEL_LABELS[v] || v || "—"; }
function str(v: any): string { return (v !== undefined && v !== null && v !== "") ? String(v) : "—"; }

// ── Pure B&W colour palette ───────────────────────────────────────────────────
const C = {
  white:   "#ffffff",
  black:   "#000000",
  dark:    "#1a1a1a",
  mid:     "#444444",
  label:   "#666666",
  border:  "#cccccc",
  borderL: "#e8e8e8",
  rowAlt:  "#f7f7f7",
  green:   "#1a7a1a",
  red:     "#cc0000",
  muted:   "#999999",
};

// ── Layout helpers ────────────────────────────────────────────────────────────
function rule(doc: any, y: number, x: number, w: number, thick = 0.5, color = C.border) {
  doc.moveTo(x, y).lineTo(x + w, y).lineWidth(thick).stroke(color);
}

function sectionHeader(doc: any, title: string, y: number, x: number, w: number): number {
  doc.font(FONT_BOLD).fontSize(8).fillColor(C.dark);
  doc.text(title.toUpperCase(), x, y, { lineBreak: false });
  const textW = doc.widthOfString(title.toUpperCase());
  doc.moveTo(x, y + 11).lineTo(x + w, y + 11).lineWidth(0.5).stroke(C.border);
  return y + 18;
}

function dataRow(
  doc: any, label: string, value: string,
  y: number, x: number, w: number, alt: boolean
): number {
  const rowH = 17;
  const colW = 160;
  if (alt) doc.rect(x, y, w, rowH).fill(C.rowAlt);
  doc.moveTo(x, y).lineTo(x + w, y).lineWidth(0.3).stroke(C.borderL);
  doc.font(FONT_REGULAR).fontSize(8).fillColor(C.label);
  doc.text(label, x + 5, y + 4.5, { width: colW - 8, lineBreak: false });
  doc.font(FONT_REGULAR).fontSize(8.5).fillColor(C.dark);
  doc.text(value, x + colW, y + 4, { width: w - colW - 5, lineBreak: false });
  return y + rowH;
}

// ── Fit image inside a box (contain, no distortion, no overflow) ──────────────
function drawImageFit(
  doc: any, dataUrl: string,
  bx: number, by: number, bw: number, bh: number
) {
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    doc.rect(bx, by, bw, bh).fill(C.white).stroke(C.border);
    doc.image(buf, bx + 2, by + 2, {
      fit: [bw - 4, bh - 4],
      align: "center",
      valign: "center",
    });
  } catch {
    doc.rect(bx, by, bw, bh).fill(C.rowAlt).stroke(C.border);
    doc.font(FONT_REGULAR).fontSize(7).fillColor(C.muted);
    doc.text("Brak zdjecia", bx, by + bh / 2 - 4, { width: bw, align: "center", lineBreak: false });
  }
}

// ── PDF Generation endpoint ───────────────────────────────────────────────────
app.post("/api/generate-protocol-pdf", (req, res) => {
  try {
    const { protocolData: d, isArchive } = req.body;
    const isImmobilizer = d.security_type === "immobilizer-can";
    const isGps = d.security_type === "gps";

    const doc = new PDFDocument({ size: "A4", margin: 0, compress: true });

    const lastName = (d.client_name || "Klient").split(" ").pop() || "Klient";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const reg = (d.vehicle_registration || "BEZ_REJ").replace(/\s+/g, "");
    const filename = `${dateStr}_${reg}_${lastName}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    doc.registerFont("Regular", FONT_REGULAR);
    doc.registerFont("Bold", FONT_BOLD);

    const pw = doc.page.width;   // 595
    const ph = doc.page.height;  // 842
    const mx = 42;
    const cw = pw - 2 * mx;     // 511

    // ── WHITE PAGE ────────────────────────────────────────────────────────────
    doc.rect(0, 0, pw, ph).fill(C.white);

    // ── HEADER (3-column, no overlap) ─────────────────────────────────────────
    const hTop = 28;

    // Left: logo mark "AS" in a box + brand name
    doc.rect(mx, hTop, 28, 28).fill(C.white).stroke(C.dark);
    doc.font("Bold").fontSize(11).fillColor(C.dark);
    doc.text("AS", mx, hTop + 8, { width: 28, align: "center", lineBreak: false });

    doc.font("Bold").fontSize(16).fillColor(C.dark);
    doc.text("AutoSafe", mx + 34, hTop + 2, { lineBreak: false });
    doc.font("Regular").fontSize(7.5).fillColor(C.mid);
    doc.text("Systemy bezpieczenstwa pojazdow", mx + 34, hTop + 21, { lineBreak: false });

    // Centre: document title
    doc.font("Bold").fontSize(11).fillColor(C.dark);
    doc.text("PROTOKOL ODBIORU PRAC", 0, hTop + 5, { align: "center", lineBreak: false });
    doc.font("Regular").fontSize(7).fillColor(C.label);
    doc.text(
      isArchive ? "WERSJA ARCHIWALNA — POUFNE" : "Dokument dla klienta",
      0, hTop + 20, { align: "center", lineBreak: false }
    );

    // Right: date — fixed column, no overlap
    const today = new Date();
    const df = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
    const rightX = pw - mx - 100;
    doc.font("Regular").fontSize(7.5).fillColor(C.label);
    doc.text("Data wystawienia:", rightX, hTop + 4, { width: 100, lineBreak: false });
    doc.font("Bold").fontSize(8.5).fillColor(C.dark);
    doc.text(df, rightX, hTop + 16, { width: 100, lineBreak: false });

    // Header bottom rule (thick)
    const hBottom = hTop + 44;
    doc.moveTo(mx, hBottom).lineTo(mx + cw, hBottom).lineWidth(1).stroke(C.dark);

    let y = hBottom + 14;

    // ── 1. DANE KLIENTA ───────────────────────────────────────────────────────
    y = sectionHeader(doc, "1. Dane klienta", y, mx, cw);
    y = dataRow(doc, "Nazwa / Imie i nazwisko:", str(d.client_name), y, mx, cw, false);
    y = dataRow(doc, "Adres:", str(d.client_address), y, mx, cw, true);
    rule(doc, y, mx, cw, 0.5, C.border);
    y += 12;

    // ── 2. DANE POJAZDU ───────────────────────────────────────────────────────
    y = sectionHeader(doc, "2. Dane pojazdu", y, mx, cw);
    const halfW = (cw - 8) / 2;
    const vLeft  = [["Marka:", str(d.vehicle_brand)], ["Model:", str(d.vehicle_model)], ["Nr rejestracyjny:", str(d.vehicle_registration)], ["Rok produkcji:", str(d.vehicle_year)]];
    const vRight = [["VIN:", str(d.vehicle_vin)], ["Przebieg:", d.vehicle_mileage ? `${d.vehicle_mileage} km` : "—"], ["Rodzaj paliwa:", str(d.fuel_type)]];
    const colStartY = y;
    vLeft.forEach(([l, v], i)  => dataRow(doc, l, v, colStartY + i * 17, mx, halfW, i % 2 === 0));
    vRight.forEach(([l, v], i) => dataRow(doc, l, v, colStartY + i * 17, mx + halfW + 8, halfW, i % 2 === 0));
    y = colStartY + 4 * 17;
    rule(doc, y, mx, cw, 0.5, C.border);
    y += 12;

    // ── 3. KOMPONENTY SYSTEMU ─────────────────────────────────────────────────
    y = sectionHeader(doc, "3. Komponenty systemu bezpieczenstwa", y, mx, cw);
    y = dataRow(doc, "Typ zabezpieczenia:", getLabel(d.security_type), y, mx, cw, false);
    y = dataRow(doc, "Model urzadzenia:", isImmobilizer ? getLabel(d.device_model) : str(d.device_model), y, mx, cw, true);
    if (isGps) y = dataRow(doc, "Nr fabryczny:", str(d.serial_number), y, mx, cw, false);
    y = dataRow(doc, "Nr homologacji:", "E20", y, mx, cw, isGps ? true : false);
    rule(doc, y, mx, cw, 0.5, C.border);
    y += 12;

    // ── 4. TESTY FUNKCJONALNE ─────────────────────────────────────────────────
    y = sectionHeader(doc, "4. Testy funkcjonalne", y, mx, cw);

    const testColW = cw - 60;
    // table header row
    doc.rect(mx, y, cw, 15).fill(C.rowAlt);
    rule(doc, y, mx, cw, 0.5, C.border);
    doc.font("Bold").fontSize(7.5).fillColor(C.mid);
    doc.text("Przeprowadzony test", mx + 5, y + 4, { lineBreak: false });
    doc.text("Wynik", mx + testColW + 5, y + 4, { width: 50, align: "center", lineBreak: false });
    y += 15;

    const tests = [
      { l: "Rozbrojenie immobilizera brelokiem", v: d.test_disarm_key },
      { l: "Rozbrojenie immobilizera kodem PIN", v: d.test_disarm_pin },
      { l: "Sprawdzenie trybu serwisowego",       v: d.test_service_mode },
    ];
    tests.forEach(({ l, v }, i) => {
      if (i % 2 === 1) doc.rect(mx, y, cw, 17).fill(C.rowAlt);
      rule(doc, y, mx, cw, 0.3, C.borderL);
      doc.font("Regular").fontSize(8.5).fillColor(C.dark);
      doc.text(l, mx + 5, y + 4.5, { width: testColW - 8, lineBreak: false });
      const ok = v === true;
      const na = v === undefined || v === null;
      doc.font("Bold").fontSize(8.5).fillColor(na ? C.muted : ok ? C.green : C.red);
      doc.text(na ? "N/A" : ok ? "TAK" : "NIE", mx + testColW + 5, y + 4.5, { width: 50, align: "center", lineBreak: false });
      y += 17;
    });
    rule(doc, y, mx, cw, 0.5, C.border);
    y += 12;

    // ── 5. ZDJECIA DOKUMENTACYJNE (client only — vehicle photos) ─────────────
    const photoH = 105;
    if (y + 26 + photoH + 16 > ph - 36) {
      doc.addPage();
      doc.rect(0, 0, pw, ph).fill(C.white);
      y = 36;
    }
    y = sectionHeader(doc, "5. Zdjecia dokumentacyjne pojazdu", y, mx, cw);

    const photoSlots = [
      { label: "Przod pojazdu z nr rej.", field: "vehicle_photo_front" },
      { label: "Numer VIN",               field: "vehicle_photo_vin" },
      { label: "Zegary po uruchomieniu",  field: "vehicle_photo_gauges" },
    ];
    const photoW = Math.floor((cw - 16) / 3);
    photoSlots.forEach(({ label, field }, i) => {
      const px = mx + i * (photoW + 8);
      const img = d[field];
      if (img && typeof img === "string" && img.startsWith("data:image")) {
        drawImageFit(doc, img, px, y, photoW, photoH);
      } else {
        doc.rect(px, y, photoW, photoH).fill(C.rowAlt).stroke(C.border);
        doc.font("Regular").fontSize(7).fillColor(C.muted);
        doc.text("Brak zdjecia", px, y + photoH / 2 - 4, { width: photoW, align: "center", lineBreak: false });
      }
      doc.font("Regular").fontSize(6.5).fillColor(C.label);
      doc.text(label, px, y + photoH + 4, { width: photoW, align: "center", lineBreak: false });
    });
    y += photoH + 20;

    // ── 6. DANE SERWISOWE (archive only — no install photos) ─────────────────
    if (isArchive) {
      if (y + 70 > ph - 36) {
        doc.addPage();
        doc.rect(0, 0, pw, ph).fill(C.white);
        y = 36;
      }
      y = sectionHeader(doc, "6. Dane serwisowe (poufne — tylko archiwum)", y, mx, cw);
      y = dataRow(doc, "Miejsce montazu urzadzenia:", str(d.control_unit_location), y, mx, cw, false);
      y = dataRow(doc, "Uwagi instalacyjne:",         str(d.service_notes),          y, mx, cw, true);
      rule(doc, y, mx, cw, 0.5, C.border);
      y += 12;
    }

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const fy = ph - 28;
    doc.moveTo(mx, fy).lineTo(mx + cw, fy).lineWidth(0.5).stroke(C.border);
    doc.font("Regular").fontSize(6.5).fillColor(C.muted);
    doc.text(
      "Dokument wygenerowany automatycznie. AutoSafe — autoryzowany instalator systemow bezpieczenstwa.",
      mx, fy + 8, { width: cw - 50, lineBreak: false }
    );
    doc.text(df, pw - mx - 45, fy + 8, { width: 45, align: "right", lineBreak: false });

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
      return res.status(400).json({ error: "Imie i telefon sa wymagane" });
    }
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: "Serwer e-mail nie jest skonfigurowany" });
    }
    const emailHtml = `
      <h2>Nowe zapytanie z formularza kontaktowego</h2>
      <p><strong>Imie i nazwisko:</strong> ${name}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Wiadomosc:</strong> ${message || "Brak wiadomosci"}</p>
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
    if (!apiRes.ok) return res.status(500).json({ error: "Nie udalo sie wyslac e-maila" });
    res.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    res.status(500).json({ error: "Wystapil blad serwera" });
  }
});

// ── Protocol email ────────────────────────────────────────────────────────────
app.post("/api/send-protocol-email", async (req, res) => {
  try {
    const data = req.body;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) return res.status(500).json({ error: "Missing API key" });
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a73e8">Nowy protokol odbioru — AutoSafe</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Marka:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_brand}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Model:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_model}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">VIN:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_vin}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Nr rej.:</td><td style="padding:8px;border-bottom:1px solid #eee">${data.vehicle_registration}</td></tr>
        </table>
      </div>
    `;
    const apiRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "AutoSafe <onboarding@resend.dev>",
        to: ["piotrsobieraj10@gmail.com"],
        subject: `Protokol: ${data.vehicle_brand} ${data.vehicle_model} — ${data.vehicle_registration}`,
        html,
      }),
    });
    const result = await apiRes.json();
    if (!apiRes.ok) return res.status(500).json({ error: "Email failed" });
    res.json({ success: true });
  } catch (err) {
    console.error("Protocol email error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Panel auth ────────────────────────────────────────────────────────────────
app.post("/api/auth/panel-login", (req, res) => {
  const { password } = req.body;
  const PANEL_PASSWORD = process.env.PANEL_PASSWORD;
  if (!PANEL_PASSWORD) {
    return res.status(500).json({ error: "Panel password not configured" });
  }
  if (password === PANEL_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Nieprawidlowe haslo" });
  }
});

const PORT = parseInt(process.env.PORT || "3001");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});
