# Verification

Everything below was actually run on 2026-10-29 in the build environment (Node 22.22, npm 10.9, Playwright Chromium 1243, Linux). Nothing is claimed that was not run.

| Check | Command | Result |
| --- | --- | --- |
| Clean install | `npm ci` (fresh extract of the release ZIP) | Passed |
| ESLint (+ jsx-a11y) | `npm run lint` | 0 errors, 0 warnings |
| TypeScript | `npm run typecheck` | 0 errors |
| Unit / integration | `npm test` (Vitest, jsdom, Testing Library) | **56 / 56 passed** (4 files) |
| Production build | `npm run build` (sitemap + `tsc -b` + Vite + per-route metadata) | Passed; 26 routes prerendered; initial JS ≈ 78 kB gzip |
| Browser E2E / responsive / axe | `npm run test:e2e` (Playwright) | **79 / 79 passed** (site 34, responsive 15, a11y 30) |

## What the tests cover
**Vitest (56):** menu data integrity (≥30 items, all 8 categories, unique ids, every image file on disk, dietary-vs-allergen consistency — e.g. no "dairy-free" dish listing dairy); menu filtering (category, search with accents, dietary AND filters, vegan⊂vegetarian, allergen exclusion, unavailable items); reservation engine (opening hours, closed days & recurring holidays, past/too-far dates, slot generation, same-day lead time, party-size & seating-area limits, demo capacity, overlapping-stay capacity, "limited" state, area assignment); reservation store (save, persistence hook, duplicate prevention by email/date, modify without self-conflict, cancel, refusing past/cancelled changes, capacity freed on cancel); form validation (contact, private dining, experience); order maths in integer cents; homepage section ordering/hiding; theme application; SEO helpers; storage fallbacks; page-level integration tests (menu tabs/search/filters/empty state, contact form, lightbox keyboard control, journal search).

**Playwright (79):** every route loads with zero console errors/warnings, zero failed requests and zero broken images (14 routes incl. 404); unique titles/descriptions/canonicals/OG tags; desktop and mobile navigation (focus return, Escape); custom 404; menu tabs/search/dietary/allergen filters/empty state/arrow-key tabs; order builder totals + persistence; full reservation flow (validate → review → acknowledge → confirm → reload persistence → modify → cancel with confirmation dialog); duplicate-booking block; closed/past dates disabled; unsuitable seating disabled; calendar keyboard navigation; private dining / experience / contact form validation and demo-only success messaging; lightbox keyboard, focus trap and focus restore; gallery category filter; journal search & article route; **horizontal-overflow checks on all 14 routes at 360, 390, 768, 1024 and 1440 px**; 44 px touch targets; reservation steps within viewport at all five widths; **axe-core (WCAG 2.0/2.1/2.2 A+AA tags) on all 14 routes at 1440 and 390 px plus interactive states** (each reservation step with errors, confirmation, manage list, cancel dialog, filtered/empty menu, lightbox, enquiry dialog, private-dining errors).

## Defects found and fixed during verification
- Header overflowed horizontally at 360 px → compact logo/actions below 480 px.
- WCAG 2.5.3 label-in-name failures (logo, step buttons, "Add to demo order") → visible text now part of the accessible name.
- Step buttons had no accessible name on phones (label hidden with `display:none`) → visually hidden instead.
- Low contrast: unavailable dishes (opacity), demo-notice label in light sections.
- Invalid `<dl>` structure in reservation summary.
- Changing party size on the time step cleared the chosen time even if still valid → time is now kept while bookable and cleared only when no longer available.
- Order-summary amounts showed `$92` rather than `$92.00`.

## Visual review
`review/` contains labelled contact sheets (desktop 1440 px and mobile 390 px, all pages and all seven reservation states). They were inspected for layout, clipping and overlap. Regenerate with `npm run build`, `npm run preview`, then `npm run review` (ImageMagick required). Note: the "Skip to content" link appears in the full-page mobile captures only because fixed elements are re-laid-out when a full-page screenshot is stitched; it is hidden in normal use.

## Not tested / known limitations
- Only Chromium was exercised (no Firefox/WebKit/real devices); the swipe gesture is implemented with touch events and was not exercised on a physical device (keyboard and button navigation are tested).
- Screen-reader testing (NVDA/VoiceOver/JAWS) was not performed; accessibility claims are limited to automated axe-core results, ESLint jsx-a11y and keyboard tests. Automated tools find only a subset of issues.
- No Lighthouse or load/performance benchmark was run.
- Firebase deployment was not executed (no credentials); `firebase.json` is configured but untested against a live project.
- Reservations, enquiries and orders are **simulations** (browser `localStorage` only). Capacity is a deterministic fictional load.
- Time zone: reservation dates/times are local naive values (no time-zone conversion).
- Menu photographs are atmospheric stock images that do not literally depict the named dishes; see ASSET_LICENSES.md for people/likeness caveats.
- Allergen and dietary data are fictional; real restaurants must supply verified data.
- Date-sensitive: E2E tests pick dates relative to "today", and the reservation window is rolling (60 days).
