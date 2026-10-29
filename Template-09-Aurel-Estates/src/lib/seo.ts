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

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

/** Updates <title>, description, canonical and Open Graph tags for the current page. */
export function applySeo(opts: { title?: string; description?: string; path?: string; image?: string }): void {
  const title = opts.title ? site.seo.titleTemplate.replace('%s', opts.title) : site.seo.defaultTitle;
  const description = opts.description ?? site.seo.description;
  const path = opts.path ?? window.location.pathname;
  document.title = title;
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', absoluteUrl(path));
  setMeta('property', 'og:image', absoluteUrl(opts.image ?? site.seo.ogImage));
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = absoluteUrl(path);
}
