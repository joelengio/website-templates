import { site } from '../config/site';

export interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

const absolute = (path: string) => `${site.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

export function fullTitle(title?: string): string {
  return title ? site.seo.titleTemplate.replace('%s', title) : site.seo.defaultTitle;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Applies per-route title, description, canonical URL, Open Graph and Twitter tags. */
export function applySeo({ title, description, path = '/', image, noindex }: SeoInput): void {
  const t = fullTitle(title);
  const d = description ?? site.seo.description;
  const url = absolute(path === '/' ? '/' : path);
  const img = absolute(image ?? site.seo.ogImage);
  document.title = t;
  setMeta('name', 'description', d);
  setMeta('property', 'og:title', t);
  setMeta('property', 'og:description', d);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', img);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', site.brand.name);
  setMeta('name', 'twitter:card', site.seo.twitterCard);
  setMeta('name', 'twitter:title', t);
  setMeta('name', 'twitter:description', d);
  setMeta('name', 'twitter:image', img);
  setMeta('name', 'robots', noindex || site.seo.noindexDemo ? 'noindex, nofollow' : 'index, follow');
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}
