# Verification Report — Template 09 · Aurel Estates (v1.1.0)

Independent QA run on 2026-10-29 · Node 22.22 · npm 10.9 · Chromium 1243 (Playwright 1.63) · Firefox 155 · WebKit 27.2.
Everything below was actually executed; see `documentation/review/` for the screenshot contact sheets and `REVIEW.md`.

| Check | Command | Result |
| --- | --- | --- |
| Clean install | `npm ci` (also repeated inside a fresh extraction of the release ZIP) | OK — `npm audit`: 0 vulnerabilities (prod and dev) |
| Lint (ESLint + jsx-a11y) | `npm run lint` | 0 errors, 0 warnings |
| Typecheck (TS strict) | `npm run typecheck` | 0 errors |
| Unit + interaction tests | `npm test` | **35 / 35 passed** (3 files) |
| Production build | `npm run build` | OK; sitemap 27 URLs + robots generated; no Vite warnings |
| Browser E2E + a11y — Chromium | `npm run test:e2e` | **30 / 30 passed** |
| Browser E2E + a11y — Firefox 155 | `PW_BROWSER=firefox npx playwright test` | **30 / 30 passed** |
| Browser E2E + a11y — WebKit 27.2 | `PW_BROWSER=webkit npx playwright test --workers=1` | **30 / 30 passed** (final run). Earlier runs the same day showed one failure each, in a different test, that passed alone: a favorites persistence write that lived in a React state updater and a fixed compare tray covering checkboxes — both fixed in code — and a hero-search click that fired before the app hydrated — fixed in the test |
| Fresh-extract run | unzip → `npm ci` → `npm run check` → `npm run test:e2e` | passed — the final ZIP was extracted into an empty directory and the same four commands were run there (same counts as the rows above) |

## What is covered

**Vitest** — filtering (keyword, AND-combined filters, availability, empty result, every sort, URL round-trip, junk params); **saved searches** (storage, corrupt storage, cap, round-trip of a combined filter, description text, UI journey: save → reset → reload → re-apply → duplicate warning → delete);
inquiry validation; property pre-selection; focus to first invalid field; demo mode never says "sent"; listings UI (filter → empty → reset, keyword, sort, drawer dialog); favorites persistence; compare cap of three; gallery + lightbox keys; mobile-menu focus trap;
customization (hide/reorder sections, disable pages, theme → CSS variables, owner credit, ≥ 12 unique properties, every image + alt text exists).

**Playwright (Chromium, Firefox, WebKit)** — 12 routes × **360 / 390 / 768 / 1024 / 1440 px**: no horizontal overflow, no broken images, no console errors; mobile menu by keyboard; skip link; focus to heading after navigation;
desktop filters + URL state + reset + empty state; **combined filters + sort + reload + saved search re-apply/delete**; mobile filter drawer; favorites survive reload; compare limited to three; lightbox keyboard; inquiry form validation and honest demo result; hero search;
`prefers-reduced-motion`; sitemap/robots/favicon/canonical/title; **static HTML head has absolute canonical/OG URLs; 404/Favorites/Compare are `noindex`**; SPA deep-link fallback; owner credit.
**axe-core** (WCAG 2.0/2.1 A + AA **+ best-practice**, animations disabled) on 12 pages including a filtered listing and the 404: 0 violations.

## Customization (actually exercised)
A scratch copy was rebranded **only through `src/config`** (brand name + wordmark, site URL, SEO title, primary colour, a nav label, hiding the home "stats" section, switching the Journal page off, footer blurb), built, and inspected in a browser:
header/footers showed the new brand and nav label, `--c-forest` became the new colour, the stats section disappeared, `/journal` returned the 404 page and left the navigation, and `dist/index.html` + `sitemap.xml` carried the new title, canonical, `og:image` and URLs. No component edits were needed.

## Defects found by this QA pass (all fixed — see CHANGELOG 1.1.0)
Saved searches missing; stale/relative static SEO head; indexable 404/private pages; a11y best-practice gaps (landmark, heading order); cramped inquiry form and misaligned hero search; "$5.0M" price labels;
favorites were persisted inside a React state updater (a reload straight after a click could lose the change in WebKit) → now written synchronously; the fixed compare tray could cover the last checkboxes/footer → scroll padding added;
Vite config used extensionless imports (deprecated config loader warning).

## Archive
`handoff/OneStop-Infinite-Template-09-Aurel-Estates.zip` — project at archive root, no `node_modules`, `dist`, `.git`, env files, credentials, QA screenshot sheets or other ZIPs (enforced by `npm run package`, which also runs `unzip -t`).
Its SHA-256 is in `handoff/OneStop-Infinite-Template-09-Aurel-Estates.zip.sha256` (a ZIP cannot contain its own hash). Re-check: `cd handoff && sha256sum -c OneStop-Infinite-Template-09-Aurel-Estates.zip.sha256`.

## Known limitations
- Client-side rendered SPA: per-page meta is applied in the browser (the static head carries site-wide defaults only); add prerendering if per-URL previews matter.
- Forms and saved searches: no backend. Inquiries need `VITE_FORM_ENDPOINT` (only its validation path is tested; no live service was available). Saved searches live in this browser only and send no alerts.
- Firebase config is provided but was **not deployed** (no project/credentials).
- Accessibility evidence is automated (axe + keyboard/role assertions + manual visual review), not a real screen-reader session.
- Photography is Unsplash-licensed stock. Photographer names are **not recorded** (CDN ids cannot be resolved to authors); all 39 source URLs were re-requested and still resolve on the free-photo host. Replace before commercial launch.
- WebKit was run on Linux (WebKitGTK-based Playwright build), not on Apple devices; some timing-sensitive checks can be flaky under heavy CPU load, so WebKit was run with one worker.
