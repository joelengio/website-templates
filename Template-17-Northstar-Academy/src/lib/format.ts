import { site } from '../config/site';

export const money = (n: number) =>
  new Intl.NumberFormat(site.locale, { style: 'currency', currency: site.currency, maximumFractionDigits: 0 }).format(n);

export const priceLabel = (n: number) => (n === 0 ? 'Free' : money(n));

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString(site.locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const hoursLabel = (h: number) => `${h} hour${h === 1 ? '' : 's'}`;
export const minutesLabel = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ''}`.trim() : `${m} min`);
