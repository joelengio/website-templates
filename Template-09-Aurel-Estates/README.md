# OneStop Infinite Template 09 — Aurel Estates

A premium, resellable **real estate website template** built with **React 18 + Vite + TypeScript**.
Design: luxurious editorial real estate — deep forest green, ivory and brass, Cormorant Garamond + Inter, architectural photography.

> **Template owner:** OneStop Infinite. **Demo brand:** "Aurel Estates" — a *fictional* agency. All listings, people, prices, addresses and statistics are invented.

## Features

- **7 page types:** Home, Properties (listings), Property details, About / Team, Services, Journal / Guides (+ article pages), Contact — plus Favorites, Compare and 404.
- **15 fictional demo properties** with photo galleries, specs, descriptions and features.
- **Search, multi-filter, sort, reset, empty states** — type, neighborhood, price range, bedrooms, bathrooms, features, hide "under offer". Filter state lives in the URL (shareable links).
- **Responsive mobile filter drawer**, active-filter chips, live result count for screen readers.
- **Interactive gallery** with thumbnails, keyboard-operable lightbox (←/→/Esc, focus trap, focus return).
- **Favorites** (localStorage, synced across tabs) and **Compare up to 3** (tray + side-by-side table).
- **Inquiry form** with accessible validation, selected property auto-populated, honeypot, and **honest demo mode** (no fake "sent" message when no endpoint is configured).
- **Config-driven:** brand, logo, colours, fonts, copy, navigation, footer, CTAs, properties, images, and section order/visibility.
- **Accessibility:** skip link, focus management on route change, focus-trapped dialogs, `prefers-reduced-motion`, axe-core checked (WCAG 2.1 A/AA).
- **SEO:** per-page title/description/canonical/Open Graph, favicon, generated `sitemap.xml` + `robots.txt`.
- **Firebase Hosting** config included (`firebase.json`, SPA rewrite, cache headers).

## Quick start

```bash
npm ci            # clean install from the lockfile (Node >= 20)
npm run dev       # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Generates sitemap/robots, typechecks, builds to `dist/` |
| `npm run preview` | Serves the production build on :4173 |
| `npm run lint` | ESLint (incl. jsx-a11y) |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm test` | Vitest unit + interaction tests (jsdom) |
| `npm run test:e2e` | Playwright browser tests (responsive widths, keyboard, axe a11y). Needs Chromium: `npx playwright install chromium`, or set `PW_CHROMIUM_PATH` |
| `npm run check` | lint + typecheck + unit tests + build |
| `npm run seo` | Regenerate `public/sitemap.xml` and `public/robots.txt` |
| `npm run package` | Rebuild the hand-off ZIP in `handoff/` |

## Deploy to Firebase Hosting

```bash
cp .firebaserc.example .firebaserc     # put your project id in it
npm run build
npx firebase-tools deploy --only hosting
```

Set your real domain first (`src/config/site.ts → url`, or `VITE_SITE_URL=https://… npm run build`).

## Project structure

```
src/config/      ← ALL editable content (site, theme, navigation, layout, content, properties, images, features)
src/components/  reusable UI (cards, filters, gallery, forms, header/footer…)
src/pages/       route components
src/lib/         pure logic (filters, validation, formatting, SEO, theming)
src/hooks/       favorites/compare store, dialog focus-trap, reveal-on-scroll
src/styles/      main.css (design tokens → components)
public/          images, favicon, robots.txt, sitemap.xml
e2e/             Playwright specs
scripts/         SEO generator, release packager
```

## Documents

[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) · [VERIFICATION.md](VERIFICATION.md) · [ASSET_LICENSES.md](ASSET_LICENSES.md) · [CHANGELOG.md](CHANGELOG.md) · [LICENSE.md](LICENSE.md)

## Known limitations

- Client-side rendered SPA: per-page meta tags are set in the browser; crawlers that do not run JavaScript see the default tags. Add prerendering for stronger SEO if needed.
- Forms need a real endpoint (see guide) to deliver inquiries; there is no bundled backend.
- No map or mortgage calculator is included (no third-party keys are shipped).
- Photography is Unsplash stock — replace before commercial launch (see ASSET_LICENSES.md).
