import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const JSZip = require("jszip");

// Roboto font bundled with pdfmake — full Polish character support
const FONT_DIR = path.join(process.cwd(), "node_modules", "pdfmake", "build", "fonts", "Roboto");
const FONT_REGULAR = path.join(FONT_DIR, "Roboto-Regular.ttf");
const FONT_BOLD = path.join(FONT_DIR, "Roboto-Medium.ttf");

// AutoSafe logo for PDF header
const LOGO_PATH = path.join(__dirname, "logo.png");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ── Model label lookup ────────────────────────────────────────────────────────
const MODEL_LABELS: Record<string, string> = {
  "seo-cani-u333-76-10":     "Seo Cani U333_76_10",
  "seo-cani-u335-76-10":     "Seo Cani U335_76_10",
  "seo-canblu-u335-77-12":   "Seo Canblu U335_77_12 z 2 brelokami",
  "seo-canblu-u335-77-a1":   "Seo Canblu U335_77_A1 z 2 brelokami",
  "seo-canblu-u335-77-a2-2": "Seo Canblu U335_77_A2 z 2 brelokami",
  "seo-canblu-u335-77-a2":   "Seo Canblu U335_77_A2",
  "seo-cani-u122-50-05":     "Seo Cani U122_50_05",
  "seo-cani-u122-50-10":     "Seo Cani U122_50_10",
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
  doc.moveTo(x, y + 11).lineTo(x + w, y + 11).lineWidth(0.5).stroke(C.border);
  return y + 18;
}

