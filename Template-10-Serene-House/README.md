# OneStop Infinite — Template 10: SERENE HOUSE

A luxury spa, beauty and wellness website template built with **React 19, Vite, TypeScript and React Router**.
Published by **OneStop Infinite**. *SERENE HOUSE is a fictional demonstration brand* — every name, price, team member,
testimonial and article is placeholder content for you to replace.

> **Demo-only functionality.** There is no backend. Bookings are saved to the visitor's own browser (`localStorage`) and are
> **not** sent to any business; availability is simulated; the contact form and newsletter do not deliver anything
> unless you connect your own endpoint. See [VERIFICATION.md](VERIFICATION.md) for details.

## What's included

Home · Treatments (filter, search, detail pages) · Packages (breakdowns + comparison) · Booking (5-step demo flow with simulated availability, duplicate-booking guard, manage/reschedule/cancel)
· About · Gallery (filters + accessible lightbox) · Journal (search, categories, articles) · Contact (validated demo form, hours, demo map)
· Demo notice · 404. Everything is driven from `src/config/` — see [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md).

## Requirements

Node.js 18.18+ (tested on Node 22) and npm 9+.

## Install

```bash
npm ci
```

## Develop

```bash
npm run dev          # http://localhost:5173
```

## Quality checks

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm test             # Vitest unit + integration tests (jsdom)
npm run build        # type-check + production build into dist/
npm run test:e2e     # real-browser checks against the production build (needs Chromium; set CHROMIUM_PATH if not auto-detected)
npm run check        # typecheck + lint + test + build
E2E_BROWSER=firefox npm run test:e2e   # same checks in Firefox (npx playwright-core install firefox first); webkit also supported where the OS libraries exist
```

## Production build

```bash
npm run build
npm run preview      # serve dist/ locally
```

The build also generates `sitemap.xml` and `robots.txt` from your configuration and injects title / description /
canonical / Open Graph tags into `index.html`. **Set your real domain in `src/config/site.ts` (`url`)** or via the
`VITE_SITE_URL` environment variable before building.

## Deploy to Firebase Hosting

`firebase.json` is included (serves `dist/`, rewrites every route to `/index.html`, long-cache for assets).

```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # choose an existing project; keep public dir = dist; do NOT overwrite firebase.json / index.html
npm run build
firebase deploy --only hosting
```

No credentials or API keys are stored in this template. Any other static host works too — configure an SPA fallback to `index.html`.

## Imagery

The demo pictures are licensed stock photography (Unsplash License, each photo individually verified — see [ASSET_LICENSES.md](ASSET_LICENSES.md)).
Replace them with your own photography before launch (CUSTOMIZATION_GUIDE.md §4). Team "portraits" are generated monogram cards;
`npm run images` regenerates those and the demo-map backdrop with Chromium. `scripts/photos/sources.json` records which source photograph
feeds which file (`scripts/photos/build-photos.py` can rebuild them from the original downloads; it is optional and not needed to build the site).

## Project structure

```
src/config/      ← all editable content, branding, theme, booking settings
src/components/  ← shared UI (layout, cards, lightbox, forms)
src/pages/       ← route pages
src/lib/         ← availability, booking store, validation, SEO, formatting
src/styles/      ← CSS (tokens in base.css; colours/fonts overridden from config/theme.ts)
public/          ← favicon, logo, images
scripts/         ← e2e tests, artwork generator, packaging script
```

## Ownership

SERENE HOUSE is fictional. The template is © OneStop Infinite. Bundled fonts are SIL OFL 1.1 — see [ASSET_LICENSES.md](ASSET_LICENSES.md).
