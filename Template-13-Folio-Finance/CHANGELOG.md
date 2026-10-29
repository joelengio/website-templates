# Changelog

## 1.0.0 — 2026-10-29

Initial release of OneStop Infinite Template 13 — Folio Finance.

* 14 route types: Home, Services (+8 details), Industries (+7 details), About, Team (+6 profiles), Pricing, Tools, Insights (+9 articles), Booking, Contact, Disclaimers, 404.
* Three calculators (compound growth, loan amortization, break-even) with validation, reset, explanations, SVG charts and data tables.
* Central configuration under `src/config/` (brand, theme, navigation, home sections, services, industries, team, plans, calculators, booking, articles, images, SEO, legal).
* Demo booking flow with accessible calendar, local persistence and cancellation dialog.
* Contact form with honest no-backend behaviour and optional endpoint.
* Vitest unit + integration tests, Playwright E2E, axe-core scans, responsive checks (360–1440 px).
* Firebase Hosting SPA configuration, generated sitemap/robots, per-route SEO.
