import { site } from '../config/site';

export const siteUrl = ((import.meta.env.VITE_SITE_URL as string | undefined) || site.url).replace(/\/$/, '');

export interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const buildTitle = (title?: string) => (title ? `${title}${site.seo.titleSuffix}` : site.seo.defaultTitle);

export function applySeo({ title, description, path = '/', image, noindex, type = 'website' }: SeoInput) {
  const fullTitle = buildTitle(title);
  const desc = description || site.seo.defaultDescription;
  const url = `${siteUrl}${path === '/' ? '/' : path.replace(/\/$/, '')}`;
  const img = `${siteUrl}${image || site.seo.ogImage}`;
  document.title = fullTitle;
  setMeta('name', 'description', desc);
  setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  setMeta('property', 'og:title', fullTitle);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', img);
  setMeta('property', 'og:site_name', site.brand.name);
  setMeta('name', 'twitter:card', site.seo.twitterCard);
  setMeta('name', 'twitter:title', fullTitle);
  setMeta('name', 'twitter:description', desc);
  setMeta('name', 'twitter:image', img);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}
