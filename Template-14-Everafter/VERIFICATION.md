# Verification

Everything below was **actually executed** on 2026-10-29 against the final source in this directory. Nothing is claimed that was not run.
Environment: Node v22.22.0, npm 10.9.4, Linux container, Chromium (Playwright, headless) with axe-core 4.x.

## Command results

| Step | Command | Result |
|---|---|---|
| Clean install | `rm -rf node_modules && npm ci` | 245 packages installed |
| TypeScript | `npm run typecheck` (`tsc -b --noEmit`, strict) | 0 errors |
| ESLint | `npm run lint` | 0 errors, 0 warnings |
| Unit + integration tests | `npm test` (Vitest + Testing Library, jsdom) | **4 files, 45 tests passed** |
| Production build | `npm run build` | succeeded; code-split per route |
| Browser end-to-end | `npm run build && npm run test:e2e` (Playwright + axe-core) | **112/112 checks passed** |
| Screenshot contact sheets | `npm run review` | 10 labelled sheets written to `review/` |

### Unit / integration tests (`src/test/`)
- `lib.test.ts` — validation helpers, formatting, safe storage, every questionnaire step validator, conditional services, guest advice, summary and demo-reference format, related-article logic.
- `config.test.ts` — content integrity (>=12 weddings, 8 services, >=3 packages, unique slugs, all cross-references resolve, every registered image exists in two sizes, all alt text present, brand/publisher separation, `firebase.json` SPA rewrite).
- `app.test.tsx` — routing, active navigation, custom 404 (unknown route and unknown slug), page titles, portfolio location/style/event-type filtering with the empty state, contact form validation and honest result, full questionnaire walk-through to the demo completion screen, back navigation keeping answers.
- `customization.test.tsx` — homepage sections render in configured order, can be hidden or reordered, unknown ids ignored, empty configuration still renders, theme tokens written to CSS variables.

### Browser end-to-end (`scripts/e2e.mjs`) — 112 checks
The script serves the production build with `vite preview`, reads every URL from the generated `sitemap.xml` (**54 routes**: all pages plus every wedding, service, destination and article), and runs:

**Per-route sweep at 360, 390, 768, 1024 and 1440 px** (direct URL access to every route, in a fresh page each time):
- PASS [360px] 54 routes: direct access, no overflow, no broken images, one h1, heading order, alt text, SEO tags, touch targets
- PASS [360px] no console errors or failed requests
- PASS [390px] 54 routes: direct access, no overflow, no broken images, one h1, heading order, alt text, SEO tags, touch targets
- PASS [390px] no console errors or failed requests
- PASS [1440px] 54 routes: direct access, no overflow, no broken images, one h1, heading order, alt text, SEO tags, touch targets
- PASS [1440px] no console errors or failed requests
- PASS [1024px] 54 routes: direct access, no overflow, no broken images, one h1, heading order, alt text, SEO tags, touch targets
- PASS [1024px] no console errors or failed requests
- PASS [768px] 54 routes: direct access, no overflow, no broken images, one h1, heading order, alt text, SEO tags, touch targets
- PASS [768px] no console errors or failed requests

Each of those checks verifies, for all 54 routes: no horizontal overflow, no broken or unloaded images (lazy images forced to load), exactly one `h1`, no skipped heading levels, every image has an `alt` attribute, unique title + description + canonical, and no interactive target smaller than 24x24 px.

