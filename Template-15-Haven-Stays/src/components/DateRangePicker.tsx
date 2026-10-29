import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { booking } from '../config/booking';
import { addDays, addMonths, diffDays, formatDate, monthGrid, startOfMonth } from '../lib/dates';
import { requiredMinNights } from '../lib/pricing';
import { today } from '../lib/stay';
import { useMedia } from '../hooks/useMedia';
import Icon from './Icon';

interface Props {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  error?: string;
  idPrefix?: string;
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const long = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } as const;

/** Responsive range calendar: one month on phones, two on wider screens, fully keyboard operable. */
export default function DateRangePicker({ checkIn, checkOut, onChange, error, idPrefix = 'dates' }: Props) {
  const uid = useId();
  const t = today();
  const maxDate = addDays(t, booking.maxAdvanceDays);
  const two = useMedia('(min-width: 760px)');
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [view, setView] = useState(startOfMonth(checkIn || t));
  const [focusDate, setFocusDate] = useState(checkIn || t);
  const [hover, setHover] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const checkInBtn = useRef<HTMLButtonElement>(null);
  const checkOutBtn = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef(false);

  const close = useCallback((restore: boolean) => {
    setOpen(false);
    setHover('');
    if (restore) (phase === 'out' && checkOut ? checkOutBtn : checkInBtn).current?.focus();
  }, [phase, checkOut]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open && pendingFocus.current) {
      pendingFocus.current = false;
      root.current?.querySelector<HTMLButtonElement>(`[data-date="${focusDate}"]`)?.focus();
    }
  });

  const openAt = (p: 'in' | 'out') => {
    if (open && phase === p) return setOpen(false);
    const base = p === 'out' && checkOut ? checkOut : checkIn || t;
    setPhase(p);
    setView(startOfMonth(base));
    setFocusDate(base < t ? t : base);
    setOpen(true);
    pendingFocus.current = true;
  };

  const minOut = checkIn ? addDays(checkIn, requiredMinNights(checkIn, checkIn)) : '';
  const maxOut = checkIn ? addDays(checkIn, booking.maxNights) : '';

  const disabled = (d: string) => {
    if (d < t || d > maxDate) return true;
    if (phase === 'out' && checkIn && d > checkIn) return d < minOut || d > maxOut;
    return false;
  };

  const pick = (d: string) => {
    if (disabled(d)) return;
    if (phase === 'in' || !checkIn || d <= checkIn) {
      onChange(d, '');
      setPhase('out');
      setFocusDate(addDays(d, requiredMinNights(d, d)));
      pendingFocus.current = true;
    } else {
      onChange(checkIn, d);
      setOpen(false);
      setHover('');
      checkOutBtn.current?.focus();
    }
  };

  const move = (d: string, delta: number) => {
    let n = addDays(d, delta);
    if (n < t) n = t;
    if (n > maxDate) n = maxDate;
    setFocusDate(n);
    const first = view;
    const last = addMonths(view, two ? 1 : 0);
    if (n < first) setView(startOfMonth(n));
    else if (startOfMonth(n) > last) setView(addMonths(startOfMonth(n), two ? -1 : 0));
    pendingFocus.current = true;
  };

  const onKey = (e: React.KeyboardEvent, d: string) => {
    const k = e.key;
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (k in map) {
      e.preventDefault();
      move(d, map[k]);
    } else if (k === 'Home' || k === 'End') {
      e.preventDefault();
      const wd = (new Date(`${d}T00:00:00Z`).getUTCDay() + 6) % 7;
      move(d, k === 'Home' ? -wd : 6 - wd);
    } else if (k === 'PageUp' || k === 'PageDown') {
      e.preventDefault();
      const delta = k === 'PageUp' ? -1 : 1;
      const [y, mo, dd] = d.split('-').map(Number);
      const dim = new Date(Date.UTC(y, mo + delta, 0)).getUTCDate();
      const target = addMonths(startOfMonth(d), delta).slice(0, 8) + String(Math.min(dd, dim)).padStart(2, '0');
      move(d, diffDays(d, target));
    } else if (k === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
    }
  };

  const rangeEnd = checkOut || (phase === 'out' && hover && checkIn && hover > checkIn ? hover : '');
  const months = [view, ...(two ? [addMonths(view, 1)] : [])];
  const nights = checkIn && checkOut ? diffDays(checkIn, checkOut) : 0;
  const canPrev = view > startOfMonth(t);
  const canNext = addMonths(view, two ? 1 : 0) < startOfMonth(maxDate);

  return (
    <div className="dates" ref={root}>
      <div className={`dates__fields${error ? ' has-error' : ''}`} role="group" aria-label="Stay dates">
        <button ref={checkInBtn} type="button" id={`${idPrefix}-in`} className="dates__btn" aria-haspopup="dialog" aria-expanded={open && phase === 'in'} aria-controls={`${uid}-cal`} onClick={() => openAt('in')}>
          <span className="field-label">Check-in</span>
          <span className="dates__value">{checkIn ? formatDate(checkIn, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Add date'}</span>
          <Icon name="calendar" size={18} />
        </button>
        <button ref={checkOutBtn} type="button" id={`${idPrefix}-out`} className="dates__btn" aria-haspopup="dialog" aria-expanded={open && phase === 'out'} aria-controls={`${uid}-cal`} onClick={() => openAt('out')}>
          <span className="field-label">Check-out</span>
          <span className="dates__value">{checkOut ? formatDate(checkOut, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Add date'}</span>
          <Icon name="calendar" size={18} />
        </button>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      {open && (
        <div id={`${uid}-cal`} className="calendar" role="dialog" aria-label={phase === 'in' ? 'Choose check-in date' : 'Choose check-out date'}>
          <div className="calendar__nav">
            <button type="button" className="icon-btn" onClick={() => setView(addMonths(view, -1))} disabled={!canPrev} aria-label="Previous month"><Icon name="chevron-left" /></button>
            <p className="calendar__hint" aria-live="polite">{phase === 'in' ? 'Select your check-in date' : `Select check-out · min ${requiredMinNights(checkIn || t, '')} night${requiredMinNights(checkIn || t, '') > 1 ? 's' : ''}`}</p>
            <button type="button" className="icon-btn" onClick={() => setView(addMonths(view, 1))} disabled={!canNext} aria-label="Next month"><Icon name="chevron-right" /></button>
          </div>
          <div className="calendar__months">
            {months.map((m) => (
              <div key={m} className="month">
                <h3 className="month__title" id={`${uid}-${m}`}>{formatDate(m, { month: 'long', year: 'numeric' })}</h3>
                <table role="grid" aria-labelledby={`${uid}-${m}`}>
                  <thead>
                    <tr>{weekdays.map((w) => <th key={w} scope="col" abbr={w}><span aria-hidden="true">{w.slice(0, 2)}</span><span className="sr-only">{w}</span></th>)}</tr>
                  </thead>
                  <tbody>
                    {monthGrid(m).map((week, i) => (
                      <tr key={i}>
                        {week.map((d, j) => {
                          if (!d) return <td key={j} />;
                          const dis = disabled(d);
                          const isIn = d === checkIn;
                          const isOut = d === checkOut;
                          const inRange = !!checkIn && !!rangeEnd && d > checkIn && d < rangeEnd;
                          return (
                            <td key={d} className={`${inRange ? 'in-range ' : ''}${isIn && rangeEnd ? 'range-start ' : ''}${d === rangeEnd ? 'range-end' : ''}`}>
                              <button
                                type="button"
                                data-date={d}
                                className={`day${isIn || isOut ? ' is-selected' : ''}${d === t ? ' is-today' : ''}`}
                                tabIndex={d === focusDate ? 0 : -1}
                                disabled={dis}
                                aria-label={`${formatDate(d, long)}${isIn ? ', check-in' : ''}${isOut ? ', check-out' : ''}${dis ? ', unavailable' : ''}`}
                                aria-pressed={isIn || isOut}
                                onClick={() => pick(d)}
                                onMouseEnter={() => setHover(d)}
                                onFocus={() => setFocusDate(d)}
                                onKeyDown={(e) => onKey(e, d)}
                              >
                                {Number(d.slice(8))}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="calendar__foot">
            <p>{nights ? `${nights} night${nights > 1 ? 's' : ''} · ${formatDate(checkIn, { day: 'numeric', month: 'short' })} → ${formatDate(checkOut, { day: 'numeric', month: 'short' })}` : 'Past dates and dates beyond the booking window are disabled.'}</p>
            <div>
              {(checkIn || checkOut) && <button type="button" className="link-btn" onClick={() => { onChange('', ''); setPhase('in'); }}>Clear dates</button>}
              <button type="button" className="link-btn" onClick={() => close(true)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
