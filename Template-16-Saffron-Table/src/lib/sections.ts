import type { HomeSection, HomeSectionId } from '../config/types';

export const knownSections: HomeSectionId[] = [
  'hero', 'concept', 'signature', 'philosophy', 'menus', 'atmosphere', 'privateDining', 'awards', 'testimonials', 'journal', 'reserveCta',
];

/** Returns enabled, known, de-duplicated section ids in configured order. */
export function resolveHomeSections(config: HomeSection[]): HomeSectionId[] {
  const seen = new Set<HomeSectionId>();
  const out: HomeSectionId[] = [];
  for (const s of config) {
    if (!s.enabled || !knownSections.includes(s.id) || seen.has(s.id)) continue;
    seen.add(s.id);
    out.push(s.id);
  }
  return out;
}
