# Customization Guide — Folio Finance

All business content and settings live in **`src/config/`**. Edit a value, save, and every page that uses it updates (dev server hot-reloads; `npm run build` regenerates the sitemap).
Components contain no business data. Tests in `src/test/app.test.tsx` ("customization propagates from config") prove this for brand, contact, plans and home sections.

## 1. File map

| File | Controls |
| --- | --- |
| `site.ts` | Brand, owner credit, URL, currency, contact, offices, hours, social, SEO defaults, legal copy, footer columns |
| `theme.ts` | Colours, font stacks, corner radius |
| `navigation.ts` | Header menu items and header CTA |
| `layout.ts` | Page on/off switches; home section order and visibility |
| `content.ts` | Home copy, stats, testimonials, About, Tools/Contact/Insights/Booking page copy + SEO |
| `services.ts` | Services, filter categories, pricing models |
| `industries.ts` | Who-we-serve segments |
| `team.ts` | Team members and disclosure |
| `plans.ts` | Plans, annual discount, comparison rows, add-ons, pricing FAQ |
| `calculators.ts` | Defaults, limits, assumptions text, frequency options |
| `booking.ts` | Booking window, hours, slot length, consultation types |
| `articles.ts` | Journal articles and categories |
| `images.ts` | Image registry (paths, sizes, alt text) |

## 2. Recipes (exact paths)

**Brand name / tagline / logo / favicon** — `site.brand.name`, `site.brand.tagline`, `site.brand.monogram` (2-letter built-in mark).
To use your own logo set `site.brand.logoSrc: '/logo.svg'` (file in `public/`). Replace `public/favicon.svg` and `public/apple-touch-icon.png` (180×180) for the favicon; `site.brand.faviconPath` documents the path (also edit `index.html`).
Update `<title>`/meta defaults in `index.html` as well as `site.seo.*` (the static HTML is what crawlers see before JavaScript runs).

**Template owner credit** — `site.owner` (`name`, `templateName`, `showCredit`). It is separate from the business brand and appears in the footer and Disclaimers page.

**Colours & fonts** — `theme.colors.*` (navy, ivory, stone, bronze…) and `theme.fonts.heading/body`. Values become CSS variables `--c-navy`, `--c-bronze-dark`, … at start-up.
To change typefaces: `npm i @fontsource-variable/<font>`, import it in `src/main.tsx`, then set the family name in `theme.fonts`.
Keep text/background contrast ≥ 4.5:1 (the primary button uses `bronzeDark` on purpose).

**Navigation** — `navigation.ts › mainNav` (add/remove/reorder), `headerCta`. Footer columns: `site.ts › footerNav`. Hide a whole page: `layout.ts › pages.<name> = false` (route removed and footer links hidden; also remove its `mainNav` entry — the header already filters known routes).

**Home page** — copy in `content.ts › home.*`. Order/visibility: reorder or toggle `layout.ts › homeSections` (ids: hero, stats, services, about, advisory, segments, why, process, toolPreview, testimonials, insights, cta). Featured services: `home.services.featured` (slugs). Stats are *demonstration data* — keep the label or replace with verified facts.

**Contact details, offices, hours, social** — `site.contact` (`email`, `phone`, `phoneHref`, `form.categories`), `site.offices[]`, `site.hours[]`, `site.timezoneLabel`, `site.social[]`. Real contact form: set `site.contact.form.endpoint` to an HTTPS URL accepting JSON `{name,email,phone,category,message}`; leave empty to keep honest demo mode.

**Currency** — `site.currency` `{ code: 'EUR', locale: 'de-DE' }` changes every formatted amount. Display only; no conversion is performed. If you change the currency, also review plan, service and calculator numbers.

**Services** — `services.ts › services[]`. Each: `slug` (URL), `name`, `icon`, `categories` (ids from `serviceCategories`), `summary`, `description[]`, `deliverables[]`, `idealClient[]`, `benefits[]`, `process[]`, `pricing { model: fixed|monthly|hourly|project|quote, from, unit, note }`, `image` (key in `images.ts`), optional `faqs`. Adding a service adds its route, card, booking option, sitemap entry and team/industry cross-links automatically. Filter chips: `serviceCategories`.

**Industries** — `industries.ts` (`services` = service slugs). **Team** — `team.ts` (`image` via `portrait(file, alt)`; keep credentials prefixed `Demo:` until replaced with verified ones; a test enforces this for the demo data — update `src/test/config.test.ts` for real data).

**Pricing & plans** — `plans.ts`: `pricing.annualDiscountPercent` (global), `pricing.defaultCycle`, `plans[]` (`monthly` price, optional `annualDiscountPercent`, `includes[]`, `highlight`), `planFeatures[]` (comparison rows; `values` has one entry per plan, in order), `addOns[]`, `pricingFaqs[]`. Annual prices are *calculated* (`src/lib/pricing.ts`).

**Calculators** — `calculators.ts`: `defaults`, `limits`, `assumptions`, compounding `frequencies`, home preview defaults. Formulas are in `src/lib/finance.ts`.

**Booking** — `booking.ts`: `minDaysAhead`, `maxDaysAhead`, `openWeekdays`, `dayStart/dayEnd`, `slotStepMinutes`, break window, `demoBusyRatio`, `consultationTypes[]` (id, name, duration, mode), `maxNoteLength`. To connect a real system replace `saveAppointment` in `src/lib/booking.ts` and remove the demonstration disclaimers in `site.legal.bookingDisclaimer`.

**Articles** — `articles.ts`: add objects with `slug`, `title`, `excerpt`, `category` (must be in `articleCategories`), `tags`, `date`, `author`, `image`, `body[]` blocks (`p`, `h2`, `ul`, `callout`). Do not publish current tax/regulatory claims without review.

**Images** — put files in `public/images/`, register in `images.ts` (width/height, alt text, optional 640 px `small`). `scripts/fetch-images.sh` documents how the demo images were produced.

**SEO** — defaults in `site.seo` and `site.url`; per-page `title`/`description` objects in `content.ts` and each config entity (service summary, article excerpt, member summary). Set `site.url` to your domain before building (canonical, Open Graph, sitemap). `site.seo.noindexDemo = true` adds `noindex` and a `Disallow: /` robots file for staging.

**Legal text** — `site.legal.*` (demo notice, general / calculator / booking / contact / pricing disclaimers, regulatory note). Shown in the footer, forms, tools and `/disclaimer`. Replace with counsel-reviewed copy.

## 3. Converting the demo into a real client site — checklist

1. Replace brand, contact, hours, offices, legal and regulatory text. 2. Replace team, testimonials, statistics with real, verifiable content (or remove sections in `layout.ts`).
3. Replace prices/plans. 4. Swap photography and update `ASSET_LICENSES.md`. 5. Review calculator defaults/assumptions with your compliance adviser.
6. Connect the contact endpoint and (optionally) a real booking backend. 7. Remove the `demo-strip` in `src/components/Layout.tsx` and demonstration labels when no longer true.
8. Set `site.url`, run `npm run check`, deploy.
