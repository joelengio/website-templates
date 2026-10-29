import { site } from '../config/site';

const fmt = new Intl.NumberFormat(site.currency.locale, { style: 'currency', currency: site.currency.code, maximumFractionDigits: 0 });
const fmtCents = new Intl.NumberFormat(site.currency.locale, { style: 'currency', currency: site.currency.code, minimumFractionDigits: 2 });

/** Whole currency units (e.g. a base rate of 245). */
export const money = (units: number) => fmt.format(units);
/** Integer cents (all booking maths) — always two decimals so totals reconcile visually. */
export const cents = (c: number) => fmtCents.format(c / 100);
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
