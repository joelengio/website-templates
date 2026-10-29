# Saffron Table — Restaurant & Fine Dining Website Template

**OneStop Infinite · Template 16** — a premium, fully functional restaurant website built with React 18, Vite, TypeScript and React Router.

> **Everything is demonstration content.** Saffron Table is a fictional restaurant. Reservations, enquiries and the order builder are
> **local simulations**: nothing is sent to a restaurant, booking platform, kitchen or payment provider.

## Pages
Home · Menus · Reserve / My reservations · Experiences (+ detail pages) · Private Dining · Our Story · Gallery · Journal (+ articles) · Contact · Order Builder (demo) · 404

## Quick start
```bash
npm ci
npm run dev        # http://localhost:5173
npm run check      # lint + typecheck + unit tests + production build
npm run preview    # serve the production build on :4173
npm run test:e2e   # Playwright E2E, responsive and axe accessibility suites
```
Requires Node 20+. For E2E, Playwright needs a Chromium browser: run `npx playwright install chromium`, or point
`PW_CHROMIUM_PATH` at an existing Chromium binary.

## Customise
Everything a client changes lives in `src/config/` — brand, colours, fonts, navigation, hours, menu, prices/currency, dietary and
allergen labels, reservation rules, seating areas, experiences, private-dining packages, testimonials, journal, gallery, homepage
section order, SEO. See **[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)** for the exact file-by-file mapping.

## Reservation simulation (important)
The reservation tool is an interactive demonstration of how a booking flow behaves. Availability is generated from a deterministic
*fictional* load plus reservations saved in the visitor's own browser (`localStorage`). It never contacts a restaurant, never confirms a
table, and the UI says so at every step. To go live, replace `src/lib/reservationStore.ts` with calls to your booking provider and
update the copy in `src/config/reservations.ts` (`reservationCopy`) and `site.demo`.

## Food, allergen and dietary disclosures
Dietary indicators and allergen lists are illustrative demo data. The Menus page, order builder and reservation notes show a
configurable warning (`allergyWarning` in `src/config/menu.ts`) directing diners to confirm ingredients and preparation with the
restaurant. Labels are phrased as "…ingredients" (for example "Gluten-free ingredients") and the UI never claims a dish is allergen-free.
Before launch, replace all dish data with accurate, reviewed information and follow your local food-allergen labelling laws.

## Deployment (Firebase Hosting)
```bash
npm ci && npm run build            # outputs dist/
npm i -g firebase-tools
firebase login
firebase init hosting              # public dir: dist · single-page app: Yes · do not overwrite firebase.json
firebase deploy --only hosting
```
`firebase.json` already contains the SPA rewrite (`** → /index.html`), `cleanUrls`, long-term caching for `/assets` and security headers.
`npm run build` also writes per-route HTML files (`dist/menus.html`, …) so each page ships its own title, description, canonical and Open
Graph tags. Before deploying, set `site.url` in `src/config/site.ts` (it feeds canonical links, `sitemap.xml` and `robots.txt`).
Any static host works (Netlify, Cloudflare Pages, S3): configure an SPA fallback to `index.html`.

## Project structure
```
src/config/    all editable content & settings        src/lib/        pure logic (reservations, menu filters, order, validation, SEO)
src/components UI building blocks                       src/pages/      route components
src/styles/    base / components / pages CSS            scripts/        sitemap, prerender, packaging, review screenshots
e2e/           Playwright specs                         public/images/  locally hosted, optimised photography
```

## Testing
`npm run lint`, `npm run typecheck`, `npm test` (Vitest), `npm run build`, `npm run test:e2e` (Playwright + axe-core). `npm run review`
regenerates the contact sheets in `review/`. Results and limits are documented honestly in **[VERIFICATION.md](VERIFICATION.md)**.

## Credits & licensing
Template published by **OneStop Infinite**. Photography: see **[ASSET_LICENSES.md](ASSET_LICENSES.md)**. Fonts: Cormorant Garamond and Inter
(SIL Open Font License, via Fontsource). See [LICENSE](LICENSE).
