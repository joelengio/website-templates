# Verification report — Template 10: SERENE HOUSE (v1.0.0)

Environment: Linux, Node 22.22, npm 10.9, Chromium (Playwright-core, headless). All commands run inside `Template-10-Serene-House/`.
The ZIP's SHA-256 is reported in the pull request / hand-off message (it cannot be embedded in a file that is inside the ZIP).

## Automated results

| Check | Command | Result |
|---|---|---|
| Install from lockfile | `npm ci` | OK, 0 vulnerabilities reported |
| TypeScript (strict, noUnused*) | `npm run typecheck` | Pass, 0 errors |
| Lint | `npm run lint` | Pass, 0 errors / 0 warnings |
| Unit + integration tests | `npm test` | **39 / 39 passed** (4 files) |
| Production build | `npm run build` | Pass; route-level code-splitting; sitemap.xml + robots.txt generated |
| Real-browser checks | `npm run test:e2e` | **36 / 36 passed** |

### Vitest coverage (what is actually tested)
- Availability engine: deterministic hashing, Sunday closed, 42-day window, closing-time limits, therapist double-booking prevention, cancelled bookings freeing slots, reschedule ignoring itself.
- Booking store: create / persist / update / cancel; survives corrupt localStorage. Pricing (per guest, fixed couples price), specialty matching.
- Validation rules for booking and contact forms.
- Config integrity: unique slugs, valid categories, positive prices, savings ≥ 0, every referenced image exists on disk, alt text present.
- UI flows (React Testing Library): routing + per-page title/canonical/OG, 404s, mobile menu aria + Escape, treatment filter/search/empty state/clear, gallery lightbox keyboard (arrows, wrap, Escape), journal search, contact form errors and non-delivery disclosure, **full booking flow** (service → therapist → date/time → validated details → review/consent → confirmation → saved to localStorage → cancel from My Bookings), URL preselection, empty state.
- Customisation: hiding homepage sections, rebranding name/phone, adding a treatment, theme colour variables.

### Browser checks (Chromium, `scripts/e2e.mjs`)
- 12 routes × viewports **360, 390, 768, 1024, 1440 px** loaded by direct URL: no horizontal overflow, no broken images (lazy images forced to load), exactly one `<h1>`, every image has `alt`, no interactive target < 24 px, no console errors, no failed/4xx requests.
- axe-core (WCAG 2.0/2.1 A + AA) on all 12 routes: no serious/critical violations.
- Unknown URL → in-app 404 with `noindex`; `/robots.txt`, `/sitemap.xml`, `/favicon.svg` served; sitemap includes detail pages; `index.html` carries description/canonical/OG tags.
- Mobile (390 px): hamburger open/close/Escape/navigation; category filter; search; complete booking flow incl. validation errors, consent, confirmation and localStorage persistence; persistence after reload; reschedule; cancel; contact form validation and non-delivery disclosure; lightbox open/arrow/focus trap/Escape/focus return; skip link is first Tab stop; `prefers-reduced-motion` shows content immediately.
- Screenshots of all routes at 390 and 1440 px were captured to `e2e-output/` (git-ignored) and the home, booking and package pages were inspected by eye.

### Defects found by these tests and fixed
- Horizontal overflow on `/packages` (screen-reader-only text inside the comparison table escaped its scroller).
- Horizontal overflow on `/contact` at ≤ 390 px (map box min-height/aspect-ratio).
- Breadcrumb links under minimum target size.
- Skip link was not the first Tab stop on initial load (focus was moved to `<main>`).
- Gold eyebrow/label text failed colour contrast (axe); added a darker `goldInk` token.
- Brand link accessible name did not contain its visible text.
- Calendar offered days on which the chosen therapist had no free slot (now disabled as "fully booked").
- Clicking *Submit* right after leaving an invalid field could be lost because the error message vanished on blur and shifted the button; errors now only clear while typing.

## Cross-checks not performed / limitations
- **Only Chromium** was tested. Firefox/Safari were not available; layouts use standard CSS (grid, flex, `aspect-ratio`, `dvh`) but are unverified there.
- No physical mobile device or screen-reader (NVDA/VoiceOver) testing; accessibility evidence is axe-core + keyboard automation + manual review of semantics.
- No Lighthouse run. Build output is split per route (initial JS ≈ 83 kB gzip), images are WebP and lazy-loaded.
- Firebase deployment was not executed (no credentials); `firebase.json` contains the SPA rewrite and cache headers but has not been deployed.
- The clean-install ZIP test result is in the hand-off message (see "ZIP verification").

## Demonstration-only functionality (by design)
- **Booking**: availability is generated locally and deterministically; bookings live in the visitor's `localStorage` only. No email, calendar, payment or server. Not synchronised across devices/browsers. Disclosed on the booking pages, review step, confirmation and `/demo-notice`.
- **Contact form**: validated only. With no `contact.formEndpoint` it states plainly that nothing was delivered and offers a `mailto:` link.
- **Newsletter**: validates the address and discloses that nothing is stored or sent.
- **Map**: an illustration labelled "Demonstration location — not a real address" (a real embed can be configured).
- **Content**: brand, address, phone (555-01xx), email (`.example`), team, testimonials, articles and prices are fictional. Social links point to the networks' home pages as placeholders.
- **Imagery**: original generated illustrations, not photography (see ASSET_LICENSES.md). Team portraits are abstract illustrations.

## Outstanding / recommended follow-ups
- Replace illustrations with licensed photography for a real client.
- Add Firefox/WebKit runs to `test:e2e`.
- Add a real backend adapter for booking/contact in `src/lib/` when a client needs one.
- Step 1 of the booking flow lists all treatments in one long list on phones; a search box could be added.
