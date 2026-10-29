/** Calendar-date helpers. Dates are ISO strings (YYYY-MM-DD) and all maths is done in UTC so DST never shifts a night. */
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidISO(s: string | null | undefined): s is string {
  if (!s) return false;
  const m = ISO.exec(s);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

const toUTC = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

export function toISO(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export const addDays = (iso: string, n: number) => toISO(toUTC(iso) + n * 86_400_000);
export const diffDays = (a: string, b: string) => Math.round((toUTC(b) - toUTC(a)) / 86_400_000);
/** 0 = Sunday … 6 = Saturday. */
export const weekday = (iso: string) => new Date(toUTC(iso)).getUTCDay();
export const monthDay = (iso: string) => iso.slice(5);

export function todayISO(override?: string | null): string {
  if (override && isValidISO(override)) return override;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Nights between check-in (inclusive) and check-out (exclusive) as a list of night dates. */
export function nightsBetween(checkIn: string, checkOut: string): string[] {
  const n = diffDays(checkIn, checkOut);
  return n > 0 ? Array.from({ length: n }, (_, i) => addDays(checkIn, i)) : [];
}

/** Is MM-DD inside an inclusive range that may wrap the year end? */
export function inMonthDayRange(md: string, from: string, to: string): boolean {
  return from <= to ? md >= from && md <= to : md >= from || md <= to;
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: 'UTC' }).format(new Date(toUTC(iso)));
}

/** First-of-month ISO for the month containing `iso`. */
export const startOfMonth = (iso: string) => `${iso.slice(0, 7)}-01`;
export function addMonths(iso: string, n: number) {
  const [y, m] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1 + n, 1));
  return toISO(t.getTime());
}

/** Weeks (Monday first) for the month grid; cells outside the month are null. */
export function monthGrid(firstOfMonth: string): (string | null)[][] {
  const [y, m] = firstOfMonth.split('-').map(Number);
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (weekday(firstOfMonth) + 6) % 7;
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push(`${firstOfMonth.slice(0, 8)}${String(d).padStart(2, '0')}`);
  while (cells.length % 7) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
