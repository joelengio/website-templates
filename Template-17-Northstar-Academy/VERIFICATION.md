# Verification Report

Run on 2026-10-29 · Node 22.22 · npm 10.9 · Playwright 1.63 driving the pre-installed Chromium 1243 build (via `PW_CHROMIUM_PATH`).
Results below are from real runs of the commands shown, from a clean `node_modules`.

| Check | Command | Result |
| --- | --- | --- |
| Clean install | `rm -rf node_modules dist && npm ci` | OK |
| Dependency audit | `npm audit` | 0 vulnerabilities |
| Lint (ESLint + jsx-a11y) | `npm run lint` | 0 errors, 0 warnings |
| Typecheck (TS strict) | `npm run typecheck` | 0 errors |
| Unit + integration | `npm test` | **55 / 55 passed** (3 files) |
| Production build | `npm run build` | OK (sitemap 42 URLs + robots.txt generated, code-split per route) |
| Browser E2E + layout + axe | `npm run test:e2e` | **157 / 157 passed** (~2 min) |
| Fresh-extract run of the release ZIP | unzip → `npm ci` → `npm run check` → `npm run test:e2e` | see "Archive" below |

## What the tests cover

**Vitest — `src/lib/lib.test.ts` (41 tests), `src/test/config.test.ts`, `src/test/app.test.tsx` (14 tests)**
- *Quiz scoring:* all right / all wrong / partial; pass exactly at the mark and just below; rounding cannot push a failing score over the mark (2/3 vs a 67% mark); unanswered, out-of-range and fractional answers count wrong; default pass mark; 0% and 100% marks; an empty quiz can never pass; feedback tiers.
- *Progress:* 0% start; equal weighting of lessons and quizzes; **all lessons done but quizzes outstanding ⇒ not complete**; quizzes passed but lesson missing ⇒ not complete; completes only at 100% with `completedAt`, and un-completes when a lesson is unchecked; never 100% before completion, never 0% after progress; unknown ids ignored; a failed retry never un-passes a quiz; progress requires enrollment; resume logic (last visited incomplete step, else first incomplete); step ordering; unenroll clears scores.
- *Learning paths:* all path courses exist; path progress/next course; empty path.
- *Persistence:* localStorage round trip; corrupt JSON recovery; sanitising unknown courses/lessons/quizzes/bookmarks; stored `passed` flag is not trusted over the best score; reset clears storage; sample progress is consistent (one completed course, others in progress).
- *Search / filters / sorting:* case- and accent-insensitive multi-term search, AND-combined filters, price/duration/rating/title sorting, URL round trip and junk-param handling, article search.
- *Pricing:* annual ≤ monthly, whole-number saving percentages.
- *Customization safety net:* section hide/reorder, theme → CSS variables, unique slugs, valid category/instructor/quiz references, every course ≥ 2 modules / ≥ 3 lessons per module / ≥ 3 questions per quiz with valid answer indexes and no duplicate options, every configured image/asset file exists, demonstration data is labelled, owner credit separate from the demo brand.
- *UI integration (React Testing Library):* catalogue search/filters/empty state/reset; enroll dialog → enrollment → lesson completion → persisted state → next/previous; not-enrolled redirect; quiz requires all answers, fails, retries, passes; dashboard empty state, load sample progress, reset with cancel and confirm; certificate locked vs unlocked and labelled; bookmarks; plans toggle; contact validation with focus on first invalid field and honest demo result; mobile menu dialog (Escape + focus return); 404s; instructor page; owner credit + disclosure.

