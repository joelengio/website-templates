import { commerce } from '../config/commerce';

/**
 * Money is stored and calculated as integers in MINOR units (cents). Floating point is used only to display.
 * Config files are written in major units and converted once with `toMinor`.
 */

const digitsCache = new Map<string, number>();
export const currencyDigits = (code: string = commerce.currency.code, locale: string = commerce.currency.locale): number => {
  const key = `${locale}|${code}`;
  const cached = digitsCache.get(key);
  if (cached !== undefined) return cached;
  let d: number;
  try {
    d = new Intl.NumberFormat(locale, { style: 'currency', currency: code }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    d = 2;
  }
  digitsCache.set(key, d);
  return d;
};

/** Convert a major-unit amount (e.g. 62.5) to integer minor units using decimal-safe rounding (1.005 → 101 at 2 digits). */
export const toMinor = (major: number, digits: number = currencyDigits()): number => {
  if (!Number.isFinite(major)) return 0;
  const s = String(major);
  const scaled = s.includes('e') ? major * 10 ** digits : Number(`${s}e${digits}`);
  return Math.round(scaled);
};

export const toMajor = (minor: number, digits: number = currencyDigits()): number => minor / 10 ** digits;

export interface FormatOptions {
  currency?: string;
  locale?: string;
  /** Hide ".00" on whole amounts (used for compact product cards). */
  compact?: boolean;
}

/** Format minor units as a localised currency string. Falls back to a plain "CODE 12.34" string if Intl rejects the currency/locale. */
export const formatMoney = (minor: number, opts: FormatOptions = {}): string => {
  const currency = opts.currency ?? commerce.currency.code;
  const locale = opts.locale ?? commerce.currency.locale;
  const digits = currencyDigits(currency, locale);
  const value = toMajor(Number.isFinite(minor) ? minor : 0, digits);
  try {
    const whole = opts.compact && Number.isInteger(value);
    return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: whole ? 0 : digits, maximumFractionDigits: whole ? 0 : digits }).format(value);
  } catch {
    return `${currency} ${value.toFixed(digits)}`;
  }
};

/** Percentage of an amount, rounded half-up to a whole minor unit using integer maths. Rates may have up to 3 decimal places. */
export const percentOf = (minor: number, ratePct: number): number => {
  if (!Number.isFinite(minor) || !Number.isFinite(ratePct) || minor <= 0 || ratePct <= 0) return 0;
  const rate = Math.round(ratePct * 1000);
  return Math.floor((minor * rate + 50000) / 100000);
};

/** Tax contained in a tax-inclusive amount: gross × r / (100 + r), rounded half-up. */
export const taxIncludedIn = (grossMinor: number, ratePct: number): number => {
  if (!Number.isFinite(grossMinor) || !Number.isFinite(ratePct) || grossMinor <= 0 || ratePct <= 0) return 0;
  const rate = Math.round(ratePct * 1000);
  const denom = 100000 + rate;
  return Math.floor((grossMinor * rate * 2 + denom) / (denom * 2));
};

export const clampInt = (n: number, min: number, max: number): number => {
  const v = Number.isFinite(n) ? Math.trunc(n) : min;
  return Math.min(max, Math.max(min, v));
};
