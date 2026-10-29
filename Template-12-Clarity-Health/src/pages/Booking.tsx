import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { booking as cfg } from '../config/booking';
import { site } from '../config/site';
import { specialties } from '../config/specialties';
import type { Doctor } from '../config/types';
import { Calendar } from '../components/Calendar';
import { ChoiceCard, doctorLabel, recordSummary, SummaryList, type SummaryData } from '../components/BookingParts';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';
import { Button, describedBy, Field, LinkButton, Notice } from '../components/ui';
import { bookingWindow, getSlots, hasAvailability } from '../lib/availability';
import { addBooking, storageUnavailable, updateBooking, useBookings, type BookingRecord } from '../lib/bookings';
import {
  buildBooking, buildReschedule, emptyDraft, firstIncomplete, poolFor, reschedulePool, sanitizeDraft, selectedService, stepComplete, STEPS, type Draft, type StepIndex
} from '../lib/booking-flow';
import { availableModes, bookableServices, doctorById, doctorsOfSpecialty, specialtyById } from '../lib/catalog';
import { formatDate, formatDuration, formatPrice, formatTime } from '../lib/format';
import { validateContactDetails, type ContactDetails, type Errors } from '../lib/validation';

const CONSENT = 'I understand this is a demonstration: no real appointment is made, and the details I enter are saved only in this browser.';

export default function Booking() {
  const [params] = useSearchParams();
  const rescheduleId = params.get('reschedule');
  const all = useBookings();
  const target = rescheduleId ? all.find((b) => b.id === rescheduleId) : undefined;
  if (rescheduleId) return target && target.status === 'confirmed' ? <RescheduleFlow key={target.id} rec={target} /> : <RescheduleMissing found={!!target} />;
  return <NewBookingFlow />;
}

function RescheduleMissing({ found }: { found: boolean }) {
  return (
    <section className="section">
      <Seo title="Reschedule demo appointment" noindex />
      <div className="container narrow">
        <h1>{found ? 'That appointment was cancelled' : 'We couldn’t find that demo appointment'}</h1>
        <p className="lead">Demo appointments are stored only in the browser they were made in. {found ? 'A cancelled appointment cannot be rescheduled.' : 'It may have been deleted, or created in a different browser.'}</p>
        <div className="btn-row">
          <LinkButton to="/appointments">My demo appointments</LinkButton>
          <LinkButton to="/book" variant="secondary">Start a new booking</LinkButton>
        </div>
      </div>
    </section>
  );
}

function BookingIntro({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="booking-hero">
      <div className="container">
        <p className="eyebrow">Demonstration booking</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <Notice title="This is a demonstration — not a real appointment">{site.notices.booking} {site.notices.emergency}</Notice>
      </div>
    </header>
  );
}

/* ---------------- calendar + time slots (shared by new booking and reschedule) ---------------- */
function DateTimePicker({ pool, durationMinutes, date, time, onDate, onTime, ignoreId }: {
  pool: Doctor[]; durationMinutes: number; date: string; time: string; onDate: (iso: string) => void; onTime: (t: string) => void; ignoreId?: string;
}) {
  const all = useBookings();
  const win = bookingWindow();
  const q = (iso: string) => ({ iso, durationMinutes, pool, bookings: all, ignoreBookingId: ignoreId });
  const slots = date ? getSlots(q(date)) : [];
  const morning = slots.filter((s) => s.time < '12:00');
  const afternoon = slots.filter((s) => s.time >= '12:00');
  const group = (label: string, list: typeof slots) =>
    list.length > 0 && (
      <div className="slot-group">
        <h4>{label}</h4>
        <div className="slots">
          {list.map((s) => (
            <label key={s.time} className={`slot ${time === s.time ? 'is-checked' : ''} ${s.available ? '' : 'is-disabled'}`}>
              <input type="radio" name="slot" value={s.time} checked={time === s.time} disabled={!s.available} onChange={() => onTime(s.time)} />
              <span>{formatTime(s.time)}</span>
              {!s.available && <span className="sr-only"> (unavailable)</span>}
            </label>
          ))}
        </div>
      </div>
    );
  return (
    <div className="datetime">
      <div>
        <Calendar value={date} onChange={onDate} minISO={win.startISO} maxISO={win.endISO} isAvailable={(iso) => hasAvailability(q(iso))} />
        <p className="muted small">Availability is generated for the demonstration. Times use the fictional clinic’s local time. Appointments last {formatDuration(durationMinutes)}.</p>
      </div>
      <fieldset className="slot-picker" disabled={!date}>
        <legend>{date ? `Times on ${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}` : 'Choose a date to see times'}</legend>
        {date && slots.length === 0 && <p>No times are available on this date. Please choose another day.</p>}
        {group('Morning', morning)}
        {group('Afternoon', afternoon)}
        {!date && <p className="muted">Pick an available date on the calendar first.</p>}
      </fieldset>
    </div>
  );
}

