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
  heroArch: img('hero-arch', 2000, 1200, 'Sunlit arched opening in a plaster wall looking onto a soft sage garden'),
  heroMist: img('hero-mist', 2000, 1200, 'Layers of misty sage-green hills at sunrise'),
  introStones: img('intro-stones', 1000, 1300, 'Stack of smooth balancing stones on warm sand beside a sprig of leaves'),
  introLeaves: img('intro-leaves', 1600, 1067, 'Soft shadows of botanical leaves across ivory plaster'),
  philosophy: img('philosophy-ripples', 2000, 1200, 'Concentric ripples on still green water with floating petals'),
  ctaDunes: img('cta-dunes', 2000, 1200, 'Golden sand dunes under a pale low sun'),
  treatMassage: img('treat-massage', 1600, 1067, 'Warm oil bowl with petals glowing beside two candles on dark wood'),
  treatFacial: img('treat-facial', 1600, 1067, 'Layered cream and blush flower bloom with a golden centre'),
  treatBody: img('treat-body', 1600, 1067, 'Flowing folds of ivory and sand linen'),
  treatWellness: img('treat-wellness', 1600, 1067, 'Calm olive-green water with soft concentric ripples'),
  treatRitual: img('treat-ritual', 1600, 1067, 'Stack of folded spa towels on natural wood with a green sprig'),
  treatSkincare: img('treat-skincare', 1600, 1067, 'Three amber and sage skincare bottles on a sand-coloured shelf'),
  treatStone: img('treat-stone', 1600, 1067, 'Balanced warm stones on a dark sandy surface'),
  treatBotanical: img('treat-botanical', 1600, 1067, 'Sage leaves and botanical shadows on a green plaster wall'),
  pkgDay: img('pkg-day', 1600, 1067, 'Arched window with soft daylight and a potted sprig'),
  pkgCouples: img('pkg-couples', 1600, 1067, 'Two candles glowing beside a bowl of petals'),
  pkgSeasonal: img('pkg-seasonal', 1600, 1067, 'Warm dunes beneath a low golden sun'),
  pkgRenew: img('pkg-renew', 1600, 1067, 'Quiet layered hills fading into morning mist'),
  aboutStory: img('about-story', 1000, 1300, 'Warm arched doorway glowing with garden light'),
  aboutFacility: img('about-facility', 2000, 1200, 'Soft waves of ivory linen in a quiet treatment room'),
  aboutGarden: img('about-garden', 1000, 1300, 'Garden leaves in green shadow'),
  ogImage: img('og-image', 1200, 630, 'SERENE HOUSE — sunlit arch over a sage garden'),
  contactMap: img('contact-map', 1600, 1067, 'Soft illustrative landscape used behind the demonstration map')
};

export const teamImages = [1, 2, 3, 4, 5, 6].map((n) =>
  img(`team-${n}`, 800, 1000, 'Illustrated portrait of a SERENE HOUSE team member (demonstration artwork)')
);

export const journalImages = [
  img('j-1', 1600, 1067, 'Dark green botanical leaves in soft light'),
  img('j-2', 1600, 1067, 'Still water with gentle ripples'),
  img('j-3', 1600, 1067, 'Balanced stones on sand'),
  img('j-4', 1600, 1067, 'Cream and blush flower in full bloom'),
  img('j-5', 1600, 1067, 'Rolling waves of ivory linen'),
  img('j-6', 1600, 1067, 'Misty hills in layered sage tones'),
  img('j-7', 1600, 1067, 'Candlelit oil bowl on dark wood'),
  img('j-8', 1600, 1067, 'Sand dunes at golden hour')
];
