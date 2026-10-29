# CLARITY HEALTH — Customization guide

All editable content lives in `src/config/`. Components read from these files; nothing brand- or content-specific is hard-coded in
`src/components` or `src/pages` (apart from structural labels such as "Continue" or "Back"). Edit, save, and the dev server hot-reloads.
`npm run build` regenerates `index.html` metadata, `sitemap.xml` and `robots.txt` from the same files.

> Everything shipped is **fictional demonstration data**. Replace it with real, verified content, have clinical text reviewed by a
> qualified professional, and obtain independent legal/privacy review before collecting any real patient information.

## 1. Configuration map

| You want to change… | File | Key / export |
|---|---|---|
| Brand name, tagline, logo, favicon, wordmark on/off | `site.ts` | `site.brand` |
| Deployed URL (canonical, Open Graph, sitemap) | `site.ts` or env `VITE_SITE_URL` | `site.url` |
| Default title/description, title suffix, OG image, theme colour | `site.ts` | `site.seo` |
| Phone, e-mail, address | `site.ts` | `site.contact` |
| Opening hours (also drive the booking calendar) | `site.ts` | `site.hours`, `site.hoursNote` |
| Locations, department contacts | `site.ts` | `site.locations`, `site.departments` |
| Social links (footer) | `site.ts` | `site.social` |
| Demonstration / emergency / privacy / medical notices | `site.ts` | `site.notices` |
| OneStop Infinite credit (separate from the clinic) | `site.ts` | `site.publisher` |
| Colours, fonts, radii | `theme.ts` | `theme.colors`, `theme.fonts`, `theme.radius` |
| Header navigation | `navigation.ts` | `navigation` |
| Footer columns and blurb, CTA labels | `navigation.ts` | `footerGroups`, `footerBlurb`, `ctas` |
| Homepage sections: order, visibility, wording | `home.ts` | `homeSections`, `home` |
| Specialties | `specialties.ts` | `specialties`, `specialtyCategories` |
| Doctors | `doctors.ts` | `doctors` |
| Services, categories, durations, demo prices | `services.ts` | `services`, `serviceCategories` |
| Booking rules, price display, storage key | `booking.ts` | `booking` |
| Testimonials | `testimonials.ts` | `testimonials` |
| Facilities | `facilities.ts` | `facilities` |
| About page | `about.ts` | `about` |
| First-visit guide, payment/insurance, policies, FAQs | `patient-info.ts` | `patientInfo`, `faqs` |
| Journal articles and categories | `articles.ts` | `articles`, `articleCategories` |
| All images (paths + alt text) | `images.ts` | `images` |

## 2. Branding

1. **Name & tagline** — edit `site.brand.name`, `shortName`, `tagline`. The header, footer, page titles, Open Graph tags, sitemap, and the
   demo bar all update. The `<title>` suffix is `site.seo.titleSuffix`.
2. **Logo & favicon** — replace `public/logo.svg` and `public/favicon.svg` (keep the file names) or point `site.brand.logo` / `favicon` at other
   files in `public/`. Set `showWordmark: false` to show only the mark (the name remains available to screen readers).
3. **Colours** — change values in `theme.ts`. They are written to CSS variables at start-up. Keep text colours (`ink`, `muted`, `tealInk`, `navy`)
   dark enough for ≥ 4.5:1 contrast on `ivory`/`white`/`mist`, and `fieldBorder` ≥ 3:1. Re-run `npm run test:e2e` to confirm the axe scans still pass.
4. **Fonts** — fonts are self-hosted through Fontsource. To change them: `npm i @fontsource-variable/<font>`, import its CSS in `src/main.tsx`, and set
   `theme.fonts.display` / `theme.fonts.body` to the new family names. Remove unused font packages and imports.
5. **Social image** — replace `public/images/og-image.webp` (1200×630) or change `site.seo.ogImage`.

## 3. Content

