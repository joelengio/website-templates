# Changelog

## 1.1.0 — 2026-10-29 (independent QA release)
- **Booking bug fixed:** when a time was taken between selecting it and confirming (for example by a second tab), the app sent the user back to the date step but *wiped the explanation* — the error was cleared by the same state update that cleared the stale time, so the user saw an unexplained reset. The message now stays visible (and is scrolled into view). Regression test: two tabs cannot both confirm; the stale one is told why.
- **Hosting:** `firebase.json` no longer marks un-hashed `/images/*` as `immutable` for a year (a replaced image would have stayed stale for returning visitors); `/assets/**` stays immutable; trailing slash normalised. The existing CSP and security headers are unchanged.
- **Tooling:** dev/build/preview run with `--configLoader runner` (the default loader warned about extensionless imports); the release ZIP script now validates the archive (no forbidden entries, root files present, `unzip -t`), excludes caches and the QA screenshot sheets, and no longer drops `.env.example`; the old, stale `review/` sheets and `npm run review` were replaced by `documentation/review/` (kept out of the ZIP).
- **Tests:** accessibility scans now run with motion settled (entrance animations otherwise hide contrast from axe); `PW_BROWSER=firefox|webkit` runs the suite in another engine; +1 two-tab booking test.
- **Copy:** doctor-profile notice said "photographs"; the portraits are illustrations.
- **Assessment:** the generated illustration set is cohesive and was kept as the template's art direction rather than swapped for stock photography (see `documentation/review/REVIEW.md`).

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
