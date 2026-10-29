import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { booking } from '../config/booking';
import { bookingPage } from '../config/content';
import { services } from '../config/services';
import { site } from '../config/site';
import { Button, LinkButton } from '../components/Button';
import { Calendar } from '../components/Calendar';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { Notice } from '../components/DemoNotice';
import { PageHero, Section } from '../components/Section';
import { useSeo } from '../hooks/useSeo';
import { cancelAppointment, loadAppointments, newReference, saveAppointment, slotsForDate, validateDetails, fromMinutes, toMinutes, type Appointment, type DetailFields } from '../lib/booking';
import { formatLongDate, formatShortDate, formatTime } from '../lib/format';
import type { Errors } from '../lib/validation';

const STEPS = ['Service', 'Type', 'Date', 'Time', 'Details', 'Review'] as const;

interface Draft {
  serviceSlug: string;
  typeId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  consent: boolean;
}
const emptyDraft = (service = ''): Draft => ({ serviceSlug: service, typeId: '', date: '', time: '', name: '', email: '', phone: '', note: '', consent: false });

const endTime = (time: string, duration: number) => fromMinutes(toMinutes(time) + duration);

export default function Booking() {
  useSeo({ ...bookingPage.seo, path: '/book' });
  const [params] = useSearchParams();
  const presetService = services.find((s) => s.slug === params.get('service'))?.slug ?? '';
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(presetService));
  const [errors, setErrors] = useState<Errors<DetailFields>>({});
  const [stepError, setStepError] = useState('');
  const [saved, setSaved] = useState<Appointment[]>(() => loadAppointments());
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [message, setMessage] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const type = booking.consultationTypes.find((t) => t.id === draft.typeId);
  const service = services.find((s) => s.slug === draft.serviceSlug);
  const duration = type?.duration ?? 30;
  const slots = useMemo(() => (draft.date ? slotsForDate(draft.date, duration, saved) : []), [draft.date, duration, saved]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, confirmed]);

  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));

  const next = () => {
    setStepError('');
    if (step === 0 && !draft.serviceSlug) return setStepError('Choose a service to continue.');
    if (step === 1 && !draft.typeId) return setStepError('Choose a consultation type to continue.');
    if (step === 2 && !draft.date) return setStepError('Select an available date to continue.');
    if (step === 3 && !draft.time) return setStepError('Select a time slot to continue.');
    if (step === 4) {
      const e = validateDetails(draft);
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setStep((s) => s + 1);
  };
  const back = () => {
    setStepError('');
    setStep((s) => Math.max(0, s - 1));
  };

  const confirm = () => {
    // Re-check availability right before saving (another saved appointment may now overlap).
    const stillFree = slotsForDate(draft.date, duration, saved).find((s) => s.time === draft.time)?.available;
    if (!stillFree) {
      setStepError('That time is no longer available. Please choose another slot.');
      setDraft((d) => ({ ...d, time: '' }));
      setStep(3);
      return;
    }
    const appt: Appointment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      reference: newReference(),
      serviceSlug: draft.serviceSlug,
      typeId: draft.typeId,
      date: draft.date,
      time: draft.time,
      duration,
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      note: draft.note.trim(),
      createdAt: new Date().toISOString(),
    };
    setSaved(saveAppointment(appt));
    setConfirmed(appt);
    setMessage('');
  };

  const doCancel = () => {
    if (!toCancel) return;
    setSaved(cancelAppointment(toCancel.id));
    setMessage(`Demo appointment ${toCancel.reference} on ${formatShortDate(toCancel.date)} at ${formatTime(toCancel.time)} was cancelled.`);
    if (confirmed?.id === toCancel.id) setConfirmed(null);
    if (confirmed?.id === toCancel.id) {
      setDraft(emptyDraft());
      setStep(0);
    }
    setToCancel(null);
  };

  const startOver = () => {
    setDraft(emptyDraft());
    setConfirmed(null);
    setErrors({});
    setStepError('');
    setStep(0);
  };

  const nameOf = (slug: string) => services.find((s) => s.slug === slug)?.name ?? slug;
  const typeOf = (id: string) => booking.consultationTypes.find((t) => t.id === id);

  const Summary = (
    <aside className="booking-summary" aria-label="Your booking summary">
      <h2 className="h3">Booking summary</h2>
      <dl>
        <div><dt>Service</dt><dd>{service?.name ?? '—'}</dd></div>
        <div><dt>Type</dt><dd>{type ? `${type.name} (${type.duration} min)` : '—'}</dd></div>
        <div><dt>Date</dt><dd>{draft.date ? formatLongDate(draft.date) : '—'}</dd></div>
        <div><dt>Time</dt><dd>{draft.time ? `${formatTime(draft.time)} – ${formatTime(endTime(draft.time, duration))}` : '—'}</dd></div>
      </dl>
      <p className="fine-print">Times shown in {site.timezoneLabel}. {site.legal.bookingDisclaimer}</p>
    </aside>
  );

  return (
    <>
      <PageHero eyebrow="Demo booking" title={booking.text.heading} lead={booking.text.lead} />
      <Section tone="ivory">
        <Notice tone="warn" title="Demonstration only — not delivered to any firm">{site.legal.bookingDisclaimer} {site.legal.sensitiveDataNotice}</Notice>

        {confirmed ? (
          <div className="booking-layout booking-layout--done">
            <div className="confirmation">
              <span className="confirmation__icon"><Icon name="check" size={28} /></span>
              <h2 tabIndex={-1} ref={headingRef}>Demo reservation confirmed</h2>
              <p>Reference <strong data-testid="reference">{confirmed.reference}</strong>. This is a demonstration appointment saved only in this browser — no firm has been notified.</p>
              <dl className="confirmation__details">
                <div><dt>Service</dt><dd>{nameOf(confirmed.serviceSlug)}</dd></div>
                <div><dt>Type</dt><dd>{typeOf(confirmed.typeId)?.name} · {confirmed.duration} min · {typeOf(confirmed.typeId)?.mode}</dd></div>
                <div><dt>When</dt><dd>{formatLongDate(confirmed.date)}, {formatTime(confirmed.time)} – {formatTime(endTime(confirmed.time, confirmed.duration))}</dd></div>
                <div><dt>Name</dt><dd>{confirmed.name}</dd></div>
                <div><dt>Email</dt><dd>{confirmed.email}</dd></div>
              </dl>
              <div className="form__actions">
                <Button variant="secondary" onClick={() => setToCancel(confirmed)}><Icon name="trash" size={16} /> Cancel this appointment</Button>
                <Button variant="primary" onClick={startOver}>Book another</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="booking-layout">
            <div className="booking-main">
              <ol className="stepper" aria-label="Booking progress">
                {STEPS.map((s, i) => (
                  <li key={s} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                    <span className="stepper__dot" aria-hidden="true">{i < step ? <Icon name="check" size={14} /> : i + 1}</span>
                    <span className="stepper__label">{s}</span>
                  </li>
                ))}
              </ol>
              <p className="sr-only" role="status">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

              <h2 className="booking-step-title" tabIndex={-1} ref={headingRef}>
                {['1. Choose a service', '2. Choose a consultation type', '3. Select a date', '4. Select a time', '5. Your contact details', '6. Review and confirm'][step]}
              </h2>

              {step === 0 && (
                <fieldset className="choice-grid">
                  <legend className="sr-only">Service</legend>
                  {services.map((s) => (
                    <label key={s.slug} className={`choice${draft.serviceSlug === s.slug ? ' is-selected' : ''}`}>
                      <input type="radio" name="service" value={s.slug} checked={draft.serviceSlug === s.slug} onChange={() => patch({ serviceSlug: s.slug })} />
                      <Icon name={s.icon} size={22} />
                      <span><strong>{s.name}</strong><em>{s.summary}</em></span>
                    </label>
                  ))}
                </fieldset>
              )}

              {step === 1 && (
                <fieldset className="choice-grid choice-grid--single">
                  <legend className="sr-only">Consultation type</legend>
                  {booking.consultationTypes.map((t) => (
                    <label key={t.id} className={`choice${draft.typeId === t.id ? ' is-selected' : ''}`}>
                      <input type="radio" name="ctype" value={t.id} checked={draft.typeId === t.id} onChange={() => patch({ typeId: t.id, time: '' })} />
                      <Icon name={t.id === 'office' ? 'pin' : 'calendar'} size={22} />
                      <span><strong>{t.name} · {t.duration} min</strong><em>{t.description} {t.mode}.</em></span>
                    </label>
                  ))}
                </fieldset>
              )}

              {step === 2 && (
                <Calendar value={draft.date || null} duration={duration} existing={saved} onSelect={(iso) => patch({ date: iso, time: draft.date === iso ? draft.time : '' })} />
              )}

              {step === 3 && (
                <div>
                  <p>Available times on <strong>{formatLongDate(draft.date)}</strong> for a {duration}-minute {type?.name.toLowerCase()}. Times in {site.timezoneLabel}.</p>
                  <fieldset className="slot-grid">
                    <legend className="sr-only">Time slots</legend>
                    {slots.map((s) => (
                      <label key={s.time} className={`slot${draft.time === s.time ? ' is-selected' : ''}${s.available ? '' : ' is-unavailable'}`}>
                        <input type="radio" name="slot" value={s.time} disabled={!s.available} checked={draft.time === s.time} onChange={() => patch({ time: s.time })} />
                        <span>{formatTime(s.time)}</span>
                        {!s.available && <span className="sr-only"> (unavailable)</span>}
                      </label>
                    ))}
                  </fieldset>
                  {slots.length === 0 && <div className="empty"><h3>No slots on this date</h3><p>Go back and choose another date.</p></div>}
                </div>
              )}

              {step === 4 && (
                <form className="form" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
                  <div className="form__row">
                    <div className={`field${errors.name ? ' field--error' : ''}`}>
                      <label htmlFor="b-name">Full name</label>
                      <input id="b-name" autoComplete="name" value={draft.name} onChange={(e) => patch({ name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'b-name-err' : undefined} />
                      {errors.name && <p className="field__error" id="b-name-err">{errors.name}</p>}
                    </div>
                    <div className={`field${errors.email ? ' field--error' : ''}`}>
                      <label htmlFor="b-email">Email address</label>
                      <input id="b-email" type="email" autoComplete="email" value={draft.email} onChange={(e) => patch({ email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'b-email-err' : undefined} />
                      {errors.email && <p className="field__error" id="b-email-err">{errors.email}</p>}
                    </div>
                  </div>
                  <div className={`field${errors.phone ? ' field--error' : ''}`}>
                    <label htmlFor="b-phone">Phone (optional)</label>
                    <input id="b-phone" type="tel" autoComplete="tel" value={draft.phone} onChange={(e) => patch({ phone: e.target.value })} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'b-phone-err' : undefined} />
                    {errors.phone && <p className="field__error" id="b-phone-err">{errors.phone}</p>}
                  </div>
                  <div className={`field${errors.note ? ' field--error' : ''}`}>
                    <label htmlFor="b-note">What would you like to discuss? (optional)</label>
                    <textarea id="b-note" rows={4} value={draft.note} onChange={(e) => patch({ note: e.target.value })} aria-invalid={!!errors.note} aria-describedby={`${errors.note ? 'b-note-err ' : ''}b-note-hint`} />
                    <p className="field__hint" id="b-note-hint">{draft.note.length}/{booking.maxNoteLength}. Do not include account numbers, tax IDs or statements.</p>
                    {errors.note && <p className="field__error" id="b-note-err">{errors.note}</p>}
                  </div>
                  <div className={`field field--check${errors.consent ? ' field--error' : ''}`}>
                    <label className="check">
                      <input type="checkbox" checked={draft.consent} onChange={(e) => patch({ consent: e.target.checked })} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'b-consent-err' : undefined} />
                      <span>I understand this is a demonstration booking that is saved only in this browser and not sent to any firm.</span>
                    </label>
                    {errors.consent && <p className="field__error" id="b-consent-err">{errors.consent}</p>}
                  </div>
                </form>
              )}

              {step === 5 && (
                <div className="review">
                  <dl className="review__list">
                    <div><dt>Service</dt><dd>{service?.name}</dd></div>
                    <div><dt>Consultation</dt><dd>{type?.name} · {duration} min · {type?.mode}</dd></div>
                    <div><dt>Date</dt><dd>{formatLongDate(draft.date)}</dd></div>
                    <div><dt>Time</dt><dd>{formatTime(draft.time)} – {formatTime(endTime(draft.time, duration))} ({site.timezoneLabel})</dd></div>
                    <div><dt>Name</dt><dd>{draft.name}</dd></div>
                    <div><dt>Email</dt><dd>{draft.email}</dd></div>
                    {draft.phone && <div><dt>Phone</dt><dd>{draft.phone}</dd></div>}
                    {draft.note && <div><dt>Note</dt><dd>{draft.note}</dd></div>}
                  </dl>
                  <Notice title="Before you confirm">{site.legal.bookingDisclaimer}</Notice>
                </div>
              )}

              {stepError && <p className="field__error step-error" role="alert">{stepError}</p>}
              <div className="booking-nav">
                <Button variant="ghost" onClick={back} disabled={step === 0}>Back</Button>
                {step < 5 ? (
                  <Button variant="primary" arrow onClick={next}>Continue</Button>
                ) : (
                  <Button variant="primary" onClick={confirm}>Confirm demo reservation</Button>
                )}
              </div>
            </div>
            {Summary}
          </div>
        )}
      </Section>

      <Section id="my-appointments" eyebrow="Saved in this browser" title="Your demo appointments" tone="stone">
        <p className="sr-only" role="status" aria-live="polite">{message}</p>
        {message && <Notice tone="success" title="Cancelled">{message}</Notice>}
        {saved.length === 0 ? (
          <div className="empty">
            <Icon name="calendar" size={28} />
            <h3>No saved demo appointments</h3>
            <p>When you confirm a demo reservation it will appear here, and you can cancel it at any time.</p>
          </div>
        ) : (
          <ul className="appointments">
            {saved.map((a) => (
              <li key={a.id} className="appointment" data-testid="appointment">
                <div>
                  <p className="appointment__ref">{a.reference}</p>
                  <h3>{nameOf(a.serviceSlug)}</h3>
                  <p>{typeOf(a.typeId)?.name} · {formatLongDate(a.date)}, {formatTime(a.time)} – {formatTime(endTime(a.time, a.duration))}</p>
                  <p className="fine-print">{a.name} · {a.email}</p>
                </div>
                <Button variant="secondary" onClick={() => setToCancel(a)} aria-label={`Cancel appointment ${a.reference}`}><Icon name="trash" size={16} /> Cancel</Button>
              </li>
            ))}
          </ul>
        )}
        <p className="fine-print">Stored in your browser’s local storage under “{site.storagePrefix}:appointments”. Clearing site data removes them. <Link to="/disclaimer">Read the notices</Link>.</p>
        <LinkButton to="/contact" variant="ghost">Prefer to send an enquiry instead?</LinkButton>
      </Section>

      <Modal
        open={!!toCancel}
        title="Cancel this demo appointment?"
        onClose={() => setToCancel(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setToCancel(null)} data-autofocus>Keep appointment</Button>
            <Button variant="primary" onClick={doCancel}>Yes, cancel it</Button>
          </>
        }
      >
        {toCancel && (
          <p>
            {nameOf(toCancel.serviceSlug)} on {formatLongDate(toCancel.date)} at {formatTime(toCancel.time)} (reference {toCancel.reference}) will be removed from this browser. No firm is notified because this is a demonstration.
          </p>
        )}
      </Modal>
    </>
  );
}
