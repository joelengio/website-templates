import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReservationSettings } from '../config/types';
import { addDays, formatDateLong, formatMonthYear, parseDateKey, toDateKey } from '../lib/dates';
import { getDayInfo, hasBookableSlot } from '../lib/reservations';
import { Icon } from './Icon';

interface Props {
  value: string;
  onChange: (dateKey: string) => void;
  settings: ReservationSettings;
  now: Date;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Calendar({ value, onChange, settings, now }: Props) {
  const today = toDateKey(now);
  const last = addDays(today, settings.bookingWindowDays);
  const initial = value || today;
  const [cursor, setCursor] = useState(() => {
    const d = parseDateKey(initial);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [focusKey, setFocusKey] = useState(initial);
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);

  const weeks = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const start = new Date(cursor.y, cursor.m, 1 - first.getDay());
    const rows: string[][] = [];
    for (let w = 0; w < 6; w++) {
      const row: string[] = [];
      for (let d = 0; d < 7; d++) row.push(toDateKey(new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d)));
      rows.push(row);
    }
    // Drop a trailing week that is entirely next month
    return rows.filter((r, i) => i < 5 || r.some((k) => parseDateKey(k).getMonth() === cursor.m));
  }, [cursor]);

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusKey}"]`)?.focus();
  }, [focusKey, cursor]);

  const moveFocus = (key: string) => {
    if (key < today) key = today;
    if (key > last) key = last;
    const d = parseDateKey(key);
    if (d.getMonth() !== cursor.m || d.getFullYear() !== cursor.y) setCursor({ y: d.getFullYear(), m: d.getMonth() });
    shouldFocus.current = true;
    setFocusKey(key);
  };

  const onKeyDown = (e: React.KeyboardEvent, key: string) => {
    const map: Record<string, string | undefined> = {
      ArrowLeft: addDays(key, -1),
      ArrowRight: addDays(key, 1),
      ArrowUp: addDays(key, -7),
      ArrowDown: addDays(key, 7),
      Home: addDays(key, -parseDateKey(key).getDay()),
      End: addDays(key, 6 - parseDateKey(key).getDay()),
      PageUp: toDateKey(new Date(parseDateKey(key).getFullYear(), parseDateKey(key).getMonth() - 1, parseDateKey(key).getDate())),
      PageDown: toDateKey(new Date(parseDateKey(key).getFullYear(), parseDateKey(key).getMonth() + 1, parseDateKey(key).getDate())),
    };
    const next = map[e.key];
    if (next) {
      e.preventDefault();
      moveFocus(next);
    }
  };

  const monthStart = toDateKey(new Date(cursor.y, cursor.m, 1));
  const monthEnd = toDateKey(new Date(cursor.y, cursor.m + 1, 0));
  const focusDate = parseDateKey(focusKey);
  const rovingKey = focusDate.getMonth() === cursor.m && focusDate.getFullYear() === cursor.y ? focusKey : monthStart < today ? today : monthStart;
  const canPrev = monthStart > today;
  const canNext = monthEnd < last;
  const go = (delta: number) => setCursor(({ y, m }) => {
    const d = new Date(y, m + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  return (
    <div className="calendar">
      <div className="calendar__head">
        <button type="button" className="icon-btn" onClick={() => go(-1)} disabled={!canPrev} aria-label="Previous month">
          <Icon name="chevron-left" />
        </button>
        <h3 className="calendar__title" aria-live="polite">
          {formatMonthYear(cursor.y, cursor.m)}
        </h3>
        <button type="button" className="icon-btn" onClick={() => go(1)} disabled={!canNext} aria-label="Next month">
          <Icon name="chevron" />
        </button>
      </div>
      <div ref={gridRef} role="grid" aria-label={`Choose a dining date, ${formatMonthYear(cursor.y, cursor.m)}`} className="calendar__grid">
        <div role="row" className="calendar__row calendar__row--head">
          {WEEKDAYS.map((d) => (
            <span key={d} role="columnheader" aria-label={d} className="calendar__dow">
              {d.slice(0, 3)}
            </span>
          ))}
        </div>
        {weeks.map((row) => (
          <div role="row" className="calendar__row" key={row[0]}>
            {row.map((key) => {
              const inMonth = parseDateKey(key).getMonth() === cursor.m;
              const info = getDayInfo(key, settings, now);
              const bookable = hasBookableSlot(key, settings, now);
              const selected = key === value;
              const state = !bookable ? (info.status === 'open' ? 'no slots left today' : info.reason ?? 'unavailable') : 'available';
              if (!inMonth) return <span role="gridcell" key={key} className="calendar__cell calendar__cell--blank" />;
              return (
                <span role="gridcell" key={key} className="calendar__cell" aria-selected={selected}>
                  <button
                    type="button"
                    data-date={key}
                    className={`calendar__day${selected ? ' is-selected' : ''}${!bookable ? ' is-off' : ''}${key === today ? ' is-today' : ''}`}
                    aria-disabled={!bookable}
                    aria-pressed={selected}
                    aria-label={`${formatDateLong(key)}, ${state}${key === today ? ', today' : ''}`}
                    tabIndex={key === rovingKey ? 0 : -1}
                    onKeyDown={(e) => onKeyDown(e, key)}
                    onClick={() => {
                      setFocusKey(key);
                      if (bookable) onChange(key);
                    }}
                  >
                    <span aria-hidden="true">{parseDateKey(key).getDate()}</span>
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <p className="calendar__legend">
        <span className="legend-dot" aria-hidden="true" /> Open · <span className="legend-dot legend-dot--off" aria-hidden="true" /> Closed or unavailable. Bookings open {settings.bookingWindowDays} days ahead.
      </p>
    </div>
  );
}
