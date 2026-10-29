import { useEffect } from 'react';
import { site } from '../config/site';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeo(opts: { title: string; description: string; path: string; image?: string; noindex?: boolean }) {
  const { title, description, path, image, noindex } = opts;
  useEffect(() => {
    const full = site.seo.titleTemplate.replace('%s', title);
    document.title = full;
    const url = site.url.replace(/\/$/, '') + (path === '/' ? '/' : path);
    const img = (image ?? site.seo.ogImage).startsWith('http') ? (image ?? site.seo.ogImage) : site.url.replace(/\/$/, '') + (image ?? site.seo.ogImage);
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', site.brand.shortName);
    setMeta('name', 'twitter:card', site.seo.twitterCard);
    setMeta('name', 'twitter:title', full);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, path, image, noindex]);
}
