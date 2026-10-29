/** Shared route list for sitemap + prerendered meta. Reads the same config the app uses. */
import { experiences } from '../src/config/experiences';
import { features } from '../src/config/features';
import { articles } from '../src/config/journal';
import { seo, site } from '../src/config/site';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  image: string;
  type: 'website' | 'article';
  indexable: boolean;
  lastmod?: string;
}

const brand = site.brand.name;
const full = (t: string, home = false) => (home || t.includes(brand) ? t : `${t} | ${brand}`);
const enabled = (path: string): boolean => {
  if (path === '/order') return features.orderBuilder;
  if (path.startsWith('/reserve')) return features.reservations;
  if (path === '/gallery') return features.gallery;
  if (path === '/journal') return features.journal;
  if (path === '/private-dining') return features.privateDining;
  return true;
};

export function allRoutes(): RouteMeta[] {
  const noindex = new Set(['/order', '/reserve/manage']);
  const pages: RouteMeta[] = Object.entries(seo)
    .filter(([path]) => enabled(path))
    .map(([path, s]) => ({
      path,
      title: full(s.title, path === '/'),
      description: s.description,
      image: s.image ?? '/images/hero-table.jpg',
      type: 'website' as const,
      indexable: !noindex.has(path),
    }));
  const exp: RouteMeta[] = experiences.map((e) => ({
    path: `/experiences/${e.slug}`,
    title: full(e.title),
    description: `${e.tagline}. ${e.summary}`,
    image: `/images/${e.image}.jpg`,
    type: 'website',
    indexable: true,
  }));
  const posts: RouteMeta[] = features.journal
    ? articles.map((a) => ({
        path: `/journal/${a.slug}`,
        title: full(a.title),
        description: a.excerpt,
        image: `/images/${a.image}.jpg`,
        type: 'article' as const,
        indexable: true,
        lastmod: a.date,
      }))
    : [];
  return [...pages, ...exp, ...posts];
}

export const abs = (path: string): string => `${site.url.replace(/\/$/, '')}${path === '/' ? '/' : path}`;
