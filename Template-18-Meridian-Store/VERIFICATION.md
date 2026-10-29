# Verification report

Everything below was **actually executed** on the final code (Node v22.22.0, npm 10.9.4, Chromium from `/opt/pw-browsers`, Linux container, 2026-10-29). Nothing here is aspirational.

## Commands and results

| Step | Command | Result |
|---|---|---|
| Clean install | `npm ci` (in the project and again in a fresh extraction of the release ZIP) | succeeded |
| Lint | `npm run lint` (ESLint 10, typescript-eslint, react-hooks incl. React Compiler rules) | 0 errors, 0 warnings |
| Types | `npm run typecheck` (`tsc -b --noEmit`, strict) | 0 errors |
| Unit + integration | `npm test` (Vitest 5, jsdom, Testing Library) | **7 files, 124 tests, all passed** |
| Production build | `npm run build` | succeeded; route-split chunks (largest app chunk ≈ 245 kB / 76 kB gzip) |
| Browser E2E | `npm run build && npm run test:e2e` (Playwright + axe-core 4.14) | **171 / 171 checks passed** |
| Fresh-extract check | unzip release ZIP → `npm ci` → lint → typecheck → test → build | see "Release archive" below |

## What the unit/integration tests cover

* **Money** — decimal-safe major→minor conversion (`1.005 → 101`, `0.1+0.2 → 30`), JPY/EUR/USD formatting, invalid currency fallback, half-up percentage rounding, inclusive-tax extraction.
* **Pricing** — subtotal, percentage/fixed/free-shipping promos, caps, minimums, expiry boundary, inactive codes, free-shipping thresholds on the discounted subtotal, express shipping, per-extra-item surcharge, regional/inclusive/exclusive tax, tax rounding once per order, taxed shipping option, unsupported destinations, **negative / NaN / out-of-range configuration never yields negative or non-finite totals**.
* **Cart** — add, merge duplicates, invalid/unknown variants, sold-out, coming-soon, invalid quantity, excessive quantity (stock cap and max cap), update/remove/clear, corrupt persisted state, persistence round-trip, **localStorage throwing**, wishlist/recent dedupe, reset.
* **Catalogue** — ≥30 products, unique IDs/slugs/SKUs, every image file exists and has alt text, all stock states present, collections reference real products, search scoring, multi-filter combinations, sort orders, URL round-trip of filters, related products, variant lookup and per-size pricing, config checker catches bad data.
* **Validation / orders** — emails, names, phone, per-country postcodes, required regions, card-number refusal (Luhn, including inside free text), contact and newsletter forms, order creation totals, reference generation, stored-order sanitising.
* **UI flows (integration)** — variant selection updates price/image/stock; low-stock limit; sold-out and coming-soon cannot be bought; fullscreen viewer keyboard; recently viewed; 404; bag totals with coupons; clear/remove; typed excessive quantity; unavailable lines block checkout; slide-out bag and Escape; wishlist add/persist/move-to-bag; shop filters, chips, reset, empty state, sort; collections; journal filter/search; static pages; contact and newsletter validation; **complete checkout flow incl. validation errors, card-number refusal, delivery selection, acknowledgement requirement, confirmation, saved order totals**; stock change between bag and confirmation; order history and missing-order state; reset demo data; customisation propagation (brand, sections, products, prices, shipping/tax, theme).

## What the browser E2E covers (171 checks)

* **Every page × 5 breakpoints (360, 390, 768, 1024, 1440 px)** — 21 routes each: no horizontal overflow, no broken images (lazy images forced to load), exactly one `<h1>`, alt text on every image, no clipped text, no console errors or failed requests.
* **Complete purchase journey at every breakpoint** — product → variant → add to bag → slide-out bag → bag page → promo → checkout (bag, validation errors, details, delivery, review) → confirm DEMO order → order confirmation → order history → wishlist, with overflow/broken-image audits and axe at each stage.
* **axe-core (WCAG 2.0/2.1/2.2 A+AA + best-practice)** — run on all pages at 360/768/1440 px, key pages at 390/1024 px, and every purchasing step and drawer: **no critical or serious violations anywhere**.
* **Behaviour** — search/filters/chips/reset/sort (price, name), filtered deep links, variant price and image changes, zero-stock and low-stock messaging, quantity cap, fullscreen viewer keyboard + focus return, cart drawer focus move/trap/Escape/return, live-region announcement, cart persistence + reload, quantity clamping, invalid coupon, coupon cap + free shipping + tax exact total, destination changing tax treatment, clear bag, wishlist persistence, corrupt localStorage recovery, search overlay, mega menu (click, hover, Escape), missing-image fallback, custom 404 on deep link, `robots.txt` + `sitemap.xml`, per-page SEO tags and product JSON-LD, mobile filter drawer and menu, reduced motion.

## Accessibility findings

* axe-core: **0 critical/serious** across all audited pages and checkout states in the final run. During development axe found, and we fixed: logo accessible name not containing its visible text, undersized/overlapping mega-menu caret targets, content outside landmarks (store notices), and a skipped heading level on product lists.
* The final run reports 5 non-blocking informational notes (a 24 px target-size note for the breadcrumb link on the empty-checkout page at each width); recorded in `e2e-output/results.json` when you run the suite.
* Implemented: semantic landmarks, skip link, labelled form controls with `aria-invalid`/`aria-describedby`, error summaries, focus-managed dialogs (bag, menu, filters, search, viewer) with Escape and focus return, `aria-live` cart/wishlist announcements, `aria-pressed`/`aria-current`, visible focus rings, reduced-motion support, alt text everywhere, 404 page.
* **Not done / not claimed:** no manual screen-reader (NVDA/VoiceOver/JAWS) pass was performed; automated tools find only a subset of issues. Colour contrast was checked by axe on rendered pages only.

## Visual review

Screenshots from the E2E run were assembled into labelled contact sheets in `review/` (committed to the pull request; excluded from the release ZIP): `contact-sheet-{1440,1024,768,390,360}px-pages.jpg` and `…-purchase-flow.jpg`. They were reviewed by eye; issues found and fixed included double-exposed sold-out card images, breadcrumb alignment, a skip-link that appeared in full-page screenshots, and a filter-state race between URL and local state.

## Known limitations

* Demonstration only: no payment, no backend, no real orders; integrations (Shopify, WooCommerce, Stripe) are **not** implemented or tested — extension points are documented in the README.
* Imagery is original procedural illustration, not photography.
* Demo stock is static and not decremented by demo orders.
* Promo codes, prices and tax rates live in client code and are visible to any visitor; a real store must calculate and validate on a server.
* Tax and shipping rates are illustrative, not tax advice. One currency per store.
* No manual screen-reader testing; E2E ran in Chromium only (no Firefox/WebKit/real devices).
* Journal, FAQ, legal and sourcing text are fictional placeholders.

## Release archive

`handoff/OneStop-Infinite-Template-18-Meridian-Store.zip` (≈2.4 MB) plus `…zip.sha256` (verify with `sha256sum -c`). The project sits at the archive root; `node_modules`, `dist`, `.git`, `handoff`, `review`, `e2e-output`, env files and other ZIPs are excluded. The archive's own hash cannot be written inside it — read it from the `.sha256` file or the pull request. The archive was test-extracted into an empty directory and `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` (124 passed) and `npm run build` were run there successfully; `dist/` contained `robots.txt` and `sitemap.xml`. The browser E2E suite was run on the repository checkout, not repeated inside the extraction.
