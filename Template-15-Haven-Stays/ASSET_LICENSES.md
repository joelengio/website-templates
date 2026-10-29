# Asset Licenses

Last reviewed: 2026-10-29

## Imagery — original, procedurally generated

All 79 images in `public/images/` (`*.webp`), `public/favicon.svg`, `public/logo-mark.svg` and `public/apple-touch-icon.png` were
**created for this template** by `scripts/generate-art.ts`. They are drawn from code (seeded pseudo-random SVG scenes rasterised with the
`sharp` library and encoded as WebP). **No photographs, stock images, third-party illustrations or AI-generated pictures are
included.** They are covered by the template licence in `LICENSE`; no attribution to any third party is required.

Because they are stylised illustrations rather than photography, the template ships **without any photographer credits or
external image sources** — there is nothing to attribute and nothing was sourced from a stock library. For a production site you will
normally replace them with the client's own photography (see CUSTOMIZATION_GUIDE.md → Images) and record those licences here.

## Typefaces — SIL Open Font License 1.1

Self-hosted through npm (no requests to Google Fonts at runtime):

| Font | Package | Licence |
| --- | --- | --- |
| Fraunces (variable) | `@fontsource-variable/fraunces` | SIL OFL 1.1 |
| Manrope (variable) | `@fontsource-variable/manrope` | SIL OFL 1.1 |

The OFL permits commercial use and embedding; the licence texts ship in `node_modules/@fontsource-variable/*/LICENSE` after `npm ci`.

## Software

Runtime dependencies: React, React DOM, React Router (MIT). Build/test tooling: Vite, Vitest, TypeScript, ESLint, Playwright,
axe-core, Testing Library, sharp (see `package.json`; all permissively licensed — consult each package for its exact licence).

## Text content

All copy, names, addresses, phone numbers, reviews, team members and articles are fictional and were written for this template.
Placeholder social links point to the generic home pages of the networks, not to real accounts.
