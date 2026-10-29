# Changelog

## 1.0.0 — 2026-10-29
Initial release of OneStop Infinite Template 16 — Saffron Table.

- Pages: Home, Menus, Reserve (+ My reservations), Experiences (+ 6 detail pages), Private Dining, Our Story, Gallery, Journal (+ 8 articles), Contact, demo Order Builder, custom 404.
- 40 demonstration menu items across 8 categories with dietary indicators, allergen lists, availability flags and a configurable allergy warning.
- Local reservation simulation engine: opening hours, closed dates, seating areas, slot intervals, fictional capacity, party limits, duplicate prevention, modify/cancel, local persistence.
- Centralised configuration in `src/config/*`, theme tokens, homepage section ordering/hiding, feature switches.
- Accessible lightbox (keyboard + swipe), focus-managed dialogs, reduced-motion support, skip link.
- SEO: per-page metadata (also prerendered per route at build), Open Graph, canonical, sitemap.xml, robots.txt, Restaurant JSON-LD.
- Firebase Hosting config with SPA rewrites; Playwright + axe-core test suites; Vitest unit/integration tests.
