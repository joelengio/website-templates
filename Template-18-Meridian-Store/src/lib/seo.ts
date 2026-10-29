import { site } from '../config/site';
import type { Product } from '../config/types';
import { availability, getCategory } from './catalog';
import { toMajor } from './money';

export const siteUrl = (): string => ((import.meta.env?.VITE_SITE_URL as string | undefined) || site.url).replace(/\/$/, '');
export const absoluteUrl = (path: string): string => `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
export const pageTitle = (title?: string): string => (title ? site.seo.titleTemplate.replace('%s', title) : site.seo.defaultTitle);

/**
 * schema.org Product JSON-LD. Offers reflect the template's DEMONSTRATION catalogue (prices, availability); replace with live data in a real store.
 */
export function productJsonLd(p: Product): Record<string, unknown> {
  const av = availability(p);
  const schemaAvailability = av === 'sold-out' ? 'https://schema.org/OutOfStock' : av === 'coming-soon' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock';
  return {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description, sku: p.sku,
    image: p.images.map((i) => absoluteUrl(i.src)), category: getCategory(p.category)?.name, brand: { '@type': 'Brand', name: site.brand.name },
    offers: { '@type': 'AggregateOffer', priceCurrency: p.currency, lowPrice: toMajor(p.minPriceMinor).toFixed(2), highPrice: toMajor(p.maxPriceMinor).toFixed(2), offerCount: p.variants.length, availability: schemaAvailability, url: absoluteUrl(`/products/${p.slug}`) }
  };
}
