import { site } from '../config/site';

const money = new Intl.NumberFormat(site.locale, { style: 'currency', currency: site.currency, maximumFractionDigits: 0 });

export const formatPrice = (n: number) => money.format(n);

export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};

/** Parse "YYYY-MM-DD" as a local date (avoids UTC off-by-one errors). */
export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const formatLongDate = (iso: string) =>
  parseISODate(iso).toLocaleDateString(site.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export const formatShortDate = (iso: string) =>
  parseISODate(iso).toLocaleDateString(site.locale, { month: 'short', day: 'numeric', year: 'numeric' });

export const formatTime = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return d.toLocaleTimeString(site.locale, { hour: 'numeric', minute: '2-digit' });
};

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