**Playwright — `e2e/site.spec.ts`, `e2e/a11y.spec.ts` (157 tests) against the production build**
- **Layout at 360, 390, 768, 1024 and 1440 px** for 13 public routes (incl. 404 and course/instructor/article details) and 7 learning routes (dashboard, course home, lesson, quiz, bookmarks, completed, certificate): no horizontal overflow, no broken images (lazy images forced to load), no console errors, page errors, failed requests or HTTP ≥ 400.
- *Catalogue:* search, category, difficulty and price filters, sorting, URL persistence across reload, empty state, reset; hero search; free filter; mobile filter drawer.
- *Learning workflow (single end-to-end test):* enroll via dialog (focus lands on confirm) → lesson complete → exact progress % (8%, 75%, 100%) → next/previous → reload persistence → toggle off/on → all lessons done but quizzes outstanding is **not** complete → quiz validation error → 0% fail → 67% fail (2 of 3 vs 70% mark) → retry → pass → remaining quizzes → course complete → completed page → certificate with "DEMONSTRATION — NOT ACCREDITED" → dashboard → reset dialog (Escape returns focus, confirm clears) → reload still empty.
- *Dashboard:* seeded data, continue-learning resumes the last visited step, bookmarks, "Load sample progress" fills charts.
- *Lesson viewer:* local video with captions track, mobile outline drawer (focus trap, closes on navigation), desktop persistent sidebar with accordion keyboard operation.
- *Learning paths:* Start learning enrolls and opens first lesson; completed courses advance the path.
- *Plans:* monthly/annual toggle prices and "$228 per year · save 21%", comparison table, inquiry pre-selection and validation.
- *Navigation & meta:* mobile navigation by keyboard (focus trap, Escape, focus return); skip link and visible focus; per-route title / canonical / OG tags; `noindex` on `/learn/*`, certificate and 404; robots.txt, sitemap.xml (no `/learn` URLs), favicon, OG image; deep-link route; journal search/category; `prefers-reduced-motion`; certificate print view hides site chrome.
- **axe-core (WCAG 2.0/2.1 A + AA):** 19 routes × 2 viewports (1440 and 390 px) plus interactive states (enroll dialog, quiz with validation error, quiz results, filter drawer, mobile menu, outline drawer, annual plans, contact errors): **0 violations**.

## Defects found and fixed during verification
- Catalogue search debounce could overwrite a category/filter change made while typing (stale state) — search now writes the full filter state to the URL immediately; verified stable with 10× repeated runs under parallel load.
- Visually hidden (`sr-only`) tables inside scrollable/non-positioned containers caused horizontal page overflow at 360–768 px — containers are now positioned.
- axe `label-content-name-mismatch` on the logo link, `link-name` on the mobile lesson "Course home" link, and a mid-animation `color-contrast` flag on drawers — fixed.
- Generated course covers produced negative SVG sizes (unsigned shift) — fixed.

## Manual review
Labelled contact sheets of every important page at desktop and mobile widths are in `review/` and were inspected visually:
`public-pages-1440.jpg`, `public-pages-390.jpg`, `learning-dashboard-1440.jpg`, `learning-dashboard-390.jpg` (regenerate with `npm run review`).

## Archive
`handoff/OneStop-Infinite-Template-17-Northstar-Academy.zip` — project at archive root; no `node_modules`, `dist`, `.git`, env files, credentials or other ZIPs (enforced by `npm run package`, which also runs `unzip -t`).
Its SHA-256 is in `handoff/OneStop-Infinite-Template-17-Northstar-Academy.zip.sha256` (a ZIP cannot contain its own hash) and in the delivery notes. Re-check with `cd handoff && sha256sum -c OneStop-Infinite-Template-17-Northstar-Academy.zip.sha256`.
The final archive was extracted into an empty temporary directory and `npm ci`, `npm run check` and `npm run test:e2e` were run there; the outcome is recorded in the pull request description.

## Known limitations
- Client-side rendered SPA: per-route meta is applied in the browser (no prerendering/SSR).
- Real form delivery requires `VITE_FORM_ENDPOINT`; that path is not tested against a live service (validation and demo mode are).
- Firebase config is provided but was **not deployed** (no project/credentials available).
- Only Chromium was exercised; Firefox/Safari were not tested. No real device testing.
- Screen-reader testing was automated (axe + role/label assertions), not done with real assistive technology.
- Instructor portraits are original illustrations, not photographs; the two people photos are Unsplash stock (see ASSET_LICENSES.md).
- The demo video is a short silent clip; there is no streaming or tutoring integration.
- Progress lives in `localStorage` only; it is per-browser and can be lost.
