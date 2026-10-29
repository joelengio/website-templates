import { site } from '../config/site';

export function formatPrice(value: number): string {
  return new Intl.NumberFormat(site.locale, {
    style: 'currency',
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Compact price for filter labels: 1,500,000 → "$1.5M". */
export function formatPriceShort(value: number): string {
  return new Intl.NumberFormat(site.locale, {
    style: 'currency',
    currency: site.currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

const SQFT_PER_SQM = 10.7639;

export function formatArea(sqm: number): string {
  if (site.units === 'imperial') {
    return `${new Intl.NumberFormat(site.locale, { maximumFractionDigits: 0 }).format(Math.round(sqm * SQFT_PER_SQM))} sq ft`;
  }
  return `${new Intl.NumberFormat(site.locale).format(sqm)} m²`;
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString(site.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
