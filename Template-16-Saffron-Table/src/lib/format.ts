import { currency } from '../config/menu';

export const formatMoney = (amount: number, opts: { code?: string; locale?: string } = {}): string => {
  const code = opts.code ?? currency.code;
  const locale = opts.locale ?? currency.locale;
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCents = (cents: number): string =>
  new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(cents / 100);

export const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;

export const slugify = (v: string): string =>
  v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
