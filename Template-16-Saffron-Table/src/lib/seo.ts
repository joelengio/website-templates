import { seo, site } from '../config/site';
import type { PageSeo } from '../config/types';

export const absoluteUrl = (path: string): string => `${site.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

export const fullTitle = (title: string, isHome = false): string =>
  isHome || title.includes(site.brand.name) ? title : `${title} | ${site.brand.name}`;

export const pageSeo = (path: string): PageSeo =>
  seo[path] ?? { title: site.brand.name, description: site.brand.description };

export const canonicalFor = (path: string): string => absoluteUrl(path === '/' ? '/' : path.replace(/\/$/, ''));

export const restaurantJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: site.brand.name,
  description: site.brand.description,
  servesCuisine: 'Modern European, Levantine, Persian',
  url: site.url,
  telephone: site.contact.phone,
  email: site.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.contact.address.line1,
    addressLocality: site.contact.address.city,
    addressRegion: site.contact.address.region,
    postalCode: site.contact.address.postcode,
    addressCountry: 'US',
  },
  image: absoluteUrl('/images/hero-table.jpg'),
});
