# OneStop Infinite — Template 15: Haven Stays

A complete boutique hotel & luxury resort website template: **React 18 · Vite · TypeScript · React Router**, hand-written responsive CSS,
no UI framework. It includes a fully working **booking demonstration** (dates, guests, rooms, rate plans, seasonal pricing, taxes,
discounts, local reservations you can view, change and cancel).

> **Booking limitations — read this.** The booking engine is a front-end demonstration. Availability is **simulated** from a
> deterministic function plus the reservations stored in the visitor's own browser (`localStorage`). Nothing is sent to a hotel or
> channel manager, **no payment is taken**, no email is sent, and nothing is guaranteed. The site says so wherever it matters. Going live
> means replacing `src/lib/reservations.ts` (and the availability source) with your property-management / booking provider.

"HAVEN STAYS" is a fictional brand. The publisher (OneStop Infinite) is kept separate from the hotel brand in `src/config/site.ts`.

## Pages

Home · Rooms & Suites (filters, search, sort, empty states) · Room detail (gallery + lightbox, rates by season, simulated
availability calendar, related rooms) · Booking · Confirmation · Manage reservations · Reservation detail (change / cancel) · Dining +
venue pages with menus · Experiences + detail · Offers + detail (eligibility checker) · Gallery (categorised lightbox) · About · Explore ·
Journal + articles · Contact (validated form, FAQ, directions, policies) · 404.

## Requirements

Node.js 20 or newer and npm 10+.

## Install & run

```bash
npm ci
npm run dev        # http://localhost:5173
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run lint` | ESLint (TypeScript, React hooks, jsx-a11y) |
| `npm run typecheck` | `tsc -b --noEmit` for app, scripts and e2e |
| `npm test` | Vitest unit + integration tests (dates, pricing, availability, validation, reservations, filters, pages) |
| `npm run build` | Generates `sitemap.xml`/`robots.txt`, type-checks and builds to `dist/` |
| `npm run test:e2e` | Playwright browser tests (builds and serves the production bundle first) |
| `npm run check` | lint + typecheck + unit tests + build |
| `npm run art` | Regenerates the illustration set in `public/images/` |
| `npm run review` | Rebuilds the screenshot contact sheets in `review/` |
| `npm run package` | Builds the single hand-off ZIP in `handoff/` with a `.sha256` file |

Playwright needs a Chromium build. If browsers are not installed run `npx playwright install chromium`, or point
`PW_CHROMIUM_PATH` at an existing Chromium binary.

## Deploy independently

The site is a static single-page app — deploy `dist/` anywhere.

**Firebase Hosting** (config included):

```bash
npm run build
npx firebase-tools deploy --only hosting   # after `firebase login` and `firebase use <project>`
```

`firebase.json` serves `dist/` with an SPA rewrite (`** → /index.html`) and long-cache headers for hashed assets. Other hosts need the
same "serve index.html for unknown paths" rule.

Before launch set `site.url` in `src/config/site.ts` (used for canonical URLs, `sitemap.xml` and `robots.txt`) and update the
`<link rel="canonical">`/`og:image` defaults in `index.html`.

## Rate configuration in one minute

All pricing inputs live in `src/config/booking.ts` and `src/config/rooms.ts`: a room's `baseRate` × the season's `multiplier` ×
(1 + `weekendUplift` on Fri/Sat) × the rate plan's `multiplier`; optional per-person plan extras; the best eligible promotion; then
fees (service charge %, per-night levy, per-adult municipal tax) and VAT. Every amount is calculated in integer cents. See
CUSTOMIZATION_GUIDE.md for exact steps.

## Documentation

- `CUSTOMIZATION_GUIDE.md` — exact file paths and settings for rebranding
- `VERIFICATION.md` — what was actually run and the results
- `ASSET_LICENSES.md` — image and font licensing
- `CHANGELOG.md`, `LICENSE`
