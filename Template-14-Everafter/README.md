# EVERAFTER — Luxury Wedding & Event Planning Website Template

**OneStop Infinite · Template 14.** A complete, commercially resellable website for wedding planners, destination-wedding
specialists, luxury event agencies, venues, decorators and private-celebration organisers.

Built with **React 19 · Vite · TypeScript · React Router** and hand-written, dependency-free CSS. Fonts are self-hosted, there are
no runtime network requests, and the whole site is configured from `src/config/`.

> **This is a demonstration.** EVERAFTER is a fictional studio. All couples, venues, prices, testimonials and articles are made up,
> and **no form on the site is sent anywhere** (there is no backend). The questionnaire, package enquiry, contact form and newsletter
> all validate your input and show an on-screen preview that says plainly that nothing was delivered. See [Demonstration-only
> functionality](#demonstration-only-functionality).

## What is included

| Area | Routes |
|---|---|
| Home — cinematic hero, brand intro, philosophy, featured weddings, services, destinations, signature experiences, process, testimonials, journal preview, consultation CTA | `/` |
| Portfolio — 13 weddings, filters for location / style / event type, fullscreen lightbox | `/weddings`, `/weddings/:slug` |
| Services — 8 services with stages, inclusions, example prices, FAQs | `/services`, `/services/:slug` |
| Packages — 3 tiers, comparison table, add-ons, indicative estimate, enquiry hand-off | `/packages` |
| Destinations — 13 demonstration destinations, category + region filters, galleries | `/destinations`, `/destinations/:slug` |
| About — story, philosophy, values, approach, team, behind the scenes | `/about` |
| Journal — categories, search, article pages, related content | `/journal`, `/journal/:slug` |
| Event planning questionnaire — 9 steps + completion screen | `/plan` |
| Contact — details, hours, validated form, social links, FAQs | `/contact` |
| Demo notice, photo credits, custom 404 | `/demo-notice`, `/credits`, `*` |

## Quick start

```bash
npm ci
npm run dev        # http://localhost:5173
```

```bash
npm run check      # typecheck + lint + unit/integration tests + production build
npm run build && npm run test:e2e   # real-browser audit (Playwright + axe-core), see VERIFICATION.md
npm run build && npm run review     # regenerate screenshot contact sheets in ./review
npm run package    # rebuild handoff/OneStop-Infinite-Template-14-Everafter.zip (+ .sha256)
```

Requires Node 18.18 or newer. The browser scripts need a Chromium binary (they look in `/opt/pw-browsers/chromium`; set
`CHROMIUM_PATH` otherwise).

## Customising

Everything the visitor sees is data in `src/config/`. **Read [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)** for the exact
mapping from each thing you might want to change (brand, colours, fonts, navigation, hero, homepage section order, projects,
destinations, services, packages, prices, team, testimonials, journal, questionnaire, SEO…) to the file and field that controls it.

## Deploying

```bash
npm run build      # outputs ./dist
```

`firebase.json` is ready for **Firebase Hosting** (`public: dist`, SPA rewrite `** → /index.html`, immutable caching for assets).
Any static host works if it rewrites unknown paths to `index.html` (Netlify `_redirects`: `/* /index.html 200`; Vercel rewrites;
nginx `try_files $uri /index.html;`). Set your public URL in `src/config/site.ts` (`url`) or with `VITE_SITE_URL`
so canonical links, Open Graph tags, `sitemap.xml` and `robots.txt` are correct.

## Demonstration-only functionality

| Feature | What actually happens | Making it real |
|---|---|---|
| Questionnaire (`/plan`) | Validates every step, shows a review, then a completion screen that says nothing was sent. The reference (`DEMO-XXXXXX`) is generated locally and is *not* an enquiry number. An optional, opt-in draft is stored in your browser's local storage only. | Wire `finish()` in `src/pages/Plan.tsx` to your endpoint — see *Connecting a backend* in the guide. |
| Package enquiry | Opens the questionnaire with the package and add-ons pre-filled. | Same as above. |
| Contact form / newsletter | Validate, then preview "nothing was sent". | Same as above. |
| Prices, packages, add-ons | Fictional example figures. | Edit `src/config/packages.ts`, `services.ts`. |
| Weddings, destinations, venues | Fictional. Photos are illustrative stock images of real places and **do not depict** the projects. No venue is named, verified or endorsed. | Replace with your own work. |
| Testimonials, team, articles | Fictional. | Replace with your own. |
| Office address, phone, e-mail | Fictional (`example-everafter.com`, `555` numbers). | `src/config/site.ts`. |

Remove or reword the demonstration notices (`DemoBanner`, `/demo-notice`, footer line) only after replacing the fictional content
and connecting real backends. Never present a form as delivered unless it truly is.

## Project structure

```
src/
  config/        all content and settings (single source of truth)
  components/    Layout, Lightbox, Photo, forms, cards, UI primitives
  pages/         one file per route
  lib/           validation, questionnaire logic, SEO, storage, theme
  styles/        base.css · components.css · pages.css
  test/          Vitest unit and integration tests
public/          favicon, logo, optimised images
scripts/         e2e.mjs, review.mjs, make-zip.mjs
review/          committed screenshot contact sheets
```

## Licence

See [LICENSE](LICENSE) (template) and [ASSET_LICENSES.md](ASSET_LICENSES.md) (photographs, fonts, dependencies). The footer shows the
OneStop Infinite template-publisher credit, configured separately from your business branding (`site.publisher`).
