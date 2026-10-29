# Verification

Run on 2026-10-29, Node 22.22 / npm 10.9, Linux, Chromium (Playwright 1.63, headless). Every line below was actually executed;
nothing is reported as passed that was not run.

| Check | Command | Result |
| --- | --- | --- |
| Clean install | `npm ci` | succeeded, 0 vulnerabilities reported (re-run inside the freshly extracted ZIP, see below) |
| Lint | `npm run lint` | 0 errors, 0 warnings |
| Type check | `npm run typecheck` | 0 errors (app, scripts and e2e) |
| Unit + integration | `npm test` | **7 files, 66 tests passed** |
| Production build | `npm run build` | succeeded (sitemap/robots generated, route-split chunks; main JS ≈ 200 kB / 65 kB gzip) |
| Browser E2E | `npm run test:e2e` | **172 tests passed** (3.1 min, 2 workers) |
| Screenshots | `npm run review` | 23 screens × 2 viewports → `review/desktop-sheet-1…6.jpg`, `review/mobile-sheet-1…3.jpg` |

## What the tests cover

**Unit (`src/lib/*.test.ts`)** — date maths across month/year/DST/leap boundaries; season coverage of all 366 days with no gaps or
overlaps; nightly rates (season × weekend × plan); stays that cross season boundaries; exact fee/tax/discount arithmetic on a controlled
config; best-single-discount selection, code eligibility reasons (adults-only, children, nights, advance days, room, plan); simulated
availability determinism and consumption by local reservations; invalid dates (missing, malformed, past, check-out before check-in,
**zero nights**, too long, too far ahead, seasonal minimum stay); occupancy (no adult, too many adults/children/total, adults-only
room, limits); reservation store (create, persistence across instances, duplicate guest/room/dates, single-unit inventory,
change with re-pricing, non-refundable change refusal, cancel + free inventory, corrupt storage); cancellation policy; room filters,
sorting, URL round-trip.

**Integration (`src/pages/pages.test.tsx`, React Testing Library)** — rooms listing/filter/empty state/availability badges; the full
booking flow to a persisted reservation; guest-detail validation; over-capacity disclosure; invalid promo code; contact form.

**Playwright E2E (`e2e/`)** — home widget → calendar → guests → rooms → rate → details → review → confirmation → manage → cancel
(with price lines reconciling to the total, localStorage persistence and reload); invalid URL dates; duplicate booking blocked;
single-unit room removed once booked; change reservation recalculates total; keyboard-only calendar; promo eligibility messages;
room filters/search/sort with URL persistence; room page CTA with room prepopulated; gallery thumbnails; keyboard lightbox (Esc, arrows,
focus trap, focus return); every route loads with no console errors, no failed requests, no broken or alt-less images, a single `h1`, unique
title, description, canonical and Open Graph tags; 404 for unknown routes and slugs; `robots.txt`, `sitemap.xml`, favicon; SPA deep links;
mobile menu focus trap/Escape; skip link; contact validation; FAQ; experiences, dining, offers eligibility, journal and gallery filters.

**Accessibility** — axe-core with WCAG 2.0/2.1/2.2 A and AA tags: 17 routes + booking with dates + 404, plus calendar and guest picker open,
every booking step (including validation errors), confirmation, manage/change form, cancel dialog, lightbox, mobile menu and the
rooms empty state: **0 violations**. Reduced-motion and visible-focus checks pass. Contrast was fixed during testing
(`--c-terracotta-ink`). Manual screen-reader testing was **not** performed.

**Responsive** — widths 360, 390, 768, 1024 and 1440: all 17 routes have no horizontal scroll and no element outside the viewport;
booking steps, date picker (bottom sheet on phones) and guest selector stay inside the viewport; hero widget and navigation modes
verified. Issues found and fixed in this pass: contact e-mail text overflowing at ≤390 px; calendar popover overflowing by 1 px.

## Issues found and fixed during verification

- Low-contrast kicker text (axe `color-contrast`) → darker ink colour.
- `label-content-name-mismatch` on card links and gallery button → hidden duplicate links, matching labels.
- Controlled checkboxes lagging behind URL updates → filter state held locally and mirrored to the URL.
- Native `<dialog>` let Tab leave the dialog → explicit focus trap.
- Calendar/guest popovers overflowing narrow screens → bottom sheets below 760 px.
- Page-level focus stolen from the booking step heading by the route handler.

## Known limitations (not verified / not provided)

- Booking is a demonstration (simulated availability, local storage, no payments or emails). See README.
- Only Chromium was tested; Firefox/Safari were not run. No manual device testing, no screen-reader testing, no Lighthouse run.
- Images are original generated illustrations, not photography (see ASSET_LICENSES.md).
- Firebase deployment was not performed (no project credentials); `firebase.json` is configuration only.
