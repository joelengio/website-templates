# Customization Guide — EVERAFTER (Template 14)

Everything a visitor sees is driven by plain TypeScript files in `src/config/`. You rarely need to touch components.
After editing, run `npm run dev` to preview and `npm run check` to verify nothing broke (types, lint, tests, build).

> Business branding and the template-publisher identity are kept apart. Your studio is `site.brand` / `site.footer.copyright`;
> the OneStop Infinite credit is `site.publisher` and can be hidden with `show: false`.

## 1. Exact configuration mapping

| What you want to change | File | Export → field |
|---|---|---|
| Brand name | `src/config/site.ts` | `site.brand.name` |
| Descriptor under the logo / tagline | `site.ts` | `site.brand.descriptor`, `site.brand.tagline` |
| Logo (typographic monogram or your image) | `site.ts`, `src/components/Logo.tsx`, `public/logo.svg` | `site.brand.logoMode` (`'typographic'` \| `'image'`), `site.brand.logo` |
| Favicon | `site.ts`, `public/favicon.svg` | `site.brand.favicon` |
| Colours | `src/config/theme.ts` | `theme.colors.*` (written to CSS variables at start-up) |
| Typography | `theme.ts`, `src/main.tsx` | `theme.fonts.display`, `theme.fonts.body`; swap the `@fontsource/*` imports in `main.tsx` and `package.json` |
| Navigation | `site.ts` | `site.nav[]` (`label`, `to`), `site.headerCta` |
| Footer text, columns, legal links, copyright | `site.ts` | `site.footer.blurb`, `.columns[]`, `.legalLinks[]`, `.copyright` |
| Newsletter form on/off | `site.ts` | `site.newsletter.enabled` |
| Social links | `site.ts` | `site.social[]` |
| Contact details, hours, office | `site.ts` | `site.contact.email`, `.phone`, `.phoneHref`, `.office`, `.hours[]`, `.responseTime` |
| Currency and number format | `site.ts` | `site.currency.code`, `.locale` |
| Hero (headline, image, buttons, stats) | `src/config/home.ts` | `hero.*` |
| Which homepage sections show, and in what order | `home.ts` | `homeSections[]` — reorder the array, set `enabled: false` to hide |
| Intro, philosophy, experiences, process, final CTA copy | `home.ts` | `intro`, `philosophy`, `experiences`, `planningProcess`, `cta` |
| How many cards the home page shows | `home.ts` | `homeCounts` |
| Portfolio projects (add, remove, edit) | `src/config/weddings.ts` | `seeds[]` (title, location, region, style, theme, eventType, guests, story, services, images…) |
| Portfolio filter lists / order | `weddings.ts` | `weddingFilterOrder` (values must match the project fields) |
| Images (registry, alt text, focal point) | `src/config/images.ts` | `catalog` (key → `alt`, `position`, optional `file`) |
| Wedding destinations | `src/config/destinations.ts` | `seeds[]`, `destinationCategories`, `destinationContinents` |
| Services (copy, stages, inclusions, FAQs, price label) | `src/config/services.ts` | `services[]` (`priceLabel`, `priceFrom`) |
| Packages, starting prices, included features | `src/config/packages.ts` | `packages[]` (`startingPrice`, `includes`), `packageFeatures[]` |
| Add-ons and their prices | `packages.ts` | `addOns[]` |
| Team members, values, approach, behind-the-scenes | `src/config/team.ts` | `team[]`, `values[]`, `approach[]`, `behindTheScenes[]` |
| About page story and quote | `src/config/about.ts` | `about.*` |
| Testimonials | `src/config/testimonials.ts` | `testimonials[]` |
| Journal articles and categories | `src/config/journal.ts` | `articles[]`, `journalCategories` |
| Questionnaire questions, options and limits | `src/config/questionnaire.ts` | `eventTypes`, `dateModes`, `seasons`, `destinationOptions`, `styleOptions`, `serviceOptions` (with `appliesTo`), `budgetOptions`, `contactMethods`, `questionnaireSettings` |
| FAQs | `src/config/faqs.ts` | `generalFaqs` (Packages), `contactFaqs` (Contact); per-service FAQs live in `services.ts` |
| CTAs | `home.ts` (`hero.primaryCta`, `cta.primary`), `site.ts` (`headerCta`); page CTAs are props on `<CtaBand>` in `src/pages/*` |
| SEO defaults (title, description, OG image, theme colour) | `site.ts` | `site.seo.*` |
| Page-specific SEO | `<Seo title description image />` at the top of each file in `src/pages/` |
| Canonical / sitemap / robots base URL | `site.ts` or `.env` | `site.url` or `VITE_SITE_URL` |
| Photo credits shown on `/credits` | `src/config/credits.ts` | `photoCredits[]` |
| Backend switch and endpoints | `site.ts` | `site.backend.*` |
| Template publisher credit | `site.ts` | `site.publisher.*` (`show: false` hides it) |
| Hosting | `firebase.json` | rewrites, headers |

