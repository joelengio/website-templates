# Changelog

## 1.0.0 — 2026-10-29

Initial release of **OneStop Infinite — Template 14: EVERAFTER**, a luxury wedding and event planning website template.

### Added
- 15 routes: Home, Weddings (portfolio) and wedding detail, Services and service detail, Packages, Destinations and destination detail, About, Journal and article detail, Event Planning Questionnaire (`/plan`), Contact, Demo notice, Photo credits, custom 404.
- 13 fictional wedding projects with story, gallery, services, facts and a distinct detail route; working location, style and event-type filters stored in the URL.
- Full-screen lightbox with keyboard (arrows, Home/End, Esc), thumbnails, swipe, focus trap and scroll lock.
- 8 service pages, 3 packages with comparison table and add-on estimator, 13 destination pages with category and region filters, 9 journal articles with search, categories and related content.
- Nine-step questionnaire with validation, conditional questions, progress indicator, optional local draft, review and a demonstration completion screen that clearly states nothing was sent.
- Central configuration under `src/config/` (brand, theme, navigation, footer, home section order and visibility, content collections, questionnaire, SEO, backend switch) and `CUSTOMIZATION_GUIDE.md`.
- SEO: per-page titles/descriptions, Open Graph, canonical URLs, generated `sitemap.xml` and `robots.txt`, favicon.
- Firebase Hosting configuration with SPA rewrites and long-lived asset caching.
- Test suite: Vitest unit/integration tests, Playwright + axe-core browser audit across every route at five breakpoints, screenshot contact sheets (`npm run review`).
- 74 optimised photographs from Wikimedia Commons with recorded licences (`ASSET_LICENSES.md`, in-site credits page).
