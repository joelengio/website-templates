# Verification Report

Run on 2026-10-29 · Node 22.22 · npm 10.9 · Chromium 1243 (Playwright 1.63). Results below are from real runs, including a **fresh extraction of the release ZIP** into an empty directory followed by `npm ci`.

| Check | Command | Result |
| --- | --- | --- |
| Clean install | `npm ci` (from extracted ZIP) | OK — 0 vulnerabilities (`npm audit`) |
| Lint (ESLint + jsx-a11y) | `npm run lint` | 0 errors, 0 warnings |
| Typecheck (TS strict) | `npm run typecheck` | 0 errors |
| Unit + interaction tests | `npm test` | **31 / 31 passed** (3 files) |
| Production build | `npm run build` | OK (sitemap 27 URLs + robots generated, Vite build ~0.6 s) |
| Browser E2E + a11y | `npm run test:e2e` | **26 / 26 passed** |
| Fresh-extract run | unzip → `npm ci` → `npm run check` → `npm run test:e2e` | all passed (same counts) |

## What the tests cover

**Vitest (`src/lib/lib.test.ts`, `src/test/*.test.ts(x)`)**
- Filtering: keyword, multi-filter AND logic, availability toggle, empty result, sorting, URL round-trip and junk-param handling.
- Inquiry validation for every field; property pre-selection (property route and `/contact?property=`); focus moves to first invalid field; demo mode never shows "sent".
- Listings UI: filter → empty state → reset, keyword search, sorting, mobile filter drawer dialog.
- Favorites persisted to localStorage and listed on `/favorites`; compare capped at three with announcement; compare table.
- Gallery next/previous + lightbox with Arrow keys and Escape; mobile menu focus trap, Escape, focus return.
- **Customization:** hiding and reordering home sections, disabling a page (route + nav), hero hidden still yields an `<h1>`, theme config → CSS variables, owner credit separate from demo brand, ≥ 12 unique properties, every image file + alt text exists.

**Playwright (`e2e/*.spec.ts`)** against the production build
- All 12 routes (incl. 404 and two property pages) at **360, 390, 768, 1024 and 1440 px**: no horizontal overflow, no broken images, no console errors.
- Mobile menu by keyboard; skip link; focus on page heading after navigation; filters + URL state + reset + empty state; mobile filter drawer.
- Favorites survive reload; compare limited to three; lightbox keyboard; inquiry form validation and honest demo result; hero search; `prefers-reduced-motion`; sitemap/robots/favicon/canonical/title; deep-link SPA fallback; owner credit in footer.
- **axe-core** (WCAG 2.0/2.1 A + AA) on 10 pages: 0 violations.

## Manual review
Screenshots at 360 px and 1440 px for Home, Properties and Property detail were reviewed visually during development (layout, imagery, readable text over photos).

## Archive
`handoff/OneStop-Infinite-Template-09-Aurel-Estates.zip` — project at archive root, no `node_modules`, `dist`, `.git`, env files, credentials or other ZIPs (enforced by `npm run package`, which also runs `unzip -t`).
Its SHA-256 is written to `handoff/OneStop-Infinite-Template-09-Aurel-Estates.zip.sha256` (a ZIP cannot contain its own hash) and reported in the delivery notes. Re-check with `cd handoff && sha256sum -c OneStop-Infinite-Template-09-Aurel-Estates.zip.sha256`.

## Known limitations
- Client-side rendered SPA; per-page meta is applied in the browser (no prerendering).
- Real form delivery requires configuring `VITE_FORM_ENDPOINT`; that path is unit-tested for validation only, not against a live service.
- Firebase config is provided but was **not deployed** (no project/credentials available here).
- Only Chromium was exercised; Firefox/Safari were not tested.
- Screen-reader testing was automated (axe + role/label assertions), not done with a real assistive technology.
- Demo photographs are Unsplash stock; photographer names are not recorded (see ASSET_LICENSES.md). Replace before commercial launch.