## 2. Replacing the fictional content (checklist)

1. **Brand** — edit `site.brand`, contact details, social links and `site.url`.
2. **Colours & fonts** — `theme.ts`.
3. **Photography** — add your own images to `public/images/` as `<name>.webp` (≈1600px wide) and `<name>-sm.webp` (≈720px wide),
   register each in `images.ts` with real alt text, point projects/destinations/services at the new keys, then delete the unused demo
   files, their `credits.ts` entries and the matching rows of `ASSET_LICENSES.md`. Replace `public/images/og-image.jpg`
   (1200×630) and set `site.seo.ogImage`.
4. **Portfolio** — rewrite `weddings.ts`. Each project needs a unique `slug`, a `destinationSlug` that exists in `destinations.ts`,
   and `services` titles that match `services.ts`. Update `weddingFilterOrder` so every region/style/event type you use is listed.
   The test suite (`npm test`) fails with a clear message if any reference is broken.
5. **Services, packages, prices** — `services.ts`, `packages.ts` (prices render through `formatPrice`, so `site.currency` changes everywhere).
6. **Team, testimonials, journal, about** — the corresponding config files. Delete the “fictional” wording only once the content is real.
7. **Questionnaire** — adjust options in `questionnaire.ts`. Budget labels are plain text; keep them consistent with `site.currency`.
8. **Demo wording** — once real, update `DemoBanner` usages (search for `DemoBanner` and `fictional`), the footer line in `Layout.tsx`,
   `DemoNotice.tsx` and the hero stats. Do this *together with* connecting the backends below.

## 3. Homepage sections: hide and reorder

```ts
// src/config/home.ts
export const homeSections = [
  { id: 'intro', enabled: true },
  { id: 'featured', enabled: true },
  { id: 'cta', enabled: true }
  // …move, remove or disable any entry
];
```

Valid ids: `intro`, `philosophy`, `featured`, `services`, `destinations`, `experiences`, `process`, `testimonials`, `journal`, `cta`.
Unknown ids are ignored, a section missing from the array is simply not shown, and the page renders safely even if the array is empty
(covered by `src/test/customization.test.tsx`).

## 4. Colours and fonts

Set colours in `theme.ts`. Keep text/background pairs at WCAG AA (4.5:1) — the automated axe audit (`npm run test:e2e`) will flag failures.
To change fonts: `npm i @fontsource/your-heading-font @fontsource/your-body-font`, replace the imports in `src/main.tsx`, and update
`theme.fonts`. Self-hosted fonts keep the site free of third-party requests.

## 5. Adding a wedding, destination, service or article

Copy an existing object in the relevant file and change it. Routes, cards, filters, sitemap and related-content links are generated
from the arrays — no router changes are needed. `vite.config.ts` reads the same arrays to write `sitemap.xml`.

## 6. Connecting a backend (making forms real)

By default `site.backend.enabled` is `false` and all forms show “nothing was sent” messages. To make them real:

1. Create an endpoint that accepts JSON (a Cloud Function, Formspree, your CRM webhook, etc.) and returns 2xx on success.
2. Set `site.backend.enabled = true` and fill `inquiryEndpoint` / `contactEndpoint` in `site.ts`.
3. In `src/pages/Plan.tsx` → `finish()`, `src/pages/Contact.tsx` → `submit()` and `src/components/NewsletterForm.tsx`, replace the local
   “preview” branch with a `fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) })`. Show the success screen **only** after a
   2xx response, and show a clear error message otherwise. Remove the demo banners and “nothing was sent” wording.
4. Add spam protection (honeypot field, CAPTCHA or server-side rate limiting) and a privacy notice that matches your data handling.
5. Update the draft-saving note in `Plan.tsx` if you change what is stored locally.

Never display “sent”, “booked” or “received” unless the request genuinely succeeded.

## 7. SEO and deployment

- `index.html` metadata, `sitemap.xml` and `robots.txt` are generated at build time from `site.ts` and the content arrays.
- Per-page titles/descriptions come from each page's `<Seo>`; article and project pages use their own summary and cover image.
- Set the canonical origin via `site.url` or `VITE_SITE_URL=https://www.yourdomain.com npm run build`.
- Firebase: `npm run build && firebase deploy --only hosting` (after `firebase init hosting` once, keeping `dist` as public and SPA rewrites **on**).

## 8. Accessibility contract (please keep)

Visible focus styles, one `h1` per page and ordered headings, descriptive alt text, labelled form controls with `aria-describedby` errors,
keyboard-operable gallery/menu/accordion, reduced-motion support (`prefers-reduced-motion`), and 44px-ish touch targets. The e2e suite
checks these on every route — run it after significant changes.
