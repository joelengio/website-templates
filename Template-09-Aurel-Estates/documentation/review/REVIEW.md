# Independent QA review — Template 09 · Aurel Estates (v1.1.0)

Reviewer: independent QA pass, 2026-10-29. Chromium 1243 (Playwright 1.63) for all captures; Firefox 155 for the browser suite.

## Screenshot contact sheets (this folder)

| File | What it shows |
|---|---|
| `contact-sheet-desktop-1440.png` | 12 routes at 1440 px (top ≈2300 px of each full-page capture): Home, Properties, filtered Properties, Property detail, About, Services, Journal, Article, Contact, empty Favorites, empty Compare, 404 |
| `contact-sheet-mobile-390.png` | the same 12 routes at 390 px |
| `contact-sheet-interaction-states.png` | mobile menu, filter drawer, combined filters + sort + saved search, empty state, gallery lightbox, inquiry validation errors, honest demo result, compare (3 homes), favorites |

## Visual quality verdict

**Premium and resellable.** Architectural photography, Cormorant Garamond display type over Inter, a restrained forest/ivory/brass palette,
generous spacing and calm motion read as a boutique-agency site, not a generic template. The luxury real-estate identity was kept unchanged.
Weak spots found and fixed: hero search labels/fields were 2–3 px out of alignment; the sidebar inquiry form squeezed two columns into 400 px
(the "I'm interested in" select was truncated); fact rows wrapped; compact prices showed "$5.0M". Remaining honest caveats: the photography is
stock (several listings share the same villa style), and team members are initials rather than portraits.

## Defects and gaps found (all fixed unless listed under limitations)

1. **Saved filters did not exist** although the brief/README promised combined filters and saved filters → implemented saved searches (named, re-apply, delete, duplicate/limit handling, announcements, localStorage only, no fake "alerts").
2. Static `index.html` head: relative `og:image`, no canonical/`og:url`, brand text hard-coded (a rebrand via `site.ts` left the HTML head stale) → generated from config at build time.
3. 404, Favorites and Compare pages were indexable → `noindex`.
4. Best-practice a11y: demo banner outside any landmark; Journal list heading order → fixed (axe now includes `best-practice`).
5. Layout/format polish listed above.

## Verified working (realistic journeys, not only unit tests)

Search + combined filters + sort + URL state + reload; saved searches; property gallery + lightbox keyboard (arrows/Esc/focus return); favorites persistence across reload and tabs;
compare limited to three with announcement; inquiry validation, focus-to-first-error and an honest "nothing was sent" demo result; mobile menu and filter drawer focus traps; SPA deep links;
configuration changes (see VERIFICATION.md → Customization).

## Remaining limitations

See VERIFICATION.md → Known limitations (client-side rendered SPA, no real backend, Unsplash photographers not recorded, WebKit not runnable here).
