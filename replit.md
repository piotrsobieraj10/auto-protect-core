# AutoSafe — Vehicle Security Protocol System

## Overview
AutoSafe is a Polish-language web application for vehicle security system installers. It provides a public-facing landing page and a password-protected panel for technicians to create installation protocol documents (PDF).

## Architecture

- **Frontend**: React + Vite (TypeScript), served on port 5000
- **Backend**: Express.js server (TypeScript via tsx), served on port 3001
- **Vite proxy**: All `/api/*` requests from the frontend are proxied to the Express server
- **Database**: Replit PostgreSQL (provisioned, available via `DATABASE_URL`)

## Key Features

### Public Site (`/`)
- Landing page with hero, services, FAQ, contact form
- Contact form submits to `/api/send-contact-email` (uses Resend API)

### Installer Panel (`/dashboard`)
- Password-protected via server-side auth at `/api/auth/panel-login`
- Password stored securely in `PANEL_PASSWORD` environment secret
- Multi-step protocol form (4 steps): client/vehicle identification, device specification, service data, tests & acceptance
- PDF generation via `/api/generate-protocol-pdf` (uses pdfkit + Roboto font from pdfmake)
- Two PDF versions: customer copy and confidential archive copy

## Environment Variables / Secrets

| Key | Description |
|-----|-------------|
| `PANEL_PASSWORD` | Password for the installer panel login |
| `RESEND_API_KEY` | Resend API key for sending emails (optional — email routes gracefully fail without it) |
| `DATABASE_URL` | PostgreSQL connection string (auto-provisioned by Replit) |

## Running the App

```
npm run dev
```

This runs both the Express API server and the Vite dev server concurrently.

## Project Structure

```
server/
  index.ts          — Express API server (PDF generation, email sending, panel auth)
src/
  pages/
    Index.tsx         — Public landing page
    Dashboard.tsx     — Password-protected installer panel
    NotFound.tsx      — 404 page
  components/
    ProtocolStepper.tsx     — 4-step protocol form
    protocol-steps/         — Individual step components
    Navbar.tsx, Footer.tsx, Hero.tsx, etc.
  integrations/supabase/    — Legacy Supabase files (kept for reference, not actively used)
supabase/
  migrations/               — Original DB schema (reference for Replit PostgreSQL)
  functions/                — Legacy Supabase Edge Functions (replaced by Express endpoints)
```

## Notes

- The `@supabase/supabase-js` package is still in dependencies but the active app flow (Dashboard → ProtocolStepper) does not use Supabase. The `ProtocolForm.tsx`, `Login.tsx`, and `useAuth.tsx` files are legacy and not routed.
- PDF fonts: Roboto Regular and Medium are sourced from the `pdfmake` package's bundled fonts directory.
