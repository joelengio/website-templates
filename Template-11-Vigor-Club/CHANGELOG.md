# Changelog

## 1.0.0 — 2026-10-29
Initial release of **OneStop Infinite Template 11 — VIGOR CLUB**.

### Added
- 13 route types: Home, Programs (+8 detail pages), Schedule, Trainers (+6 detail pages), Membership, Facilities,
  About, Journal (+8 article pages), Contact, Demo notice and a useful 404.
- Interactive weekly class schedule with day/week navigation, class-type and trainer filters, class details modal,
  demonstration booking (localStorage), duplicate and time-clash prevention, cancellation and helpful empty states.
- Membership pricing with monthly/annual toggle, accessible comparison table, FAQs and a validated 3-step demo signup.
- Facilities gallery with area filter and a keyboard-accessible lightbox.
- Validated contact/enquiry form that never claims delivery unless `site.forms.endpoint` is configured.
- Central configuration under `src/config/` (brand, theme, navigation, homepage sections order/visibility, programs,
  trainers, classes, memberships, facilities, journal, testimonials, SEO, demo booking settings).
- SEO: per-page metadata, Open Graph, canonical URLs, generated `robots.txt` and `sitemap.xml`, favicon.
- Firebase Hosting configuration with SPA rewrites.
- Original generated illustration set (`npm run images`) — no third-party imagery.
- Vitest unit/integration tests, Playwright (playwright-core) browser E2E suite with axe-core, and a visual review
  contact-sheet generator (`npm run review`).
