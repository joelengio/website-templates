import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { addDays, formatDate, formatMonth, parseISODate, toISODate } from '../lib/format';
import { Icon } from './Icon';

const WEEKDAYS = [
  { short: 'Mon', long: 'Monday' }, { short: 'Tue', long: 'Tuesday' }, { short: 'Wed', long: 'Wednesday' },
  { short: 'Thu', long: 'Thursday' }, { short: 'Fri', long: 'Friday' }, { short: 'Sat', long: 'Saturday' }, { short: 'Sun', long: 'Sunday' }
];

interface CalendarProps {
  value: string;
  onChange: (iso: string) => void;
  minISO: string;
  maxISO: string;
  /** Return true when the day has at least one bookable slot. */
  isAvailable: (iso: string) => boolean;
  label?: string;
}

/**
 * Accessible month calendar. Months are navigated with the Previous/Next buttons (or PageUp/PageDown inside the grid),
 * days with the arrow keys. Unavailable days stay focusable (aria-disabled) so keyboard users can discover them.
 */
export function Calendar({ value, onChange, minISO, maxISO, isAvailable, label = 'Choose a date' }: CalendarProps) {
  const start = parseISODate(value || minISO);
  const [cursor, setCursor] = useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const gridRef = useRef<HTMLTableElement>(null);
  const monthId = useId();

  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => toISODate(new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)))];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const monthStartISO = toISODate(first);
  const monthEndISO = toISODate(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0));
  const canPrev = monthStartISO > minISO;
  const canNext = monthEndISO < maxISO;

  const availableInMonth = cells.filter((c): c is string => !!c && c >= minISO && c <= maxISO && isAvailable(c));
  const tabbable = value && cells.includes(value) ? value : availableInMonth[0] ?? cells.find((c): c is string => !!c && c >= minISO && c <= maxISO) ?? cells.find(Boolean) ?? '';

  const focusDay = (iso: string) => {
    const d = parseISODate(iso);
    if (d.getMonth() !== cursor.getMonth() || d.getFullYear() !== cursor.getFullYear()) {
      if (iso < minISO || iso > maxISO) return;
      setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    }
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLElement>(`[data-date="${iso}"]`)?.focus());
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, iso: string) => {
    const d = parseISODate(iso);
    const move: Record<string, string> = {
      ArrowLeft: toISODate(addDays(d, -1)), ArrowRight: toISODate(addDays(d, 1)),
      ArrowUp: toISODate(addDays(d, -7)), ArrowDown: toISODate(addDays(d, 7)),
      PageUp: toISODate(new Date(d.getFullYear(), d.getMonth() - 1, d.getDate())), PageDown: toISODate(new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())),
      Home: toISODate(addDays(d, -((d.getDay() + 6) % 7))), End: toISODate(addDays(d, 6 - ((d.getDay() + 6) % 7)))
    };
    const target = move[e.key];
    if (!target) return;
    e.preventDefault();
    if (target < minISO || target > maxISO) return;
    focusDay(target);
  };

  return (
    <div className="calendar" role="group" aria-labelledby={monthId}>
      <p className="sr-only">{label}. Use the arrow keys to move between days, Page Up and Page Down to change month, and Enter to select.</p>
      <div className="calendar-head">
        <button type="button" className="icon-btn" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} disabled={!canPrev} aria-label="Previous month"><Icon name="chevron-left" /></button>
        <h3 id={monthId} aria-live="polite">{formatMonth(cursor)}</h3>
        <button type="button" className="icon-btn" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} disabled={!canNext} aria-label="Next month"><Icon name="chevron-right" /></button>
      </div>
      <table ref={gridRef} className="calendar-grid">
        <thead>
          <tr>{WEEKDAYS.map((w) => <th key={w.long} scope="col"><abbr title={w.long}>{w.short}</abbr></th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((wk, wi) => (
            <tr key={wi}>
              {wk.map((iso, ci) => {
                if (!iso) return <td key={ci} className="is-empty" />;
                const inRange = iso >= minISO && iso <= maxISO;
                const ok = inRange && isAvailable(iso);
                const selected = iso === value;
                const dayNum = parseISODate(iso).getDate();
                return (
                  <td key={iso}>
                    <button
                      type="button"
                      data-date={iso}
                      tabIndex={iso === tabbable ? 0 : -1}
                      className={`day ${selected ? 'is-selected' : ''} ${ok ? 'is-available' : 'is-unavailable'}`}
                      aria-pressed={selected}
                      aria-disabled={!ok}
                      aria-label={`${formatDate(iso)}, ${ok ? 'available' : inRange ? 'no availability' : 'not bookable'}`}
                      onClick={() => ok && onChange(iso)}
                      onKeyDown={(e) => onKey(e, iso)}
                    >
                      {dayNum}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="calendar-legend" aria-hidden="true">
        <li><span className="swatch available" /> Available</li>
        <li><span className="swatch selected" /> Selected</li>
        <li><span className="swatch unavailable" /> Unavailable</li>
      </ul>
    </div>
  );
}
