const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar date as YYYY-MM-DD (no time zone conversion). */
export const toDateKey = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const isDateKey = (v: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = parseDateKey(v);
  return toDateKey(d) === v;
};

export const parseDateKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (key: string, n: number): string => {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
};

export const weekdayOf = (key: string): number => parseDateKey(key).getDay();

export const daysBetween = (a: string, b: string): number =>
  Math.round((parseDateKey(b).getTime() - parseDateKey(a).getTime()) / 86_400_000);

export const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const minutesToTime = (mins: number): string => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

export const isTimeString = (v: string): boolean => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

export const minutesOfDay = (d: Date): number => d.getHours() * 60 + d.getMinutes();

const LOCALE = 'en-US';

export const formatDateLong = (key: string): string =>
  new Intl.DateTimeFormat(LOCALE, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(parseDateKey(key));

export const formatDateShort = (key: string): string =>
  new Intl.DateTimeFormat(LOCALE, { weekday: 'short', month: 'short', day: 'numeric' }).format(parseDateKey(key));

export const formatMonthYear = (year: number, month: number): string =>
  new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));

export const formatTime = (t: string): string => {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad(m)} ${suffix}`;
};

export const formatArticleDate = (key: string): string =>
  new Intl.DateTimeFormat(LOCALE, { month: 'long', day: 'numeric', year: 'numeric' }).format(parseDateKey(key));
