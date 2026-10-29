# Customization Guide — Haven Stays

Everything a client normally changes lives in `src/config/` as plain TypeScript data. Pages and components read it; you rarely touch
them. After editing run `npm run check` (and `npm run test:e2e` if you changed ids, slugs or copy that tests assert on).

## 1. Rebrand in ten steps

1. **Name, logo, favicon** — `src/config/site.ts` → `brand` (`name`, `shortName`, `tagline`, `logoText`, `showMark`). Replace
   `public/favicon.svg`, `public/logo-mark.svg` and `public/apple-touch-icon.png` (180×180). The header/footer mark is drawn inline in
   `src/components/Logo.tsx`; swap the `<svg>` there for your own mark.
2. **Colours & fonts** — `src/config/theme.ts` (`colors` are written to CSS variables at start-up; `fonts.display`/`fonts.body`). To change
   typefaces install a Fontsource package (`npm i @fontsource-variable/<name>`), import it in `src/main.tsx` and update `theme.fonts`.
3. **Contact, address, hours, social** — `src/config/site.ts` → `contact`, `social`; opening hours, FAQ, policies and directions are in
   `src/config/policies.ts`.
4. **Site URL & SEO** — `site.url`, `site.seo` (title template, default description, OG image) in `site.ts`; per-route titles and
   descriptions in `src/config/seo.ts`. Room/offer/article pages use their own title and summary automatically. `npm run build`
   regenerates `public/sitemap.xml` and `public/robots.txt` from your content. Also update the `<link rel="canonical">` and `og:image`
   defaults in `index.html`.
5. **Rooms and inventory** — `src/config/rooms.ts` (see §2).
6. **Rates, seasons, taxes, promotions** — `src/config/booking.ts` (see §3).
7. **Amenities** — `src/config/amenities.ts`. Rooms reference amenity `id`s; `property: true` shows an amenity in the home-page
   "Amenities" section. Available icon names are the keys in `src/components/Icon.tsx`.
8. **Dining, experiences, offers** — `dining.ts`, `experiences.ts`, `offers.ts`.
9. **Reviews, articles, destination, about, gallery** — `reviews.ts`, `content.ts` (intro, wellness block, attractions, articles),
   `about.ts`, `gallery.ts`.
10. **Imagery** — replace files in `public/images/` keeping the same names, or edit the `src` paths in the config files (see §6).

## 2. Rooms — `src/config/rooms.ts`

Each entry of `rooms`:

| Field | Meaning |
| --- | --- |
| `id`, `slug` | `id` is used by bookings and URLs (`?room=`); `slug` forms `/rooms/<slug>`. Changing an `id` orphans reservations stored in visitors' browsers. |
| `name`, `category`, `tagline`, `description`, `highlights` | Copy. `category` must be one of `Rooms`, `Suites`, `Family`, `Villas` (edit `RoomCategory` in `types.ts` and `roomCategories` to add more). |
| `baseRate` | Nightly starting rate in whole currency units, before season, weekend, plan, fees and tax. |
| `maxAdults`, `maxChildren`, `maxOccupancy` | Occupancy rules enforced everywhere (`src/lib/validation.ts`). `maxChildren: 0` makes a room adults-only. |
| `beds`, `areaSqm`, `view` | Facts shown on cards and detail pages. |
| `amenities` | List of amenity ids. |
| `images` | `{ src, alt }[]` — any number; the gallery and lightbox adapt. Always write meaningful `alt` text. |
| `units` | Number of rooms of this type. Drives simulated availability. `0` hides the room from listing, detail page, sitemap and booking. |
| `featured` | Shown on the home page and first in "Recommended" sort. |

## 3. Pricing — `src/config/booking.ts`

**Formula** (all maths in integer cents, see `src/lib/pricing.ts`):

```
nightly = round( baseRate × 100 × season.multiplier × (1 + weekendUplift if Fri/Sat) × ratePlan.multiplier )
room charge = Σ nightly
+ plan extras (perAdultNight / perChildNight × nights)
− best eligible promotion (applies to the room charge only)
= base
+ fees (percent of base, per night, per adult-night with optional capNights, per stay)
+ taxes (percent of base + taxable fees)
= total
```

