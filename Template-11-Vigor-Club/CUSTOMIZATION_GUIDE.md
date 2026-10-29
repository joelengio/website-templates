# Customization guide — VIGOR CLUB (OneStop Infinite Template 11)

Everything a business owner or developer normally edits lives in **`src/config/`**. Pages read from these files, so a
change in one place propagates everywhere (header, footer, home, detail pages, sitemap, tests). No page file needs
editing for a rebrand.

> **Template owner vs. business.** "OneStop Infinite" is the template's owner and is credited in the footer
> (`site.template`). "VIGOR CLUB" is a fictional demonstration business. Replace all fictional details before launch.

## 1. Quick map: what to edit → where

| I want to change… | File | Setting / export |
|---|---|---|
| Brand name, tagline | `src/config/site.ts` | `brand.name`, `brand.shortName`, `brand.tagline` |
| Logo image / favicon | `public/logo.svg`, `public/favicon.svg` (+ `site.brand.logo`, `site.brand.favicon`) | The header/footer **wordmark** is rendered by `src/components/Logo.tsx` from `brand.name`; edit the SVG mark there to change the symbol |
| Colours | `src/config/theme.ts` | `theme.colors.*` (applied as CSS variables at start-up) |
| Fonts | `src/config/theme.ts` + `src/main.tsx` | `theme.fonts.display/body`; import the new `@fontsource/*` files in `main.tsx` |
| Corner radius | `src/config/theme.ts` | `theme.radius` |
| Header navigation | `src/config/navigation.ts` | `navigation` (label + route) |
| Header/hero/CTA buttons | `src/config/navigation.ts` | `ctas.*`; home buttons in `src/config/home.ts` |
| Footer links, blurb | `src/config/navigation.ts` | `footerGroups`, `footerBlurb` |
| Footer disclaimers, year | `src/config/site.ts` | `legal.*` |
| Template credit | `src/config/site.ts` | `template.showCredit`, `creditLabel`, `creditUrl` |
| Phone, email, address | `src/config/site.ts` | `contact.*` |
| Opening hours | `src/config/site.ts` | `hours`, `holidayNote` |
| Social links | `src/config/site.ts` | `social` (empty array hides them) |
| Homepage copy | `src/config/home.ts` | `home.*` |
| Homepage section **order** and **visibility** | `src/config/home.ts` | `homeSections` (reorder / set `visible:false`) |
| Programs (8 included) | `src/config/programs.ts` | `programs`, `programCategories` |
| Trainers (6 included) | `src/config/trainers.ts` | `trainers`, `credentialNote` |
| Weekly classes / timetable | `src/config/classes.ts` | `classes` |
| Demo booking behaviour | `src/config/booking.ts` | `bookingSettings` (weeks ahead, cut-off, occupancy, storage keys, wording) |
| Membership plans & prices | `src/config/membership.ts` | `plans`, `comparison`, `faqs`, `currency`, `membershipCopy` |
| Facilities & gallery | `src/config/facilities.ts` | `facilities`, `gallery` |
| Testimonials | `src/config/testimonials.ts` | `testimonials` |
| Journal categories & articles | `src/config/journal.ts` | `articles`, `journalCategories`, `journalDisclaimer` |
| About page copy | `src/config/about.ts` | `about` |
| All image references | `src/config/images.ts` | `images`, `trainerImages`, `journalImages`, `facilityImages` |
| SEO defaults, OG image | `src/config/site.ts` | `seo.*` |
| Canonical / production URL | `src/config/site.ts` or build env | `site.url`, or `VITE_SITE_URL=https://yourdomain.com npm run build` |
| Where enquiries go | `src/config/site.ts` | `forms.endpoint` (JSON POST URL) |
| Firebase hosting | `firebase.json` | rewrites, cache headers |

## 2. Rebrand in ten minutes
1. `src/config/site.ts` — change `brand.name`, contact details, hours, `url`, `seo.*`, `legal.*`.
2. `src/config/theme.ts` — change `lime` (accent) and `limeInk` (text on the accent); keep `limeDeep` dark enough for
   text on light sections (aim for ≥4.5:1 on `bone`). Adjust `ink`/`charcoal`/`graphite` for the dark surfaces.
3. Replace `public/favicon.svg` and `public/logo.svg`; edit the mark in `src/components/Logo.tsx` if you want a different symbol.
4. Update `src/config/home.ts` copy and `src/config/about.ts`.
5. Replace programs, trainers, classes and plans with your own (sections 4–7 below).
6. Swap images (section 9), run `npm run check`, then `npm run build`.

## 3. Colours and typography (`src/config/theme.ts`)
`theme.colors` keys → CSS variables (see `src/lib/theme.ts`): `ink` (page), `charcoal` (alternate sections), `graphite`
(cards), `steel` (inputs/raised), `bone` (light sections and primary text), `mist` (secondary text), `slate` (secondary
text on light), `lime` (accent), `limeInk` (text on accent), `limeDeep` (accent text on light), `line`/`lineLight`
(hairlines), `danger`/`dangerLight` (errors).

**Changing fonts:** `npm i @fontsource/your-font`, import the weights in `src/main.tsx` (follow the existing
`@fontsource/...` imports), then set `theme.fonts.display` / `theme.fonts.body`. Fonts are self-hosted — no external requests.

## 4. Programs (`src/config/programs.ts`)
Each program: `slug` (URL), `name`, `category` (must be listed in `programCategories`), `summary`, `description[]`,
`duration` (minutes), `intensity` (1–5), `level`, `trainerSlugs[]` (must exist in `trainers.ts`), `image`, `highlights[]`,
`expect[]`, `bring[]`, optional `bookingNote` (shown when the program is not in the class timetable, e.g. personal training).
Programs appear on `/programs` (with search + filters), on `/programs/:slug`, on the home page (`home.programs.limit` controls
how many) and in `sitemap.xml`.

