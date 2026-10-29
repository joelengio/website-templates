import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { reservationCopy, reservationSettings as settings } from '../config/reservations';
import { addDays, formatDateLong, formatTime, toDateKey } from '../lib/dates';
import { plural } from '../lib/format';
import { reservationStore, useReservations } from '../lib/reservationStore';
import {
  ANY_AREA,
  areaAcceptsParty,
  findNextAvailableDate,
  getAvailability,
  getDayInfo,
  type BookingInput,
  type Reservation,
} from '../lib/reservations';
import { validateEmail, validateMessage, validateName, validatePhone, type Errors } from '../lib/validation';
import { Button, ButtonLink } from './Button';
import { Calendar } from './Calendar';
import { CheckField, ErrorSummary, SelectField, TextArea, TextField } from './Field';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { DemoNotice } from './Section';

const STEPS = ['Date', 'Party & seating', 'Time', 'Your details', 'Review'] as const;

const blank = (): BookingInput => ({
  dateKey: '',
  time: '',
  party: 2,
  requestedArea: ANY_AREA,
  guest: { name: '', email: '', phone: '' },
  note: '',
  occasion: '',
});

const fromReservation = (r: Reservation): BookingInput => ({
  dateKey: r.dateKey,
  time: r.time,
  party: r.party,
  requestedArea: r.requestedArea,
  guest: { ...r.guest },
  note: r.note,
  occasion: r.occasion,
});

export const areaName = (id: string): string => settings.seatingAreas.find((a) => a.id === id)?.name ?? 'Any available area';

function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function ReservationSummary({ r, heading = true }: { r: Pick<Reservation, 'dateKey' | 'time' | 'party' | 'areaId' | 'guest' | 'note' | 'occasion'>; heading?: boolean }) {
  return (
    <dl className="summary" aria-label={heading ? 'Reservation details' : undefined}>
      <div><dt>Date</dt><dd>{formatDateLong(r.dateKey)}</dd></div>
      <div><dt>Time</dt><dd>{formatTime(r.time)}</dd></div>
      <div><dt>Party</dt><dd>{plural(r.party, 'guest')}</dd></div>
      <div><dt>Seating</dt><dd>{areaName(r.areaId)}</dd></div>
      <div><dt>Name</dt><dd>{r.guest.name}</dd></div>
      <div><dt>Email</dt><dd>{r.guest.email}</dd></div>
      <div><dt>Phone</dt><dd>{r.guest.phone}</dd></div>
      {r.occasion && <div><dt>Occasion</dt><dd>{r.occasion}</dd></div>}
      {r.note && <div><dt>Note</dt><dd>{r.note}</dd></div>}
    </dl>
  );
}

interface Props {
  editing: Reservation | null;
  onExitEdit: () => void;
  onViewReservations: () => void;
  onModify: (r: Reservation) => void;
}

