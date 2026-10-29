# Verification — Folio Finance (Template 13)

Run on 2026-10-29, Node 22.22 / npm 10.9, Chromium (Playwright 1.64.1, pre-installed binary), Linux. Everything below was actually executed;
anything not listed was **not** done (see "Not performed").

## Clean-room run (extracted from the hand-off ZIP into an empty directory)

| Step | Command | Result |
| --- | --- | --- |
| Install | `npm ci` | ✅ success (lockfile honoured) |
| Lint | `npm run lint` | ✅ 0 errors, 0 warnings (ESLint + jsx-a11y) |
| Typecheck | `npm run typecheck` | ✅ 0 errors (TypeScript 6, strict) |
| Unit + integration | `npm test` | ✅ **81 tests / 4 files passed** |
| Production build | `npm run build` | ✅ success (SEO files generated, type-check, Vite build, lazy-loaded route chunks) |
| Browser E2E + axe | `npm run test:e2e` | ✅ **134 tests passed** (Chromium) |

The same suites also passed in the working tree before packaging. (The ZIP used for the clean-room run differs from the final ZIP only by this file.)

## What the tests cover

**Unit (`src/lib/*.test.ts`, 47 tests)** — compound growth (closed form vs. an in-test simulation and an *independent* Python Decimal simulation: 10,000 + 300/mo, 5%, 20y → 150,436.50),
zero interest, zero contributions, compounding-frequency monotonicity, series integrity; loan payments (200,000/5%/30y = 1,073.64; 250,000/6.5%/25y = 1,688.02, also checked independently),
amortization to exactly 0, principal repaid = loan, zero interest, one-month term, zero/negative term, yearly roll-ups; break-even (margin, units, rounding up, revenue, target profit,
zero fixed costs, **impossible** price ≤ variable cost); `roundCents` half-up behaviour; number parsing; input validation (blank, text, negative, range, fractional);
plan pricing (monthly, annual = ×12×(1−discount), add-ons, discount clamping); search/filter; contact/booking validation incl. sensitive-number rejection;
booking windows, slot grid, lunch break, overlap handling, localStorage persistence/cancel/corruption; formatting; SEO tag application.

**Integration (`src/test/*.test.tsx|ts`, 34 tests)** — routing, 404s, mobile menu + Escape, active-route marking, services filter/search/empty state/detail routes (all 8),
pricing toggle & add-ons, all three calculators (values, validation, reset, impossible scenario, keyboard tabs), insights search/empty state/article navigation,
contact validation and honest "Not sent" demo result, full booking flow incl. persistence and cancellation dialog, configuration integrity (slugs, cross-references, image files exist,
no invented credentials), and **customization propagation** (brand name, contact email, plan price, home-section order/visibility changed in config → rendered output changes).

**E2E (`e2e/*.spec.ts`, 134 tests)** — every one of 35 routes loads directly (SPA deep links) with HTTP 200, one `h1`, no console errors, no failed/4xx requests, no broken images;
unique titles/descriptions/canonical/Open Graph; robots.txt + sitemap.xml; **no horizontal overflow at 360, 390, 768, 1024, 1440 px on all 35 routes**; mobile menu; keyboard skip link and focus ring;
reduced motion; pricing toggle/add-on/CTA prefill; calculators with charts reflecting input (SVG path changes, data table matches headline result, keyboard chart inspection);
360 px calculator usability; services filter → detail → booking pre-selection; team/industry navigation; full booking flow with persistence across reload, Escape-to-keep and cancellation;
mobile/keyboard calendar; contact validation with focus management; insights search/filter/related.

## Accessibility (axe-core 4.14, tags wcag2a/2aa/21a/21aa/22aa + best-practice)

Scanned: all 35 routes at 1440 px and 390 px (70 scans) + interactive states (annual pricing with add-on and open FAQ, empty states, calculator validation errors, chart table/readout,
loan monthly schedule, break-even impossible state, contact errors, every booking step at both widths, confirmation, cancel dialog, open mobile menu).
**Final result: 0 violations.** Issues found and fixed during the build: brand-link label mismatch, demo strip outside a landmark, low-contrast step numbers, skipped heading levels,
focusable scroll region, calendar day label mismatch, a focus-stealing error summary (found by an integration test), and mobile page overflow caused by an `sr-only` caption
inside a scroll container and by a grid column sizing bug on the loan calculator.

## Visual review

`review/contact-sheet-desktop.jpg` (1440 px) and `review/contact-sheet-mobile.jpg` (390 px) show the top of 18 routes; `review/shots/` holds full-page captures for each.
Regenerate with `npm run review:shots`. The screenshots were inspected manually; the layout issues they revealed (header CTA wrapping on mobile, calculator `$` prefix overlap) were fixed.

## Not performed / limitations

* Chromium only — no Firefox/WebKit runs, no real-device testing, no screen-reader (NVDA/VoiceOver) testing; axe finds only a subset of WCAG issues.
* No Lighthouse/performance budget run; no Firebase deployment was attempted (config provided, not exercised against a live project).
* Lazy images are loaded eagerly by test helpers for the broken-image check; real-world lazy loading was not measured.
* Photographer credits for the Unsplash images were not recorded (the licence does not require them); see ASSET_LICENSES.md.
* Calculators are verified against independently computed references and formulas, but are illustrations only, not validated against any lender or regulator's methodology.
* Booking and contact are demonstrations by design (no backend).
