# Customization Guide — SERENE HOUSE

Everything you normally change lives in **`src/config/`**. You should not need to edit components to rebrand the site.

## 1. Where to change what (mapping)

| I want to change… | Edit this file | Setting |
|---|---|---|
| Brand name, tagline, logo, favicon | `src/config/site.ts` | `brand.*` (+ replace `public/logo.svg`, `public/favicon.svg`) |
| Live domain (canonical, sitemap, OG) | `src/config/site.ts` or `.env` | `url` / `VITE_SITE_URL` |
| Phone, email, address, map | `src/config/site.ts` | `contact.*` (`mapEmbedUrl` shows a real map) |
| Contact-form delivery | `src/config/site.ts` | `contact.formEndpoint` (empty = demo mode, nothing delivered) |
| Social links | `src/config/site.ts` | `social[]` (remove an entry to hide it) |
| Opening hours (also drives booking availability) | `src/config/site.ts` | `hours[]` (`open: null` = closed) |
| Colours | `src/config/theme.ts` | `colors.*` |
| Fonts | `src/config/theme.ts` + `src/main.tsx` | `fonts.*` and the `@fontsource` imports |
| Header navigation, button labels | `src/config/navigation.ts` | `navigation`, `ctas` |
| Footer links & blurb | `src/config/navigation.ts` | `footerGroups`, `footerBlurb` |
| Homepage sections: show/hide/reorder | `src/config/home.ts` | `homeSections[]` |
| Homepage copy & images | `src/config/home.ts` | `homeContent` |
| Treatments, prices, durations | `src/config/treatments.ts` | `treatments[]`, `treatmentCategories` |
| Packages, breakdowns, comparison | `src/config/packages.ts` | `packages[]`, `packageComparisonRows` |
| Team members & which services they perform | `src/config/staff.ts` | `staff[]` (`specialties`, `workingDays`) |
| Gallery | `src/config/gallery.ts` | `galleryItems[]`, `galleryCategories` |
| Testimonials | `src/config/testimonials.ts` | `testimonials[]` |
| Journal articles | `src/config/journal.ts` | `articles[]`, `journalCategories` |
| About page | `src/config/about.ts` | `aboutContent` |
| Booking rules (lead time, window, slot length, demo busyness, closed dates) | `src/config/booking.ts` | `booking.*` |
| Page titles / descriptions (SEO) | `src/config/site.ts` | `pages.*`, `seo.*` |
| Image registry | `src/config/images.ts` | `images`, `teamImages`, `journalImages` |

## 2. Rebranding in 10 minutes

1. `site.ts`: set `brand`, `url`, `contact`, `hours`, `social`. Update `publisher` only if you rebrand the template itself.
2. `theme.ts`: set colours. Contrast tip: keep `ink`/`forest` dark and `ivory` light; `gold` is used for small accents.
3. Replace `public/logo.svg` and `public/favicon.svg`.
4. Replace treatments, packages and staff with your real offer.
5. Replace images (section 4) and remove demo wording ("fictional", testimonials notice, journal notice) once content is real.
6. Run `npm run check`.

## 3. Common tasks

**Add a treatment** — append an object to `treatments` in `treatments.ts`. `slug` becomes `/treatments/<slug>`; it also appears in the booking flow, search, sitemap and sitemap-ready routes automatically. `maxGuests: 1` makes it single-guest only.

**Add a package** — append to `packages` in `packages.ts`. `items` produce the price breakdown and "You save" figure; `features` ids tick the comparison table. `guests: 2` makes a fixed couples package priced for two.

**Hide a homepage section / change order** — in `home.ts` set `enabled: false` or move the line.

**Change the booking window** — `booking.ts`: `leadDays`, `windowDays`, `slotIntervalMinutes`, `demoBusyRatio`, `closedDates`.

**Add a navigation item** — add to `navigation` and create a route in `src/App.tsx` + a page in `src/pages/`.

**Change fonts** — `npm i @fontsource/<font>`, import the weights in `src/main.tsx`, then set `fonts.display` / `fonts.body` in `theme.ts`.

**Add a gallery image** — put an optimised `.webp` in `public/images/`, then add `item('gX', 'category', 'file-name', width, height, 'alt text', 'Caption')` to `gallery.ts`.

## 4. Replacing the demo photography

The bundled photographs are Unsplash-licensed demo images (see `ASSET_LICENSES.md`). Every picture is registered in `src/config/images.ts` (plus `gallery.ts`; treatments/packages/staff/journal reference those entries). To use your own:

1. Export optimised WebP files (≈1600 px wide, <250 KB; hero/CTA ≈2000 px). Overwrite the files in `public/images/` (keep the name) **or** add new files and change `src`, `width`, `height` and the accurate `alt` text in `images.ts`.
2. Team cards (`team-1…6.webp`) are monogram placeholders — replace with portraits (800×1000) and update the alt text in `teamImages`.
3. Record each photo's source and licence in `ASSET_LICENSES.md`. Only use images you are licensed to use commercially, and use releases for people shown.
4. Run `npm test` — it fails if a referenced file is missing, alt text is missing, or an unreferenced file is left in `public/images/`.

Note: image files are not content-hashed. Firebase caches `/images` for one day (`firebase.json`); rename files when replacing them if you need visitors to see changes sooner.

## 5. Making bookings real

The booking flow is intentionally a demonstration. To go live you must provide your own backend (availability, persistence, email, payments). The seams are:

- `src/lib/availability.ts` — replace the simulated slot generation with an API call.
- `src/lib/bookings.ts` — replace the `localStorage` store with API calls.
- `src/config/booking.ts` — remove the demo `disclosure` once real.
- Remove the demo bar in `src/components/Layout.tsx` and demo notices when you are live.

Never put secrets in front-end code; use a server or serverless function.

## 6. Contact form

Set `contact.formEndpoint` to a service that accepts a JSON `POST` (`name`, `email`, `subject`, `message`). When empty, the form validates input and explicitly states that nothing was delivered.

## 7. Verification

`src/test/config.test.ts` verifies the configuration (unique slugs, valid categories, prices, every image file exists, etc.) so mistakes are caught by `npm test` after you edit content.
