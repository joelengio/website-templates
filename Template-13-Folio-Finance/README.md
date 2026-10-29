# Folio Finance — OneStop Infinite Template 13

A premium, fully customizable **financial advisory, accounting and business consultancy** website template.
Built with React 18, Vite, TypeScript and React Router. Hand-written SVG charts, no UI framework, no backend.

> **Folio Finance is a fictional demo brand.** People, photographs, testimonials, statistics, prices, addresses and credentials are
> demonstration content. Template © OneStop Infinite (credit shown in the footer; see `site.owner` in `src/config/site.ts`).

## What is included

| Area | Routes |
| --- | --- |
| Home (12 configurable sections) | `/` |
| Services (filter + search) and 8 detail pages | `/services`, `/services/:slug` |
| Industries / who we serve (7 segments) | `/industries`, `/industries/:slug` |
| About, Team (6 fictional advisers), profiles | `/about`, `/team`, `/team/:slug` |
| Engagement plans — monthly/annual toggle, add-ons, comparison table, FAQ | `/pricing` |
| Financial tools — savings growth, loan payment, break-even | `/tools` (`#compound`, `#loan`, `#break-even`) |
| Insights journal — categories, search, 9 articles, related | `/insights`, `/insights/:slug` |
| Demo consultation booking (8-stage flow, local persistence, cancel) | `/book` |
| Contact (validated, honest demo mode) | `/contact` |
| Disclaimers, 404 | `/disclaimer`, `*` |

## Quick start

```bash
npm ci
npm run dev        # http://localhost:5173
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run lint` | ESLint (incl. jsx-a11y) |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm test` | Vitest: unit (finance, pricing, booking, validation) + integration (React Testing Library) |
| `npm run test:unit` | Only the `src/lib` unit tests |
| `npm run build` | Generates `sitemap.xml`/`robots.txt`, type-checks, builds to `dist/` |
| `npm run preview` | Serves `dist/` on http://127.0.0.1:4173 |
| `npm run test:e2e` | Playwright E2E + axe-core (builds and previews automatically) |
| `npm run check` | lint + typecheck + unit/integration tests + build |
| `npm run review:shots` | Screenshot contact sheets into `review/` (needs the preview server) |
| `npm run package` | Builds the canonical hand-off ZIP in `handoff/` with a `.sha256` file |

Playwright needs Chromium: run `npx playwright install chromium`, or point `PW_CHROMIUM_PATH` at an existing binary.

## Firebase Hosting

`firebase.json` serves `dist/` with a single-page-app rewrite (`** → /index.html`), so deep links such as `/services/tax-planning` load directly,
plus long-lived caching for hashed assets and `no-cache` for `index.html`.

```bash
npm i -g firebase-tools
cp .firebaserc.example .firebaserc      # then set your project id
firebase login
npm run build                          # set site.url in src/config/site.ts first (canonical, sitemap, Open Graph)
firebase deploy --only hosting
```

Set `site.url` in `src/config/site.ts` to your real origin *before* building; the sitemap, robots.txt and canonical/OG tags are generated from it.
No credentials or secrets are included in this project.

## Customization

Everything editable lives in `src/config/`. See **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** for exact paths and steps.

## Calculator formulas and assumptions

All maths lives in `src/lib/finance.ts` (pure functions, unit-tested). Results are *estimates*, never forecasts or advice.

**Savings & compound growth.** Nominal annual rate `R` (percent) compounded `n` times a year is converted to an equivalent monthly rate
`r = (1 + R/100/n)^(n/12) − 1`. With starting amount `P`, end-of-month contribution `C` and `m` months:
`FV = P(1+r)^m + C·((1+r)^m − 1)/r`, or `P + C·m` when `r = 0`. Total contributions = `P + C·m`; growth = `FV − contributions`.
The chart plots each year from 0 to the horizon using the same function. Taxes, fees and inflation are not modelled; the rate is constant.

**Loan payment.** Monthly rate `r = R/100/12`, `n` payments: `PMT = P·r / (1 − (1+r)^−n)` (or `P/n` at 0%). The schedule rounds the payment and each
month's interest to cents; the last payment is adjusted so the balance ends at exactly 0. Totals are sums of the schedule. Fees, insurance, rate
changes and early repayment are not modelled. Terms up to 50 years.

**Break-even.** Contribution margin `CM = price − variable cost`. Break-even units = `fixed costs / CM` (shown rounded up to a whole unit, exact value also shown);
break-even revenue = exact units × price (= fixed costs ÷ margin ratio). A target profit adds to fixed costs. If `CM ≤ 0` the scenario is flagged impossible.

**Pricing plans.** Annual price = `(plan monthly + selected add-ons) × 12 × (1 − discount%)`, rounded to cents; the discount is per plan
(`annualDiscountPercent`) with a global fallback (`pricing.annualDiscountPercent`).

Inputs are validated (blank, non-numeric, negative, out of range, fractional where whole numbers are required). Amounts use a *display currency* only
(`site.currency`); **no exchange rates are applied**.

## Demonstration behaviour — what is real and what is not

* **Booking** is a demo: availability is generated from `src/config/booking.ts` (plus a deterministic "busy" pattern); appointments are saved only in the
  visitor's `localStorage` (`folio-finance:appointments`) and can be cancelled. Nothing is transmitted to any firm.
* **Contact form** validates input, then — because no backend is configured — states clearly that the message was **not sent** and offers a `mailto:` link.
  Set `site.contact.form.endpoint` to a JSON endpoint (Formspree, your API, …) to enable real submission, with sending/success/error states.
* **Sensitive data**: forms reject long digit runs (account/card/ID-like numbers) and say so; no bank, tax or credential fields exist.
* **Prices, statistics, testimonials, team and credentials** are labelled demonstration data on the page.

## Financial and legal disclaimers

Nothing in this template is financial, tax, legal or investment advice. It makes no claim of regulatory approval, licensing, certification or awards.
Real firms must replace all legal copy (`site.legal`) with counsel-reviewed text and state their true regulatory status.

## Quality

See [VERIFICATION.md](./VERIFICATION.md) for the actual results of every check, and `review/` for screenshot contact sheets.
