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
  "seo-cani-u333-76-10": "Seo Cani U333_76_10",
  "seo-cani-u335-76-10": "Seo Cani U335_76_10",
  "seo-canblu-u335-77-12": "Seo Canblu U335_77_12 z 2 brelokami",
  "seo-cani-u122-50-10": "Seo Cani U122_50_10",
  "immobilizer-can": "Immobilizer CAN",
  "gps": "GPS",
};

function getLabel(v: string): string { return MODEL_LABELS[v] || v || "—"; }
function str(v: any): string { return (v !== undefined && v !== null && v !== "") ? String(v) : "—"; }

// ── PDF colour palette (light / print-friendly) ───────────────────────────────
const C = {
  white:      "#ffffff",
  pageBg:     "#f9fafb",
  headerBg:   "#1e3a5f",
  headerText: "#ffffff",
  accentBlue: "#1d4ed8",
  sectionBg:  "#eff6ff",
  sectionText:"#1e40af",
  rowOdd:     "#f8fafc",
  rowEven:    "#eef2ff",
  label:      "#64748b",
  value:      "#1e293b",
  border:     "#cbd5e1",
  borderDark: "#94a3b8",
  green:      "#16a34a",
  red:        "#dc2626",
  muted:      "#94a3b8",
  amber:      "#92400e",
  amberBg:    "#fef3c7",
  amberBorder:"#f59e0b",
  footerBg:   "#f1f5f9",
  footerText: "#64748b",
};

// ── Layout helpers ────────────────────────────────────────────────────────────
function sectionHeader(doc: any, title: string, y: number, x: number, w: number): number {
  doc.rect(x, y, w, 20).fill(C.sectionBg);
  doc.rect(x, y, 3, 20).fill(C.accentBlue);
  doc.font(FONT_BOLD).fontSize(8).fillColor(C.sectionText);
  doc.text(title.toUpperCase(), x + 9, y + 6, { lineBreak: false });
  return y + 26;
}

function dataRow(
  doc: any, label: string, value: string,
  y: number, x: number, w: number, even: boolean
): number {
  const rowH = 17;
  doc.rect(x, y, w, rowH).fill(even ? C.rowEven : C.rowOdd);
  doc.moveTo(x, y).lineTo(x + w, y).stroke(C.border);
  const colW = 150;
  doc.font(FONT_REGULAR).fontSize(8).fillColor(C.label);
  doc.text(label, x + 6, y + 4.5, { width: colW - 10, lineBreak: false });
  doc.font(FONT_REGULAR).fontSize(8.5).fillColor(C.value);
  doc.text(value, x + colW, y + 4, { width: w - colW - 6, lineBreak: false });
  return y + rowH;
}