**Accessibility, SEO, behaviour, forms:**
- PASS axe-core WCAG 2.1 A/AA (desktop): no violations on all 54 routes
- PASS axe-core WCAG 2.1 A/AA (mobile 390px): no violations on key routes
- PASS Unknown URL renders the custom 404 with noindex
- PASS Unknown wedding slug renders 404 inside the layout
- PASS /robots.txt is served
- PASS /sitemap.xml is served
- PASS /favicon.svg is served
- PASS /logo.svg is served
- PASS /images/og-image.jpg is served
- PASS sitemap lists wedding, service, destination and article URLs
- PASS index.html has description, canonical and Open Graph tags
- PASS firebase.json has SPA rewrite to /index.html
- PASS Mobile menu opens (aria-expanded=true)
- PASS Escape closes mobile menu and returns focus to the toggle
- PASS Mobile menu navigates and closes
- PASS Active nav item is marked aria-current on the new route
- PASS Portfolio lists at least 12 weddings
- PASS Location filter: Italy shows 3
- PASS Filter state is stored in the URL
- PASS Location + style filter: Italy and Coastal Elegance shows 1
- PASS Impossible combination shows the empty state
- PASS Clear filters restores all weddings
- PASS Event type filter: Elopement shows 1
- PASS Filters initialise from URL on direct load
- PASS Detail shows story, facts, services and gallery
- PASS Lightbox opens from keyboard
- PASS Lightbox shows the chosen photo (2 / n)
- PASS Lightbox focus starts on the close button and is inside the dialog
- PASS ArrowRight advances
- PASS ArrowLeft goes back
- PASS End jumps to the last photo
- PASS Navigation wraps around to the first photo
- PASS Thumbnail click selects that photo
- PASS Tab key stays trapped inside the lightbox
- PASS Page behind the lightbox is scroll-locked
- PASS Next button works on mobile viewport
- PASS axe: lightbox open has no violations
- PASS Escape closes lightbox, restores scroll and returns focus to the thumbnail
- PASS Swipe left advances the lightbox on touch devices
- PASS Services index lists 8 services
- PASS All 8 service pages have stages, inclusions, price label and FAQs
- PASS FAQ accordion expands with aria-expanded
- PASS FAQ accordion collapses
- PASS Service CTA pre-selects the chosen service in the questionnaire
- PASS Package comparison table lists three tiers with a caption
- PASS At least three packages with starting prices
- PASS Selecting an add-on updates the indicative total
- PASS Package inquiry carries package and add-ons into the questionnaire
- PASS Destinations lists 13
- PASS Category filter: Coastal shows 3
- PASS Coastal + Asia shows the empty state
- PASS Show all restores every destination
- PASS Region filter: Asia shows 1 (Bali)
- PASS Destination page shows planning information and gallery
- PASS Destination page discloses that venues are not verified
- PASS Questionnaire discloses it is not sent to a planner
- PASS Progress shows Step 1 of 9
- PASS Step 1 validation error appears
- PASS Date step requires a date
- PASS Past dates are rejected
- PASS Conditional: season and year fields appear for "we have a season"
- PASS Conditional: custom destination field appears for "Somewhere else"
- PASS Custom destination is required
- PASS Guest minimum enforced
- PASS Guest field is numeric (non-numeric typing is rejected by the browser)
- PASS Large-event note appears for 300 guests
- PASS Style step requires a selection
- PASS Conditional: corporate event hides wedding-only services and shows corporate ones
- PASS Services step requires a selection
- PASS Budget step is optional and the button reads Skip
- PASS Conditional: corporate shows company field, not partner field
- PASS Contact step shows name, email and company errors
- PASS Invalid email is rejected with a clear message
- PASS Choosing phone as contact method makes phone required
- PASS Review step lists the answers
- PASS Review "Edit" jumps back to that step
- PASS Returning to the review keeps edited answers
- PASS Completion requires acknowledging the demonstration
- PASS Completion screen clearly states nothing was sent and no booking was made
- PASS Completion shows a clearly demo-labelled reference
- PASS Summary download works
- PASS axe: questionnaire completion screen has no violations
- PASS Nothing is stored before the visitor opts in
- PASS Opt-in draft is stored locally with the current step
- PASS Focus moves to the new step heading
- PASS Saved draft can be resumed at the saved step
- PASS Unticking save deletes the stored draft
- PASS Journal lists 9 articles
- PASS Journal category filter works
- PASS Journal search finds matching articles
- PASS Journal search with no results shows the empty state
- PASS Article page shows heading, body and related content
- PASS Contact form shows an error summary and inline errors when empty
- PASS Contact form requires demo acknowledgement
- PASS Contact result never claims delivery
- PASS Contact page shows opening hours, office and social links
- PASS Newsletter form validates email
- PASS Newsletter form says nothing was subscribed
- PASS Skip link is the first focusable element
- PASS Home sections render (intro first, cta last)
- PASS All 29 internal links on the home page resolve to real pages
- PASS Reduced motion: reveal content is visible immediately without animation

