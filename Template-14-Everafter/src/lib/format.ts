import { site } from '../config/site';

const nf = () => new Intl.NumberFormat(site.currency.locale, { style: 'currency', currency: site.currency.code, maximumFractionDigits: 0 });
export const formatPrice = (n: number) => nf().format(n);

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return Number.isNaN(d.getTime()) ? iso : new Intl.DateTimeFormat(site.currency.locale, opts).format(d);
};

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
