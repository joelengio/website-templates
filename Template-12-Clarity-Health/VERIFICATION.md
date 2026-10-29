# Verification report — CLARITY HEALTH (Template 12, v1.1.0)

Independent QA run on 2026-10-29 · Linux · Node 22.22 · npm 10.9 · Chromium 1243, Firefox 155, WebKit 27.2 (Playwright 1.64).
Everything below was actually executed on the final source tree. Screenshot contact sheets and the written review are in `documentation/review/`
(kept in git, not shipped in the ZIP).

## Automated results
| Check | Command | Result |
|---|---|---|
| Clean install | `npm ci` (also repeated inside a fresh extraction of the release ZIP) | OK — `npm audit`: 0 vulnerabilities |
| TypeScript (strict) | `npm run typecheck` | 0 errors |
| ESLint | `npm run lint` | 0 errors, 0 warnings |
| Unit + integration tests | `npm test` | **79 / 79 passed** (3 files) |
| Production build | `npm run build` | OK; sitemap.xml (67 URLs) + robots.txt generated; no Vite warnings |
| Browser suite — Chromium | `npx playwright test` | **152 / 152 passed** |
| Browser suite — Firefox 155 | `PW_BROWSER=firefox npx playwright test --workers=2` | **152 / 152 passed** |
| Browser suite — WebKit 27.2 | `PW_BROWSER=webkit npx playwright test --workers=2` | **152 / 152 passed** |
| Fresh-extract run | unzip → `npm ci` → `npm run check` → `npx playwright test` | passed — the final ZIP was extracted into an empty directory and the same commands were run there (same counts) |

### What the suites cover
- **Vitest:** configuration integrity (every specialty has doctors and services, doctor ↔ specialty ↔ service ↔ consultation-mode compatibility, unique slugs, every referenced image exists with alt text); availability generation (opening hours, working days, window, closed dates, busy slots); booking store (persistence, corrupt/blocked storage, cancel, delete all); duplicate-prevention rules (same e-mail overlap, same service/day, per-e-mail cap, reschedule ignoring itself); validation (names, e-mail, phone, no medical fields); search; SEO tags; theme variables; customization (rebrand, hide/reorder home sections).
- **Playwright (Chromium, Firefox, WebKit):** all 16 routes at **360, 390, 768, 1024, 1440 px** (no overflow, no broken images, one `h1`, no console errors or failed requests); direct deep links through a server that applies `firebase.json` rewrites **and its Content-Security-Policy**; 404s; robots/sitemap/favicon; per-page title/description/canonical/Open Graph; nav active state, mobile menu focus trap, skip link; filters/search for specialties, doctors, services and journal;
  **full booking** with per-step validation, keyboard calendar, slot disappearance, duplicate blocking, **two-tab stale-confirmation protection**, reschedule, cancel dialog (focus, Escape, return), persistence, delete-all, blocked-localStorage warning, mobile booking at 360 px; contact validation without any delivery claim; reduced motion.
- **axe-core** (WCAG 2.0/2.1/2.2 A/AA **+ best-practice**, motion settled) on every route at 1440 and 390 px, and on interactive states (booking steps, calendar, review, confirmation, open dialog, open mobile menu, filtered and empty states): **zero violations**.

## Medical-safety and honesty review
The booking collects only name, e-mail and an optional phone number and says, in the step and in the contact form, never to enter symptoms, medical history, insurance or ID numbers. Every booking surface, the confirmation and the footer state that nothing is real and nothing is sent; an emergency-number notice is always visible; the doctors are labelled fictional; articles are labelled as not clinician-reviewed; the About and Demo notice pages state that **no accreditation, award or regulatory compliance (HIPAA, GDPR or otherwise) is claimed**. Nothing simulates clinical confirmation.

## Customization (actually exercised)
A scratch copy was rebranded **only through `src/config`** (brand name and short name, site URL, SEO title and suffix, phone, navy theme colour, a navigation label, the home "doctors" section switched off), built and inspected in a browser: header/footer showed the new name and label, the doctors band disappeared, page titles and meta descriptions used the new brand, and `index.html` (title, canonical, `<noscript>`) and `sitemap.xml` followed. This exposed one defect, fixed: eleven pages and the `<noscript>` message hard-coded the brand.

## Defects found by this QA pass (all fixed — see CHANGELOG 1.1.0)
Unexplained reset after a taken time (error message erased by the same state update); hard-coded brand in meta descriptions and `<noscript>`; filter handlers building on a render-time URL snapshot (a click right after "Clear filters" could resurrect old filters — found as a one-off CI-style failure and fixed with functional updates); year-long `immutable` caching of un-hashed images; ZIP script dropping `.env.example` and skipping validation; deprecated Vite config loader; stale review sheets; "photographs" wording for illustrations.

## Known limitations
- **Demonstration-only booking:** availability is generated locally from configured hours and each doctor's working days; appointments live in the visitor's `localStorage` only, with no server, e-mail, calendar, payment or clinical system. A real clinic must supply a backend plus independent legal, privacy and security review before collecting any patient data.
- The contact-form endpoint option (`site.contact.formEndpoint`) is unit-tested but was not exercised against a live service.
- Client-side rendered SPA: per-page meta is set in the browser; the static head has site-wide defaults. No prerendering.
- Firebase deployment was **not executed** (no credentials). `firebase.json` (rewrite, caching, security headers and CSP) was exercised only through `scripts/serve-dist.mjs`, which mimics it.
- Imagery is generated illustration, not photography — a deliberate, licence-clean art direction (see ASSET_LICENSES.md and `documentation/review/REVIEW.md`).
- WebKit (Playwright's Linux build) logs a CSP console error ("Refused to apply a stylesheet…") on any page containing a `<select>` when `style-src` is `'self'` — reproduced with a three-line static page and no site code. The WebKit run ignores exactly that message (and nothing else); Chromium and Firefox have no such exemption and are clean.
- Accessibility evidence is axe-core + keyboard automation + visual review, not a screen-reader session. No Lighthouse run. Firefox/WebKit ran on Linux, not on Apple/Android devices.
