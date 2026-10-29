# Customization Guide

Everything a reseller needs to edit lives in **`src/config/`**. You never need to touch components to rebrand or change content.
Changes appear instantly in `npm run dev`; run `npm run build` to publish.

## 1. Customization map — "I want to change… → edit this"

| I want to change | File → key |
| --- | --- |
| Brand name, tagline | `src/config/site.ts → brand.name / shortName / tagline` |
| Logo (monogram or image) | `site.ts → brand.logo` (see §3) |
| Phone, email, address, hours | `site.ts → contact` |
| Social links in footer | `site.ts → social` (empty array = hidden) |
| Currency, locale, m² vs sq ft | `site.ts → currency / locale / units` |
| Site URL (canonical, sitemap) | `site.ts → url` or env `VITE_SITE_URL` |
| SEO title template, description, social image | `site.ts → seo` |
| Demo banner / footer disclaimer | `site.ts → demo` (`showBanner:false` to hide) |
| OneStop Infinite credit | `site.ts → owner` (keep unless your agreement says otherwise) |
| Form delivery | `site.ts → forms` / env `VITE_FORM_ENDPOINT` |
| Colours | `src/config/theme.ts → colors` |
| Fonts | `theme.ts → fonts` + font imports in `src/main.tsx` (see §4) |
| Corner radius, max width | `theme.ts → shape` |
| Header navigation, header CTA | `src/config/navigation.ts → mainNav / headerCta` |
| Footer blurb, link columns, legal links | `navigation.ts → footer` |
| Shared CTAs | `navigation.ts → ctas` |
| Turn a whole page off | `src/config/layout.ts → pages` |
| Hide / reorder sections | `layout.ts → sections.home / about / services` |
| Hero text, buttons, hero image | `src/config/content.ts → home.hero` |
| Other home / about / services / contact copy | `content.ts → home, about, services, contact` |
| Team members | `content.ts → about.team.members` |
| FAQ | `content.ts → services.faq.items` |
| Journal articles | `content.ts → articles` |
| Properties | `src/config/properties.ts` |
| Filterable features & labels | `src/config/features.ts` |
| Price steps in filters | `features.ts → priceSteps` |
| Saved-search limit | `src/lib/savedSearches.ts → MAX_SAVED_SEARCHES` (remove `<SavedSearches />` from `src/pages/Properties.tsx` to drop the feature) |
| Photos & alt text | `src/config/images.ts` + files in `public/images/` |
| Favicon / app icon | `public/favicon.svg`, `public/apple-touch-icon.png` |
| Firebase project | `.firebaserc` (copy from `.firebaserc.example`) |

## 2. Quick rebrand checklist

1. `site.ts`: name, tagline, contact, `url`, currency, units; set `demo.showBanner: false` and rewrite `demo.footerDisclaimer`.
2. `theme.ts`: colours + fonts.
3. Replace logo and favicon. The static `<title>`, description, canonical, Open Graph and theme-colour tags in `index.html` are rewritten from `site.ts`/`theme.ts` at build — do not edit them by hand; set `site.url` (or `VITE_SITE_URL`) so they are absolute.
4. Replace `properties.ts` entries and photos; rewrite `content.ts`.
5. Connect the form endpoint (§6).
6. `npm run check` then deploy.

## 3. Logo

```ts
brand.logo = { type: 'monogram', monogram: 'A', wordmark: 'Aurel', wordmarkSub: 'Estates', imageSrc: '', imageAlt: '…' }
// or an image from /public:
brand.logo = { type: 'image', imageSrc: '/brand/logo.svg', imageAlt: 'Your Brand', … }
```
Also update `public/favicon.svg` and `public/apple-touch-icon.png` (180×180).

## 4. Colours and typography

`theme.colors` are written to CSS custom properties (`--c-forest`, `--c-brass`, …) on page load; the stylesheet only references the variables.
Keep text/background pairs at WCAG AA contrast (4.5:1). `brassDeep` is the accessible accent for text on light backgrounds.

To change fonts: `npm i @fontsource/<font>`, import the weights you need in `src/main.tsx` (replace the Cormorant/Inter imports),
and set `theme.fonts.display` / `theme.fonts.body` to the new family names. Fonts are self-hosted — no Google Fonts requests.

## 5. Pages and sections: hide, reorder

`src/config/layout.ts`:

```ts
export const pages = { home: true, properties: true, about: true, services: true, journal: false, contact: true };
export const sections = { home: [ {id:'hero',enabled:true}, {id:'featured',enabled:true}, … ] };
```
- `pages.x = false` removes the route (visitors see the 404 page), the nav item, footer links and any home teaser that points to it.
  Disabling `properties` also disables property details, Favorites and Compare.
  CTAs you write by hand in `content.ts` / `navigation.ts` are **not** auto-removed — update them if you disable a page they link to.
- **Order = array order.** Move an entry up/down to reorder. `enabled:false` hides it.
- Unknown or duplicate ids are ignored, so a typo cannot crash the page.
- If you hide `hero` (Home) or `intro` (About/Services) an accessible, visually-hidden `<h1>` is rendered automatically.
- Section ids — **home:** hero, featured, neighborhoods, approach, services, stats, journal, cta · **about:** intro, values, team, cta · **services:** intro, list, process, faq, cta.

## 6. Forms (inquiry + contact)

With no endpoint the forms run in **demo mode**: input is validated, a "Demo form" notice is shown, and on submit the visitor sees
"Demo only — nothing was sent". It never claims success.

To send real inquiries, set an endpoint that accepts a JSON `POST` (Formspree, Getform, a Cloud Function…):

```bash
# .env.local   (copy from .env.example; VITE_ values are public, never put secrets here)
VITE_FORM_ENDPOINT=https://formspree.io/f/your-id
```
Payload: `name, email, phone, topic, propertyId, message, propertyTitle`. Success is shown only for a 2xx response; errors show an alert with fallback contact details.
Update `site.forms.demoNotice` if you want to reword the demo text.

## 7. Properties

Each property in `properties.ts` needs: `id` (unique, becomes the URL slug unless `slug` is set), `title`, `tagline`, `status` (`available` | `under-offer`), `type`, `price`,
`neighborhood`, `region`, `bedrooms`, `bathrooms`, `areaSqm`, `lotSqm` (0 = shared grounds), `yearBuilt`, `parking`, `features[]`, `highlights[]`, `description[]`, `images[]` (first = card/hero), `featured`, `listedAt` (ISO date).

- New **types** (`PropertyType` in `types.ts`), **neighborhoods** and **features** (`features.ts` + `FeatureKey` in `types.ts`) appear in filters automatically.
- Home "Neighborhoods" tiles are in `content.ts → home.neighborhoods.items` (names must match `neighborhood`).
- Run `npm run seo` (or `npm run build`) to refresh the sitemap.
- Tests (`npm test`) check that property ids are unique, ≥ 12 exist and every image file and alt text is present.

## 8. Images

1. Put the large file in `public/images/name.jpg` (1600–2000 px wide) and a ~640 px thumbnail `name-640.jpg`.
2. Register it in `src/config/images.ts` with **meaningful alt text**.
3. Reference it by key from `properties.ts` or `content.ts`.
4. Record the license in `ASSET_LICENSES.md`.

## 9. Verifying your changes

```bash
npm run check          # lint + typecheck + unit/interaction tests + build
npm run test:e2e       # browser tests across 360/390/768/1024/1440 px + axe accessibility
```
The test-suite includes customization tests that prove section hiding/reordering, page switches, theme variables, data integrity and the owner credit work (`src/test/app.test.tsx`, `src/test/config.test.ts`).
