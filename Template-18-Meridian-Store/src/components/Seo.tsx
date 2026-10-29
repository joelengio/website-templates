import { useEffect } from 'react';
import { site } from '../config/site';
import { absoluteUrl, pageTitle } from '../lib/seo';

interface Props {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

/** Per-page title, description, canonical URL, Open Graph tags and optional JSON-LD. */
export function Seo({ title, description = site.seo.defaultDescription, path, image = site.seo.ogImage, type = 'website', jsonLd, noindex }: Props) {
  useEffect(() => {
    const full = pageTitle(title);
    document.title = full;
    const url = absoluteUrl(path ?? window.location.pathname);
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type === 'product' ? 'website' : type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:site_name', site.brand.name);
    setMeta('property', 'og:image', absoluteUrl(image));
    setMeta('name', 'twitter:card', site.seo.twitterCard);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]');
    if (jsonLd) {
      if (!script) { script = document.createElement('script'); script.type = 'application/ld+json'; script.dataset.seoJsonld = 'true'; document.head.appendChild(script); }
      script.textContent = JSON.stringify(jsonLd);
    } else script?.remove();
  }, [title, description, path, image, type, jsonLd, noindex]);
  return null;
}
