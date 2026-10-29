# Independent QA review — Template 10 · Serene House (v1.1.0)

Reviewer: independent QA pass, 2026-10-29. Chromium 1243 and Firefox 155 (Playwright-core 1.64).

## Screenshot contact sheets (this folder)

| File | What it shows |
|---|---|
| `contact-sheet-desktop-1440.png` | 12 routes at 1440 px (top ≈2300 px of each full-page capture): Home, Treatments, Treatment detail, Packages, Booking, empty My bookings, About, Gallery, Journal, Article, Contact, 404 |
| `contact-sheet-mobile-390.png` | the same 12 routes at 390 px |
| `contact-sheet-interaction-states.png` | booking steps (therapist, date/time availability, validation, review, confirmation), duplicate-booking block, cancel confirmation, lightbox, contact "not delivered" result, mobile menu, mobile filter, mobile slots |

## Visual quality verdict

**Before:** layout, typography and colour were already calm and well proportioned, but the pictures were procedurally drawn illustrations — flat,
repetitive (the same stacked-stones scene filled several treatment cards; 15 treatments shared 8 images, 8 packages shared 4) and cartoon-faced "team portraits".
That did *not* meet a luxury-spa standard or look commercially resellable.

**After:** every picture is now licensed photography (Unsplash License; photographer + source page recorded per file in `ASSET_LICENSES.md`), each treatment,
package, gallery tile and journal article has its own image, the arched hero frame holds a real spa pool hall, and team cards are refined monograms. The identity
(sage/olive/gold/cream, Cormorant + Jost, arch motif) is unchanged. It now reads as a boutique-spa product. Caveats: stock photography — replace before launch;
some photos show guests receiving treatments (see ASSET_LICENSES notes on releases); team cards are placeholders by design.

## Defects found (all fixed)

1. **Gallery lightbox broke layout** — rendered inside the animated `<main>` so the fixed overlay was offset and the photo sat below the fold (missed by the earlier test, which only checked focus/keys). Now portalled to `<body>`; a geometry check guards it.
2. **Accessibility failures hidden by the old audit** — axe was run mid-animation, so colour-contrast was skipped. With motion settled: package pills 4.13:1, About pillar numerals 2.31:1, mismatched link names on card images, demo bar outside a landmark, heading-order skips. All fixed; audit now strict (A/AA + best-practice, 1280 & 390 px).
3. **Duplicate booking** — the same guest could hold two overlapping appointments (even a double submit). Guarded on the details step and at confirmation against the live store.
4. "Make another demo booking" after a reschedule re-opened the reschedule screen.
5. Firebase config marked un-hashed `/images/*` as `immutable` for a year (replaced photos would stay stale); no security headers.
6. Imagery issues above; About-page pillar spacing; photo overlays too dark to show the photography.

## Verified working (realistic journeys)

Treatment filter/search; packages; booking (service → therapist → date/time → details → review → confirm), allocation of a second guest to a different therapist, slot disabled for a booked therapist,
cancellation frees the slot, reschedule, persistence across reload, corrupt-storage tolerance; gallery lightbox; contact form never claims delivery; newsletter is a labelled demo; configuration changes.

## Remaining limitations

See VERIFICATION.md → Known limitations.
