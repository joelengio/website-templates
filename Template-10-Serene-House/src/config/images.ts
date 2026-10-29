import type { ImageAsset } from './types';

/**
 * Central image registry. Every picture used by the site is declared here.
 * To swap in your own photography: drop the file in /public/images and change `src`
 * (keep `width`/`height` accurate – they prevent layout shift) and update `alt`.
 */
const img = (file: string, width: number, height: number, alt: string): ImageAsset => ({
  src: `/images/${file}.webp`,
  width,
  height,
  alt
});

export const images = {
  heroArch: img('hero-arch', 2000, 1200, 'Symmetrical indoor spa pool framed by tall windows onto green trees'),
  heroMist: img('hero-mist', 2000, 1200, 'Sunlit relaxation room with lounge chairs facing mountain-view windows'),
  introStones: img('intro-stones', 1000, 1300, 'Stack of balanced grey and beige stones on a pebble shore'),
  introLeaves: img('intro-leaves', 1600, 1067, 'Wooden bath tray with lavender, a candle and a rolled towel'),
  philosophy: img('philosophy-ripples', 2000, 1200, 'Quiet bedroom looking through a large window onto forested mountains'),
  ctaDunes: img('cta-dunes', 2000, 1200, 'Covered wooden deck overlooking forested hills under a pale sky'),
  treatMassage: img('treat-massage', 1600, 1067, 'Therapist\u2019s hands working on a guest\u2019s shoulder in warm light'),
  treatDeep: img('treat-deep', 1600, 1067, 'Two therapists using warm herbal compresses on a guest\u2019s chest and shoulders'),
  treatStone: img('treat-stone', 1600, 1067, 'Smooth black stones lined along a back with white orchids on the treatment table'),
  treatPrenatal: img('treat-prenatal', 1600, 1067, 'Hands gently holding golden grasses in soft evening light'),
  treatFacial: img('treat-facial', 1600, 1067, 'Brush applying a cleansing mask during a facial'),
  treatSkincare: img('treat-skincare', 1600, 1067, 'Amber dropper bottle releasing serum onto a palm'),
  treatCalm: img('treat-calm', 1600, 1067, 'Lavender flowers backlit by the sun'),
  treatScrub: img('treat-scrub', 1600, 1067, 'Hand gathering fresh rosemary sprigs'),
  treatWrap: img('treat-wrap', 1600, 1067, 'Neatly folded white spa towels'),
  treatBath: img('treat-bath', 1600, 1067, 'Stone bath filled with rose petals and marigolds, with oils and rolled towels'),
  treatRitual: img('treat-ritual', 1600, 1067, 'Rolled white towels stacked on a wooden bench'),
  treatBreath: img('treat-breath', 1600, 1067, 'Open doors onto a terrace with two chairs facing green hills'),
  treatSound: img('treat-sound', 1600, 1067, 'Dark stone steam room lit by a single candle and warm lights'),
  treatNidra: img('treat-nidra', 1600, 1067, 'Day bed with flowers behind flowing sheer curtains'),
  treatAroma: img('treat-aroma', 1600, 1067, 'Reed diffuser and candles on a warm amber shelf'),
  pkgReset: img('pkg-reset', 1600, 1067, 'Deep bath beside a window screened with white blinds and green views'),
  pkgRenewal: img('pkg-renewal', 1600, 1067, 'Wood-panelled room with a tiled soaking pool and a window to the garden'),
  pkgDay: img('pkg-day', 1600, 1067, 'Poolside terrace with loungers, a striped parasol and flowers'),
  pkgTwilight: img('pkg-twilight', 1600, 1067, 'Candles and a glass of champagne on a bath tray'),
  pkgCouples: img('pkg-couples', 1600, 1067, 'Warm wooden spa suite with a corner bath for two'),
  pkgGlow: img('pkg-glow', 1600, 1067, 'Bath tray with lavender, a candle and fresh towel'),
  pkgSeasonal: img('pkg-seasonal', 1600, 1067, 'Ceramic teapot and cup on a wooden tray'),
  pkgWinter: img('pkg-winter', 1600, 1067, 'Cedar sauna with a window onto the forest'),
  aboutStory: img('about-story', 1000, 1300, 'Day bed draped with sheer curtains and fresh flowers'),
  aboutFacility: img('about-facility', 2000, 1200, 'Light-filled suite with a bed beneath large windows over green hills'),
  aboutGarden: img('about-garden', 1000, 1300, 'Sage leaves in deep green close-up'),
  ogImage: img('og-image', 1200, 630, 'SERENE HOUSE \u2014 indoor spa pool framed by garden windows'),
  contactMap: img('contact-map', 1600, 1067, 'Soft illustrative landscape used behind the demonstration map')
};

export const teamImages = [1, 2, 3, 4, 5, 6].map((n) =>
  img(`team-${n}`, 800, 1000, 'Monogram placeholder for a SERENE HOUSE team member (replace with a portrait)')
);

export const journalImages = [
  img('j-1', 1600, 1067, 'Ceramic teapot and cup on a dark wooden tray'),
  img('j-2', 1600, 1067, 'Open doors onto a hilltop terrace with two chairs'),
  img('j-3', 1600, 1067, 'Warm cedar sauna with a window onto the forest'),
  img('j-4', 1600, 1067, 'Amber dropper bottle releasing serum onto a palm'),
  img('j-5', 1600, 1067, 'Neatly folded white towels on a soft chair'),
  img('j-6', 1600, 1067, 'Covered deck looking out over forested hills'),
  img('j-7', 1600, 1067, 'Therapist\u2019s hands working on a guest\u2019s shoulder'),
  img('j-8', 1600, 1067, 'Candles and a glass on a bath tray')
];
