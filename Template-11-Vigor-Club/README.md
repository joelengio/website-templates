# VIGOR CLUB — OneStop Infinite Template 11

A premium, commercially resellable **gym & fitness club website template**: luxury athletic editorial design on charcoal and
graphite with warm off-white type and acid-lime accents. Built with **React 19, Vite, TypeScript and React Router**; no
backend required.

> VIGOR CLUB is a **fictional** business. "OneStop Infinite" owns the template. Class booking, membership signup and
> contact forms are **demonstrations** (see [Demonstration-only functionality](#demonstration-only-functionality)).

## What's included
| Area | Highlights |
|---|---|
| Home | Cinematic hero, positioning, programs, philosophy, facilities, weekly class preview, trainers, pricing, testimonials, journal, contact CTA, footer — order/visibility configurable |
| Programs | 8 configurable programs, category/level/trainer filters, working search (URL-addressable), detail pages |
| Schedule | Weekly timetable with week + day navigation, class and trainer filters, class details, **demo booking**, confirmation, cancellation, duplicate/clash prevention, `localStorage` persistence |
| Trainers | 6 fictional trainers, detail pages, programs, weekly classes, inquiry CTA, fictional-credential labelling |
| Membership | 3 plans, monthly/annual toggle, comparison table, FAQs, validated 3-step demo signup (no payment) |
| Facilities | 6 zones, filterable gallery, keyboard-accessible lightbox |
| About, Journal, Contact, Demo notice, 404 | Journal search/categories/related articles; validated forms that never fake delivery |
| Customization | Everything editable in `src/config/` — see [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) |

## Requirements
Node.js ≥ 18.18 (developed and verified on Node 22) and npm.

## Install & run
```bash
npm ci            # clean install from package-lock.json
npm run dev       # http://localhost:5173
```

## Scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Type-check (`tsc -b`) and production build to `dist/` (also writes `sitemap.xml`, `robots.txt`) |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm test` | Vitest unit + integration tests (config integrity, logic, pages, booking, pricing, forms, customization) |
| `npm run test:e2e` | Playwright browser E2E + axe-core accessibility checks against the production build (run `npm run build` first) |
| `npm run check` | typecheck + lint + tests + build |
| `npm run images` | Regenerates the trainer monogram cards and the demo-map backdrop in `public/images` (needs Chromium) |
| `npm run package` | Builds the single canonical hand-off ZIP in `handoff/` |

E2E scripts use `playwright-core` and look for Chromium at `$CHROMIUM_PATH` or `/opt/pw-browsers/chromium`.
Elsewhere install a browser (`npx playwright-core install chromium`) and set `CHROMIUM_PATH`.
Set `E2E_BROWSER=firefox` or `webkit` to run the same checks in another engine (`npx playwright-core install firefox webkit` first).

## Deploy (Firebase Hosting)
`firebase.json` serves `dist/` with an SPA rewrite so every route (including nested ones such as `/programs/hiit`) loads directly.
```bash
VITE_SITE_URL=https://your-domain.com npm run build
npx firebase-tools login
npx firebase-tools init hosting   # choose the existing firebase.json, public dir "dist", SPA rewrite = yes (do not overwrite index.html)
npx firebase-tools deploy --only hosting
```
Any static host works if it rewrites unknown paths to `index.html` (Netlify `_redirects`, Vercel rewrites, nginx `try_files`, …).

## Project structure
```
src/config/      all editable content & settings (brand, theme, nav, home, programs, trainers, classes, plans, journal…)
src/pages/       one file per route
src/components/  Layout, Modal, Lightbox, cards, UI primitives, Logo, Icon, Seo
src/lib/         schedule logic, reservations, validation, filters, pricing, forms, storage, SEO, theme
src/styles/      base.css (tokens/typography) · components.css · pages.css
src/test/        Vitest suites
scripts/         e2e.mjs, make-zip.mjs, art/ (monogram + map generators), photos/ (photo source manifest)
public/          images, favicon, logo
```

## Demonstration-only functionality
* **Class booking** — reservations exist only in the visitor's browser (`localStorage`). No server, email, calendar or payment.
  Capacity numbers shown ("demo places") are simulated; they never reflect real occupancy.
* **Membership signup** — validates details and stores a demo enquiry locally. It never takes payment, creates an account
  or activates a membership, and says so on screen.
* **Contact / enquiry forms** — validated, but **not delivered** unless you set `site.forms.endpoint`; the UI says "Message not sent"
  in demo mode and only says "sent" after a successful server response.
* **Business content** — address, phone, email, trainers, qualifications, testimonials, prices and articles are fictional.
  Social links point to the platforms' home pages as placeholders.
* **Imagery** — licensed stock photographs (Unsplash License, each verified; photographer and source page recorded in [ASSET_LICENSES.md](ASSET_LICENSES.md)). They do not show a real club or its trainers; some show people, for whom the licence gives no model release — replace before launch. Trainer cards are monogram placeholders.

## Accessibility & performance notes
Skip link, semantic landmarks, one `h1` per page, visible focus rings, labelled form fields with inline errors, focus-trapped
modals/lightbox that restore focus, `prefers-reduced-motion` support, WCAG 2.1 AA contrast verified with axe-core, lazy-loaded
images with intrinsic sizes, code-split routes, self-hosted fonts.

## Documentation
* [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) — exact mapping of editable files and settings
* [VERIFICATION.md](VERIFICATION.md) — real test results and known limitations
* [ASSET_LICENSES.md](ASSET_LICENSES.md) — image, font and dependency licences
* [CHANGELOG.md](CHANGELOG.md) · [LICENSE](LICENSE)

Template by **OneStop Infinite**.
