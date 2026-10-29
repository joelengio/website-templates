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
  heroMain: img('hero-main', 2000, 1200, 'Dark strength floor with rows of machines and racks under a single line of white light'),
  introLifter: img('intro-lifter', 1000, 1300, 'Athlete crouched over a loaded barbell in near darkness'),
  philosophy: img('philosophy-plates', 2000, 1200, 'Close view of a 45 lb weight plate on a barbell'),
  cta: img('cta-stripes', 2000, 1200, 'Loaded barbell resting on black rubber flooring'),
  ogImage: img('og-image', 1200, 630, 'VIGOR CLUB — dark strength floor under a line of white light'),
  contactMap: img('contact-map', 1600, 1067, 'Abstract dark map grid with a lime route line, used behind the demonstration location card'),
  aboutStory: img('about-story', 1000, 1300, 'Hand gripping a kettlebell in a cloud of chalk against a black background'),
  aboutFloor: img('about-floor', 2000, 1200, 'Wide view of a strength floor with benches and rows of dumbbells'),
  aboutCommunity: img('about-community', 2000, 1200, 'Two members performing overhead kettlebell swings in a bright studio'),
  progStrength: img('prog-strength', 1600, 1067, 'Barbell and weight plate on a gym floor'),
  progFunctional: img('prog-functional', 1600, 1067, 'Rows of black kettlebells on rubber flooring'),
  progHiit: img('prog-hiit', 1600, 1067, 'Man gripping heavy battle ropes against a white brick wall'),
  progBoxing: img('prog-boxing', 1600, 1067, 'Boxing gym with a heavy bag hanging beside the ring'),
  progMobility: img('prog-mobility', 1600, 1067, 'Athlete in a deep lunge with arms reaching overhead on a mat'),
  progPersonal: img('prog-personal', 1600, 1067, 'Athlete pulling a heavy barbell from the floor in a training hall'),
  progGroup: img('prog-group', 1600, 1067, 'Open training floor with cable machines and benches under bright lights'),
  progPerformance: img('prog-performance', 1600, 1067, 'Top-down view of a row of hex dumbbells on black flooring')
};

export const trainerImages = [1, 2, 3, 4, 5, 6].map((n) =>
  img(`trainer-${n}`, 800, 1000, 'Monogram placeholder for a VIGOR CLUB trainer (replace with a portrait)')
);

export const journalImages = [
  img('j-1', 1600, 1067, 'Weight plate stamped 45 LBS in low light'),
  img('j-2', 1600, 1067, 'Sauna bucket and ladle on a warm wooden bench'),
  img('j-3', 1600, 1067, 'Member walking on a treadmill beside tall gym windows'),
  img('j-4', 1600, 1067, 'Row of dumbbells photographed from above'),
  img('j-5', 1600, 1067, 'Pair of black boxing gloves resting on a mat'),
  img('j-6', 1600, 1067, 'Kettlebell casting a long shadow on a yoga mat'),
  img('j-7', 1600, 1067, 'Silhouettes on treadmills in front of large gym windows'),
  img('j-8', 1600, 1067, 'Two members swinging kettlebells together')
];

export const facilityImages = {
  strength: img('fac-strength', 1000, 1300, 'Power rack with plates loaded on the barbell in the strength hall'),
  cardio: img('fac-cardio', 1600, 1067, 'Row of treadmills facing floor-to-ceiling windows'),
  functional: img('fac-functional', 1600, 1067, 'Members training on heavy bags in the functional yard'),
  group: img('fac-group', 2000, 1200, 'Bright studio with a member working out beside tall windows'),
  personal: img('fac-personal', 1000, 1300, 'Private coaching area with benches and dumbbell racks in black and white'),
  recovery: img('fac-recovery', 1600, 1067, 'Recovery room with a wooden sauna bench and heater stones'),
  plunge: img('fac-plunge', 1200, 1200, 'Swimmer in an ice-cold plunge'),
  track: img('fac-track', 1600, 1067, 'Long corridor of cardio machines along a bright window wall'),
  boxing: img('fac-boxing', 1200, 1200, 'Black boxing gloves on a mat in the boxing zone'),
  free: img('fac-free', 1600, 1067, 'Rows of black kettlebells on a rubber floor')
};
