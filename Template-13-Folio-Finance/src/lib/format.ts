import { site } from '../config/site';

const { code, locale } = site.currency;

/** Formats an amount in the configured display currency. No exchange-rate conversion is ever applied. */
export function formatCurrency(value: number, opts: { cents?: boolean } = {}): string {
  if (!Number.isFinite(value)) return '—';
  const digits = opts.cents ? 2 : 0;
  return new Intl.NumberFormat(locale, { style: 'currency', currency: code, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

/** Compact currency for chart axes: $1.2M, $450K. */
export function formatCompactCurrency(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: code, notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

export function formatPercent(fraction: number, digits = 1): string {
  if (!Number.isFinite(fraction)) return '—';
  return new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(fraction);
}

/** Currency symbol only (e.g. "$") for input adornments. */
export function currencySymbol(): string {
  const part = new Intl.NumberFormat(locale, { style: 'currency', currency: code }).formatToParts(0).find((p) => p.type === 'currency');
  return part?.value ?? code;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(parseISODate(iso));
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(parseISODate(iso));
}

/** "09:30" → "9:30 AM" (locale-aware). */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, h, m));
}

export function readingMinutes(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}
