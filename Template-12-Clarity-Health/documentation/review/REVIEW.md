# Independent QA review — Template 12 · CLARITY HEALTH (v1.1.0)

Reviewer: independent QA pass, 2026-10-29. Chromium 1243 for all captures; Chromium, Firefox 155 and WebKit 27.2 for the browser suite.

## Screenshot contact sheets (this folder)

| File | What it shows |
|---|---|
| `contact-sheet-desktop-1440.png` | 16 routes at 1440 px (top ≈2300 px of each full-page capture): Home, Specialties, Specialty detail, Doctors, Doctor detail, Services, Service detail, Book, My appointments (empty), About, Patient information, Journal, Article, Contact, Demo notice, 404 |
| `contact-sheet-mobile-390.png` | the same 16 routes at 390 px |
| `contact-sheet-interaction-states.png` | doctor filter + empty state, booking steps 1/4/5/6 (specialty, calendar + slots, validation with the "do not enter medical information" notice, review), confirmed demo appointment, duplicate-booking block, My demo appointments, cancel dialog, contact validation, mobile menu, mobile calendar and services |

## Visual quality verdict

**Premium and resellable — kept as is.** The system is cohesive and clearly healthcare-appropriate: Fraunces + DM Sans, a navy / teal / ivory palette, generous spacing, calm cards, a clear six-step booking wizard, a visible demo/emergency banner and consistent flat illustration used for the hero, specialties, services, facilities, doctors and articles.
Every specialty, doctor and article has its own artwork. I considered replacing the artwork with stock photography (as done for Templates 10 and 11) and decided against it: stock photos of clinics are generic and sterile, would clash with the illustrated doctors and icon-style specialty art,
and — most importantly for a medical template — would bring in model-release and property-release questions and could be mistaken for real staff or premises. The illustrated set avoids all of that and is owned by the template author. A real clinic is told to replace it with its own photography (CUSTOMIZATION_GUIDE.md → Images).
Weakest spots (noted, not changed): the soft "intro" room illustration is low-contrast, and the combined demo + emergency banner is tall on 360–390 px screens (deliberate safety messaging).

## Defects found and fixed

1. **Booking: unexplained reset.** If the chosen time was taken between selecting it and confirming (e.g. in a second tab), the app returned to the date step but cleared the explanation in the same state update, so the user saw no message. The message now persists and is scrolled into view. Regression test: two tabs cannot both confirm; the stale tab is told why and only one appointment is stored.
2. **Hard-coded brand:** eleven pages hard-coded "CLARITY HEALTH" in their meta descriptions / lead text and `index.html`'s `<noscript>` did too — a rebrand through `site.ts` left them stale. They now follow `site.brand.name`.
3. **Hosting:** un-hashed images were cached as `immutable` for a year → one day; `/assets/**` keeps long-term immutable caching; CSP and security headers unchanged.
4. **Packaging/tooling:** the ZIP script dropped `.env.example` (pattern `.env.*`), had no validation and could include caches; deprecated Vite config loader warning; stale `review/` sheets (and an `npm run review` script) replaced by this folder.
5. **Test rigor:** accessibility scans ran while entrance animations were mid-fade, which makes axe skip contrast checks — now run with motion settled (no violations found). Firefox/WebKit selectable via `PW_BROWSER`.
6. **Copy:** the doctor-profile notice said "photographs"; the portraits are illustrations.

## Verified working (realistic journeys)

Specialty/doctor/service search and filters (URL-backed); doctor ↔ specialty ↔ service ↔ mode compatibility; six-step booking with per-step validation; keyboard-operable calendar; generated availability; duplicate prevention (same e-mail, overlapping time or same service/day; max upcoming per e-mail); stale-tab protection; reschedule; cancel dialog (focus, Escape, return);
persistence and "delete all demo data"; blocked-localStorage fallback with a visible warning; the booking collects only name, e-mail and optional phone and tells users never to enter medical details; no HIPAA/GDPR/accreditation claims (the notices say the opposite); contact form never claims delivery; mobile booking at 360 px; configuration changes (see VERIFICATION.md).

## Remaining limitations

See VERIFICATION.md → Known limitations.
