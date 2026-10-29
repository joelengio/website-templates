import type { SectionConfig } from './types';
import type { PageKey } from './navigation';

/**
 * LAYOUT CONFIG — switch pages on/off and hide or reorder page sections.
 * - `pages.<key>`: false removes the route, nav item and footer link (visitors get the 404 page).
 * - `sections`: the array order IS the render order; set enabled:false to hide. Unknown ids are ignored.
 */
export const pages: Record<PageKey, boolean> = {
  home: true,
  properties: true,
  about: true,
  services: true,
  journal: true,
  contact: true,
};

export const sections: Record<'home' | 'about' | 'services', SectionConfig[]> = {
  home: [
    { id: 'hero', enabled: true },
    { id: 'featured', enabled: true },
    { id: 'neighborhoods', enabled: true },
    { id: 'approach', enabled: true },
    { id: 'services', enabled: true },
    { id: 'stats', enabled: true },
    { id: 'journal', enabled: true },
    { id: 'cta', enabled: true },
  ],
  about: [
    { id: 'intro', enabled: true },
    { id: 'values', enabled: true },
    { id: 'team', enabled: true },
    { id: 'cta', enabled: true },
  ],
  services: [
    { id: 'intro', enabled: true },
    { id: 'list', enabled: true },
    { id: 'process', enabled: true },
    { id: 'faq', enabled: true },
    { id: 'cta', enabled: true },
  ],
};
