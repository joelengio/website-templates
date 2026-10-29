import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { availableCount, bookableRange, isBookableDate, type Appointment } from '../lib/booking';
import { formatLongDate, parseISODate, toISODate } from '../lib/format';
import { site } from '../config/site';
import { Icon } from './Icon';

interface Props {
  value: string | null;
  onSelect: (iso: string) => void;
  duration: number;
  existing: Appointment[];
  now?: Date;
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const monthKey = (d: Date) => d.getFullYear() * 12 + d.getMonth();

/** Accessible month calendar (ARIA grid): arrow keys move by day/week, PageUp/PageDown by month, Enter/Space selects. */
export function Calendar({ value, onSelect, duration, existing, now }: Props) {
  const today = useMemo(() => now ?? new Date(), [now]);
  const range = useMemo(() => bookableRange(today), [today]);
  const [cursor, setCursor] = useState<Date>(() => (value ? parseISODate(value) : range.min));
  const [view, setView] = useState<Date>(() => new Date(cursor.getFullYear(), cursor.getMonth(), 1));
  const gridRef = useRef<HTMLDivElement>(null);
  const [wantFocus, setWantFocus] = useState(false);

  const first = view;
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i + 1))];
  while (cells.length % 7) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const canPrev = monthKey(view) > monthKey(range.min);
  const canNext = monthKey(view) < monthKey(range.max);
  const monthLabel = new Intl.DateTimeFormat(site.currency.locale, { month: 'long', year: 'numeric' }).format(view);
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i)); // Mon..Sun

  useEffect(() => {
    if (!wantFocus) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`button[data-date="${toISODate(cursor)}"]`)?.focus();
    setWantFocus(false);
  }, [wantFocus, cursor, view]);

  const moveTo = (d: Date) => {
    const clamped = d < range.min ? range.min : d > range.max ? range.max : d;
    setCursor(clamped);
    setView(new Date(clamped.getFullYear(), clamped.getMonth(), 1));
    setWantFocus(true);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, d: Date) => {
    const map: Record<string, Date> = {
      ArrowLeft: addDays(d, -1),
      ArrowRight: addDays(d, 1),
      ArrowUp: addDays(d, -7),
      ArrowDown: addDays(d, 7),
      PageUp: new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()),
      PageDown: new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()),
      Home: addDays(d, -((d.getDay() + 6) % 7)),
      End: addDays(d, 6 - ((d.getDay() + 6) % 7)),
    };
    if (map[e.key]) {
      e.preventDefault();
      moveTo(map[e.key]);
    }
  };

  const cursorIso = toISODate(cursor);
  const inView = cursor.getMonth() === view.getMonth() && cursor.getFullYear() === view.getFullYear();
  const tabbableIso = inView ? cursorIso : toISODate(first);

  return (
    <div className="calendar">
      <div className="calendar__head">
        <button type="button" className="icon-btn" disabled={!canPrev} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} aria-label="Previous month">
          <Icon name="chevron" size={18} className="flip" />
        </button>
        <h3 aria-live="polite">{monthLabel}</h3>
        <button type="button" className="icon-btn" disabled={!canNext} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} aria-label="Next month">
          <Icon name="chevron" size={18} />
        </button>
      </div>
      <div role="grid" aria-label={`Choose a date, ${monthLabel}`} ref={gridRef} className="calendar__grid">
        <div role="row" className="calendar__row">
          {weekdays.map((d) => (
            <div role="columnheader" key={d.getDay()} aria-label={new Intl.DateTimeFormat(site.currency.locale, { weekday: 'long' }).format(d)}>
              {new Intl.DateTimeFormat(site.currency.locale, { weekday: 'short' }).format(d)}
            </div>
          ))}
        </div>
        {rows.map((row, ri) => (
          <div role="row" className="calendar__row" key={ri}>
            {row.map((d, ci) => {
              if (!d) return <div role="gridcell" key={ci} className="calendar__blank" />;
              const iso = toISODate(d);
              const bookable = isBookableDate(d, today);
              const count = bookable ? availableCount(iso, duration, existing, today) : 0;
              const usable = bookable && count > 0;
              const selected = value === iso;
              return (
                <div role="gridcell" key={ci} aria-selected={usable ? selected : undefined}>
                  <button
                    type="button"
                    data-date={iso}
                    className={`calendar__day${selected ? ' is-selected' : ''}${usable ? '' : ' is-unavailable'}`}
                    tabIndex={iso === tabbableIso ? 0 : -1}
                    aria-disabled={!usable}
                    aria-pressed={selected}
                    onKeyDown={(e) => onKey(e, d)}
                    onFocus={() => setCursor(d)}
                    onClick={() => usable && onSelect(iso)}
                  >
                    <span className="calendar__num" aria-hidden="true">{d.getDate()}</span>
                    {usable && <span className="calendar__count" aria-hidden="true">{count}</span>}
                    <span className="sr-only">
                      {formatLongDate(iso)}, {usable ? `${count} time${count === 1 ? '' : 's'} available` : bookable ? 'fully booked' : 'unavailable'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="calendar__legend">Dates with a number have that many demo slots open. Weekends and the next-day cut-off are unavailable.</p>
    </div>
  );
}
