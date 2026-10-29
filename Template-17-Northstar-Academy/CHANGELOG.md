# Changelog

## 1.0.0 — 2026-10-29
Initial release of OneStop Infinite Template 17 — Northstar Academy.

- Public site: Home (13 configurable sections), Courses (search, category/difficulty/price filters, sorting, URL state, empty states), Course detail, Instructors (+ detail), Learning paths, Plans (monthly/annual toggle, comparison, FAQ, inquiry), About, Journal (+ articles), Contact, 404.
- 17 demonstration courses, 9 fictional instructors, 6 learning paths, 4 plans, 8 articles, all centralised in `src/config/`.
- Local demo learning dashboard: enroll, lesson viewer, module accordion, quizzes with pass thresholds and retries, bookmarks, progress, resume, completed-course review, certificate preview (DEMONSTRATION — NOT ACCREDITED), sample data and reset. Stored in `localStorage` only.
- Per-route SEO (title, description, canonical, Open Graph, robots/noindex for demo dashboard), generated sitemap.xml and robots.txt, Firebase Hosting SPA rewrites, code splitting.
- Tests: 55 Vitest unit/integration tests; Playwright E2E, layout (5 viewports) and axe-core accessibility suites.
