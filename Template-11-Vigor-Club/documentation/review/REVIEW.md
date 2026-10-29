# Independent QA review — Template 11 · VIGOR CLUB (v1.1.0)

Reviewer: independent QA pass, 2026-10-29. Chromium 1243 for all captures; Firefox 155 and WebKit 27.2 for the browser suite.

## Screenshot contact sheets (this folder)

| File | What it shows |
|---|---|
| `contact-sheet-desktop-1440.png` | 14 routes at 1440 px (top ≈2300 px of each full-page capture): Home, Programs, Program detail, Schedule, Trainers, Trainer detail, Membership, Facilities, About, Journal, Article, Contact, Demo notice, 404 |
| `contact-sheet-mobile-390.png` | the same 14 routes at 390 px |
| `contact-sheet-interaction-states.png` | program filter + empty state, weekly schedule, class modal (form → validation errors → confirmed demo reservation), My demo reservations, annual pricing, comparison table, membership review step, lightbox, contact validation, mobile menu / schedule / booking modal |

## Visual quality verdict

**Before:** the typography and system were already strong — Big Shoulders Display headlines, a disciplined black/bone/acid-lime palette, tidy spacing and a clear class-booking UI. But the *imagery* undermined it: every picture was a generated silhouette illustration. The home hero showed a headless black blob hanging from a bar, programs were clip-art plates and kettlebells, and the six trainers were blank-faced silhouettes. That reads as an unfinished demo, not a resellable premium gym template.

**After:** 27 licensed photographs (dark gym halls, racks, kettlebells, boxing, sauna, ice bath) now sit under the unchanged brand system; the hero is a cinematic dark strength floor with the lime headline over it, every program/zone/article has its own picture, and trainer cards are bold lime-on-charcoal monograms that match the brand rather than cartoon faces. It now looks like a professionally art-directed premium club site. Caveats: stock photography (replace before launch), a few photos show people without model releases, and some show incidental equipment brands — all flagged in `ASSET_LICENSES.md`.

## Defects found (all fixed unless listed under limitations)

1. **Imagery** — as above; the unused `hero-alt` file removed; two pairs of journal articles shared one picture.
2. **Booking rules lived only in the UI.** `book()` accepted closed or full classes if called directly, and checked duplicates against the tab's in-memory list, so a stale second tab (or double submit) could book the same class twice. Now enforced in the logic layer against the stored list; cancel sees other tabs' changes too.
3. **Time-bomb tests:** dated unit tests (Nov 2026) used the real clock and would fail as the calendar moved on → fixed clock.
4. **Accessibility:** heading-order skips on Programs/Trainers/Facilities/Journal; audit now strict (A/AA + best-practice, animations settled, every impact).
5. **Customization:** nine pages hard-coded "VIGOR CLUB" in meta descriptions and the demo notice → use `site.brand.name`.
6. **Hosting/tooling:** un-hashed images cached as `immutable` for a year; deprecated Vite config loader; stale `review/` sheets of the old illustrations removed.
7. **Test robustness:** the modal axe check ran while the modal was still fading in (flagged only under WebKit) → waits for the animation to settle instead of weakening the rule.

## Verified working (realistic journeys)

Program search/filters/URL state; weekly timetable with week/day navigation, class-type and trainer filters; booking modal (focus-in, Tab trap, inert background, Escape + focus return); validation; confirmation with demo disclosure;
persistence across reload; duplicate prevention; stale-tab duplicate prevention; full and closed classes; cancel/keep; deep link; membership monthly/annual switching, comparison, plan preselection, signup review without any payment claim;
contact form honest "not sent"; lightbox keys; mobile menu; configuration changes (see VERIFICATION.md).

## Remaining limitations

See VERIFICATION.md → Known limitations.