## 5. Trainers (`src/config/trainers.ts`)
Each trainer: `slug`, `name`, `role`, `tagline`, `bio[]`, `specialties[]`, `qualifications[]`, `yearsExperience`,
`programSlugs[]` (keep in sync with each program's `trainerSlugs` — the test-suite checks both directions), `image`.
**Qualifications in the template are fictional and must be replaced with real, verifiable ones.** Remove the word
"fictional" and the `credentialNote` only when you have done so.

## 6. Classes and the demo booking system
`src/config/classes.ts` → `classes[]`: `id` (unique, stable — reservations reference it), `title`, `programSlug`, `day`
(0 = Monday … 6 = Sunday), `start` (24-hour `HH:MM`), `duration` (min), `trainerSlug` (must teach that program),
`capacity`, `room`, `blurb`.
`src/config/booking.ts` → `bookingSettings`: `weeksAhead`, `cutoffMinutes`, `demoOccupancy` (simulated places taken),
`storageKey`/`profileKey`/`inquiriesKey` (change these when you rebrand), `referencePrefix`, and the demo wording.

**Booking is a demonstration.** Reservations are stored in the visitor's `localStorage` only. To go live, replace the calls in
`src/lib/reservations.ts` (`book`, `cancel`, `loadReservations`) with calls to your booking provider/API; the UI
(`src/pages/Schedule.tsx`) stays the same.

## 7. Membership (`src/config/membership.ts`)
`plans[]`: `id`, `name`, `tagline`, `monthly` (price per month billed monthly), `annualMonthly` (price per month billed
annually — the page shows the yearly total and saving), `joiningFee`, `highlight` (featured plan), `badge`, `benefits[]`, `cta`.
`comparison[]` rows must include a value for **every plan id** (`true`/`false`/text). `currency` sets code + locale.
Add or remove plans freely — cards, comparison table, signup picker, contact form plan list and tests follow.
The signup flow validates and records a *demo enquiry*; it never charges or activates anything.

## 8. Facilities, gallery, journal, testimonials
* `facilities.ts` → `facilities[]` (zones) and `gallery[]` (lightbox images; `area` drives the filter chips).
* `journal.ts` → `articles[]` (`slug`, `title`, `category`, `excerpt`, `date` ISO, `readMinutes`, `author`, `image`, `body[]`, `tags[]`).
  Related articles are chosen by category and shared tags. Keep wording balanced and avoid health/transformation claims.
* `testimonials.ts` → `testimonials[]`. Only publish **real** testimonials with permission; the template's are fictional.

## 9. Replacing images
(Page `<meta>` descriptions use `site.brand.name`, so renaming the club in `src/config/site.ts` updates them too.)
All images are referenced in `src/config/images.ts` (and `facilities.ts`/`programs.ts`/`journal.ts` via that file).
1. Put optimised files in `public/images/` (WebP/AVIF/JPEG, ≤ ~250 KB each is a good target).
2. Update `src/` entries in `images.ts`: `src`, accurate `width`/`height` (prevents layout shift) and a descriptive `alt`.
3. Keep `og-image` at 1200×630 for social previews.
The bundled pictures are Unsplash-licensed demo photographs (see `ASSET_LICENSES.md`); `scripts/photos/sources.json` records which source feeds which file.
Trainer cards (`trainer-1…6.webp`) are monogram placeholders — replace with portraits (800×1000) and update `trainerImages` alt text; `npm run images` regenerates the placeholders and the demo-map backdrop.
The test suite fails if a referenced image is missing, has no alt text, or an unreferenced file is left in `public/images/`.
Images are not content-hashed and Firebase caches `/images` for one day; rename files when replacing them if visitors must see changes sooner.
Document the licence of every replacement image in `ASSET_LICENSES.md`.

## 10. Homepage sections
`src/config/home.ts` → `homeSections` is the ordered list. Example — hide testimonials and move the journal before pricing:
```ts
{ id: 'testimonials', visible: false },
```
Keep `hero` visible: it holds the page's `<h1>`.

## 11. SEO and deployment
* `src/config/site.ts` → `seo.defaultTitle`, `titleSuffix`, `defaultDescription`, `ogImage`, `themeColor`.
* Each page sets its own title/description via `<Seo />`; canonical and Open Graph URLs use `site.url` (or `VITE_SITE_URL` at build time).
* `robots.txt` and `sitemap.xml` are generated at build time from the config (programs, trainers and articles included).
* Firebase: `npm run build` then `firebase deploy --only hosting` (see README). `firebase.json` rewrites all routes to `index.html`.

## 12. Enquiries, forms and privacy
`site.forms.endpoint` is empty, so the contact and signup forms run in **demonstration mode**: they validate, then clearly say
nothing was sent. To receive real enquiries set `endpoint` to a service that accepts a JSON `POST` (the payload includes
`type`, `name`, `email`, `phone`, `topic`, `message`, …). The UI only reports "sent" when the server answers 2xx and shows a
helpful error otherwise. No secrets are stored in the front-end; do not put API keys in this repository.
Before collecting personal data add a privacy policy and any consent text your jurisdiction requires.

## 13. Tests that protect your edits
`npm test` checks configuration integrity: unique slugs/ids, program ↔ trainer ↔ class references, every plan present in the
comparison table, all referenced images exist, credentials flagged as fictional, and more. After editing config, run
`npm run check`.
