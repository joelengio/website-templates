import type { SectionConfig } from '../config/types';

/**
 * Resolves a section config into an ordered list of enabled, known, unique ids.
 * Unknown ids and duplicates are dropped so a bad edit can never crash a page.
 */
export function resolveSections(config: SectionConfig[], known: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of config) {
    if (!s.enabled || !known.includes(s.id) || seen.has(s.id)) continue;
    seen.add(s.id);
    out.push(s.id);
  }
  return out;
}
