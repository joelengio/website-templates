# MERIDIAN STORE — Customization guide

Everything a business owner normally edits lives in **`src/config/`**. Components read from these files; you should not need to touch `src/components` or `src/pages` to rebrand the store, replace the catalogue or change commerce rules.

> **MERIDIAN STORE is a fictional demonstration business.** The template publisher, **OneStop Infinite**, is credited separately (`site.publisher` and the footer). Replace the demo copy, imagery and policies with your own before using this commercially.

## Customization map

| I want to change… | Edit | Notes |
|---|---|---|
| Brand name, wordmark, tagline, logo, favicon | `src/config/site.ts` → `brand` | Logo/favicon files live in `public/` (`logo.svg`, `favicon.svg`) |
| Publisher credit in the footer | `site.publisher.credit` | |
| Colours and fonts | `src/config/theme.ts` | Written to CSS variables at start-up. Fonts need a matching `@fontsource/*` import in `src/main.tsx` |
| Header navigation and **mega menus** | `src/config/navigation.ts` → `primaryNav` | Items with `mega` get a mega menu (desktop) and an accordion (mobile) |
| Footer columns | `navigation.ts` → `footerColumns` | Address, phone, social links come from `site.ts` |
| Contact details, hours, social links | `site.ts` → `contact`, `social` | |
| Announcement bar | `site.ts` → `announcement` | `{freeShipping}` is replaced by your configured threshold |
| Demo banner / checkout notice / order prefix | `site.ts` → `demo` | **Keep these while the store is a demonstration** |
| Button and message labels | `site.ts` → `labels`, `newsletter`, `productPage` | |
| Products, variants, prices, stock, images | `src/config/products.ts` | See “Products” below |
| Categories | `src/config/collections.ts` → `categories` | |
| Collections | `collections.ts` → `collections` | Hero image, copy and the ordered product list |
| Homepage section order and visibility | `src/config/home.ts` → `homeSections` | Reorder entries or set `enabled: false` |
| Homepage copy and images | `home.ts` → `homeContent` | |
| Testimonials | `src/config/testimonials.ts` | Use real, permissioned quotes only |
| Journal articles | `src/config/journal.ts` | Body blocks: `p`, `h2`, `quote`, `products` |
| About page | `src/config/about.ts` | |
| FAQ / support | `src/config/faq.ts` | Keep prices quoted in FAQ in sync with `commerce.ts` |
| Legal and policy pages | `src/config/legal.ts` | Placeholder text — get real policies reviewed |
| Currency and locale | `src/config/commerce.ts` → `currency` | One currency per store |
| Shipping zones, methods, free-shipping thresholds | `commerce.ts` → `shipping.zones` | |
| Tax | `commerce.ts` → `tax` | |
| Promo codes | `commerce.ts` → `promos` | |
| Max quantity, low-stock threshold | `commerce.ts` → `maxQtyPerLine`, `lowStockThreshold` | |
| SEO defaults, Open Graph image, site URL | `site.ts` → `seo`, `url` (or `VITE_SITE_URL`) | Per-page SEO is derived from product/article data |
| Imagery | `public/images/` | See “Replacing images” |

The configuration is **strongly typed** (`src/config/types.ts`). TypeScript will flag a missing field, and `checkConfig()` (`src/lib/config-check.ts`, run in development and by the tests) reports duplicate IDs, unknown categories, negative prices, invalid stock, variants that do not match their options, bad tax/shipping values and broken collection references.

## Rebranding in five steps

1. `site.ts`: set `brand.name`, `wordmark`, `wordmarkSub`, `tagline`, `contact`, `social`, `url`.
2. `public/logo.svg` and `public/favicon.svg`: replace the files (keep the file names or update `site.brand.logo` / `favicon`).
3. `theme.ts`: set your palette. Use a contrast checker — body text needs 4.5:1 against its background.
4. Replace products, collections and imagery (below).
5. Rewrite `about.ts`, `home.ts`, `faq.ts`, `legal.ts`, `journal.ts`, `testimonials.ts`.

## Products

Each product is built with the `product({...})` helper in `products.ts` (or write a `ProductInput` object by hand — the type is in `types.ts`). Prices are in **major units** (`285` = $285.00) and converted once to integer cents when the catalogue is built.

```ts
product({
  id: 'MER-1001', slug: 'atelier-tote', name: 'Atelier Leather Tote',
  tagline: 'Full-grain leather, cut to carry a working day.',
  description: '…', category: 'bags-accessories',
  price: 285, compareAt: 340,            // compareAt is optional; it creates a sale
  sku: 'MER-TOTE', added: '2026-09-18',   // `added` drives "Newest" sorting
  new: true, featured: true, best: 1,     // badges / ordering (best = best-seller rank)
  status: 'active',                       // 'active' | 'coming-soon' | 'archived' (hidden)
  colors: [['Cognac', '#9b5d3a', 'cognac'], ['Ink', '#302d2b', 'ink']],   // [label, swatch, image key]
  sizes: { name: 'Size', values: ['S', 'M', ['L', 15]] },                  // ['L', 15] = +15 on the base price
  stock: { 'Ink / M': 0, default: 12 },   // omit for generated demo stock
  features: ['…'], details: [['Material', '…'], ['Dimensions', '…'], ['Care', '…']],
})
```

