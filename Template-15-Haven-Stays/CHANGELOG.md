# Changelog

## 1.0.0 — 2026-10-29

Initial release of OneStop Infinite Template 15 — Haven Stays.

- 20 route types: home, rooms & suites (listing + 10 detail pages), booking engine, confirmation, manage/change/cancel reservation,
  dining (listing + 4 venue pages), experiences (listing + 10 detail pages), offers (listing + 6 detail pages with eligibility checker),
  gallery, about, explore, journal (listing + 6 articles), contact (FAQ, policies, directions, validated form) and a 404 page.
- Local booking demonstration: range calendar, guest selector, occupancy validation, seasonal and weekend pricing, four rate plans,
  automatic and coded promotions, service charge / VAT / per-night and per-adult fees, duplicate protection, localStorage persistence,
  change and cancel flows with illustrative cancellation charges.
- Centralised configuration in `src/config/` — branding, theme, navigation, section order/visibility, rooms, inventory, rates, seasons,
  taxes, promotions, amenities, menus, experiences, offers, reviews, articles, policies and SEO.
- Original procedurally generated illustration set (`npm run art`) — no third-party imagery.
- Route-level SEO, Open Graph, canonical URLs, generated `sitemap.xml` / `robots.txt`, Firebase Hosting config with SPA rewrites.
- Vitest unit and integration suites, Playwright end-to-end, accessibility (axe, WCAG 2.2 A/AA tags), responsive and image/console checks.