// ── Fit image inside a box without distortion ─────────────────────────────────
function drawImageFit(
  doc: any, dataUrl: string,
  bx: number, by: number, bw: number, bh: number
) {
  try {
    const base64 = dataUrl.split(",")[1];
    const buf = Buffer.from(base64, "base64");
    // Draw white background for photo box
    doc.rect(bx, by, bw, bh).fill(C.white).stroke(C.border);
    // Fit image with contain mode (no distortion, no overflow)
    doc.image(buf, bx + 2, by + 2, {
      fit: [bw - 4, bh - 4],
      align: "center",
      valign: "center",
    });
  } catch {
    doc.rect(bx, by, bw, bh).fill("#f1f5f9").stroke(C.border);
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
    const mx = 36;
    const cw = pw - 2 * mx;     // 523

    // ── PAGE BACKGROUND ───────────────────────────────────────────────────────
    doc.rect(0, 0, pw, ph).fill(C.pageBg);

    // ── HEADER ────────────────────────────────────────────────────────────────
    doc.rect(0, 0, pw, 72).fill(C.headerBg);

    // Brand mark — left
    doc.font("Bold").fontSize(22).fillColor(C.white);
    doc.text("AutoSafe", mx, 14, { lineBreak: false });
    doc.font("Regular").fontSize(7.5).fillColor("#93c5fd");
    doc.text("Systemy bezpieczenstwa pojazdow", mx, 40, { lineBreak: false });
    // Thin underline below brand
    doc.moveTo(mx, 52).lineTo(mx + 130, 52).lineWidth(0.5).stroke("#3b82f6");

    // Document label — center
    doc.font("Bold").fontSize(12).fillColor(C.white);
    doc.text("PROTOKOL ODBIORU PRAC", 0, 20, { align: "center", lineBreak: false });
    doc.font("Regular").fontSize(7).fillColor("#93c5fd");
    doc.text(isArchive ? "WERSJA ARCHIWALNA — POUFNE" : "Dokument dla klienta", 0, 36, { align: "center", lineBreak: false });

    // Date — right column
    const today = new Date();
    const df = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()} r.`;
    doc.font("Bold").fontSize(8).fillColor("#bfdbfe");
    doc.text("Data wystawienia:", pw - mx - 130, 18, { width: 130, lineBreak: false });
    doc.font("Regular").fontSize(9).fillColor(C.white);
    doc.text(df, pw - mx - 130, 30, { width: 130, lineBreak: false });

    // Header bottom border
    doc.rect(0, 72, pw, 2).fill(C.accentBlue);

    let y = 84;

    // ── 1. DANE KLIENTA ───────────────────────────────────────────────────────
    y = sectionHeader(doc, "1. Dane klienta", y, mx, cw);
    y = dataRow(doc, "Nazwa / Imie i nazwisko:", str(d.client_name), y, mx, cw, false);
    y = dataRow(doc, "Adres:", str(d.client_address), y, mx, cw, true);
    // bottom border
    doc.moveTo(mx, y).lineTo(mx + cw, y).stroke(C.border);
    y += 10;

    // ── 2. DANE POJAZDU ───────────────────────────────────────────────────────
    y = sectionHeader(doc, "2. Dane pojazdu", y, mx, cw);

    // Two-column layout for vehicle data
    const halfW = (cw - 6) / 2;
    const vLeft = [
      ["Marka:", str(d.vehicle_brand)],
      ["Model:", str(d.vehicle_model)],
      ["Nr rejestracyjny:", str(d.vehicle_registration)],
      ["Rok produkcji:", str(d.vehicle_year)],
    ];
    const vRight = [
      ["VIN:", str(d.vehicle_vin)],
      ["Przebieg:", d.vehicle_mileage ? `${d.vehicle_mileage} km` : "—"],
      ["Rodzaj paliwa:", str(d.fuel_type)],
      ["", ""],
    ];
    const vStartY = y;
    vLeft.forEach(([l, v], i) => {
      dataRow(doc, l, v, vStartY + i * 17, mx, halfW, i % 2 === 0);
    });
    vRight.forEach(([l, v], i) => {
      if (l) dataRow(doc, l, v, vStartY + i * 17, mx + halfW + 6, halfW, i % 2 === 0);
    });
    y = vStartY + 4 * 17;
    doc.moveTo(mx, y).lineTo(mx + cw, y).stroke(C.border);
    y += 10;

    // ── 3. KOMPONENTY SYSTEMU ─────────────────────────────────────────────────
    y = sectionHeader(doc, "3. Komponenty systemu bezpieczenstwa", y, mx, cw);
    y = dataRow(doc, "Typ zabezpieczenia:", getLabel(d.security_type), y, mx, cw, false);
    y = dataRow(doc, "Model urzadzenia:", isImmobilizer ? getLabel(d.device_model) : str(d.device_model), y, mx, cw, true);
    if (isGps) {
      y = dataRow(doc, "Nr fabryczny:", str(d.serial_number), y, mx, cw, false);
    }
    y = dataRow(doc, "Nr homologacji:", "E20", y, mx, cw, isGps ? true : false);
    doc.moveTo(mx, y).lineTo(mx + cw, y).stroke(C.border);
    y += 10;

    // ── 4. TESTY FUNKCJONALNE ─────────────────────────────────────────────────
    y = sectionHeader(doc, "4. Testy funkcjonalne", y, mx, cw);

    // Table header
    const testColW = cw - 70;
    doc.rect(mx, y, cw, 16).fill(C.sectionBg);
    doc.font("Bold").fontSize(7.5).fillColor(C.sectionText);
    doc.text("Przeprowadzony test", mx + 6, y + 4.5, { lineBreak: false });
    doc.text("Wynik", mx + testColW + 10, y + 4.5, { width: 55, align: "center", lineBreak: false });
    y += 16;

    const tests = [
      { l: "Rozbrojenie immobilizera brelokiem", v: d.test_disarm_key },
      { l: "Rozbrojenie immobilizera kodem PIN", v: d.test_disarm_pin },
      { l: "Sprawdzenie trybu serwisowego", v: d.test_service_mode },
    ];
    tests.forEach(({ l, v }, i) => {
      doc.rect(mx, y, cw, 17).fill(i % 2 === 0 ? C.rowOdd : C.rowEven);
      doc.moveTo(mx, y).lineTo(mx + cw, y).stroke(C.border);
      doc.font("Regular").fontSize(8.5).fillColor(C.value);
      doc.text(l, mx + 6, y + 4.5, { width: testColW - 10, lineBreak: false });
      const ok = v === true;
      const na = v === undefined || v === null;
      doc.font("Bold").fontSize(8.5).fillColor(na ? C.muted : ok ? C.green : C.red);
      doc.text(na ? "N/A" : ok ? "TAK" : "NIE", mx + testColW + 10, y + 4.5, { width: 55, align: "center", lineBreak: false });
      y += 17;
    });
    doc.moveTo(mx, y).lineTo(mx + cw, y).stroke(C.border);
    y += 10;

    // ── 5. ZDJĘCIA DOKUMENTACYJNE ─────────────────────────────────────────────
    // Check if we need a new page
    const photoH = 100;
    if (y + 30 + photoH + 20 > ph - 40) {
      doc.addPage();
      doc.rect(0, 0, pw, ph).fill(C.pageBg);
      y = 30;
    }

    y = sectionHeader(doc, "5. Zdjecia dokumentacyjne pojazdu", y, mx, cw);

    const photoSlots = [
      { label: "Przod pojazdu z nr rej.", field: "vehicle_photo_front" },
      { label: "Numer VIN", field: "vehicle_photo_vin" },
      { label: "Zegary po uruchomieniu", field: "vehicle_photo_gauges" },
    ];
    const photoW = Math.floor((cw - 12) / 3);
    photoSlots.forEach(({ label, field }, i) => {
      const px = mx + i * (photoW + 6);
      const imgData = d[field];
      if (imgData && typeof imgData === "string" && imgData.startsWith("data:image")) {
        drawImageFit(doc, imgData, px, y, photoW, photoH);
      } else {
        doc.rect(px, y, photoW, photoH).fill("#f1f5f9").stroke(C.border);
        doc.font("Regular").fontSize(7).fillColor(C.muted);
        doc.text("Brak zdjecia", px, y + photoH / 2 - 4, { width: photoW, align: "center", lineBreak: false });
      }
      doc.font("Regular").fontSize(6.5).fillColor(C.label);
      doc.text(label, px, y + photoH + 3, { width: photoW, align: "center", lineBreak: false });
    });
    y += photoH + 18;

    // Installation photos for immobilizer (if any)
    if (isImmobilizer) {
      const ipSlots = [
        { label: "Zdjecie z montazu 1", field: "install_photo_1" },
        { label: "Zdjecie z montazu 2", field: "install_photo_2" },
        { label: "Zdjecie z montazu 3", field: "install_photo_3" },
      ];
      const hasInstallPhotos = ipSlots.some(({ field }) => d[field] && d[field].startsWith("data:image"));
      if (hasInstallPhotos) {
        if (y + 30 + photoH + 20 > ph - 40) {
          doc.addPage();
          doc.rect(0, 0, pw, ph).fill(C.pageBg);
          y = 30;
        }
        y = sectionHeader(doc, "Zdjecia z montazu urzadzenia", y, mx, cw);
        ipSlots.forEach(({ label, field }, i) => {
          const px = mx + i * (photoW + 6);
          const imgData = d[field];
          if (imgData && typeof imgData === "string" && imgData.startsWith("data:image")) {
            drawImageFit(doc, imgData, px, y, photoW, photoH);
          } else {
            doc.rect(px, y, photoW, photoH).fill("#f1f5f9").stroke(C.border);
            doc.font("Regular").fontSize(7).fillColor(C.muted);
            doc.text("Brak zdjecia", px, y + photoH / 2 - 4, { width: photoW, align: "center", lineBreak: false });
          }
          doc.font("Regular").fontSize(6.5).fillColor(C.label);
          doc.text(label, px, y + photoH + 3, { width: photoW, align: "center", lineBreak: false });
        });
        y += photoH + 18;
      }
    }

    // ── 6. DANE SERWISOWE (archive only) ──────────────────────────────────────
    if (isArchive) {
      if (y + 80 > ph - 50) {
        doc.addPage();
        doc.rect(0, 0, pw, ph).fill(C.pageBg);
        y = 30;
      }
      doc.rect(mx, y, cw, 20).fill(C.amberBg).stroke(C.amberBorder);
      doc.font("Bold").fontSize(8).fillColor(C.amber);
      doc.text("DANE SERWISOWE — POUFNE (tylko wersja archiwalna)", mx + 6, y + 6, { lineBreak: false });
      y += 26;
      y = dataRow(doc, "Miejsce montazu urzadzenia:", str(d.control_unit_location), y, mx, cw, false);
      y = dataRow(doc, "Uwagi instalacyjne:", str(d.service_notes), y, mx, cw, true);
      doc.moveTo(mx, y).lineTo(mx + cw, y).stroke(C.border);
      y += 10;
    }

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const footerY = ph - 30;
    doc.rect(0, footerY, pw, 30).fill(C.footerBg);
    doc.moveTo(0, footerY).lineTo(pw, footerY).lineWidth(0.5).stroke(C.border);

    // Left: disclaimer
    doc.font("Regular").fontSize(6.5).fillColor(C.footerText);
    doc.text(
      "Dokument wygenerowany automatycznie. AutoSafe — autoryzowany instalator systemow bezpieczenstwa.",
      mx, footerY + 8, { width: cw - 80, lineBreak: false }
    );
    // Right: page number
    doc.font("Regular").fontSize(6.5).fillColor(C.muted);
    doc.text("Strona 1", pw - mx - 40, footerY + 8, { width: 40, align: "right", lineBreak: false });

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

const PORT = parseInt(process.env.PORT || "3001");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});