### Variants

* Options are generated as the cartesian product of `colors` and `sizes`. Each variant gets an ID like `atelier-tote-ink-m`, an auto-generated SKU, its own stock and (for size deltas) its own price.
* Use `colorOption: 'Scent'` (or `'Finish'`) to rename the image-driving option; its values show as text buttons instead of colour swatches.
* For full control write `options` and `variants` directly — each variant lists a value for **every** option, plus `stock`, and optionally `price`, `compareAtPrice` and `sku`.
* Selecting a colour swaps the first gallery image to the image tagged with that option (`ProductImage.option`). Selecting a size changes price and stock.
* The cart stores only `productId`, `variantId` and quantity; prices always come from the catalogue.

### Stock

Stock numbers are **demonstration inventory** and are never decremented by demo orders. 0 = sold out; at or below `lowStockThreshold` the page shows “Only N left (demonstration inventory)”. A product with `status: 'coming-soon'` is visible but cannot be added. When connecting a real backend, load stock from it (see README → Backend integration).

### Replacing images

Images are referenced by path in `products.ts` (`/images/products/<slug>-<key>.webp`). To use your own photography: drop optimised WebP/JPEG files into `public/images/products/`, then change the `images` arrays (or the `img()` helper). Every image needs meaningful `alt` text; the config checker enforces this. Aim for a 4:5 ratio (800 × 1000 px) so product grids stay aligned. The procedural generator (`npm run images`) is for the demo only; delete `scripts/art` when you no longer need it.

## Homepage sections

`homeSections` in `home.ts` is an ordered list: `hero`, `categories`, `new-arrivals`, `collections`, `story`, `best-sellers`, `editorial`, `testimonials`, `journal`, `newsletter`. Reorder the array or set `enabled: false`. “New arrivals” shows products with `new: true`; “Best sellers” uses the `best` rank.

## Shipping, tax and promotions

All in `commerce.ts`; every number is read at calculation time.

```ts
shipping.zones: [{ id: 'us', label: 'United States', countries: ['US'],
  methods: [{ id: 'standard', label: 'Standard delivery', eta: '3–5 business days', price: 8, freeOver: 150 },
            { id: 'express', label: 'Express delivery', eta: '1–2 business days', price: 22 }] }]
```
* The **first method of a zone is “standard”**: it is the one the `FREESHIP` promo and the free-shipping progress bar apply to. The announcement bar, bag progress bar and checkout read the threshold from that method's `freeOver`.
* `freeOver` is compared with the **discounted** subtotal. `perExtraItem` adds a surcharge per additional item.
* Add a country to a zone's `countries` and to `countryNames` and it becomes selectable at checkout (add a postcode rule in `lib/validation.ts` if it needs one).

```ts
tax: { enabled: true, mode: 'exclusive', taxShipping: false, defaultRatePct: 0,
  rates: [{ country: 'US', ratePct: 6, label: 'Sales tax (estimate)' },
          { country: 'US', region: 'CA', ratePct: 7.25, label: 'Sales tax (estimate)' },
          { country: 'GB', ratePct: 20, label: 'VAT included', inclusive: true }] }
```
Rates match by country + region (state code), then country, then `defaultRatePct`. Tax is calculated once on the order (not per line). **These are illustrative demonstration rates, not tax advice.**

```ts
promos: [{ code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your order' },
         { code: 'SAVE20', type: 'fixed', value: 20, minSubtotal: 100, description: '$20 off orders over $100' },
         { code: 'FREESHIP', type: 'free-shipping', value: 0, description: 'Free standard shipping' }]
```
Optional: `minSubtotal`, `maxDiscount`, `expiresAt` (ISO date), `active: false`. **Promo codes in a front-end template are visible to anyone** — validate real codes on a server.

## Currency

Set `commerce.currency` (`{ code: 'EUR', locale: 'de-DE' }`). Formatting uses `Intl.NumberFormat`; zero-decimal currencies such as JPY are handled. Product `currency` fields must match the store currency. The price-filter placeholder labels say `$`; change them in `ProductBrowser.tsx` for other currencies.

## Navigation and mega menus

`primaryNav` entries are `{ label, href }`, optionally with `mega: { columns: [{ title, links }], feature?: { title, text, href, cta, image, alt } }`. Desktop opens on hover, focus or the caret button; Escape closes it. On mobile the same data renders as an accordion.

## Checkout labels and demo wording

`site.demo` (banner, notice, confirm button, order reference prefix) and `site.labels` control checkout wording. The demonstration disclosures are intentionally repeated on every step; do not remove them unless you have replaced the demo checkout with a real, compliant one.

## SEO and deployment settings

`site.url` (or `VITE_SITE_URL` at build time) feeds canonical links, Open Graph URLs, `sitemap.xml` and `robots.txt`, all generated at build time by the plugin in `vite.config.ts`. New products, collections, articles and legal pages are added to the sitemap automatically. Product pages emit schema.org `Product` JSON-LD based on your data — make sure prices and availability are accurate once you go live.
