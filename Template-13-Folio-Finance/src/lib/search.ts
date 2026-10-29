import type { Article, Service } from '../config/types';

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

export function filterArticles(articles: Article[], opts: { q?: string; category?: string }): Article[] {
  const terms = norm(opts.q ?? '').split(/\s+/).filter(Boolean);
  return articles
    .filter((a) => !opts.category || opts.category === 'all' || a.category === opts.category)
    .filter((a) => {
      if (!terms.length) return true;
      const hay = norm([a.title, a.excerpt, a.category, a.author, a.tags.join(' '), a.body.map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : '')).join(' ')].join(' '));
      return terms.every((t) => hay.includes(t));
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function relatedArticles(all: Article[], article: Article, limit = 3): Article[] {
  return all
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({ a, score: (a.category === article.category ? 3 : 0) + a.tags.filter((t) => article.tags.includes(t)).length }))
    .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
    .slice(0, limit)
    .map((x) => x.a);
}

export function filterServices(services: Service[], opts: { category?: string; q?: string }): Service[] {
  const terms = norm(opts.q ?? '').split(/\s+/).filter(Boolean);
  return services
    .filter((s) => !opts.category || opts.category === 'all' || s.categories.includes(opts.category))
    .filter((s) => {
      if (!terms.length) return true;
      const hay = norm([s.name, s.summary, s.description.join(' '), s.deliverables.join(' '), s.idealClient.join(' ')].join(' '));
      return terms.every((t) => hay.includes(t));
    });
}
