import type { ImageAsset } from './types';

/**
 * Image registry. Components refer to images by key, so swapping a photo means editing one line here (or replacing the
 * file in /public/images with the same name). All shipped images are original generated illustrations; see ASSET_LICENSES.md.
 */
const img = (file: string, alt: string, width: number, height: number): ImageAsset => ({ src: `/images/${file}.webp`, alt, width, height });

export const images: Record<string, ImageAsset> = {
  'hero-main': img('hero-main', 'Illustration of a calm clinic reception with a tall arched window and a plant', 1000, 1250),
  'hero-card': img('hero-card', 'Illustration of a stethoscope resting on a soft blue background', 600, 600),
  'intro-main': img('intro-main', 'Illustration of a bright consultation room with a desk and two chairs', 1200, 900),
  'about-story': img('about-story', 'Illustration of a sunlit clinic corridor with arched doorways', 1000, 1250),
  'about-care': img('about-care', 'Illustration of a relaxed waiting lounge with sofas and plants', 1400, 900),
  'cta-band': img('cta-band', 'Soft blue and teal illustration of a calm window view', 2000, 900),
  'og-image': img('og-image', 'CLARITY HEALTH demonstration clinic', 1200, 630),
  'map-riverside': img('map-riverside', 'Stylized illustrative map showing the fictional Riverside Centre', 1400, 1000),
  'map-annex': img('map-annex', 'Stylized illustrative map showing the fictional Garden Annex', 1400, 1000),

  'spec-general': img('spec-general', 'Illustration of a stethoscope for General Medicine', 1200, 900),
  'spec-cardiology': img('spec-cardiology', 'Illustration of a heart with a pulse line for Cardiology', 1200, 900),
  'spec-dermatology': img('spec-dermatology', 'Illustration of water droplets and a leaf for Dermatology', 1200, 900),
  'spec-orthopedics': img('spec-orthopedics', 'Illustration of a bone and joint for Orthopedics', 1200, 900),
  'spec-pediatrics': img('spec-pediatrics', 'Illustration of building blocks and a balloon for Pediatrics', 1200, 900),
  'spec-dentistry': img('spec-dentistry', 'Illustration of a tooth for Dentistry', 1200, 900),
  'spec-physio': img('spec-physio', 'Illustration of a stretching figure for Physiotherapy', 1200, 900),
  'spec-womens': img('spec-womens', 'Illustration of a blossom for Women’s Health', 1200, 900),

  'doc-1': img('doc-1', 'Illustration of Dr. Amara Okafor, a fictional general physician', 800, 1000),
  'doc-2': img('doc-2', 'Illustration of Dr. Julian Reyes, a fictional general physician', 800, 1000),
  'doc-3': img('doc-3', 'Illustration of Dr. Mateo Lindqvist, a fictional cardiologist', 800, 1000),
  'doc-4': img('doc-4', 'Illustration of Dr. Priya Raman, a fictional dermatologist', 800, 1000),
  'doc-5': img('doc-5', 'Illustration of Dr. Yuki Tanaka, a fictional dermatology specialist', 800, 1000),
  'doc-6': img('doc-6', 'Illustration of Dr. Tobias Nakamura, a fictional orthopedic specialist', 800, 1000),
  'doc-7': img('doc-7', 'Illustration of Dr. Leila Haddad, a fictional pediatrician', 800, 1000),
  'doc-8': img('doc-8', 'Illustration of Dr. Sofia Marchetti, a fictional dentist', 800, 1000),
  'doc-9': img('doc-9', 'Illustration of Daniel Osei, a fictional physiotherapist', 800, 1000),
  'doc-10': img('doc-10', 'Illustration of Dr. Hannah Vogel, a fictional women’s health physician', 800, 1000),

  'fac-reception': img('fac-reception', 'Illustration of a reception desk with a plant and pendant light', 1400, 1000),
  'fac-consultation': img('fac-consultation', 'Illustration of a consultation suite with an examination couch', 1400, 1000),
  'fac-diagnostics': img('fac-diagnostics', 'Illustration of a diagnostics room with a ring-shaped scanner', 1400, 1000),
  'fac-rehab': img('fac-rehab', 'Illustration of a bright rehabilitation studio with an exercise ball', 1400, 1000),
  'fac-family': img('fac-family', 'Illustration of a children’s play area with soft shapes', 1400, 1000),

  'svc-consultation': img('svc-consultation', 'Illustration of two chairs and a desk for consultations', 1200, 800),
  'svc-diagnostic': img('svc-diagnostic', 'Illustration of a magnifier over a pulse line for diagnostics', 1200, 800),
  'svc-preventive': img('svc-preventive', 'Illustration of a shield with a leaf for preventive care', 1200, 800),
  'svc-specialist': img('svc-specialist', 'Illustration of an arch and a plus symbol for specialist care', 1200, 800),
  'svc-screening': img('svc-screening', 'Illustration of a clipboard and a check mark for screenings', 1200, 800),

  'art-1': img('art-1', 'Illustration of a crescent moon and stars', 1200, 800),
  'art-2': img('art-2', 'Illustration of a heart with a pulse line', 1200, 800),
  'art-3': img('art-3', 'Illustration of a sun above a gentle horizon', 1200, 800),
  'art-4': img('art-4', 'Illustration of a smiling tooth and toothbrush', 1200, 800),
  'art-5': img('art-5', 'Illustration of an office chair and a plant', 1200, 800),
  'art-6': img('art-6', 'Illustration of a calendar and a note pad', 1200, 800),
  'art-7': img('art-7', 'Illustration of a magnifying glass and a check mark', 1200, 800),
  'art-8': img('art-8', 'Illustration of water droplets and a glass', 1200, 800)
};

export const getImage = (key: string): ImageAsset => images[key] ?? images['hero-card'];
