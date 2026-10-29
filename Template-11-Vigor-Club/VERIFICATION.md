# Verification report — VIGOR CLUB (Template 11)

Run on 2026-10-29, Node v22.22.0 / npm 10.9.4, Chromium (Playwright 1.64 `playwright-core`) on Linux.
Everything below was actually executed on the final source tree; nothing is claimed that was not run.

## Automated results
| Check | Command | Result |
|---|---|---|
| Clean install | `rm -rf node_modules && npm ci` | ✅ success, 0 vulnerabilities reported |
| TypeScript | `npm run typecheck` | ✅ no errors |
| ESLint | `npm run lint` | ✅ no errors, no warnings |
| Unit + integration tests | `npm test` (Vitest + Testing Library, jsdom) | ✅ **104 / 104** passed in 4 files |
| Production build | `npm run build` | ✅ built; `sitemap.xml` + `robots.txt` emitted |
| Browser E2E (production build) | `npm run test:e2e` | ✅ **64 / 64** checks passed |
| Final ZIP | `npm run package`, then extract → `npm ci` → `npm run check` | see "Release ZIP" below |

### Vitest coverage (104 tests)
* **Config integrity** — required content counts, 8 required programs, unique slugs/ids, program ↔ trainer ↔ class
  consistency, categories, fictional-credential labelling, plan ↔ comparison completeness, every referenced image exists on disk,
  template-owner credit, demo mode (no endpoint).
* **Logic** — time/date formatting, week dates, Monday-first weekdays, deterministic demo occupancy, booking cut-off, availability,
  overlap detection, booking window, **booking / duplicate prevention / time-clash prevention / cancellation / corrupt-storage /
  blocked-storage**, validation (profile, contact, signup), program + article filters, related articles, **monthly/annual pricing**,
  form submission (demo / endpoint success / HTTP error / network failure), storage safety, SEO tags.
* **Pages & routes** — every page, all 8 program, 6 trainer and 8 article pages render with a single `h1`; four 404 paths; active-route
  indication; program search/filter/empty state; schedule day/filter/empty states; booking modal flow (validation → confirmation →
  localStorage → Manage → cancel); restore after reload; Escape handling; closed classes; membership toggle, comparison table, signup
  flow without payment claims; contact validation and "Message not sent" disclosure; journal search; lightbox keyboard/focus return;
  mobile menu; footer credit/disclaimer.
* **Customization** — changing brand name, phone, hero copy, section visibility/order, plan price, program name, navigation and
  theme colours propagates to the rendered site.

### Browser E2E (Playwright + axe-core) — 64 checks
* **Five widths (360, 390, 768, 1024, 1440) × 13 routes**: no horizontal overflow, no broken images (lazy images forced to load),
  exactly one `h1`, all images have `alt`, no interactive element smaller than 24 px, web fonts loaded; no console errors or failed/4xx requests.
* **axe-core WCAG 2.1 A/AA** (includes colour contrast) at 1280 px and 390 px on all 13 routes, plus the open booking modal: **0 violations
  (serious, critical and moderate)**.
* Direct loading of nested routes; in-app 404 (noindex) for unknown URLs and slugs; `robots.txt`, `sitemap.xml`, `favicon.svg`, `logo.svg`;
  index.html and per-page title / canonical / Open Graph.
* Mobile menu open/Escape/navigate; program filters, search, URL-addressable search, card → detail.
* **Schedule & booking** at 390 px: day selection, class-type filter + empty state, trainer filter, modal focus-in / Tab trap / inert background / Escape + focus
  return, validation errors, confirmation with demo disclosure, localStorage persistence, "Booked/Manage" duplicate prevention, survival after reload,
  keep vs. cancel, empty state after cancel, `?day=&class=` deep link.
* **Membership**: toggle changes prices; comparison table scrolls inside its own region without page overflow; plan preselection; signup validation;
  completion screen states that no membership/payment occurred.
* **Contact**: validation errors; success path says "Message not sent" (no backend).
* Lightbox keyboard open, ←/→, focus trap, Escape + focus return. Skip link first in tab order. Visible 3 px focus outline.
* `prefers-reduced-motion`: content visible immediately, animations disabled. Page still renders with `localStorage` blocked.

Raw results are written by the script to `e2e-output/results.json` (git-ignored).

## Visual review
`npm run review` captured all 13 routes at 360, 390, 768, 1024 and 1440 px and wrote labelled contact sheets to `review/`:

* `review/desktop-1440-sheet-1.jpg` … `-3.jpg`
* `review/tablet-1024-768-sheet-1.jpg`, `-2.jpg` (1024 px and 768 px)
* `review/mobile-390-sheet-1.jpg`, `-2.jpg` and `review/mobile-360-sheet-1.jpg`, `-2.jpg`
* `review/mobile-interactions-sheet.jpg` (mobile menu, class modal, booking confirmation, annual pricing, comparison table, lightbox, form errors)

The sheets were inspected by eye. Issues found and fixed during QA: reveal animations leaving content hidden after fast jumps; a
page-wide horizontal overflow caused by visually-hidden text inside the scrolling comparison table; unreadable contrast on
"closed" class rows; link/aria-label mismatches flagged by axe; an undersized "All articles" link; hero artwork cropped behind the
headline. No open critical or high-severity issues remain. Long pages are cropped in the sheets (marked "page continues").

## Release ZIP
`handoff/OneStop-Infinite-Template-11-Vigor-Club.zip` with `handoff/OneStop-Infinite-Template-11-Vigor-Club.zip.sha256`.
Extraction, clean install and build of the archive are recorded in the delivery report/PR description (the ZIP cannot contain its own checksum).

## Known limitations (honest list)
1. **Imagery is generated illustration, not photography.** A licensed photo set could not be verified/obtained in the build environment, so none was
   used rather than inventing licence data. Replace before a real launch (see ASSET_LICENSES.md and CUSTOMIZATION_GUIDE.md §9).
2. Booking, membership signup and enquiries are **demonstrations** (browser-only). No real backend, email, calendar, payments or accounts.
   Demo occupancy numbers are simulated.
3. Social links point to platform home pages as placeholders; address/phone/email are fictional (`.example` domain, 555 number).
4. Tested in Chromium only (no Firefox/WebKit/real devices); screen-reader testing was not performed — only axe-core and keyboard checks.
5. Firebase config was written but **not deployed** (no credentials); the SPA fallback was verified via `vite preview` only.
6. The LICENSE file contains draft terms for the template owner to confirm.
7. Unit tests use a fixed fake date; schedule UI states that depend on the current time (e.g. "Closed") change through the day by design.