- **`booking`** — `minNights`, `maxNights`, `maxAdvanceDays`, `weekendDays` (0 = Sunday), `weekendUplift`, check-in/out times,
  `simulateAvailability`, `storageKey`, and `demoToday` (set an ISO date to freeze "today" for demos).
- **`seasons`** — `from`/`to` as inclusive `MM-DD` (ranges may wrap the year end), `multiplier`, `minNights` (the rule of the check-in
  night's season applies to the stay) and `occupancy` (0–100, how busy the *simulation* is). **Every day of the year must fall in one
  season** — a unit test verifies this for a leap year.
- **`ratePlans`** — `multiplier`, optional `perAdultNight` / `perChildNight` extras (e.g. breakfast), `freeCancelDays` (`null` =
  non-refundable) and `lateCancelNights` (`'all'` or a number of nights charged on late cancellation — illustrative only).
- **`fees`** — `kind`: `percent`, `perNight`, `perAdultNight`, `perStay`; `taxable` fees join the VAT base; `capNights` caps per-night kinds.
- **`taxes`** — percentage taxes applied to base + taxable fees. Add several if needed.
- **`promotions`** — `auto: true` applies by itself, otherwise the guest enters `code`. Eligibility fields: `minNights`, `maxNights`,
  `stayWindow` (check-in `MM-DD` range), `minAdvanceDays`, `categories`, `roomIds`, `excludePlans`, `requireChildren`, `noChildren`,
  `exactAdults`. Only the **best single discount** is applied. The reason a code is rejected is shown to the guest.
- **Currency** — `site.currency` (`code`, `locale`) in `site.ts`.

## 4. Homepage sections, pages and navigation — `src/config/layout.ts`

- `homeSections` — reorder entries to reorder the page; `enabled: false` hides one. Valid ids: `intro rooms experiences amenities dining
  wellness destination offers reviews journal cta`.
- `hero` — image, kicker, title, text and `showBookingWidget`.
- `pages` — turn whole areas off (`booking: false` removes the reservation routes; the header Reserve button disappears with it).
- `navigation` — main links, header call-to-action and footer columns.
- Footer options (`blurb`, `legal`, newsletter, publisher credit) — `site.footer`. The "Template by OneStop Infinite" credit is
  `site.footer.showPublisherCredit`; keep or remove according to your agreement.

## 5. Behaviour you may want to change

- **Connect real reservations** — `src/lib/reservations.ts` exposes `ReservationStore` (`create`, `change`, `cancel`, `list`). Replace its
  persistence with API calls, replace `src/lib/availability.ts` with real inventory, keep the validation in `src/lib/validation.ts`,
  and remove the demonstration notices (`site.demoNotice`, banners in `Booking.tsx`, `Confirmation.tsx`, `ReservationDetail.tsx`).
  Do not add payment collection without a PCI-compliant provider and the account owner's authorisation.
- **Contact form** — `src/pages/Contact.tsx` validates and then shows a demonstration message; wire `submit` to your form service.
- **Newsletter** — `src/components/Footer.tsx` (`Newsletter`) is likewise a demo.
- **Menus** — prices are whole currency units in `dining.ts`.

## 6. Images

`public/images/*.webp` are original illustrations generated by `scripts/generate-art.ts` (`npm run art`). For production replace them
with your own photography:

1. Export WebP (or AVIF/JPEG) around 1600 px wide (2000 px for heroes). Keep file names or update the paths in the config files.
2. Update `alt` text in the config. Images use intrinsic width/height and `loading="lazy"` (the hero uses `fetchpriority="high"`).
3. Record the licence of every replacement in `ASSET_LICENSES.md`.

## 7. Where things live

```
src/config/   all editable content and rules          src/lib/       pure logic (dates, pricing, availability, validation, store)
src/components/  UI building blocks                    src/pages/     one file per route
src/styles/   base.css · components.css · pages.css    e2e/           Playwright specs
scripts/      generate-art · generate-seo · review-sheets · package-release
```

Adding a room: copy an entry in `rooms.ts`, give it a unique `id`/`slug`, add images; the listing, detail page, sitemap and booking
engine pick it up automatically. Adding a page: create `src/pages/X.tsx`, add a lazy route in `src/App.tsx`, add a nav entry in
`layout.ts` and an entry in `seo.ts` and `scripts/generate-seo.ts`.
