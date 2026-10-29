# Asset Licenses

Last reviewed: 2026-10-29

## Photography — Unsplash License

All 23 photographs in `public/images/` (plus the derived `og-image.jpg`) were downloaded from the [Unsplash](https://unsplash.com)
CDN using the photo identifiers below (see `scripts/fetch-images.sh`, which reproduces every file). They are used under the
[Unsplash License](https://unsplash.com/license): free for commercial and non-commercial use without permission or attribution.
Files were resized/recompressed (1600 px masters + 640 px thumbnails; portraits cropped to 900×1100 + 480 px thumbnails) and are otherwise unaltered.

**What we did and did not verify:** the source URL / photo ID of each file is recorded exactly as downloaded. Photographer names and
individual photo pages were *not* recorded in this build, so none are claimed here. Unsplash's licence does not require attribution,
but it excludes use that implies endorsement, and it does not grant model/property releases. Portraits of people are used only as
illustrative stock images of *fictional* advisers; do not use them to represent real individuals, and replace them with your own
client photography before launch.

| File | Source (Unsplash CDN photo id) |
| --- | --- |
| `public/images/hero-skyline.jpg` (+ `hero-skyline-640.jpg`) | `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab` |
| `public/images/office-interior.jpg` (+ `office-interior-640.jpg`) | `https://images.unsplash.com/photo-1497366811353-6870744d04b2` |
| `public/images/boardroom.jpg` (+ `boardroom-640.jpg`) | `https://images.unsplash.com/photo-1431540015161-0bf868a2d407` |
| `public/images/planning-desk.jpg` (+ `planning-desk-640.jpg`) | `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40` |
| `public/images/tax-documents.jpg` (+ `tax-documents-640.jpg`) | `https://images.unsplash.com/photo-1554224155-6726b3ff858f` |
| `public/images/seedling-coins.jpg` (+ `seedling-coins-640.jpg`) | `https://images.unsplash.com/photo-1579621970563-ebec7560ff3e` |
| `public/images/analytics-laptop.jpg` (+ `analytics-laptop-640.jpg`) | `https://images.unsplash.com/photo-1460925895917-afdab827c52f` |
| `public/images/handshake.jpg` (+ `handshake-640.jpg`) | `https://images.unsplash.com/photo-1521791136064-7986c2920216` |
| `public/images/signing-documents.jpg` (+ `signing-documents-640.jpg`) | `https://images.unsplash.com/photo-1450101499163-c8848c66ca85` |
| `public/images/consultation.jpg` (+ `consultation-640.jpg`) | `https://images.unsplash.com/photo-1551836022-d5d88e9218df` |
| `public/images/ind-startup.jpg` (+ `ind-startup-640.jpg`) | `https://images.unsplash.com/photo-1568992687947-868a62a9f521` |
| `public/images/ind-sme.jpg` (+ `ind-sme-640.jpg`) | `https://images.unsplash.com/photo-1600880292203-757bb62b4baf` |
| `public/images/ind-professional.jpg` (+ `ind-professional-640.jpg`) | `https://images.unsplash.com/photo-1517048676732-d65bc937f952` |
| `public/images/ind-retail.jpg` (+ `ind-retail-640.jpg`) | `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d` |
| `public/images/ind-tech.jpg` (+ `ind-tech-640.jpg`) | `https://images.unsplash.com/photo-1551434678-e076c223a692` |
| `public/images/ind-property.jpg` (+ `ind-property-640.jpg`) | `https://images.unsplash.com/photo-1512917774080-9991f1c4c750` |
| `public/images/ind-enterprise.jpg` (+ `ind-enterprise-640.jpg`) | `https://images.unsplash.com/photo-1531973576160-7125cd663d86` |
| `public/images/team-elena-marchetti.jpg` (+ `team-elena-marchetti-480.jpg`) | `https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e` |
| `public/images/team-daniel-okafor.jpg` (+ `team-daniel-okafor-480.jpg`) | `https://images.unsplash.com/photo-1560250097-0b93528c311a` |
| `public/images/team-priya-raman.jpg` (+ `team-priya-raman-480.jpg`) | `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2` |
| `public/images/team-harold-bright.jpg` (+ `team-harold-bright-480.jpg`) | `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e` |
| `public/images/team-james-whitfield.jpg` (+ `team-james-whitfield-480.jpg`) | `https://images.unsplash.com/photo-1519085360753-af0119f7cbe7` |
| `public/images/team-marco-silva.jpg` (+ `team-marco-silva-480.jpg`) | `https://images.unsplash.com/photo-1500648767791-00dcc994a43e` |
| `public/images/og-image.jpg` | Derived crop (1200×630) of `hero-skyline.jpg` |

## Fonts

| Package | Licence |
| --- | --- |
| `@fontsource-variable/newsreader` 5.3.0 (Newsreader) | SIL Open Font License 1.1 |
| `@fontsource-variable/hanken-grotesk` 5.3.0 (Hanken Grotesk) | SIL Open Font License 1.1 |

Fonts are bundled locally by the packages above — no runtime requests to Google Fonts or any CDN.

## Icons, logo and favicon

Interface icons (`src/components/Icon.tsx`), the logo mark (`src/components/Logo.tsx`), `public/favicon.svg` and
`public/apple-touch-icon.png` were drawn for this template by OneStop Infinite and are covered by `LICENSE`.

## Code dependencies

Runtime: React 18 (MIT), React DOM (MIT), React Router 7 (MIT). Dev tooling (Vite, Vitest, Playwright, axe-core, ESLint, TypeScript,
Testing Library, tsx) is MIT/Apache-2.0 licensed — see each package in `package-lock.json`. Charts are hand-written SVG; no charting library is used.
