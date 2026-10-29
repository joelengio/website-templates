# Verification report — VIGOR CLUB (Template 11, v1.1.0)

Independent QA run on 2026-10-29 · Linux · Node 22.22 · npm 10.9 · Chromium 1243, Firefox 155, WebKit 27.2 (Playwright-core 1.64).
Everything below was actually executed on the final source tree. Screenshot contact sheets and the written review are in `documentation/review/`
(kept in git, not shipped in the ZIP).

## Automated results
| Check | Command | Result |
|---|---|---|
| Clean install | `npm ci` (also repeated inside a fresh extraction of the release ZIP) | OK — `npm audit`: 0 vulnerabilities (prod and dev); prod licences MIT / OFL-1.1 only |
| TypeScript (strict) | `npm run typecheck` | 0 errors |
| ESLint | `npm run lint` | 0 errors, 0 warnings |
| Unit + integration tests | `npm test` | **106 / 106 passed** (4 files) |
| Production build | `npm run build` | OK; sitemap.xml (32 URLs) + robots.txt generated; no Vite warnings |
| Browser checks — Chromium | `npm run test:e2e` | **66 / 66 passed** |
| Browser checks — Firefox 155 | `E2E_BROWSER=firefox node scripts/e2e.mjs` | **66 / 66 passed** |
| Browser checks — WebKit 27.2 | `E2E_BROWSER=webkit node scripts/e2e.mjs` | **66 / 66 passed** |
| Fresh-extract run | unzip → `npm ci` → `npm run check` → `npm run test:e2e` | passed — the final ZIP was extracted into an empty directory and the same four commands were run there (same counts as the rows above) |

### Vitest (106 tests)
Config integrity (counts, unique slugs/ids, program ↔ trainer ↔ class consistency, plans ↔ comparison, every referenced image exists with alt text, template-owner credit, demo mode);
schedule logic (Monday-first weeks, deterministic demo occupancy, booking cut-off, availability, overlap detection, booking window);
**reservations** — book, duplicate prevention, same class other date, time-clash prevention, cancel, corrupt/blocked storage, **closed and full classes rejected by the logic layer (not only hidden by the UI)** and **a stale second tab cannot double-book or cancel the wrong list**
(dated cases run on a fixed clock so they cannot expire);
validation; program/article filters; **monthly/annual pricing and savings**; form submission (demo / endpoint success / HTTP error / network failure); storage safety; SEO tags;
every page renders with one `h1`; booking modal flow; membership toggle and signup without payment claims; contact "Message not sent"; lightbox/menu focus; customization (brand, phone, hero copy, section visibility/order, plan price, nav, theme).

### Browser checks (`scripts/e2e.mjs`; same 66 checks in each engine)
- 13 routes × **360, 390, 768, 1024, 1440 px**: no horizontal overflow, no broken images, one `h1`, alt text, targets ≥ 24 px, web fonts loaded, no console errors, no failed requests.
- **axe-core WCAG 2.1 A/AA + best-practice at 1280 and 390 px on all 13 routes, animations settled — zero violations of any impact**, plus the open booking modal.
- Direct nested-route loads; in-app 404 (`noindex`); robots/sitemap/favicon/logo; static head + per-page title/canonical/OG.
- Mobile menu; program filters/search; **schedule + booking** (day/filter/empty states, modal focus-in, Tab trap, inert background, Escape + focus return, validation, confirmation with demo disclosure, localStorage persistence, Booked/Manage duplicate prevention, reload, keep/cancel, deep link);
  **a stale second tab cannot book the same class twice; a full class shows no form and says it is full (demo)**.
- Membership toggle/comparison/preselect/signup validation/no-payment completion; contact honest non-delivery; lightbox keyboard + focus return; skip link; `prefers-reduced-motion`; page still works with `localStorage` blocked.

## Customization (actually exercised)
A scratch copy was rebranded **only through `src/config`** (brand name and monogram, site URL, SEO title/suffix, phone, accent colour, a navigation label, a CTA label, hiding the home "ticker" section), built and inspected in a browser:
header/footer showed the new name and labels, `--c-lime` changed, the ticker disappeared, the static `index.html` head and `sitemap.xml` carried the new title/canonical/URLs, and page `<meta>` descriptions used the new brand name.
This exposed one defect, fixed: nine pages hard-coded "VIGOR CLUB" in their meta descriptions and the demo notice instead of using `site.brand.name`.

## Defects found by this QA pass (all fixed — see CHANGELOG 1.1.0)
Imagery (blob-silhouette hero, blank-face trainer silhouettes, repetitive illustrations, two journal pairs sharing a picture); booking rules enforced only in the UI and stale-tab double booking; time-bomb unit tests;
heading-order skips; hard-coded brand in meta descriptions; year-long `immutable` caching of un-hashed images; deprecated Vite config loader; stale review sheets showing the old art. (Photography and logic were re-verified in the browser afterwards.)

## Known limitations
- **Demonstration-only booking and enquiries:** reservations, membership enquiries and demo occupancy numbers live only in the visitor's browser (`localStorage`) and are simulated; nothing is sent, no payment is taken, no membership is created. The UI says so wherever it matters. The contact/enquiry endpoint path (`site.forms.endpoint`) is unit-tested but was not exercised against a live service.
- Client-side rendered SPA: per-page meta is set in the browser; the static head has site-wide defaults. No prerendering.
- Firebase deployment was **not executed** (no credentials); `firebase.json` has the SPA rewrite, cache and security headers and was only exercised through `vite preview`.
- Photography is Unsplash-licensed stock with no model/property releases, some showing people and incidental equipment brands — see ASSET_LICENSES.md; replace before launch.
- Accessibility evidence is axe-core + keyboard automation + visual review, not a screen-reader session. No Lighthouse run. Firefox/WebKit ran on Linux, not on Apple/Android devices.
- Time-dependent UI ("Closed" classes) changes through the day by design.