/* ---------------- new booking ---------------- */
function draftFromParams(params: URLSearchParams): Draft {
  const specialtyId = params.get('specialty') ?? '';
  const service = params.get('service') ?? '';
  // A service shortcut without a doctor choice defaults to "no preference".
  const doctorId = params.get('doctor') ?? (specialtyId && service ? 'any' : '');
  return sanitizeDraft({ ...emptyDraft, specialtyId, doctorId, serviceId: service });
}

function NewBookingFlow() {
  const [params] = useSearchParams();
  const all = useBookings();
  const [draft, setDraft] = useState<Draft>(() => draftFromParams(params));
  const [step, setStep] = useState<StepIndex>(() => firstIncomplete(draftFromParams(params)));
  const [stepError, setStepError] = useState('');
  const [contactErrors, setContactErrors] = useState<Errors<keyof ContactDetails | 'consent'>>({});
  const [confirmed, setConfirmed] = useState<BookingRecord | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, confirmed]);

  const update = (patch: Partial<Draft>) => {
    setStepError('');
    setDraft((d) => {
      const upstream = 'specialtyId' in patch || 'doctorId' in patch || 'serviceId' in patch;
      return sanitizeDraft({ ...d, ...patch, ...(upstream ? { date: '', time: '' } : {}) });
    });
  };

  const svc = selectedService(draft);
  const pool = poolFor(draft);
  const doc = draft.doctorId && draft.doctorId !== 'any' ? doctorById(draft.doctorId) : undefined;
  const summary: SummaryData = {
    specialty: specialtyById(draft.specialtyId),
    doctorLabel: draft.doctorId === 'any' ? 'No preference (first available)' : doc?.name,
    service: svc,
    modeLabel: draft.mode ? cfg.modeLabels[draft.mode] : undefined,
    date: draft.date || undefined,
    time: draft.time || undefined
  };

  const messages = [
    'Please choose a specialty to continue.',
    'Please choose a doctor, or “No preference”.',
    'Please choose a service.',
    'Please select a date and a time.',
    '',
    ''
  ];

  const next = () => {
    if (step < 4 && !stepComplete(step, draft)) return setStepError(messages[step]);
    if (step === 4) {
      const err: Errors<keyof ContactDetails | 'consent'> = validateContactDetails(draft.contact, cfg.requirePhone);
      if (!draft.consent) err.consent = 'Please confirm that you understand this is a demonstration.';
      setContactErrors(err);
      if (Object.keys(err).length) {
        const key = Object.keys(err)[0];
        document.getElementById(key === 'consent' ? 'bk-consent' : `bk-${key}`)?.focus();
        return;
      }
    }
    setStepError('');
    setStep((s) => Math.min(5, s + 1) as StepIndex);
  };
  const back = () => {
    setStepError('');
    setStep((s) => Math.max(0, s - 1) as StepIndex);
  };

  const confirm = () => {
    const res = buildBooking(draft);
    if (!res.ok) {
      setStepError(res.error);
      if (res.step !== undefined) {
        if (res.step === 3 && res.error.startsWith('Sorry')) update({ time: '' });
        setStep(res.step);
      }
      return;
    }
    setConfirmed(addBooking(res.data));
  };

  if (confirmed) return <Confirmation rec={confirmed} headingRef={headingRef} onAnother={() => { setConfirmed(null); setDraft(emptyDraft); setStep(0); }} />;

  const goTo = (i: StepIndex) => {
    setStepError('');
    setStep(i);
  };
  const specialtyDoctors = draft.specialtyId ? doctorsOfSpecialty(draft.specialtyId) : [];
  const services = draft.specialtyId && draft.doctorId ? bookableServices(draft.specialtyId, draft.doctorId === 'any' ? undefined : draft.doctorId) : [];
  const modes = svc ? availableModes(pool, svc) : [];

  return (
    <>
      <Seo title="Book a demo appointment" description="Step through the complete CLARITY HEALTH demonstration booking: specialty, doctor, service, date, time, details and review. Nothing is sent and no real appointment is made." noindex />
      <BookingIntro title="Book a demo appointment" lead="Six short steps. Everything stays in this browser — no real clinic is contacted." />
      <section className="section-tight booking-section">
        <div className="container booking-layout">
          <div className="booking-main">
            <ol className="stepper" aria-label="Booking progress">
              {STEPS.map((label, i) => {
                const done = i < step && stepComplete(i as StepIndex, draft);
                const current = i === step;
                return (
                  <li key={label} className={`${current ? 'is-current' : ''} ${done ? 'is-done' : ''}`} aria-current={current ? 'step' : undefined}>
                    {done ? (
                      <button type="button" onClick={() => goTo(i as StepIndex)} aria-label={`Step ${i + 1}: ${label} (completed) — edit`}>
                        <span className="step-dot"><Icon name="check" size={14} /></span><span className="step-label">{label}</span>
                      </button>
                    ) : (
                      <span><span className="step-dot">{i + 1}</span><span className="step-label">{label}</span></span>
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="step-panel" aria-live="off">
              <h2 ref={headingRef} tabIndex={-1} className="step-title">Step {step + 1} of {STEPS.length}: {['Choose a specialty', 'Choose a doctor', 'Choose a service', 'Choose a date and time', 'Your contact details', 'Review and confirm'][step]}</h2>

              {step === 0 && (
                <fieldset className="choice-group">
                  <legend className="sr-only">Specialty</legend>
                  <div className="choice-grid">
                    {specialties.map((s) => (
                      <ChoiceCard key={s.id} name="specialty" value={s.id} checked={draft.specialtyId === s.id} onChange={(v) => update({ specialtyId: v })} title={s.name} meta={s.category} />
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <fieldset className="choice-group">
                  <legend className="sr-only">Doctor</legend>
                  <div className="choice-grid">
                    <ChoiceCard name="doctor" value="any" checked={draft.doctorId === 'any'} onChange={(v) => update({ doctorId: v })} title="No preference" meta="The first available doctor is assigned" />
                    {specialtyDoctors.map((d) => (
                      <ChoiceCard key={d.id} name="doctor" value={d.id} checked={draft.doctorId === d.id} onChange={(v) => update({ doctorId: v })} disabled={!d.acceptingNewPatients}
                        title={d.name} meta={`${d.title} · ${d.languages.join(', ')}${d.acceptingNewPatients ? '' : ' · Not accepting new patients'}`} />
                    ))}
                  </div>
                  <p className="muted small">Fictional profiles. {site.notices.doctor}</p>
                </fieldset>
              )}

              {step === 2 && (
                <>
                  {services.length === 0 ? <p>No services are available for this choice. Please go back and choose another doctor.</p> : (
                    <fieldset className="choice-group">
                      <legend className="sr-only">Service</legend>
                      <div className="choice-list">
                        {services.map((s) => (
                          <ChoiceCard key={s.id} name="service" value={s.id} checked={draft.serviceId === s.id} onChange={(v) => update({ serviceId: v })} title={s.name}
                            meta={`${formatDuration(s.durationMinutes)}${cfg.pricing.show ? ` · ${formatPrice(s.price)} ${cfg.pricing.label.toLowerCase()}` : ''} · ${s.modes.map((m) => cfg.modeLabels[m]).join(' / ')}`}>
                            <span className="choice-text">{s.summary}</span>
                          </ChoiceCard>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {svc && modes.length > 1 && (
                    <fieldset className="choice-group mode-group">
                      <legend>Consultation format</legend>
                      <div className="choice-grid">
                        {modes.map((m) => <ChoiceCard key={m} name="mode" value={m} checked={draft.mode === m} onChange={(v) => update({ mode: v as Draft['mode'] })} title={cfg.modeLabels[m]} />)}
                      </div>
                    </fieldset>
                  )}
                  {svc && modes.length === 1 && <p className="muted">Format: {cfg.modeLabels[modes[0]]}</p>}
                </>
              )}

              {step === 3 && svc && (
                <DateTimePicker pool={pool} durationMinutes={svc.durationMinutes} date={draft.date} time={draft.time} onDate={(iso) => update({ date: iso, time: '' })} onTime={(t) => update({ time: t })} />
              )}

              {step === 4 && (
                <form className="form" noValidate onSubmit={(e: FormEvent) => { e.preventDefault(); next(); }} aria-label="Contact details">
                  <Notice title="Please do not enter medical information">Only a name, e-mail address and optional phone number are needed. Never type symptoms, medical history, insurance or ID numbers into this demo.</Notice>
                  <Field id="bk-name" label="Full name" required error={contactErrors.name}>
                    <input id="bk-name" value={draft.contact.name} autoComplete="name" aria-invalid={!!contactErrors.name} aria-describedby={describedBy('bk-name', contactErrors.name)}
                      onChange={(e) => update({ contact: { ...draft.contact, name: e.target.value } })} />
                  </Field>
                  <Field id="bk-email" label="E-mail address" required error={contactErrors.email} hint="Use a fictional address such as alex@example.com — it is only used to prevent duplicate demo bookings.">
                    <input id="bk-email" type="email" value={draft.contact.email} autoComplete="email" aria-invalid={!!contactErrors.email} aria-describedby={describedBy('bk-email', contactErrors.email, 'hint')}
                      onChange={(e) => update({ contact: { ...draft.contact, email: e.target.value } })} />
                  </Field>
                  <Field id="bk-phone" label="Phone number" required={cfg.requirePhone} error={contactErrors.phone}>
                    <input id="bk-phone" type="tel" value={draft.contact.phone} autoComplete="tel" aria-invalid={!!contactErrors.phone} aria-describedby={describedBy('bk-phone', contactErrors.phone)}
                      onChange={(e) => update({ contact: { ...draft.contact, phone: e.target.value } })} />
                  </Field>
                  <div className={`field ${contactErrors.consent ? 'has-error' : ''}`}>
                    <label className="check consent">
                      <input id="bk-consent" type="checkbox" checked={draft.consent} aria-invalid={!!contactErrors.consent} aria-describedby={contactErrors.consent ? 'bk-consent-error' : undefined}
                        onChange={(e) => update({ consent: e.target.checked })} />
                      <span>{CONSENT} <Link to="/demo-notice">Read the demo &amp; privacy notice</Link>.</span>
                    </label>
                    {contactErrors.consent && <p className="field-error" id="bk-consent-error" role="alert"><Icon name="alert" size={16} /> {contactErrors.consent}</p>}
                  </div>
                </form>
              )}

              {step === 5 && (
                <div className="review">
                  <SummaryList s={summary} contact={draft.contact} />
                  <div className="btn-row edit-row">
                    {([0, 1, 2, 3, 4] as StepIndex[]).map((i) => <Button key={i} variant="ghost" size="sm" icon="edit" onClick={() => goTo(i)} aria-label={`Edit ${STEPS[i].toLowerCase()}`}>Edit {STEPS[i].toLowerCase()}</Button>)}
                  </div>
                  <Notice title="Before you confirm">{site.notices.booking} Your details will be saved in this browser only. Nothing is sent to {site.brand.shortName} or anyone else.</Notice>
                </div>
              )}

              {stepError && <p className="form-alert" role="alert"><Icon name="alert" size={18} /> {stepError}</p>}

              <div className="step-actions">
                <Button variant="ghost" icon="arrow-left" onClick={back} disabled={step === 0} className="back-btn">Back</Button>
                {step < 5 ? <Button icon="arrow" onClick={next}>Continue</Button> : <Button icon="check" onClick={confirm}>Confirm demo appointment</Button>}
              </div>
            </div>
          </div>

          <aside className="booking-aside" aria-labelledby="sum-title">
            <h2 id="sum-title" className="h3">Your demo appointment</h2>
            <SummaryList s={summary} />
            <p className="muted small">{all.filter((b) => b.status === 'confirmed').length > 0 ? <>You have saved demo appointments. <Link to="/appointments">View them</Link>.</> : 'Nothing is saved until you confirm.'}</p>
          </aside>
        </div>
      </section>
    </>
  );
}

function Confirmation({ rec, headingRef, onAnother }: { rec: BookingRecord; headingRef: React.RefObject<HTMLHeadingElement | null>; onAnother: () => void }) {
  const s = recordSummary(rec);
  return (
    <>
      <Seo title="Demo appointment confirmed" noindex />
      <section className="section">
        <div className="container narrow confirmation">
          <p className="eyebrow">Demonstration only</p>
          <h1 ref={headingRef} tabIndex={-1}><Icon name="check" size={34} /> Demo appointment saved</h1>
          <p className="lead">This is a <strong>demonstration</strong>. No real clinic has been contacted, and no real medical appointment exists.</p>
          <p className="reference">Reference <strong>{rec.reference}</strong></p>
          <SummaryList s={s} contact={rec.contact} />
          {storageUnavailable() && (
            <Notice tone="warning" title="Your browser blocked saving" role="alert">This demo appointment exists only in memory and will disappear when you leave or refresh this page.</Notice>
          )}
          <Notice title="What happens next">Nothing — it is a demo. You can view, reschedule or cancel it from <Link to="/appointments">My demo appointments</Link>. It is stored in this browser only. {site.notices.emergency}</Notice>
          <div className="btn-row">
            <LinkButton to="/appointments" icon="calendar">View my demo appointments</LinkButton>
            <Button variant="secondary" onClick={onAnother}>Book another</Button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- reschedule ---------------- */
function RescheduleFlow({ rec }: { rec: BookingRecord }) {
  const all = useBookings();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [review, setReview] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<BookingRecord | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    headingRef.current?.focus();
  }, [review, done]);

  const pool = reschedulePool(rec);
  const svcName = specialtyById(rec.specialtyId)?.name;
  const current = recordSummary(rec);

  const apply = () => {
    const res = buildReschedule(rec, date, time);
    if (!res.ok) { setError(res.error); setReview(false); setTime(''); return; }
    updateBooking(rec.id, res.patch);
    setDone({ ...rec, ...res.patch } as BookingRecord);
  };

  if (done) {
    const fresh = all.find((b) => b.id === done.id) ?? done;
    return (
      <section className="section">
        <Seo title="Demo appointment rescheduled" noindex />
        <div className="container narrow confirmation">
          <p className="eyebrow">Demonstration only</p>
          <h1 ref={headingRef} tabIndex={-1}><Icon name="check" size={34} /> Demo appointment rescheduled</h1>
          <p className="lead">Your demo appointment <strong>{fresh.reference}</strong> now has a new time. Nothing was sent to any clinic.</p>
          <SummaryList s={recordSummary(fresh)} contact={fresh.contact} />
          <div className="btn-row"><LinkButton to="/appointments" icon="calendar">My demo appointments</LinkButton></div>
        </div>
      </section>
    );
  }
  const newSummary: SummaryData = { ...current, date: date || undefined, time: time || undefined, doctorLabel: doctorLabel(doctorById(rec.doctorId), rec.doctorPreference === 'any') };
  return (
    <>
      <Seo title="Reschedule demo appointment" noindex />
      <BookingIntro title="Reschedule your demo appointment" lead={`Choose a new date and time for ${rec.reference}. Only the time changes — ${svcName ?? 'the specialty'}, service and your details stay the same.`} />
      <section className="section-tight booking-section">
        <div className="container booking-layout">
          <div className="booking-main step-panel">
            <h2 ref={headingRef} tabIndex={-1} className="step-title">{review ? 'Review the new time' : 'Choose a new date and time'}</h2>
            {!review ? (
              <DateTimePicker pool={pool} durationMinutes={rec.durationMinutes} date={date} time={time} ignoreId={rec.id} onDate={(iso) => { setDate(iso); setTime(''); setError(''); }} onTime={(t) => { setTime(t); setError(''); }} />
            ) : (
              <div className="review">
                <p>Currently: <strong>{formatDate(rec.date)} at {formatTime(rec.time)}</strong></p>
                <p>New time: <strong>{formatDate(date)} at {formatTime(time)}</strong></p>
                <Notice title="Demonstration">{site.notices.booking}</Notice>
              </div>
            )}
            {error && <p className="form-alert" role="alert"><Icon name="alert" size={18} /> {error}</p>}
            <div className="step-actions">
              {review ? <Button variant="ghost" icon="arrow-left" onClick={() => setReview(false)}>Back</Button> : <LinkButton to="/appointments" variant="ghost" icon="arrow-left">Keep current time</LinkButton>}
              {review ? <Button icon="check" onClick={apply}>Confirm new time</Button> : <Button icon="arrow" onClick={() => (date && time ? (setError(''), setReview(true)) : setError('Please select a date and a time.'))}>Continue</Button>}
            </div>
          </div>
          <aside className="booking-aside" aria-labelledby="sum-title">
            <h2 id="sum-title" className="h3">Appointment {rec.reference}</h2>
            <SummaryList s={newSummary} contact={rec.contact} />
          </aside>
        </div>
      </section>
    </>
  );
}