function dataRow(
  doc: any, label: string, value: string,
  y: number, x: number, w: number, alt: boolean,
  valueFontSize = 8.5
): number {
  const rowH = 17;
  const colW = 160;
  if (alt) doc.rect(x, y, w, rowH).fill(C.rowAlt);
  doc.moveTo(x, y).lineTo(x + w, y).lineWidth(0.3).stroke(C.borderL);
  doc.font(FONT_REGULAR).fontSize(8).fillColor(C.label);
  doc.text(label, x + 5, y + 4.5, { width: colW - 8, lineBreak: false });
  doc.font(FONT_REGULAR).fontSize(valueFontSize).fillColor(C.dark);
  doc.text(value, x + colW, y + 4.5, { lineBreak: false });
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

// ── Core PDF builder — returns a Buffer ───────────────────────────────────────
function buildPDFBuffer(d: any, isArchive: boolean): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const isImmobilizer = d.security_type === "immobilizer-can";
      const isGps = d.security_type === "gps";

      const doc = new PDFDocument({ size: "A4", margin: 0, compress: true });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.registerFont("Regular", FONT_REGULAR);
      doc.registerFont("Bold", FONT_BOLD);

      const pw = doc.page.width;   // 595
      const ph = doc.page.height;  // 842
      const mx = 42;
      const cw = pw - 2 * mx;     // 511

      // ── WHITE PAGE ──────────────────────────────────────────────────────────
      doc.rect(0, 0, pw, ph).fill(C.white);

      // ── HEADER — logo top-left (413×126 source), date top-right ────────────
      const hTop = 18;
      // Logo is 413×126 (≈3.27:1 wide). Render at ~260×80 to stay sharp & proportional.
      const logoW = 260;
      const logoH = 80;

      try {
        doc.image(LOGO_PATH, mx, hTop, { fit: [logoW, logoH] });
      } catch {
        doc.font(FONT_BOLD).fontSize(22).fillColor(C.dark);
        doc.text("AutoSafe", mx, hTop + 16, { lineBreak: false });
        doc.font(FONT_REGULAR).fontSize(8).fillColor(C.label);
        doc.text("Systemy zabezpieczen pojazdow", mx, hTop + 42, { lineBreak: false });
      }

      // Right: date
      const today = new Date();
      const df = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
      const rightX = pw - mx - 110;
      doc.font(FONT_REGULAR).fontSize(7.5).fillColor(C.label);
      doc.text("Data wystawienia:", rightX, hTop + 30, { width: 110, lineBreak: false });
      doc.font(FONT_BOLD).fontSize(9).fillColor(C.dark);
      doc.text(df, rightX, hTop + 43, { width: 110, lineBreak: false });

      // Header bottom rule
      const hBottom = hTop + logoH + 10;
      doc.moveTo(mx, hBottom).lineTo(mx + cw, hBottom).lineWidth(1).stroke(C.dark);

      let y = hBottom + 14;

      // ── 1. DANE KLIENTA ─────────────────────────────────────────────────────
      y = sectionHeader(doc, "1. Dane klienta", y, mx, cw);
      y = dataRow(doc, "Nazwa / Imie i nazwisko:", str(d.client_name), y, mx, cw, false);
      y = dataRow(doc, "Adres:", str(d.client_address), y, mx, cw, true);
      rule(doc, y, mx, cw, 0.5, C.border);
      y += 12;

      // ── 2. DANE POJAZDU ─────────────────────────────────────────────────────
      y = sectionHeader(doc, "2. Dane pojazdu", y, mx, cw);
      const halfW = (cw - 8) / 2;
      const vLeft = [
        ["Marka:", str(d.vehicle_brand)],
        ["Model:", str(d.vehicle_model)],
        ["Nr rejestracyjny:", str(d.vehicle_registration)],
        ["Rok produkcji:", str(d.vehicle_year)],
      ];
      const vRight: [string, string, number?][] = [
        ["VIN:", str(d.vehicle_vin), 7.5],
        ["Przebieg:", d.vehicle_mileage ? `${d.vehicle_mileage} km` : "—"],
        ["Rodzaj paliwa:", str(d.fuel_type)],
      ];
      const colStartY = y;
      vLeft.forEach(([l, v], i) => dataRow(doc, l, v, colStartY + i * 17, mx, halfW, i % 2 === 0));
      vRight.forEach(([l, v, fs], i) => dataRow(doc, l, v, colStartY + i * 17, mx + halfW + 8, halfW, i % 2 === 0, fs));
      y = colStartY + 4 * 17;
      rule(doc, y, mx, cw, 0.5, C.border);
      y += 12;

      // ── 3. KOMPONENTY SYSTEMU ───────────────────────────────────────────────
      y = sectionHeader(doc, "3. Komponenty systemu bezpieczenstwa", y, mx, cw);
      y = dataRow(doc, "Typ zabezpieczenia:", getLabel(d.security_type), y, mx, cw, false);
      y = dataRow(doc, "Model urzadzenia:", isImmobilizer ? getLabel(d.device_model) : str(d.device_model), y, mx, cw, true);
      if (isGps) y = dataRow(doc, "Nr fabryczny:", str(d.serial_number), y, mx, cw, false);
      y = dataRow(doc, "Nr homologacji:", "E20", y, mx, cw, isGps ? true : false);
      rule(doc, y, mx, cw, 0.5, C.border);
      y += 12;

      // ── 4. TESTY FUNKCJONALNE (only executed tests — skip N/A) ─────────────
      const allTests = [
        { l: "Rozbrojenie immobilizera brelokiem", v: d.test_disarm_key },
        { l: "Rozbrojenie immobilizera kodem PIN", v: d.test_disarm_pin },
        { l: "Sprawdzenie trybu serwisowego",      v: d.test_service_mode },
      ];
      const executedTests = allTests.filter(({ v }) => v === true || v === false);

      if (executedTests.length > 0) {
        y = sectionHeader(doc, "4. Testy funkcjonalne", y, mx, cw);
        const testColW = cw - 60;
        doc.rect(mx, y, cw, 15).fill(C.rowAlt);
        rule(doc, y, mx, cw, 0.5, C.border);
        doc.font(FONT_BOLD).fontSize(7.5).fillColor(C.mid);
        doc.text("Przeprowadzony test", mx + 5, y + 4, { lineBreak: false });
        doc.text("Wynik", mx + testColW + 5, y + 4, { width: 50, align: "center", lineBreak: false });
        y += 15;

        executedTests.forEach(({ l, v }, i) => {
          if (i % 2 === 1) doc.rect(mx, y, cw, 17).fill(C.rowAlt);
          rule(doc, y, mx, cw, 0.3, C.borderL);
          doc.font(FONT_REGULAR).fontSize(8.5).fillColor(C.dark);
          doc.text(l, mx + 5, y + 4.5, { width: testColW - 8, lineBreak: false });
          doc.font(FONT_BOLD).fontSize(8.5).fillColor(v === true ? C.green : C.red);
          doc.text(v === true ? "TAK" : "NIE", mx + testColW + 5, y + 4.5, { width: 50, align: "center", lineBreak: false });
          y += 17;
        });
        rule(doc, y, mx, cw, 0.5, C.border);
        y += 12;
      }

      // ── 5. ZDJECIA POJAZDU — only slots with actual photos ──────────────────
      const allPhotoSlots = [
        { label: "Przod pojazdu z nr rej.", field: "vehicle_photo_front" },
        { label: "Numer VIN",               field: "vehicle_photo_vin" },
        { label: "Zegary po uruchomieniu",  field: "vehicle_photo_gauges" },
      ];
      const presentPhotoSlots = allPhotoSlots.filter(
        ({ field }) => d[field] && typeof d[field] === "string" && d[field].startsWith("data:image")
      );

      if (presentPhotoSlots.length > 0) {
        const photoH = 105;
        if (y + 26 + photoH + 16 > ph - 36) {
          doc.addPage();
          doc.rect(0, 0, pw, ph).fill(C.white);
          y = 36;
        }
        y = sectionHeader(doc, "5. Zdjecia dokumentacyjne pojazdu", y, mx, cw);
        const cols = presentPhotoSlots.length;
        const gap = 8;
        const photoW = Math.floor((cw - gap * (cols - 1)) / cols);
        presentPhotoSlots.forEach(({ label, field }, i) => {
          const px = mx + i * (photoW + gap);
          drawImageFit(doc, d[field], px, y, photoW, photoH);
          doc.font(FONT_REGULAR).fontSize(6.5).fillColor(C.label);
          doc.text(label, px, y + photoH + 4, { width: photoW, align: "center", lineBreak: false });
        });
        y += photoH + 20;
      }

      // ── 6 & 7. DANE POUFNE (tylko archiwum) ─────────────────────────────────
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

        // Install photos — archive only, only slots with actual photos
        const allInstallSlots = [
          { label: "Zdjecie montazowe 1", field: "install_photo_1" },
          { label: "Zdjecie montazowe 2", field: "install_photo_2" },
          { label: "Zdjecie montazowe 3", field: "install_photo_3" },
        ];
        const presentInstallSlots = allInstallSlots.filter(
          ({ field }) => d[field] && typeof d[field] === "string" && d[field].startsWith("data:image")
        );
        if (presentInstallSlots.length > 0) {
          const iph = 95;
          if (y + 26 + iph + 16 > ph - 36) {
            doc.addPage();
            doc.rect(0, 0, pw, ph).fill(C.white);
            y = 36;
          }
          y = sectionHeader(doc, "7. Zdjecia z montazu (archiwum)", y, mx, cw);
          const icols = presentInstallSlots.length;
          const igap = 8;
          const ipw = Math.floor((cw - igap * (icols - 1)) / icols);
          presentInstallSlots.forEach(({ label, field }, i) => {
            const px = mx + i * (ipw + igap);
            drawImageFit(doc, d[field], px, y, ipw, iph);
            doc.font(FONT_REGULAR).fontSize(6.5).fillColor(C.label);
            doc.text(label, px, y + iph + 4, { width: ipw, align: "center", lineBreak: false });
          });
          y += iph + 20;
        }
      }

      // ── FOOTER ──────────────────────────────────────────────────────────────
      const fy = ph - 28;
      doc.moveTo(mx, fy).lineTo(mx + cw, fy).lineWidth(0.5).stroke(C.border);
      doc.font(FONT_REGULAR).fontSize(6.5).fillColor(C.muted);
      doc.text(
        "Dokument wygenerowany automatycznie. AutoSafe — autoryzowany instalator systemow bezpieczenstwa.",
        mx, fy + 8, { width: cw - 50, lineBreak: false }
      );
      doc.text(df, pw - mx - 45, fy + 8, { width: 45, align: "right", lineBreak: false });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ── SMTP transporter (o2.pl / Onet) ──────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.poczta.onet.pl",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: (process.env.SMTP_PORT || "465") === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── PDF download endpoint ─────────────────────────────────────────────────────
