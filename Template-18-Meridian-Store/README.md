# OneStop Infinite — Template 18: MERIDIAN STORE

A premium, editorial e-commerce storefront template built with **React 19, Vite, TypeScript and React Router**. It is a complete client-side *demonstration* store with real local cart, wishlist, pricing and checkout logic — and an honest demo checkout that never takes payment.

> **MERIDIAN STORE is a fictional business.** Products, prices, stock, people, testimonials, sourcing stories and policies are invented. Template publisher: **OneStop Infinite**.

**What this is / is not.** It *is* a polished front end with working shopping logic (variants, stock limits, promo codes, shipping zones, tax, order history) driven by typed configuration. It is *not* connected to Shopify, WooCommerce, Stripe or any backend, collects no payment, and places no real orders. Integration points are documented below but **not implemented or tested**.

## Features

* Pages: Home · Shop (30+ products) · Collections (8) and collection pages · Product pages · Bag (slide-out and full page) · Wishlist · 4-step demonstration checkout · Demo order confirmation and history · About · Journal (8 articles) · FAQ/support · Contact · Demo explainer · Legal · custom 404.
* Search, category/price/colour/availability/sale/new filters, sort, active filter chips, results count, responsive filter drawer, shareable filtered URLs.
* Product pages: gallery with thumbnails and fullscreen keyboard viewer, variant/size/quantity selectors that update price, image and stock, sold-out and coming-soon handling, related and recently viewed products, schema.org JSON-LD.
* Money in **integer minor units**; promo codes, free-shipping thresholds, zone shipping, regional tax (inclusive/exclusive).
* Persistence in `localStorage` with defensive parsing and a **Reset demo data** control.
* Accessible by design: semantic HTML, labelled controls, focus-managed dialogs, live announcements, accessible validation, reduced-motion support, axe-core tested.
* SEO: per-page metadata, canonical/Open Graph, generated `robots.txt` + `sitemap.xml`, route-based code splitting, lazy images, Firebase Hosting config.

## Setup

Requires Node.js 18.18+ (tested on Node 22).

```bash
npm ci
npm run dev        # http://localhost:5173
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | ESLint (TypeScript, React hooks) |
| `npm test` | Vitest unit + integration tests (jsdom, Testing Library) |
| `npm run build` | Type-check and production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run test:e2e` | Playwright + axe-core browser tests against a production build (run `npm run build` first; needs Chromium — set `CHROMIUM_PATH` if not auto-detected) |
| `npm run review` | Build labelled desktop/mobile screenshot contact sheets in `review/` from the last E2E run |
| `npm run check` | typecheck + lint + test + build |
| `npm run images` | Regenerate the procedural demo imagery (needs Chromium) |
| `npm run package` | Create the release ZIP and SHA-256 in `handoff/` |

## Project structure

```
src/config/      ← everything you customise (typed): site, theme, navigation, products, collections, commerce rules, content
src/lib/         ← pure logic: money, pricing, cart, catalogue search/filter, validation, orders, SEO, config checker
src/state/       ← persistent stores (cart, wishlist, orders, recent), UI context, actions
src/components/  ← layout, header/mega menu, drawers, cards, gallery, filters, form fields
src/pages/       ← route components (lazy-loaded)
src/styles/      ← base.css · components.css · pages.css
src/test/        ← unit and integration tests
scripts/         ← e2e runner, contact sheets, packaging, procedural art generator
public/          ← logo, favicon, images
```

See **CUSTOMIZATION_GUIDE.md** for the exact customization map.

## Product data management

Products live in `src/config/products.ts`; collections and categories in `src/config/collections.ts`. Use the `product()` helper to generate a variant matrix from `colors` and `sizes`, or write `options`/`variants` by hand. IDs, slugs and SKUs must be unique — `checkConfig()` (run in dev and in tests) tells you what is wrong. To load products from JSON or an API instead, build `ProductInput[]` and pass it to `buildCatalog()` in `src/lib/catalog.ts`.

## Variant configuration

A product defines `options` (e.g. Color, Size) and one `variant` per combination with its own `stock`, optional `price`/`compareAtPrice` and `sku`. The page selects the first in-stock combination; changing an option recomputes the exact variant, its price, gallery and stock message. Values with no stock for the current combination are visibly struck through but remain selectable so the shopper sees *why* an item is unavailable; the Add button is disabled and the cart logic independently refuses invalid, unavailable or out-of-stock variants.

## Cart behaviour

* Cart lines hold only `{ productId, variantId, qty }`; unit prices, names and images are looked up from the catalogue every render, so totals can never be stale or hard-coded.
* Adding validates product status, variant existence, stock and the per-line maximum (`maxQtyPerLine`, default 10). Quantities are clamped (never silently exceeded) and the shopper is told why; duplicates merge into one line.
* Persistence: `localStorage` key `meridian-store:cart:v1`. On load the data is sanitised: malformed lines, unknown variants, duplicates and impossible quantities are dropped. If storage is blocked or throws, the bag still works for the session.
* Changes are announced via an `aria-live` region.

## Pricing calculations

Implemented once in `src/lib/pricing.ts` (`computeTotals`) and used by the bag, drawer, checkout, confirmation and history:

