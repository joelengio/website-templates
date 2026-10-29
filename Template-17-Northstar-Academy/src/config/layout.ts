import type { PagesConfig } from './types';

/** Enable/disable whole pages. A disabled page loses its route, its navigation entry and its sitemap URLs. */
export const pages: PagesConfig = {
  home: true,
  courses: true,
  instructors: true,
  paths: true,
  plans: true,
  about: true,
  journal: true,
  contact: true,
  learn: true,
};

export type HomeSectionId =
  | 'hero'
  | 'categories'
  | 'featured'
  | 'outcomes'
  | 'instructors'
  | 'why'
  | 'experience'
  | 'paths'
  | 'testimonials'
  | 'plans'
  | 'dashboard'
  | 'journal'
  | 'cta';

/** Home page sections: order of this array is the render order; `visible: false` hides a section. */
export const homeSections: { id: HomeSectionId; visible: boolean }[] = [
  { id: 'hero', visible: true },
  { id: 'categories', visible: true },
  { id: 'featured', visible: true },
  { id: 'outcomes', visible: true },
  { id: 'instructors', visible: true },
  { id: 'why', visible: true },
  { id: 'experience', visible: true },
  { id: 'paths', visible: true },
  { id: 'testimonials', visible: true },
  { id: 'dashboard', visible: true },
  { id: 'plans', visible: true },
  { id: 'journal', visible: true },
  { id: 'cta', visible: true },
];
