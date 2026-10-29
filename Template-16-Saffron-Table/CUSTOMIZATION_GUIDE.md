# Customization Guide

All client-facing content is configured in `src/config/`. Components never hard-code brand text, prices or hours (except short UI
labels such as button text). After any change run `npm run dev` to preview and `npm run check` before delivery.

## Mapping: what to change → where

| You want to change… | File → export |
| --- | --- |
| Restaurant name, tagline, cuisine description, short description | `src/config/site.ts` → `site.brand` |
| Logo mark | `src/components/Logo.tsx` (SVG) and `public/favicon.svg`, `public/apple-touch-icon.png` (180×180) |
| Favicon | `public/favicon.svg`, `public/apple-touch-icon.png`, `<link>` tags in `index.html` |
| Production URL (canonicals, sitemap, robots) | `site.url` |
| Demo banner / demo mode wording | `site.demo` (also footer text `site.footer.legal`) |
| Phone, email, address, map label, directions | `site.contact` |
| Opening hours *display* (footer, contact) | `site.hoursDisplay`, `site.hoursNote` |
| Opening hours *booking rules* | `src/config/reservations.ts` → `reservationSettings.hours` |
| Social links | `site.social` (supported icons: Instagram, Facebook, Pinterest; others use a generic icon) |
| Restaurant policies | `site.policies` |
| Header navigation, header CTA | `site.nav`, `site.headerCta` |
| Footer columns and legal text | `site.footer` |
| OneStop Infinite publisher credit | `site.publisher` (`showCredit`) |
| Colours | `src/config/theme.ts` → `theme.colors` (applied as CSS variables `--c-*`) |
| Fonts | `theme.fonts` **and** the `@fontsource` imports in `src/main.tsx` (`npm i @fontsource/<font>`) |
| Page SEO titles / descriptions / social images | `src/config/site.ts` → `seo` (per route); experiences use `experiences.ts`, articles use `journal.ts` |
| Feature switches (order builder, reservations, journal, gallery, private dining, scroll reveal) | `src/config/features.ts` → `features` |
| Homepage sections: order and visibility | `src/config/home.ts` → `homeSections` (move entries / set `enabled: false`) |
| Homepage copy and images | `home.ts` → `homeContent` |
| Call-to-action labels and targets | `homeContent.*.primaryCta / cta`, `site.headerCta`, page components |
| Menu categories | `src/config/menu.ts` → `menuCategories` |
| Menu items, prices, photos, availability | `menu.ts` → `menuItems` |
| Currency & number format | `menu.ts` → `currency` (`code`, `locale`) |
| Dietary labels (names, short codes, filter visibility) | `menu.ts` → `dietaryLabels` |
| Allergen labels | `menu.ts` → `allergenLabels` |
| Allergy warning text | `menu.ts` → `allergyWarning` |
| Featured menu sections on Menus page | `menu.ts` → `featuredMenuSections`, `menuPageContent.showFeaturedSections` |
| Signature dishes on the homepage | `homeContent.signature.itemIds` |
| Tasting menus (homepage "Featured menus") | items with `category: 'tasting'` in `menuItems` |
| Order tax, service charge, max quantity | `features.ts` → `orderSettings` |
| Reservation interval, duration, party limits, booking window, lead time | `reservations.ts` → `reservationSettings` |
| Seating areas, capacity, party limits | `reservationSettings.seatingAreas` |
| Closed dates (recurring `MM-DD` or `YYYY-MM-DD`) | `reservationSettings.closedDates` |
| Fictional "busy-ness" of the room | `reservationSettings.demoLoad` |
| Reservation disclaimer copy | `reservations.ts` → `reservationCopy` |
| Experiences | `src/config/experiences.ts` |
| Private dining spaces, packages, menus, event types, lead time | `src/config/privateDining.ts` |
| Story, chef biographies, team, testimonials, awards | `src/config/content.ts` |
| Journal categories and articles | `src/config/journal.ts` |
| Gallery categories and images | `src/config/gallery.ts` |
| Image registry (alt text, files) | `src/config/images.ts` |

## Recipes

### Rebrand
1. Edit `site.brand`, `site.contact`, `site.url`, `site.social`, and `hoursDisplay`.
2. Edit colours/fonts in `theme.ts`; swap font packages and imports in `src/main.tsx`.
3. Replace `public/favicon.svg` and `public/apple-touch-icon.png`, update `Logo.tsx`.
4. Rewrite `seo` entries; run `npm run build` to regenerate `sitemap.xml` / `robots.txt` and per-route HTML.
5. Remove demo labels once content is real: set `site.demo.enabled = false`, and delete fictional awards/testimonials (or hide the sections).

### Add a menu item
Append to `menuItems`:
```ts
{ id: 'unique-id', name: 'Dish', description: '…', price: 24, category: 'mains', image: 'image-key',
  dietary: ['vegetarian'], allergens: ['dairy'], available: true }
```
`dietary` ids must exist in `dietaryLabels`; `allergens` ids in `allergenLabels`; `image` (optional) must be a key in `images.ts`.
Unit tests (`npm test`) fail if ids are duplicated, categories/labels are unknown, images are missing, or dietary tags contradict allergen
lists (for example a "dairy-free" dish listing dairy). Keep allergen data accurate: a wrong label is a safety issue.

### Add a currency
Change `currency` to e.g. `{ code: 'EUR', locale: 'de-DE' }`. Prices are stored in major units (`34` = €34).

### Change reservation rules
- 45-minute slots: `slotIntervalMinutes: 45`; longer stays: `diningDurationMinutes: 150`.
- Close Tuesdays: set `hours[2] = []`. Add a lunch service: add `{ label: 'Lunch', open: '12:00', lastSeating: '14:00' }` to a weekday array.
- Larger parties: raise `maxPartySize` and each area's `maxParty`. Tighten capacity by lowering `seatingAreas[].capacity`.
- Show more/less "busy" demo data via `demoLoad.weekdayLoad` (0 empty … 1 full).

### Reorder or hide homepage sections
```ts
export const homeSections: HomeSection[] = [
  { id: 'hero', enabled: true },
  { id: 'signature', enabled: true },
  { id: 'awards', enabled: false },   // hidden
  …
];
```
Valid ids: `hero, concept, signature, philosophy, menus, atmosphere, privateDining, awards, testimonials, journal, reserveCta`.

### Add pages to the sitemap / prerender
Add a `seo['/your-route']` entry in `site.ts` (static routes) — `scripts/routes.ts` picks it up automatically.

### Replace photography
Put a 1280 px master (`name.jpg`) and 640 px thumbnail (`name-640.jpg`) in `public/images/`, register it in `images.ts` with real alt text, and update
`ASSET_LICENSES.md` with its genuine source and licence. Portrait masters should be ≤1280 px on the long side.

### Connect real services
- **Reservations:** replace the persistence/validation calls in `src/lib/reservationStore.ts` with your provider's API; keep the pure rules in `src/lib/reservations.ts` for client-side checks. Remove the "demo" wording in `reservationCopy`.
- **Enquiry/contact forms:** `src/components/Forms.tsx` calls `saveInquiry(...)` (local only). Replace with a `fetch` to your form backend and only show success after a real success response.
- **Order builder:** disable via `features.orderBuilder = false` or integrate a real ordering provider; never reuse the demo totals as a payment amount.
