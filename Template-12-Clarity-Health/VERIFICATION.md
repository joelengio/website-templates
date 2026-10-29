# Verification record

Every result below was produced by actually running the command in this project. Date of the runs: 2026-10-29. Environment: Linux, Node 22.22, npm 10.9,
Chromium (Playwright 1.64.1 driver using a pre-installed Chromium at `/opt/pw-browsers/chromium`).

| Check | Command | Result |
|---|---|---|
| TypeScript (strict) | `npm run typecheck` | Pass, 0 errors |
| ESLint | `npm run lint` | Pass, 0 errors, 0 warnings |
| Unit + integration tests | `npm test` | **79 passed / 79** (3 files: `lib.test.ts` 34, `config.test.ts` 7, integration `app.test.tsx` 38) |
| Production build | `npm run build` | Pass; `dist/` includes `sitemap.xml` and `robots.txt` |
| Browser E2E + accessibility | `npm run test:e2e` | **151 passed / 151** (`site.spec.ts` 116, `a11y.spec.ts` 35), ≈2 min |

## What the browser suite covers
- **Every route (16, including the 404) at 360, 390, 768, 1024 and 1440 px (80 runs):** no horizontal overflow, no broken images (lazy images forced and checked), exactly one `h1`,
  alt attribute on every image, interactive controls ≥ 24 px (buttons ≥ 44 px high), and no console errors or failed requests.
- **Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA and best-practice rules):** every route at 1440 px and 390 px, plus the booking wizard at each step (including validation errors,
  calendar/time slots, review and confirmation), the appointments page with the cancel dialog open, the open mobile menu, and filtered/empty states. **0 violations.**
  Automated scanning does not replace a manual screen-reader and keyboard audit; no manual assistive-technology testing was performed.
- **Deep links** load directly (HTTP 200 through the Firebase-style rewrite) for every route; unknown routes and unknown doctor/specialty/service/article slugs show a 404 state.
- **SEO:** unique titles, descriptions, canonical and Open Graph tags per page; `noindex` on `/appointments`; `robots.txt`, `sitemap.xml` (contains specialty/doctor/service/article URLs) and favicon are served.
- **Headers:** the Content-Security-Policy and other security headers from `firebase.json` are applied by the test server, and the whole suite runs under that CSP without violations.
  (The test server mimics Firebase; the CSP was not tested against a real Firebase deployment.)
- **Filters:** specialty search/category; doctor specialty/language/weekday/new-patients/video; service category and search; journal category and search; empty states and clear-filters.
- **Booking:** full six-step flow with per-step validation, calendar keyboard navigation, slot selection, review, confirmation, persistence across reload, duplicate prevention,
  rescheduling, cancellation through the accessible dialog (focus moves in, Escape closes, focus returns), deleting all local data, blocked `localStorage`, and the flow at 360 px.
- **Contact form:** validation, no network POST, wording never claims delivery; location tabs with arrow keys.
- **Navigation:** active state, mobile menu (open, Escape, focus return), skip link, footer links; `prefers-reduced-motion`.

## Customization
`app.test.tsx` mutates the configuration at runtime and verifies propagation: brand name and demo notice, theme variables, price visibility, and homepage section visibility.
`config.test.ts` checks referential integrity (every doctor/service/article links to an existing specialty; every image key resolves to an existing file; fictional labelling; no compliance/accreditation claims).

## Visual review
Labelled contact sheets built from the E2E screenshots: `review/contact-sheet-desktop-1440.jpg`, `review/contact-sheet-tablet-768.jpg`, `review/contact-sheet-mobile-390.jpg`.
Per-route/per-width screenshots (80 files) are generated into `review/shots/` by the test run and are git-ignored.

## Issues found and fixed during verification
- Header overflowed at 390 px (CTA button not hidden on small screens) — fixed.
- `?service=` booking shortcut dropped the service when no doctor was given — fixed (defaults to "no preference").
- Navigation and header disappeared while a lazy route chunk loaded — Suspense boundary moved inside the layout.
- axe: header link name mismatch, heading order on listing pages, invalid `aside` roles, scrollable stepper — fixed.
- Doctors who are not accepting new patients could previously be reached through a booking shortcut — now excluded and the profile offers another doctor.

## Known limitations
- Imagery is generated illustration, not photography (see `ASSET_LICENSES.md`).
- Not tested on real mobile devices, Safari or Firefox (Chromium only), or with real screen readers.
- Colour contrast was verified by axe's automated rules only.
- Bookings and inquiries have no backend by design.
- Firebase deployment was configured but not performed.

## Release archive checks
Performed on a preliminary build of the archive whose contents differ from the final one only by this section of `VERIFICATION.md`:
`unzip -t` reported no errors; the `.sha256` file matched; the archive was extracted to an empty directory and `npm ci`, `npm run typecheck`, `npm run lint`,
`npm test` (79 passed) and `npm run build` all succeeded there. The archive contains 155 files and none from `node_modules`, `dist`, `.git`, other templates, other ZIPs, env files or credentials.
The E2E suite was run from the working tree, not from the extracted copy.

## Release archive
`handoff/OneStop-Infinite-Template-12-Clarity-Health.zip` with `.sha256` beside it. The checksum cannot be stored inside the archive it describes; read it from the `.sha256` file.