app.post("/api/generate-protocol-pdf", async (req, res) => {
  try {
    const { protocolData: d, isArchive } = req.body;
    const buf = await buildPDFBuffer(d, isArchive);

    const lastName = (d.client_name || "Klient").split(" ").pop() || "Klient";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const reg = (d.vehicle_registration || "BEZ_REJ").replace(/\s+/g, "");
    const filename = `${dateStr}_${reg}_${lastName}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buf);
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

// ── Send customer PDF by email (SMTP) ────────────────────────────────────────
app.post("/api/send-client-pdf", async (req, res) => {
  try {
    const { protocolData: d, clientEmail } = req.body;
    if (!clientEmail) return res.status(400).json({ error: "Brak adresu e-mail klienta" });
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ error: "SMTP nie jest skonfigurowany (brak SMTP_USER lub SMTP_PASS)." });
    }

    const pdfBuf = await buildPDFBuffer(d, false);
    const reg = (d.vehicle_registration || "BEZ_REJ").replace(/\s+/g, "");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = `Protokol_${reg}_${dateStr}.pdf`;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `AutoSafe <${process.env.SMTP_USER}>`,
      to: clientEmail,
      subject: `Protokół odbioru — ${d.vehicle_brand} ${d.vehicle_model} (${reg})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1a1a1a">AutoSafe — Protokół Odbioru Prac</h2>
          <p>Szanowny Kliencie,</p>
          <p>W załączniku znajduje się protokół odbioru montażu systemu zabezpieczeń dla pojazdu:</p>
          <ul>
            <li><strong>Marka/Model:</strong> ${d.vehicle_brand} ${d.vehicle_model}</li>
            <li><strong>Nr rejestracyjny:</strong> ${reg}</li>
            <li><strong>VIN:</strong> ${d.vehicle_vin}</li>
          </ul>
          <p style="color:#666;font-size:12px">AutoSafe — Systemy bezpieczeństwa pojazdów</p>
        </div>
      `,
      attachments: [{ filename, content: pdfBuf, contentType: "application/pdf" }],
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Send client PDF error:", err);
    res.status(500).json({ error: err.message || "Blad wysylki e-mail" });
  }
});

// ── Archive: ZIP → autosafe@o2.pl (SMTP) ─────────────────────────────────────
app.post("/api/archive-and-send", async (req, res) => {
  try {
    const { protocolData: d } = req.body;
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ error: "SMTP nie jest skonfigurowany (brak SMTP_USER lub SMTP_PASS)." });
    }

    const brand   = (d.vehicle_brand        || "MARKA").replace(/\s+/g, "_");
    const model   = (d.vehicle_model        || "MODEL").replace(/\s+/g, "_");
    const reg     = (d.vehicle_registration || "BEZ_REJ").replace(/\s+/g, "");
    const vin     = (d.vehicle_vin          || "VIN").replace(/\s+/g, "");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const [clientPDF, archivePDF] = await Promise.all([
      buildPDFBuffer(d, false),
      buildPDFBuffer(d, true),
    ]);

    const zip = new JSZip();
    zip.file(`Protokol_klient_${reg}_${dateStr}.pdf`, clientPDF);
    zip.file(`Protokol_archiwum_${reg}_${dateStr}.pdf`, archivePDF);

    if (d.install_video && typeof d.install_video === "string" && d.install_video.includes(",")) {
      const base64Data = d.install_video.split(",")[1];
      const mime = d.install_video.split(";")[0].replace("data:", "");
      const ext = mime.includes("mp4") ? "mp4" : mime.includes("quicktime") ? "mov" : "mp4";
      zip.file(`Nagranie_${reg}_${dateStr}.${ext}`, base64Data, { base64: true });
    }

    const zipBuf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
    const zipName = `${brand}_${model}_${reg}_${vin}.zip`;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `AutoSafe <${process.env.SMTP_USER}>`,
      to: "autosafe@o2.pl",
      subject: `Archiwum montazu — ${d.vehicle_brand} ${d.vehicle_model} ${reg}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2>AutoSafe — Archiwum Montazu</h2>
          <p>Nowy zakończony montaż do archiwizacji:</p>
          <ul>
            <li><strong>Klient:</strong> ${d.client_name}</li>
            <li><strong>Pojazd:</strong> ${d.vehicle_brand} ${d.vehicle_model} (${d.vehicle_year})</li>
            <li><strong>Nr rej.:</strong> ${reg}</li>
            <li><strong>VIN:</strong> ${vin}</li>
            <li><strong>Urządzenie:</strong> ${d.device_model || d.security_type}</li>
          </ul>
          <p>Paczka ZIP zawiera: protokół jawny, protokół poufny${d.install_video ? " oraz nagranie wideo" : ""}.</p>
        </div>
      `,
      attachments: [{ filename: zipName, content: zipBuf, contentType: "application/zip" }],
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Archive send error:", err);
    res.status(500).json({ error: err.message || "Blad archiwizacji" });
  }
});

// ── Contact email ─────────────────────────────────────────────────────────────
app.post("/api/send-contact-email", async (req, res) => {
  try {
    const { name, phone, vehicle, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Imie i telefon sa wymagane" });
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) return res.status(500).json({ error: "Serwer e-mail nie jest skonfigurowany" });
    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a1a1a">AutoSafe — Nowe zapytanie z formularza</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:40%">Imię i nazwisko:</td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Telefon:</td><td style="padding:8px;border-bottom:1px solid #eee">${phone}</td></tr>
          ${vehicle ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Pojazd:</td><td style="padding:8px;border-bottom:1px solid #eee">${vehicle}</td></tr>` : ""}
          ${message ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Wiadomość:</td><td style="padding:8px;border-bottom:1px solid #eee">${message}</td></tr>` : ""}
        </table>
      </div>
    `;
    const apiRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "AutoSafe <onboarding@resend.dev>",
        to: ["piotrsobieraj10@gmail.com"],
        subject: `Zapytanie od ${name}${vehicle ? ` – ${vehicle}` : ""}`,
        html: emailHtml,
      }),
    });
    const resendBody = await apiRes.json().catch(() => ({}));
    console.log("[Resend] status:", apiRes.status, "body:", JSON.stringify(resendBody));
    if (!apiRes.ok) return res.status(500).json({ error: "Nie udalo sie wyslac e-maila", detail: resendBody });
    res.json({ success: true, id: resendBody.id });
  } catch (err: any) {
    console.error("Contact email error:", err);
    res.status(500).json({ error: err.message || "Wystapil blad serwera" });
  }
});

// ── Panel auth ────────────────────────────────────────────────────────────────
app.post("/api/auth/panel-login", (req, res) => {
  const { password } = req.body;
  const PANEL_PASSWORD = process.env.PANEL_PASSWORD;
  if (!PANEL_PASSWORD) return res.status(500).json({ error: "Panel password not configured" });
  if (password === PANEL_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Nieprawidlowe haslo" });
  }
});

// ── Static frontend ───────────────────────────────────────────────────────────
const staticDir = path.join(__dirname, "public");
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.use((_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

const PORT = parseInt(process.env.PORT || "3001");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});
