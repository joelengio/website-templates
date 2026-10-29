# Verification report — Template 10: SERENE HOUSE (v1.1.0)

Independent QA run on 2026-10-29 · Linux · Node 22.22 · npm 10.9 · Chromium 1243, Firefox 155, WebKit 27.2 (Playwright-core 1.64). All commands run inside `Template-10-Serene-House/`.
Screenshot contact sheets and the written review are in `documentation/review/`. The ZIP's SHA-256 is in `handoff/*.zip.sha256` and the pull request (a ZIP cannot contain its own hash).

## Automated results

| Check | Command | Result |
|---|---|---|
| Install from lockfile | `npm ci` (also repeated inside a fresh extraction of the release ZIP) | OK — `npm audit`: 0 vulnerabilities (prod and dev); prod licences MIT / OFL-1.1 only |
| TypeScript (strict, noUnused*) | `npm run typecheck` | Pass, 0 errors |
| Lint | `npm run lint` | Pass, 0 errors / 0 warnings |
| Unit + integration tests | `npm test` | **43 / 43 passed** (4 files) |
| Production build | `npm run build` | Pass; route-level code splitting; sitemap.xml (32 URLs) + robots.txt generated; no Vite warnings |
| Browser checks — Chromium | `npm run test:e2e` | **42 / 42 passed** |
| Browser checks — Firefox | `E2E_BROWSER=firefox node scripts/e2e.mjs` | **42 / 42 passed** |
| Browser checks — WebKit | `E2E_BROWSER=webkit node scripts/e2e.mjs` | **42 / 42 passed** |
| Fresh-extract run | unzip → `npm ci` → `npm run check` → `npm run test:e2e` | passed — the final ZIP was extracted into an empty directory and the same four commands were run there (same counts as the rows above) |

### Vitest coverage
Availability engine (deterministic hashing, Sunday closed, 42-day window, closing-time limits, therapist double-booking prevention, cancelled bookings freeing slots, reschedule ignoring itself); booking store (create/persist/update/cancel, corrupt localStorage);
**duplicate-booking guard** (case/space-insensitive email, overlapping vs back-to-back, other day/guest, cancelled, the booking being rescheduled); pricing and specialty matching; booking/contact validation;
config integrity (unique slugs, categories, prices, savings ≥ 0, every image exists with alt text, **no picture repeated across treatments/packages/gallery/journal, no orphaned files in `public/images`**);
UI flows (routing + SEO tags, 404, mobile menu, treatment filter/search/empty state, lightbox keyboard, journal search, contact errors + non-delivery, the **full booking flow**, URL preselection); customization (hide sections, rebrand, add a treatment, theme variables).

### Browser checks (`scripts/e2e.mjs`, same checks in each engine)
- 12 routes × **360, 390, 768, 1024, 1440 px**: no horizontal overflow, no broken images, exactly one `<h1>`, alt text, targets ≥ 24 px, no console errors, no failed requests.
- **axe-core WCAG 2.0/2.1 A + AA + best-practice at 1280 and 390 px on 12 routes + the 404, with animations settled — zero violations of any impact.** (The v1.0 audit ran mid-animation and silently skipped contrast checks; see "Defects" below.)
- 404 with `noindex`; `robots.txt`, `sitemap.xml`, `favicon.svg` served; sitemap lists detail pages; `index.html` carries description/canonical/OG.
- Mobile menu (open, Escape, navigate); category filter; search; complete booking at 390 px (validation errors → review → consent → confirmation → localStorage); persistence after reload; reschedule; cancel.
- **Multi-booking journey:** same guest + same time is blocked; a second guest is allocated a *different* therapist; the booked therapist's slot is disabled; cancelling frees it; "Make another booking" after a reschedule starts a fresh flow.
- Contact form validation and honest non-delivery message; **lightbox covers the viewport with the photo fully on screen**, arrow keys, focus trap, Escape + focus return; skip link first; reduced-motion.

## Customization (actually exercised)
A scratch copy was rebranded **only through `src/config`** (brand name, site URL, SEO title, theme colours, a navigation label, the hero headline, the home gallery section switched off), built and inspected in a browser:
the header/footer showed the new name and nav label, `--c-forest` changed, the headline changed, the gallery band disappeared, and `dist/index.html` + `sitemap.xml` carried the new title, canonical, `og:image` and URLs.
The logo mark (`public/logo.svg`) and the booking text are edited in their own files, as documented.

## Defects found by this QA pass (all fixed — see CHANGELOG 1.1.0)
Imagery (flat, repetitive procedural illustrations; shared pictures; cartoon team portraits); **gallery lightbox positioned below the fold** (fixed overlay inside an animated container); real WCAG contrast failures
(package pills 4.13:1, About numerals 2.31:1) and landmark/heading-order/label-in-name issues hidden by the old audit; **overlapping bookings for the same guest**; "Make another booking" after a reschedule; cache headers marking un-hashed images immutable; missing `LICENSE.md`; no `.sha256` file for the archive;
deprecated Vite config loader (extensionless imports) now run with `--configLoader runner`.

## Known limitations
- **Demonstration-only booking:** availability is simulated; bookings live in the visitor's `localStorage` only (no email, calendar, payment or server) and the UI says so on every booking page, the review step, the confirmation and `/demo-notice`. The contact form and newsletter never claim delivery unless `contact.formEndpoint` is configured (that path is not tested against a live service).
- Client-side rendered SPA: per-page meta is set in the browser; the static head has site-wide defaults. No prerendering.
- Firebase deployment was not executed (no credentials). `firebase.json` has the SPA rewrite, cache and security headers.
- Photography is Unsplash-licensed stock (photographers and source pages are recorded). Some photos show guests being treated — the Unsplash License gives no model releases; replace before launch.
- Accessibility evidence is axe-core + keyboard automation + manual visual review, not a screen-reader session. No Lighthouse run.
- WebKit/Firefox ran on Linux, not on Apple/Android devices.
