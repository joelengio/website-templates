# Changelog

## 1.1.0 — 2026-10-29 (independent QA release)
- **New — saved searches:** the listings page can save the current filter + sort combination under a name, re-apply it, and delete it (localStorage, max 8, duplicate detection, live-region announcements, keyboard operable). The brief and README described saved filters but none existed.
- **SEO fixes:** static `index.html` had a relative `og:image`, no canonical/`og:url`, and hard-coded brand text that did not follow `site.ts`; it is now generated from config at build time (`vite.config.ts`). 404, Favorites and Compare pages now emit `noindex`.
- **Design polish:** hero search fields share one height so labels align; the property-page inquiry form is single-column inside the narrow sidebar (the "I'm interested in" select was truncated); fact rows no longer wrap; compact prices read "$5M" instead of "$5.0M".
- **Robustness (found by running the suite in WebKit):** favorites are now written to localStorage synchronously from the click handler instead of inside a React state updater; the fixed compare tray no longer covers the last checkboxes or the footer (scroll-padding + footer padding while it is open).
- **Engineering:** `Button` forwards refs; Playwright config can run Firefox/WebKit (`PW_BROWSER`); `vite.config.ts` uses explicit `.ts` imports (no deprecated-loader warning); the release ZIP no longer carries the QA screenshot sheets (`documentation/`).
- **Tests:** +3 Vitest tests (saved-search storage, round-trip, UI flow), +3 Playwright tests (combined filters/sort/reload/saved search, static head, noindex); the axe suite now includes best-practice rules, a filtered listing and the 404 page. Result: 35 Vitest, 30 Playwright in Chromium, Firefox and WebKit.
- **Docs:** asset sources re-verified (all 39 CDN URLs still resolve on the free-photo host); photographer names remain unrecorded and are documented as such.

## 1.0.0 — 2026-10-29

Initial release of **OneStop Infinite Template 09 — Aurel Estates**.

- Pages: Home, Properties, Property detail, About/Team, Services (with FAQ), Journal + articles, Contact, Favorites, Compare, 404.
- 15 fictional properties; search, multi-filter, sort, reset, empty state, URL-synced filters, mobile filter drawer.
- Photo gallery with lightbox; favorites (localStorage); compare up to three; inquiry form with validation and demo mode.
- Centralised config: site/brand/logo, theme (colours/fonts/shape), navigation/footer/CTAs, page switches, section hide/reorder, content, properties, images.
- Accessibility: skip link, focus management, dialog focus traps, reduced motion, axe-checked.
- SEO: per-route meta, favicon, generated sitemap/robots. Firebase Hosting config.
- Tests: 31 Vitest tests, 26 Playwright tests (incl. axe), ESLint, TypeScript strict.
