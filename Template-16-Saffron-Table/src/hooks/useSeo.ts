import { useEffect } from 'react';
import { site } from '../config/site';
import { absoluteUrl, canonicalFor, fullTitle } from '../lib/seo';

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object;
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

export function useSeo({ title, description, path, image, type = 'website', noindex = false, jsonLd }: SeoOptions): void {
  useEffect(() => {
    const t = fullTitle(title, path === '/');
    document.title = t;
    const url = canonicalFor(path);
    const img = absoluteUrl(image ?? '/images/hero-table.jpg');
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', t);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:site_name', site.brand.name);
    setMeta('property', 'og:locale', site.locale);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', t);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]');
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', '');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else script?.remove();
  }, [title, description, path, image, type, noindex, jsonLd]);
}