### Specialties
Add an object to `specialties` with a unique `id` and `slug`. Fields: `name`, `category` (a value from `specialtyCategories`), `icon` (a name from
`src/components/icon-paths.ts`), `image` (a key in `images.ts`), `summary`, `description[]`, `commonTopics[]`, `keywords[]` (used by search).
The specialty page automatically lists its **services** (services whose `specialtyIds` include the id) and **doctors** (doctors with that `specialtyId`).

### Doctors
Add to `doctors`: `id`, `slug`, `name`, `title`, `specialtyId`, `image`, `languages[]`, `yearsExperience`, `acceptingNewPatients`, `workingDays[]`
(0 = Sunday … 6 = Saturday), `modes[]` (`'in-person'`, `'video'`), `summary`, `bio[]`, `qualifications[]`, `interests[]`. Filters (specialty, language,
weekday, new patients, video) are built from this data. Doctors with `acceptingNewPatients: false` appear but cannot be booked.
**Never publish invented clinicians as real ones** — replace every profile and the "fictional" labels with your own verified information.

### Services & prices
Add to `services`: `category`, `specialtyIds[]` (which specialties can deliver it), `durationMinutes`, `price`, `modes[]`, `summary`, `description[]`,
`whatToExpect[]`. **Compatibility rule:** a doctor can deliver a service when the service's `specialtyIds` includes the doctor's `specialtyId` and they share
at least one `mode`. The booking flow only shows compatible combinations. Prices are placeholders: set `booking.pricing.show = false` to hide all prices,
or change `currency` and `label`.

### Booking settings (`booking.ts`)
`leadDays` (first bookable day = today + n), `windowDays`, `slotIntervalMinutes`, `demoBusyRatio` (share of slots shown as taken),
`closedDates` (ISO dates), `maxActivePerEmail`, `requirePhone`, `referencePrefix`, `storageKey`, `policyNote`, `modeLabels`.
Opening hours come from `site.hours`; each doctor's `workingDays` further limit availability.

### Homepage sections
`homeSections` is an ordered list. Reorder it, or set `enabled: false`. Section wording, counts, featured doctor/service ids and CTAs are in `home`.
Available ids: `hero, intro, specialties, doctors, services, why, experience, facilities, testimonials, info, articles, contact`.

### Articles
Add to `articles`: unique `slug`, `category` (in `articleCategories`), `image`, `date` (ISO), `readMinutes`, `excerpt`, `sections[]`
(`heading`, `paragraphs[]`, optional `list[]`), optional `relatedSpecialty`. Related articles are computed automatically.
The shipped articles are **not clinician-reviewed**. If you replace them with reviewed content, update `site.notices.articles` to say who reviewed
it and when — and only if that review really happened.

### Images
Register each image in `images.ts` with `src`, `alt`, `width`, `height`, and reference it by key from other config files. Use WebP, keep files under
~150 KB, and write meaningful alt text. The shipped images are generated illustrations — see `ASSET_LICENSES.md`; `npm run images` regenerates them.
Replacing a file in `public/images/` with one of the same name also works.

### Notices
`site.notices` holds every disclosure: the demo bar, emergency text, privacy text, booking disclaimer, doctor label, contact-form note and article
disclaimer. **For a real clinic**, remove the "demonstration/fictional" wording only after the clinic, its contact details and its booking system are real,
and keep a clear emergency message.

## 4. SEO & deployment values
- Set the production origin with `VITE_SITE_URL=https://your-domain` at build time (or `site.url`).
- Page titles/descriptions are set per page by `<Seo />` in each page component.
- `robots.txt` disallows `/appointments`; `sitemap.xml` lists every public route, including each specialty, doctor, service and article.

## 5. Turning the demo into a real booking system
This template deliberately has **no backend**. To connect a real booking or inquiry service you must add and test your own server (or a vetted third
party), and obtain legal/security review for handling patient data. Start in `src/lib/bookings.ts` (storage) and `src/pages/Booking.tsx`, `src/pages/Contact.tsx`.
Keep the privacy guardrails: collect the minimum, never log personal data, and remove the demo wording only when it is no longer true.

## 6. Verifying a change
```bash
npm run check        # typecheck + lint + unit/integration tests + build
npm run test:e2e     # browser tests (serves dist/ with Firebase-style rewrites and headers)
```
