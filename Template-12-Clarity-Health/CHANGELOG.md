# Changelog

## 1.0.0 — Initial release
- Pages: Home, Specialties (+ detail), Doctors (+ detail), Services (+ detail), Appointment booking, My demo appointments (view / reschedule / cancel),
  About, Patient information, Journal (+ articles), Contact & locations, Demo & privacy notice, 404.
- 8 specialties, 10 fictional clinicians, 30 demonstration services, 8 educational articles, 12 FAQs, 2 locations — all in `src/config/`.
- Working search and filters (URL-backed) for specialties, doctors (specialty, language, weekday, new patients, video), services (category, specialty) and articles.
- Six-step demonstration booking: compatibility rules, generated availability, accessible calendar, time slots, validation, duplicate prevention,
  review, local persistence, rescheduling, cancellation and one-click deletion of local data.
- Central configuration for brand, theme, navigation, footer, hours, locations, home section order/visibility, notices, SEO, pricing and booking rules.
- Accessible dialog, mobile menu, skip link, focus management, reduced-motion support.
- Build-time sitemap.xml, robots.txt and metadata; Firebase Hosting configuration with SPA rewrites, security headers and a Content-Security-Policy.
- 46 original generated illustrations (WebP) and bundled OFL fonts.
- Vitest unit/integration tests, Playwright E2E, axe-core accessibility scans, contact-sheet generator and release packager.
