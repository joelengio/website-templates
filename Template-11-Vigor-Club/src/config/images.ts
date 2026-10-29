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
  heroMain: img('hero-main', 2000, 1200, 'Illustrated silhouette of an athlete pressing a loaded barbell overhead in a dark gym hall with lime rim light'),
  heroAlt: img('hero-alt', 2000, 1200, 'Illustrated silhouette of an athlete deadlifting in a shadowy training hall'),
  introLifter: img('intro-lifter', 1000, 1300, 'Illustrated lifter mid-deadlift lit by an acid-lime edge glow'),
  philosophy: img('philosophy-plates', 2000, 1200, 'Close illustration of stacked weight plates on a barbell with lime highlights'),
  cta: img('cta-stripes', 2000, 1200, 'Diagonal lime stripes behind a large weight plate'),
  ogImage: img('og-image', 1200, 630, 'VIGOR CLUB — athlete silhouette pressing a barbell in a dark training hall'),
  contactMap: img('contact-map', 1600, 1067, 'Abstract dark map grid with a lime route line, used behind the demonstration location card'),
  aboutStory: img('about-story', 1000, 1300, 'Illustrated athlete pressing a barbell in lime rim light'),
  aboutFloor: img('about-floor', 2000, 1200, 'Illustrated kettlebell swing on the training floor'),
  aboutCommunity: img('about-community', 2000, 1200, 'Illustrated group of athletes training together in a studio'),
  progStrength: img('prog-strength', 1600, 1067, 'Illustrated power rack with a loaded barbell and stacked plates'),
  progFunctional: img('prog-functional', 1600, 1067, 'Illustrated row of kettlebells of ascending size'),
  progHiit: img('prog-hiit', 1600, 1067, 'Illustrated sprinter on a lane track in lime light'),
  progBoxing: img('prog-boxing', 1600, 1067, 'Illustrated boxer in stance beside a heavy bag'),
  progMobility: img('prog-mobility', 1600, 1067, 'Illustrated athlete in a deep lunge reaching overhead'),
  progPersonal: img('prog-personal', 1600, 1067, 'Illustrated athlete in a barbell back squat'),
  progGroup: img('prog-group', 1600, 1067, 'Illustrated group of athletes in a conditioning class'),
  progPerformance: img('prog-performance', 1600, 1067, 'Illustrated athlete deadlifting in a dark performance hall')
};

export const trainerImages = [1, 2, 3, 4, 5, 6].map((n) =>
  img(`trainer-${n}`, 800, 1000, 'Illustrated silhouette portrait of a fictional VIGOR CLUB trainer (demonstration artwork)')
);

export const journalImages = [
  img('j-1', 1600, 1067, 'Illustrated lifter in a deadlift setup'),
  img('j-2', 1600, 1067, 'Warm slatted sauna wall with a lime accent line'),
  img('j-3', 1600, 1067, 'Illustrated athlete stretching in a deep lunge'),
  img('j-4', 1600, 1067, 'Four kettlebells in a row under spot lighting'),
  img('j-5', 1600, 1067, 'Illustrated sprinter on a track'),
  img('j-6', 1600, 1067, 'Concentric ripples on dark water'),
  img('j-7', 1600, 1067, 'Large weight plates on a barbell'),
  img('j-8', 1600, 1067, 'Lime diagonal stripes on charcoal')
];

export const facilityImages = {
  strength: img('fac-strength', 1000, 1300, 'Illustrated power rack with plates in a strength zone'),
  cardio: img('fac-cardio', 1600, 1067, 'Illustrated row of treadmills in front of tall windows'),
  functional: img('fac-functional', 1600, 1067, 'Illustrated battle ropes in motion beside an athlete'),
  group: img('fac-group', 2000, 1200, 'Illustrated studio with four athletes mid-class'),
  personal: img('fac-personal', 1000, 1300, 'Illustrated athlete squatting in a private coaching bay'),
  recovery: img('fac-recovery', 1600, 1067, 'Warm slatted recovery room with an orange glow'),
  plunge: img('fac-plunge', 1200, 1200, 'Concentric ripples on a dark cold-water plunge pool'),
  track: img('fac-track', 1600, 1067, 'Illustrated indoor sprint lanes in perspective'),
  boxing: img('fac-boxing', 1200, 1200, 'Illustrated boxing zone with a heavy bag'),
  free: img('fac-free', 1600, 1067, 'Illustrated rack of six kettlebells')
};
