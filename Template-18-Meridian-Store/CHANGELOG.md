# Changelog

## 1.0.0 — initial release

- Premium editorial storefront: home, shop, collections, product pages, bag (slide-out and full page), wishlist, multi-step demonstration checkout, demo order history, about, journal, FAQ/support, contact, legal pages and a custom 404.
- 33 configurable demonstration products with variants, per-variant price and stock, colour/scent image switching, sale pricing and "coming soon" / "sold out" states; 8 curated collections; 8 journal articles.
- Integer minor-unit money engine, promo codes (percentage, fixed, free shipping, caps, minimums, expiry), zone-based shipping with free-shipping thresholds, regional tax (exclusive and inclusive).
- Strongly typed central configuration (`src/config`) with a runtime configuration checker.
- Persistent bag, wishlist, recently viewed and demo orders in `localStorage` with defensive parsing and a "Reset demo data" control.
- Accessibility work: dialog focus management, live announcements, accessible validation, reduced motion, axe-core checks in CI-style E2E run.
- SEO: per-page titles/descriptions/canonical/Open Graph, product JSON-LD, generated `robots.txt` and `sitemap.xml`, Firebase Hosting config with SPA rewrites.
- 201 original procedural WebP images generated from code (`npm run images`).
- Unit, integration and Playwright end-to-end test suites, labelled screenshot contact sheets, release packaging script.
