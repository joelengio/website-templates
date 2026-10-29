import type { HomeSectionConfig } from './types';

/** Turn whole pages on or off. A disabled page is removed from routing, navigation links keep working only if you also remove them in navigation.ts. */
export const pages = {
  services: true,
  industries: true,
  about: true,
  team: true,
  pricing: true,
  tools: true,
  insights: true,
  booking: true,
  contact: true,
  disclaimer: true,
};

/** Home page sections: reorder the array to reorder the page; set `enabled: false` to hide a section. */
export const homeSections: HomeSectionConfig[] = [
  { id: 'hero', enabled: true },
  { id: 'stats', enabled: true },
  { id: 'services', enabled: true },
  { id: 'about', enabled: true },
  { id: 'advisory', enabled: true },
  { id: 'segments', enabled: true },
  { id: 'why', enabled: true },
  { id: 'process', enabled: true },
  { id: 'toolPreview', enabled: true },
  { id: 'testimonials', enabled: true },
  { id: 'insights', enabled: true },
  { id: 'cta', enabled: true },
];
