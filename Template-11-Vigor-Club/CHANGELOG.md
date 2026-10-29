# Changelog

## 1.1.0 — 2026-10-29 (independent QA release)
- **Imagery:** replaced the procedural athlete silhouettes (a headless blob "lifter" in the hero, blank-face trainer silhouettes) with 27 verified Unsplash-licensed photographs — dark gyms, racks, kettlebells, boxing, recovery — each documented (photographer + source page) in `ASSET_LICENSES.md` / `scripts/photos/sources.json`. Trainer cards are now bold monogram cards in the brand's lime-on-charcoal style. Journal articles no longer reuse the same picture (two pairs did); the unused `hero-alt` image was removed.
- **Booking logic:** `book()` now enforces the closed-cut-off and capacity rules itself (previously only the UI hid the form) and re-reads stored reservations before checking duplicates/overlaps, so a stale second tab or a double submit cannot book the same class twice; `cancel()` also sees other tabs' changes. Dated unit tests now use a fixed clock instead of expiring in November 2026.
- **Accessibility:** audit now runs WCAG 2.1 A/AA **plus best-practice** with animations settled (the old run sampled mid-fade); fixed heading-order skips on Programs, Trainers, Facilities and Journal.
- **Customization:** page `<meta>` descriptions hard-coded "VIGOR CLUB" instead of using `site.brand.name`; the demo notice did too.
- **Hosting/tooling:** `firebase.json` no longer marks un-hashed `/images/*` as `immutable` for a year; added `nosniff`/referrer/frame headers; dev/build/preview run with `--configLoader runner` (default loader warned about extensionless imports); removed the stale `review/` illustration sheets and `npm run review`; the ZIP no longer carries QA screenshot sheets (`documentation/`).
- **Tests:** +2 unit tests (closed/full enforcement, stale-tab duplicate/cancel), +2 browser checks (stale second tab cannot double-book; a full class shows no form); `E2E_BROWSER=firefox|webkit` support in `scripts/e2e.mjs`.

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
