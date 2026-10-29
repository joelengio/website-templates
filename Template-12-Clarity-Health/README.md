# CLARITY HEALTH — OneStop Infinite Template 12

A premium, fully working medical-clinic website template built with **React 19, Vite, TypeScript and React Router**.
CLARITY HEALTH is a **fictional demonstration clinic**: the doctors, services, prices, testimonials, addresses and contact details are invented.
The booking experience is a **local demonstration** — it never contacts a real clinic and never creates a real medical appointment.

> **If you have an emergency, call your local emergency number (for example 911, 112 or 999).** Do not use this website or any demonstration form.

## What is included
Pages: Home · Specialties (+ detail) · Doctors (+ detail) · Services (+ detail) · Appointment booking · My demo appointments · About · Patient information ·
Journal (+ articles) · Contact & locations · Demo & privacy notice · 404.
8 specialties, 10 fictional clinicians, 30 services, 8 educational articles, 12 FAQs, 2 locations. Search and filters are URL-backed.
All content, branding, theme, navigation, home layout, booking rules and SEO live in `src/config/` — see **CUSTOMIZATION_GUIDE.md**.

## Requirements
Node.js 20 or newer and npm.

## Installation
```bash
npm ci
```

## Development
```bash
npm run dev          # http://localhost:5173
```

## Quality checks
```bash
npm run typecheck    # TypeScript (strict)
npm run lint         # ESLint
npm test             # Vitest unit + integration tests
npm run check        # typecheck + lint + tests + production build
npm run build && npm run test:e2e   # Playwright browser tests + axe-core scans
npm run review       # regenerate review/ contact sheets from the E2E screenshots
```
`npm run test:e2e` serves `dist/` with `scripts/serve-dist.mjs`, which applies the rewrites and headers from `firebase.json`.
Playwright uses the Chromium at `/opt/pw-browsers/chromium` or `PW_CHROMIUM_PATH` if present; otherwise run `npx playwright install chromium` once.

## Production build
```bash
npm run build        # outputs dist/ including sitemap.xml and robots.txt
npm run preview      # optional local preview
```
Set `VITE_SITE_URL=https://your-domain` before building so canonical URLs, Open Graph tags and the sitemap use your real origin.

## Firebase Hosting deployment
`firebase.json` serves `dist/` with a single-page-app rewrite (deep links load correctly), long-term caching for hashed assets, and security headers
including a Content-Security-Policy.
```bash
npm i -g firebase-tools
cp .firebaserc.example .firebaserc     # then set your project id
npm run build
firebase deploy --only hosting
```
Nothing here deploys automatically, and no credentials are stored in the project.

## Branding customization
Edit `src/config/site.ts` (name, logo, contact, hours, notices, SEO) and `src/config/theme.ts` (colours, fonts). Replace `public/logo.svg` and `public/favicon.svg`.
Full instructions and a file-by-file map: **CUSTOMIZATION_GUIDE.md**.

## Appointment-demo limitations
- Availability is generated from opening hours and each doctor's working days; some slots are deliberately shown as taken. It is not connected to any calendar.
- Appointments are stored only in the browser's `localStorage` (key `clarity-health:demo-appointments:v1`). They do not sync between browsers or devices, and clearing site data deletes them.
- If `localStorage` is blocked the demo still works for the current page view and tells the user their booking will not be kept.
- Duplicate prevention is per e-mail address and local to the browser; it is not a security control.
- No e-mails, reminders, payments, video calls or real confirmations exist. The contact form validates input but has no backend and never claims delivery.

## Privacy considerations
- The demo asks only for name, e-mail and an optional phone number, and tells users not to enter medical information. It never requests symptoms, histories,
  diagnoses, insurance credentials or ID numbers.
- Nothing is sent to a server; there is no analytics, tracking or third-party request (fonts and images are self-hosted).
- Users can delete all saved demo data from **My demo appointments**.
- The template makes **no claim of HIPAA, GDPR or any other regulatory compliance**. A real clinic needs independent legal, security and clinical-governance review before collecting patient data.
- Articles are general educational text that has **not** been clinician-reviewed.

## Imagery and licences
All imagery is original, code-generated illustration (no photography). See **ASSET_LICENSES.md** for details and replacement guidance.

## Documentation
README.md · CUSTOMIZATION_GUIDE.md · VERIFICATION.md · ASSET_LICENSES.md · CHANGELOG.md · LICENSE

Credit: website template by **OneStop Infinite** (kept separate from the fictional clinic's content, in `site.publisher`).
