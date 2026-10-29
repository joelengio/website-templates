import type { Article, Program } from '../config/types';

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').trim();

export interface ProgramFilter {
  q: string;
  category: string;
  level: string;
  trainer: string;
}

export function filterPrograms(list: Program[], f: ProgramFilter, trainerNames: (slug: string) => string = (s) => s): Program[] {
  const q = norm(f.q);
  return list.filter((p) => {
    if (f.category && f.category !== 'All' && p.category !== f.category) return false;
    if (f.level && f.level !== 'All' && p.level !== f.level) return false;
    if (f.trainer && f.trainer !== 'All' && !p.trainerSlugs.includes(f.trainer)) return false;
    if (!q) return true;
    const hay = norm([p.name, p.category, p.summary, p.level, ...p.highlights, ...p.trainerSlugs.map(trainerNames)].join(' '));
    return q.split(/\s+/).every((word) => hay.includes(word));
  });
}

export function filterArticles(list: Article[], q: string, category: string): Article[] {
  const nq = norm(q);
  return list.filter((a) => {
    if (category && category !== 'All' && a.category !== category) return false;
    if (!nq) return true;
    const hay = norm([a.title, a.excerpt, a.category, a.author, ...a.tags].join(' '));
    return nq.split(/\s+/).every((w) => hay.includes(w));
  });
}

export function relatedArticles(all: Article[], current: Article, limit = 3): Article[] {
  return all
    .filter((a) => a.slug !== current.slug)
    .map((a) => ({ a, score: (a.category === current.category ? 2 : 0) + a.tags.filter((t) => current.tags.includes(t)).length }))
    .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
    .slice(0, limit)
    .map((x) => x.a);
}
