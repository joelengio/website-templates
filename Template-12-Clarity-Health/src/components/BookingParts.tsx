import { booking } from '../config/booking';
import type { Doctor, Service, Specialty } from '../config/types';
import { Icon } from './Icon';
import { formatDate, formatDuration, formatPrice, formatTime } from '../lib/format';
import { doctorById, serviceById, specialtyById } from '../lib/catalog';
import type { BookingRecord } from '../lib/bookings';

/** Radio card used by the specialty / doctor / service steps (native radio input underneath for keyboard + screen readers). */
export function ChoiceCard({ name, value, checked, onChange, disabled, title, meta, children }: {
  name: string; value: string; checked: boolean; onChange: (v: string) => void; disabled?: boolean; title: string; meta?: string; children?: React.ReactNode;
}) {
  const id = `${name}-${value}`;
  return (
    <label htmlFor={id} className={`choice ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <input id={id} type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange(value)} />
      <span className="choice-body">
        <span className="choice-title">{title}</span>
        {meta && <span className="choice-meta">{meta}</span>}
        {children}
      </span>
      <span className="choice-tick" aria-hidden="true"><Icon name="check" size={16} /></span>
    </label>
  );
}

export interface SummaryData {
  specialty?: Specialty;
  doctorLabel?: string;
  service?: Service;
  modeLabel?: string;
  date?: string;
  time?: string;
}

/** Plain-language summary of an appointment; used in the booking sidebar, the review step and the confirmation. */
export function SummaryList({ s, contact }: { s: SummaryData; contact?: { name: string; email: string; phone: string } }) {
  const rows: [string, string | undefined][] = [
    ['Specialty', s.specialty?.name],
    ['Doctor', s.doctorLabel],
    ['Service', s.service ? `${s.service.name} · ${formatDuration(s.service.durationMinutes)}` : undefined],
    ['Format', s.modeLabel],
    ['Date', s.date ? formatDate(s.date) : undefined],
    ['Time', s.time ? formatTime(s.time) : undefined],
    ...(booking.pricing.show && s.service ? ([[booking.pricing.label, formatPrice(s.service.price)]] as [string, string][]) : []),
    ...(contact?.name ? ([['Name', contact.name], ['E-mail', contact.email], ['Phone', contact.phone || '—']] as [string, string][]) : [])
  ];
  return (
    <dl className="summary-list">
      {rows.map(([k, v]) => (
        <div key={k} className={v ? '' : 'is-empty'}><dt>{k}</dt><dd>{v ?? 'Not chosen yet'}</dd></div>
      ))}
    </dl>
  );
}

export const recordSummary = (b: BookingRecord): SummaryData => ({
  specialty: specialtyById(b.specialtyId),
  doctorLabel: doctorLabel(doctorById(b.doctorId), b.doctorPreference === 'any'),
  service: serviceById(b.serviceId),
  modeLabel: booking.modeLabels[b.mode],
  date: b.date,
  time: b.time
});

export function doctorLabel(d: Doctor | undefined, assignedFromAny = false) {
  if (!d) return 'Doctor no longer in the demo configuration';
  return assignedFromAny ? `${d.name} (assigned — no preference)` : d.name;
}