export function ReservationWizard({ editing, onExitEdit, onViewReservations, onModify }: Props) {
  const now = useNow();
  const reservations = useReservations();
  const [draft, setDraft] = useState<BookingInput>(() => (editing ? fromReservation(editing) : blank()));
  const [step, setStep] = useState(editing ? 4 : 0);
  const [errors, setErrors] = useState<Errors>({});
  const [ack, setAck] = useState(false);
  const [ackError, setAckError] = useState('');
  const [result, setResult] = useState<{ reservation: Reservation; updated: boolean } | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const editingId = editing?.id;
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, result]);

  const patch = (p: Partial<BookingInput>) => setDraft((d) => ({ ...d, ...p }));

  const availability = useMemo(
    () => (draft.dateKey ? getAvailability({ dateKey: draft.dateKey, party: draft.party, requestedArea: draft.requestedArea, settings, reservations, now, excludeId: editingId }) : []),
    [draft.dateKey, draft.party, draft.requestedArea, reservations, now, editingId],
  );
  const selectedSlot = availability.find((s) => s.time === draft.time);
  const timeStillValid = !!selectedSlot && (selectedSlot.state === 'available' || selectedSlot.state === 'limited');

  // Keep a chosen time only while it is still bookable for the current date, party and seating.
  useEffect(() => {
    if (draft.time && !timeStillValid) setDraft((d) => (d.time ? { ...d, time: '' } : d));
  }, [draft.time, timeStillValid]);

  const day = draft.dateKey ? getDayInfo(draft.dateKey, settings, now) : null;
  const maxDate = addDays(toDateKey(now), settings.bookingWindowDays);

  const setParty = (n: number) => {
    const party = Math.max(settings.minPartySize, Math.min(settings.maxPartySize, n));
    const area = settings.seatingAreas.find((a) => a.id === draft.requestedArea);
    patch({ party, requestedArea: area && !areaAcceptsParty(area, party) ? ANY_AREA : draft.requestedArea });
  };

  const validateStep = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0 && !draft.dateKey) e.date = 'Please choose a dining date.';
    if (s === 1) {
      if (draft.party < settings.minPartySize || draft.party > settings.maxPartySize) e.party = `Choose a party size between ${settings.minPartySize} and ${settings.maxPartySize}.`;
      const area = settings.seatingAreas.find((a) => a.id === draft.requestedArea);
      if (area && !areaAcceptsParty(area, draft.party)) e.area = `${area.name} seats parties of ${area.minParty}–${area.maxParty}.`;
    }
    if (s === 2 && !timeStillValid) e.time = draft.time ? 'That time is no longer available. Please choose another.' : 'Please choose a time to continue.';
    if (s === 3) {
      const n = validateName(draft.guest.name);
      const m = validateEmail(draft.guest.email);
      const p = validatePhone(draft.guest.phone, true);
      const note = validateMessage(draft.note, { required: false, min: 1, max: 300 });
      if (n) e.name = n;
      if (m) e.email = m;
      if (p) e.phone = p;
      if (note) e.note = note;
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => Math.min(4, s + 1));
    else requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-error-summary]')?.focus());
  };

  const confirm = () => {
    if (!ack) {
      setAckError('Please confirm you understand this is a simulated reservation.');
      return;
    }
    setAckError('');
    const res = editingId ? reservationStore.update(editingId, draft, new Date()) : reservationStore.create(draft, new Date());
    if (!res.ok) {
      setErrors(res.errors);
      const target = res.errors.time || res.errors.date || res.errors.area || res.errors.party ? (res.errors.date ? 0 : res.errors.party || res.errors.area ? 1 : 2) : res.errors.name || res.errors.email || res.errors.phone || res.errors.note ? 3 : 4;
      setStep(target);
      return;
    }
    setErrors({});
    setResult({ reservation: res.reservation, updated: !!editingId });
  };

  const reset = () => {
    setDraft(blank());
    setStep(0);
    setErrors({});
    setAck(false);
    setResult(null);
    onExitEdit();
  };

  /* ---------- Confirmation view ---------- */
  if (result) {
    const r = result.reservation;
    return (
      <div className="wizard-result">
        <div className="success-panel" role="status" aria-live="polite">
          <Icon name="check" size={30} />
          <h2 ref={headingRef} tabIndex={-1}>{result.updated ? 'Demo reservation updated' : 'Demo reservation saved'}</h2>
          <p>
            Reference <strong>{r.code}</strong>. This is a <strong>simulated reservation saved only in this browser</strong>. It was not sent to a restaurant or booking platform, and no table is being held.
          </p>
        </div>
        <ReservationSummary r={r} />
        {r.status === 'confirmed' && (
          <div className="wizard-result__actions">
            <Button variant="ghost" icon="edit" onClick={() => { onModify(r); }}>Modify</Button>
            <Button variant="ghost" icon="trash" onClick={() => setCancelOpen(true)}>Cancel reservation</Button>
            <Button variant="primary" onClick={onViewReservations}>View my reservations</Button>
            <Button variant="text" onClick={reset}>Book another table</Button>
          </div>
        )}
        {r.status === 'cancelled' && (
          <div className="wizard-result__actions">
            <p role="status">Reservation {r.code} was cancelled (demo).</p>
            <Button variant="primary" onClick={reset}>Book another table</Button>
          </div>
        )}
        <CancelDialog open={cancelOpen} reservation={r} onClose={() => setCancelOpen(false)} onCancelled={(c) => { setResult({ reservation: c, updated: false }); setCancelOpen(false); }} />
      </div>
    );
  }

  const nextSuggestion = draft.dateKey && step === 2 && availability.length > 0 && !availability.some((s) => s.state === 'available' || s.state === 'limited') && !availability.every((s) => s.state === 'unsuitable')
    ? findNextAvailableDate(draft.dateKey, { party: draft.party, requestedArea: draft.requestedArea, settings, reservations, now, excludeId: editingId })
    : undefined;
  const areaForParty = settings.seatingAreas.find((a) => a.id === draft.requestedArea);

  return (
    <div className="wizard">
      <DemoNotice>{reservationCopy.banner}</DemoNotice>
      {editing && (
        <p className="wizard__editing" role="status">
          <Icon name="edit" size={16} /> Modifying reservation <strong>{editing.code}</strong>.{' '}
          <button type="button" className="link-btn" onClick={reset}>Cancel changes</button>
        </p>
      )}
      <ol className="steps" aria-label="Reservation progress">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
            <button type="button" disabled={i > step} onClick={() => { setErrors({}); setStep(i); }}>
              <span className="steps__num" aria-hidden="true">{i < step ? <Icon name="check" size={14} /> : i + 1}</span>
              <span className="steps__label">{label}</span>
              {i < step && <span className="visually-hidden"> (completed, go back)</span>}
            </button>
          </li>
        ))}
      </ol>

      <div className="wizard__layout">
        <section className="wizard__panel" aria-labelledby="wizard-heading">
          <h2 id="wizard-heading" ref={headingRef} tabIndex={-1} className="wizard__heading">
            <span className="wizard__stepno">Step {step + 1} of {STEPS.length}</span>
            {['Choose your dining date', 'Party size & seating preference', 'Choose a time', 'Your contact details', 'Review your reservation'][step]}
          </h2>
          <ErrorSummary errors={errors} />

          {step === 0 && (
            <div>
              <Calendar value={draft.dateKey} onChange={(k) => { patch({ dateKey: k, time: '' }); setErrors({}); }} settings={settings} now={now} />
              {day && day.status === 'open' && (
                <p className="wizard__hint" role="status">
                  Selected: <strong>{formatDateLong(draft.dateKey)}</strong>. Service: {day.services.map((s) => `${s.label} ${formatTime(s.open)}–${formatTime(s.lastSeating)} (last seating)`).join(' · ')}.
                </p>
              )}
              <p className="wizard__hint">Bookable until {formatDateLong(maxDate)}.</p>
            </div>
          )}

          {step === 1 && (
            <div className="wizard__stack">
              <fieldset className="fieldset">
                <legend>Party size</legend>
                <div className="party" role="group" aria-label="Party size">
                  <button type="button" className="icon-btn" onClick={() => setParty(draft.party - 1)} disabled={draft.party <= settings.minPartySize} aria-label="Decrease party size">
                    <Icon name="minus" />
                  </button>
                  <output className="party__value" aria-live="polite">{plural(draft.party, 'guest')}</output>
                  <button type="button" className="icon-btn" onClick={() => setParty(draft.party + 1)} disabled={draft.party >= settings.maxPartySize} aria-label="Increase party size">
                    <Icon name="plus" />
                  </button>
                </div>
                <p className="field__hint">Online bookings: {settings.minPartySize}–{settings.maxPartySize} guests. {reservationCopy.largePartyNote} <Link to="/private-dining#inquiry">Private dining enquiry</Link></p>
              </fieldset>
              <fieldset className="fieldset">
                <legend>Seating preference</legend>
                <div className="choice-grid">
                  {[{ id: ANY_AREA, name: 'No preference', description: 'We’ll place you wherever there is room.', min: settings.minPartySize, max: settings.maxPartySize }, ...settings.seatingAreas.map((a) => ({ id: a.id, name: a.name, description: a.description, min: a.minParty, max: a.maxParty }))].map((a) => {
                    const fits = a.id === ANY_AREA || (draft.party >= a.min && draft.party <= a.max);
                    return (
                      <label key={a.id} className={`choice${draft.requestedArea === a.id ? ' is-selected' : ''}${fits ? '' : ' is-disabled'}`}>
                        <input type="radio" name="area" value={a.id} checked={draft.requestedArea === a.id} disabled={!fits} onChange={() => patch({ requestedArea: a.id })} />
                        <span className="choice__name">{a.name}</span>
                        <span className="choice__desc">{a.description}</span>
                        <span className="choice__meta">{fits ? (a.id === ANY_AREA ? 'Any area' : `Seats parties of ${a.min}–${a.max}`) : `Seats ${a.min}–${a.max} only, not available for ${plural(draft.party, 'guest')}`}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="wizard__hint" aria-live="polite" role="status">
                {formatDateLong(draft.dateKey)} · {plural(draft.party, 'guest')} · {areaName(draft.requestedArea)}. Times shown are fictional demo availability.
              </p>
              {availability.length === 0 && <p className="empty">We’re not open on this date{day?.reason ? ` (${day.reason})` : ''}. Please go back and choose another date.</p>}
              {availability.length > 0 && availability.every((s) => s.state === 'unsuitable') && (
                <p className="empty">{areaForParty ? `${areaForParty.name} seats parties of ${areaForParty.minParty}–${areaForParty.maxParty}.` : 'No seating area suits this party size.'} Go back to change your party size or seating.</p>
              )}
              {availability.length > 0 && availability.every((s) => s.state === 'too_soon') && <p className="empty">No more bookable times today. Please choose another date.</p>}
              {availability.length > 0 && !availability.every((s) => ['unsuitable', 'too_soon'].includes(s.state)) && (
                <>
                  {[...new Set(availability.map((s) => s.service))].map((svc) => (
                    <div key={svc} className="slots-group">
                      <h3 className="slots-group__title">{svc}</h3>
                      <ul className="slots" aria-label={`${svc} times`}>
                        {availability.filter((s) => s.service === svc).map((s) => {
                          const ok = s.state === 'available' || s.state === 'limited';
                          const selected = draft.time === s.time;
                          return (
                            <li key={s.time}>
                              <button
                                type="button"
                                className={`slot slot--${s.state}${selected ? ' is-selected' : ''}`}
                                disabled={!ok}
                                aria-pressed={selected}
                                onClick={() => { patch({ time: s.time }); setErrors({}); }}
                              >
                                <span className="slot__time">{formatTime(s.time)}</span>
                                <span className="slot__note">{s.state === 'limited' ? 'Few tables left' : s.state === 'full' ? 'Fully booked' : s.state === 'too_soon' ? 'Passed' : s.state === 'unsuitable' ? 'N/A' : areaName(s.areaId ?? '')}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  {!availability.some((s) => s.state === 'available' || s.state === 'limited') && (
                    <div className="empty">
                      <p>Every time on this date is fully booked in the demo data.</p>
                      {nextSuggestion && (
                        <Button variant="ghost" onClick={() => { patch({ dateKey: nextSuggestion, time: '' }); }}>Try {formatDateLong(nextSuggestion)}</Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="form form--grid">
              <TextField label="Full name" required autoComplete="name" value={draft.guest.name} error={errors.name} onChange={(e) => patch({ guest: { ...draft.guest, name: e.target.value } })} />
              <TextField label="Email" required type="email" inputMode="email" autoComplete="email" value={draft.guest.email} error={errors.email} onChange={(e) => patch({ guest: { ...draft.guest, email: e.target.value } })} />
              <TextField label="Phone" required type="tel" inputMode="tel" autoComplete="tel" value={draft.guest.phone} error={errors.phone} onChange={(e) => patch({ guest: { ...draft.guest, phone: e.target.value } })} />
              <SelectField label="Occasion" value={draft.occasion} onChange={(e) => patch({ occasion: e.target.value })}>
                <option value="">No special occasion</option>
                {settings.occasions.map((o) => <option key={o}>{o}</option>)}
              </SelectField>
              <div className="form__full">
                <TextArea label="General note" rows={3} maxLength={300} value={draft.note} error={errors.note} hint={`${reservationCopy.notePrompt} (${draft.note.length}/300)`} onChange={(e) => patch({ note: e.target.value })} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="wizard__stack">
              <ReservationSummary r={{ ...draft, areaId: selectedSlot?.areaId ?? draft.requestedArea }} />
              <p className="wizard__hint"><Icon name="info" size={16} /> {reservationCopy.storageNote}</p>
              <CheckField id="ack" checked={ack} onChange={(v) => { setAck(v); if (v) setAckError(''); }} error={ackError} label="I understand this is a simulated reservation: it is not sent to the restaurant and no table is held." />
            </div>
          )}

          <div className="wizard__nav">
            {step > 0 && <Button variant="ghost" icon="arrow-left" onClick={() => { setErrors({}); setStep((s) => s - 1); }}>Back</Button>}
            <span className="wizard__spacer" />
            {step < 4 && <Button icon="arrow" onClick={next} disabled={(step === 0 && !draft.dateKey) || (step === 2 && !draft.time)}>Continue</Button>}
            {step === 4 && <Button icon="check" size="lg" onClick={confirm}>{editing ? 'Save changes (demo)' : 'Confirm demo reservation'}</Button>}
          </div>
        </section>

        <aside className="wizard__aside" aria-label="Your selection">
          <h3>Your selection</h3>
          <dl className="summary summary--compact">
            <div><dt>Date</dt><dd>{draft.dateKey ? formatDateLong(draft.dateKey) : 'Not chosen'}</dd></div>
            <div><dt>Party</dt><dd>{plural(draft.party, 'guest')}</dd></div>
            <div><dt>Seating</dt><dd>{areaName(draft.requestedArea)}</dd></div>
            <div><dt>Time</dt><dd>{draft.time ? formatTime(draft.time) : 'Not chosen'}</dd></div>
          </dl>
          <p className="aside__demo">Simulated booking: stored in this browser only.</p>
          <Link to="/reserve/manage" className="aside__link" onClick={(e) => { e.preventDefault(); onViewReservations(); }}>My reservations</Link>
        </aside>
      </div>
    </div>
  );
}

export function CancelDialog({ open, reservation, onClose, onCancelled }: { open: boolean; reservation: Reservation; onClose: () => void; onCancelled: (r: Reservation) => void }) {
  const [error, setError] = useState('');
  return (
    <Modal open={open} onClose={onClose} title="Cancel this reservation?" size="sm">
      <p>
        Cancel demo reservation <strong>{reservation.code}</strong> for {formatDateLong(reservation.dateKey)} at {formatTime(reservation.time)}? The seats become available again in the demo.
      </p>
      {error && <p className="field__error" role="alert">{error}</p>}
      <div className="modal__actions">
        <Button variant="ghost" onClick={onClose} data-autofocus>Keep reservation</Button>
        <Button
          variant="primary"
          icon="trash"
          onClick={() => {
            const res = reservationStore.cancel(reservation.id);
            if (res.ok) onCancelled(res.reservation);
            else setError(res.errors.form ?? 'Could not cancel.');
          }}
        >
          Yes, cancel it
        </Button>
      </div>
    </Modal>
  );
}

export function ManageReservations({ onModify, onBook }: { onModify: (r: Reservation) => void; onBook: () => void }) {
  const list = useReservations();
  const today = toDateKey(new Date());
  const [target, setTarget] = useState<Reservation | null>(null);
  const [notice, setNotice] = useState('');
  const upcoming = list.filter((r) => r.status === 'confirmed' && r.dateKey >= today).sort((a, b) => (a.dateKey + a.time).localeCompare(b.dateKey + b.time));
  const history = list.filter((r) => !(r.status === 'confirmed' && r.dateKey >= today)).sort((a, b) => (b.dateKey + b.time).localeCompare(a.dateKey + a.time));

  return (
    <div className="manage">
      <DemoNotice>{reservationCopy.banner} {reservationCopy.storageNote}</DemoNotice>
      <p className="visually-hidden" role="status" aria-live="polite">{notice}</p>
      <h2 className="manage__title">Upcoming reservations</h2>
      {upcoming.length === 0 && (
        <div className="empty">
          <p>You have no upcoming demo reservations.</p>
          <ButtonLink to="/reserve" variant="primary" icon="arrow">Reserve a table</ButtonLink>
        </div>
      )}
      <ul className="res-list">
        {upcoming.map((r) => (
          <li key={r.id} className="res-card">
            <div className="res-card__head">
              <span className="res-card__code">{r.code}</span>
              <span className="tag tag--ok">Confirmed (demo)</span>
            </div>
            <ReservationSummary r={r} heading={false} />
            <div className="res-card__actions">
              <Button variant="ghost" size="sm" icon="edit" onClick={() => onModify(r)} aria-label={`Modify reservation ${r.code}`}>Modify</Button>
              <Button variant="ghost" size="sm" icon="trash" onClick={() => setTarget(r)} aria-label={`Cancel reservation ${r.code}`}>Cancel</Button>
            </div>
          </li>
        ))}
      </ul>
      {history.length > 0 && (
        <>
          <h2 className="manage__title">Past &amp; cancelled</h2>
          <ul className="res-list res-list--history">
            {history.map((r) => (
              <li key={r.id} className="res-card is-muted">
                <div className="res-card__head">
                  <span className="res-card__code">{r.code}</span>
                  <span className={`tag ${r.status === 'cancelled' ? 'tag--off' : ''}`}>{r.status === 'cancelled' ? 'Cancelled' : 'Past'}</span>
                </div>
                <ReservationSummary r={r} heading={false} />
                <div className="res-card__actions">
                  <Button variant="text" size="sm" onClick={() => { reservationStore.remove(r.id); setNotice(`Removed ${r.code} from this list.`); }} aria-label={`Remove record ${r.code}`}>Remove record</Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="manage__foot">
        <Button variant="primary" onClick={onBook}>Book a new table</Button>
      </div>
      {target && (
        <CancelDialog
          open
          reservation={target}
          onClose={() => setTarget(null)}
          onCancelled={(c) => { setNotice(`Reservation ${c.code} cancelled.`); setTarget(null); }}
        />
      )}
    </div>
  );
}
