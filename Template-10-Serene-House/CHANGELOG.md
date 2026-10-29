# Changelog

## 1.1.0 — 2026-10-29 (independent QA release)
- **Imagery:** replaced all procedurally drawn illustrations with 32 verified Unsplash-licensed photographs (photographer + source page documented in `ASSET_LICENSES.md` / `scripts/photos/sources.json`). Every treatment, package, gallery and journal entry now has its own picture (previously 15 treatments shared 8 images and 8 packages shared 4). Team portraits became refined monogram cards (the previous cartoon faces looked amateur next to photography).
- **Booking:** a guest (matched by email) can no longer hold two overlapping confirmed bookings — checked on the details step and again at confirmation, against the live store, so a double click or second tab cannot slip through. "Make another demo booking" after a reschedule now returns to a fresh flow instead of the reschedule view.
- **Gallery lightbox (real defect):** the viewer was rendered inside the animated `<main>`, whose transform turned the `position: fixed` overlay into a container offset below the header — the enlarged photo sat below the fold and the page behind stayed visible. It is now portalled to `<body>` and covers the viewport; a browser check asserts the overlay fills the viewport and the image is on screen.
- **Accessibility (found by running axe after animations settle — the old audit sampled half-faded text and skipped contrast checks):** package validity pills (4.13:1) and About-page pillar numerals (2.31:1) now meet AA via the existing dark-gold token; decorative card image links are `aria-hidden` (a label that did not contain the visible "Most loved" text failed *label-content-name*); the demo bar is a labelled region; list pages gained a screen-reader `h2` so heading order is valid; EmptyState title is an `h2`; newsletter status message is a persistent live region. The browser audit now runs WCAG 2.1 A/AA **plus best-practice** at 1280 and 390 px with no violations allowed.
- **Hosting:** `firebase.json` no longer marks un-hashed `/images/*` as `immutable` for a year (replacing a photo would have stayed stale); `/assets/**` stays immutable. Added `nosniff`, referrer-policy and frame headers.
- **Design:** About-page pillars spacing; photo overlays on the philosophy/CTA bands lightened so the photography shows while text keeps AA contrast.
- **Tooling:** dev/build/preview run with `--configLoader runner` (the default loader warned about extensionless imports and is slated to become unsupported); `make-zip.mjs` now validates the archive and writes the `.sha256`; added `LICENSE.md`; the ZIP no longer carries the QA screenshot sheets (`documentation/`).
- **Tests:** +2 unit tests for the duplicate guard, +2 config tests (unique images, no orphan files), +6 browser checks (lightbox geometry, duplicate prevention, allocation to another therapist, slot disabling, cancellation freeing slots, fresh flow after reschedule), `E2E_BROWSER=firefox|webkit` support in `scripts/e2e.mjs`. Result: 43 Vitest; 42 browser checks passing in Chromium, Firefox and WebKit.

## 1.0.0 — Initial release
- Pages: Home, Treatments (+ detail), Packages, Booking (+ manage), About, Gallery, Journal (+ articles), Contact, Demo notice, 404.
- Central configuration in `src/config/` (brand, theme, navigation, home layout, treatments, packages, staff, gallery, testimonials, journal, booking, SEO).
- Demo booking flow with simulated availability, validation, local persistence, review, reschedule and cancel.
- Accessible gallery lightbox, mobile menu, skip link, reduced-motion support.
- Build-time sitemap, robots.txt and metadata; Firebase Hosting config with SPA rewrites.
- Original procedurally generated artwork and bundled OFL fonts.
- Vitest suite and Playwright-based browser checks.