1. **Subtotal** = Σ (variant price × quantity), in integer cents.
2. **Promo discount** (percentage with optional cap, fixed, or free shipping; minimum subtotal, expiry, active flag). Discounts never exceed the subtotal.
3. **Shipping** from the destination's zone. Free-shipping thresholds are compared with the *discounted* subtotal. `FREESHIP` makes the zone's first (“standard”) method free.
4. **Tax** by country/region, calculated **once on the order total** (half-up rounding on integers). Exclusive tax is added; inclusive tax (e.g. VAT) is extracted and shown as “included”. Shipping is taxed only if `tax.taxShipping` is true (or the rate is inclusive).
5. **Total** = discounted subtotal + shipping (+ exclusive tax).

Invalid configuration (negative or non-finite rates, prices, discounts) is clamped, so totals are always finite and non-negative.

## Shipping and tax customisation

Edit `src/config/commerce.ts` (see the guide). Shipping zones group countries; each has methods with `price`, optional `perExtraItem` and `freeOver`. Tax rates match region → country → default. All rates in the template are **illustrative** and not tax advice.

## Demonstration checkout — limitations (read this)

* Steps: bag review → contact + delivery details → delivery method → review and **Confirm DEMO order**.
* **No payment of any kind.** No card, CVV, bank or password fields exist; text fields **refuse input that looks like a card number** (Luhn check).
* **No order is placed, paid for or transmitted.** Confirmation creates a *demo summary* and a reference such as `MER-DEMO-261029-ABCD`, saved in `localStorage` (`meridian-store:orders:v1`) so you can review past demo orders. Nothing is sent to any server or third party.
* A DEMO notice appears on every checkout step, the bag, the confirmation and order history. A required acknowledgement checkbox precedes confirmation.
* Demo orders store the *fictional* contact and address the visitor typed, plus line items and totals. Use **Reset demo data** (Order history, About this demo, or Privacy page) to erase bag, wishlist, recently viewed and orders.
* Inventory is checked again at confirmation; stock is configuration data and is **not** decremented by demo orders.
* The newsletter and contact forms validate input and then discard it.

### localStorage usage

| Key | Contents |
|---|---|
| `meridian-store:cart:v1` | `{ lines: [{productId, variantId, qty}], promoCode }` |
| `meridian-store:wishlist:v1` | `{ ids: [productId] }` |
| `meridian-store:recent:v1` | `{ ids: [productId] }` (recently viewed) |
| `meridian-store:orders:v1` | up to 25 demo orders (sample contact/address, lines, totals) |

No cookies are set and no analytics or third-party requests are made (fonts are self-hosted).

## Production build and Firebase deployment

```bash
npm run build                      # outputs dist/
npm install -g firebase-tools      # once
firebase login
firebase init hosting              # choose an existing project; public dir "dist"; single-page app: yes — do not overwrite firebase.json
firebase deploy --only hosting
```

`firebase.json` already serves `dist/`, rewrites every path to `/index.html` (deep links like `/products/atelier-tote` work), enables clean URLs and sets long-lived cache headers for hashed assets. Set the public URL before building so the sitemap, canonical and Open Graph tags are correct:

```bash
VITE_SITE_URL=https://www.your-domain.com npm run build
```

## Backend integration extension points (not implemented)

The template is structured so a commerce backend can be attached later. None of the following is built or tested here:

| Concern | Where to integrate |
|---|---|
| Catalogue (Shopify / WooCommerce / custom API) | Replace the source of `productInputs` and pass the result through `buildCatalog()` (`src/lib/catalog.ts`). Keep product/variant IDs stable; map remote variant inventory to `Variant.stock`. |
| Cart | `src/state/actions.ts` is the only code that mutates the bag. Swap its internals for a cart API (e.g. Storefront API cart mutations) and keep the same return types. |
| Pricing, shipping, tax, promos | `src/lib/pricing.ts`. A real store must calculate these **on the server**; treat the client numbers as an estimate. |
| Checkout / payment | `confirm()` in `src/pages/Checkout.tsx` currently calls `createOrder()` + `saveOrder()`. Replace it with a call that creates a real checkout session with a PCI-compliant hosted payment page (e.g. Stripe Checkout) — never collect card data in this front end. |
| Orders | `src/state/stores.ts` (`ordersStore`) and `src/pages/Orders*.tsx` → replace with authenticated order lookups. |
| Forms | `Contact.tsx` and `Newsletter.tsx` validate then discard; connect to your email/helpdesk/ESP. |
| Secrets | Never place API secrets in this client app; use a server or serverless function. |

## Testing

```bash
npm ci && npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e
```

* **Unit/integration (Vitest):** money, pricing, promos, shipping, tax rounding, catalogue filters/sort/search, variants and stock, cart logic and persistence, corrupt/blocked storage, validation, orders, config checking, customisation propagation, and UI flows (variants, bag, wishlist, filters, checkout, order history, reset).
* **Browser E2E (Playwright + axe-core):** every page at 360/390/768/1024/1440 px (overflow, broken images, console/network errors, headings, axe), the complete purchase journey at each width, filters/sorting/deep links, keyboard and focus behaviour, persistence, corrupt storage, missing images, SEO tags, reduced motion.

Actual results are recorded in **VERIFICATION.md**.

## Licence and assets

See `LICENSE` and `ASSET_LICENSES.md`. All imagery is original procedural artwork generated by this project; there are no third-party photos or trademarks.
