import { site } from '../config/site';

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const absoluteUrl = (path: string) => new URL(path, `${site.url}/`).toString();

export interface SeoOptions { title?: string; description?: string; path?: string; image?: string; noindex?: boolean }

/** Updates <title>, description, canonical, robots and Open Graph/Twitter tags for the current route. */
export function applySeo(opts: SeoOptions): void {
  const title = opts.title ? site.seo.titleTemplate.replace('%s', opts.title) : site.seo.defaultTitle;
  const description = opts.description ?? site.seo.description;
  const path = opts.path ?? window.location.pathname;
  const image = absoluteUrl(opts.image ?? site.seo.ogImage);
  document.title = title;
  setMeta('name', 'description', description);
  setMeta('name', 'robots', opts.noindex ? 'noindex, nofollow' : 'index, follow');
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', site.name);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', absoluteUrl(path));
  setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:card', site.seo.twitterCard);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = absoluteUrl(path);
}