## Not run / known limits (stated honestly)
- No real-device or Safari/Firefox testing: only Chromium was available. Layout uses standard CSS (grid, flex, `:has()`), supported by current evergreen browsers.
- axe-core finds roughly a third of WCAG issues automatically; no manual screen-reader pass (VoiceOver/NVDA/JAWS) was performed.
- No Lighthouse run and no performance budget measurement beyond the build output below.
- Forms have **no backend**; "delivery" is deliberately not implemented (see README).
- External links (social profiles, licence and Wikimedia source pages) were not crawled; social links point at platform home pages and must be replaced.

## Bundle and asset sizes (from `npm run build`)
- Entry JS 236 kB (74 kB gzip), shared content chunk 123 kB (42 kB gzip), per-route chunks 1-22 kB, CSS 61 kB (12.5 kB gzip).
- Fonts are self-hosted WOFF2/WOFF (Latin subsets load on demand through `unicode-range`).
- 74 photographs, each in 1600 px and 720 px WebP, total 23.7 MB in `public/images/` (plus `og-image.jpg`). Cards use the 720 px variant; hero images use `fetchpriority="high"`, the rest are `loading="lazy"`.

## Visual review (contact sheets in `review/`)
Desktop 1440 px: `review/desktop-contact-sheet-1.jpg` … `-5.jpg`. Mobile 390 px: `review/mobile-contact-sheet-1.jpg` … `-5.jpg`.
Each tile is labelled with its route or state: home, weddings (+2 details), services (+2 details), packages, destinations (+2 details), about, journal (+2 articles), plan, contact, demo notice, 404, plus the lightbox open, filter empty state, add-on estimate, questionnaire validation error / conditional step / review / completion, and (mobile) the open navigation menu.
Regenerate with `npm run build && npm run review`.

## Issues found and fixed during verification
- Header call-to-action stayed visible on mobile and pushed the page 39–69 px wider than the viewport (specificity bug) — fixed.
- Visually hidden text inside the comparison table escaped its scroll container and widened the page on phones — fixed.
- Brand link `aria-label` did not contain its visible text (WCAG 2.5.3) and wedding-card labels likewise — removed.
- Lightbox leaked page content to assistive technology and failed contrast checks behind it — now portalled with the app marked `inert` while open.
- Heading levels skipped from `h1` to `h3` on list pages — cards now use `h2` there.
- Rose accent colour measured 3.9:1 on the cream background — darkened to 5.5:1.
- Footer, breadcrumb and fact-list links were below the 24 px target size — padded.
- Gallery mosaic collapsed to a single full-width image on desktop (CSS ordering) — fixed.
- Questionnaire step heading scrolled underneath the sticky header — `scroll-margin-top` added.

## Archive verification (`handoff/OneStop-Infinite-Template-14-Everafter.zip`)
1. `sha256sum -c` against the external `.sha256` file: OK.
2. The archive was extracted into a clean temporary directory and the extracted project was verified there: `npm ci` (245 packages), `npm run check` (typecheck, lint, **45/45** unit and integration tests, production build) and the full `npm run test:e2e` (**112/112** browser checks, all 54 routes at 5 widths).
3. This section was then added to `VERIFICATION.md` (the only file that changed), the archive was rebuilt, and the rebuilt archive was extracted again and re-verified with `npm ci`, `npm run check` and the functional browser suite (`E2E_QUICK=1 npm run test:e2e`, which skips only the per-route sweeps already run in step 2). The two archives were compared with `diff -r`: only `VERIFICATION.md` differs.
4. The archive excludes `node_modules`, `dist`, `.git`, local env files, logs and any other `.zip`; it contains the complete project at the archive root, including the committed `review/` contact sheets.

The exact SHA-256 of the final archive is in `handoff/OneStop-Infinite-Template-14-Everafter.zip.sha256` (a file cannot contain a hash of an archive that includes it, so the hash is not repeated in this document).
