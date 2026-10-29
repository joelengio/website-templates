import { useEffect, useId, useRef, useState } from 'react';
import { plural } from '../lib/format';
import Icon from './Icon';

interface Props {
  adults: number;
  children: number;
  onChange: (adults: number, children: number) => void;
  maxAdults?: number;
  maxChildren?: number;
  maxTotal?: number;
  error?: string;
  idPrefix?: string;
}

function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const id = useId();
  return (
    <div className="stepper">
      <div>
        <p id={id} className="stepper__label">{label}</p>
        <p className="stepper__hint">{hint}</p>
      </div>
      <div className="stepper__ctrl" role="group" aria-labelledby={id}>
        <button type="button" className="icon-btn" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}><Icon name="minus" size={16} /></button>
        <output aria-live="polite" aria-label={`${label}: ${value}`}>{value}</output>
        <button type="button" className="icon-btn" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}><Icon name="plus" size={16} /></button>
      </div>
    </div>
  );
}

export default function GuestPicker({ adults, children, onChange, maxAdults = 8, maxChildren = 6, maxTotal = 10, error, idPrefix = 'guests' }: Props) {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    const el = root.current;
    if (!el || !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="guests" ref={root}>
      <button ref={btn} type="button" id={`${idPrefix}-btn`} className={`guests__btn${error ? ' has-error' : ''}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={`${uid}-pop`} onClick={() => setOpen((o) => !o)}>
        <span className="field-label">Guests</span>
        <span className="guests__value">{plural(adults, 'adult')}{children ? `, ${plural(children, 'child', 'children')}` : ''}</span>
        <Icon name="users" size={18} />
      </button>
      {error && <p className="field-error" role="alert">{error}</p>}
      {open && (
        <div id={`${uid}-pop`} className="guests__pop" role="dialog" aria-label="Choose guests">
          <Stepper label="Adults" hint="Age 13+" value={adults} min={1} max={Math.min(maxAdults, maxTotal - children)} onChange={(n) => onChange(n, children)} />
          <Stepper label="Children" hint="Ages 0–12" value={children} min={0} max={Math.min(maxChildren, maxTotal - adults)} onChange={(n) => onChange(adults, n)} />
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => { setOpen(false); btn.current?.focus(); }}>Done</button>
        </div>
      )}
    </div>
  );
}
