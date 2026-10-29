import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { treatments, treatmentCategories } from '../config/treatments';
import { packages } from '../config/packages';
import { booking as cfg } from '../config/booking';
import { site } from '../config/site';
import { bookableDates, getSlots, resolveStaff } from '../lib/availability';
import { addBooking, findBooking, updateBooking, useBookings, type BookingRecord } from '../lib/bookings';
import { eligibleStaff, resolveService, servicePrice, type ServiceKind } from '../lib/booking-logic';
import { formatDuration, formatLongDate, formatPrice, formatTime, parseISODate } from '../lib/format';
import { validateCustomer, type CustomerFields, type Errors } from '../lib/validation';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Button, DemoNotice, Field, LinkButton, SectionHeading } from '../components/ui';

type StepId = 'service' | 'therapist' | 'datetime' | 'details' | 'review';
const STEP_LABELS: Record<StepId, string> = { service: 'Service', therapist: 'Therapist', datetime: 'Date & time', details: 'Your details', review: 'Review' };
const FULL_STEPS: StepId[] = ['service', 'therapist', 'datetime', 'details', 'review'];
const RESCHEDULE_STEPS: StepId[] = ['datetime', 'review'];
const NO_CUSTOMER: CustomerFields = { name: '', email: '', phone: '', notes: '' };
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Booking() {
  const [params] = useSearchParams();
  const rescheduleId = params.get('reschedule');
  const bookings = useBookings();
  const existing = rescheduleId ? bookings.find((b) => b.id === rescheduleId && b.status === 'confirmed') : undefined;
  const rescheduling = !!existing;

  const initKind: ServiceKind = params.get('package') ? 'package' : 'treatment';
  const initSlug = params.get('package') ?? params.get('treatment') ?? '';
  const initOpt = Number(params.get('option')) || undefined;

  const [kind, setKind] = useState<ServiceKind>(existing?.service.kind ?? (resolveService(initKind, initSlug) ? initKind : 'treatment'));
  const [slug, setSlug] = useState<string>(existing?.service.slug ?? (resolveService(initKind, initSlug) ? initSlug : ''));
  const [optionMinutes, setOptionMinutes] = useState<number | undefined>(existing ? existing.durationMinutes : initOpt);
  const [staffPref, setStaffPref] = useState<string>(existing?.staffPreference ?? 'any');
  const [rawGuests, setGuests] = useState<number>(existing?.guests ?? 1);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [customer, setCustomer] = useState<CustomerFields>(existing?.customer ?? NO_CUSTOMER);
  const [errors, setErrors] = useState<Errors<keyof CustomerFields>>({});
  const [consent, setConsent] = useState(false);
  const [stepError, setStepError] = useState('');
  const [confirmed, setConfirmed] = useState<BookingRecord | null>(null);
  const steps = rescheduling ? RESCHEDULE_STEPS : FULL_STEPS;
  const [stepIdx, setStepIdx] = useState(slug && !rescheduling ? 1 : 0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const service = useMemo(() => (slug ? resolveService(kind, slug, optionMinutes) : undefined), [kind, slug, optionMinutes]);
  const pool = useMemo(() => {
    const eligible = eligibleStaff(service);
    return staffPref === 'any' ? eligible : eligible.filter((m) => m.id === staffPref);
  }, [service, staffPref]);
  const step = steps[stepIdx];
  // keep guests within the limits of the chosen service
  const guests = service ? Math.min(Math.max(rawGuests, service.minGuests), service.maxGuests) : rawGuests;

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    headingRef.current?.focus();
  }, [stepIdx, confirmed]);


  const pickService = (k: ServiceKind, s: string) => {
    setKind(k); setSlug(s); setOptionMinutes(undefined); setDate(''); setTime('');
    if (staffPref !== 'any') setStaffPref('any');
    setStepError('');
  };

  // Show a format error on blur only when something was typed; never clear on blur (avoids layout shift under clicks).
  const blurCheck = (k: keyof CustomerFields) => {
    const msg = validateCustomer(customer)[k];
    if (msg && customer[k]) setErrors((er) => ({ ...er, [k]: msg }));
  };
  const updateCustomer = (k: keyof CustomerFields, v: string) => {
    const next = { ...customer, [k]: v };
    setCustomer(next);
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validateCustomer(next)[k] }));
  };

  const total = service ? servicePrice(service, guests) : 0;

  const next = () => {
    setStepError('');
    if (step === 'service' && !service) return setStepError('Please choose a treatment or package to continue.');
    if (step === 'datetime') {
      if (!date) return setStepError('Please select a date.');
      if (!time) return setStepError('Please select an available time.');
    }
    if (step === 'details') {
      const errs = validateCustomer(customer);
      setErrors(errs);
      if (Object.keys(errs).length) {
        setStepError('Please correct the highlighted fields.');
        document.getElementById(`bk-${Object.keys(errs)[0]}`)?.focus();
        return;
      }
    }
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  };
  const back = () => { setStepError(''); setStepIdx((i) => Math.max(0, i - 1)); };

  const confirm = () => {
    if (!service) return;
    if (!consent) return setStepError('Please tick the box to confirm you understand this is a demonstration booking.');
    const others = bookings;
    const member = resolveStaff(pool, date, time, service.durationMinutes, others, existing?.id);
    if (!member) {
      setTime('');
      setStepIdx(steps.indexOf('datetime'));
      return setStepError('Sorry, that time is no longer available. Please choose another.');
    }
    if (existing) {
      updateBooking(existing.id, { date, time, staffId: member.id, staffName: member.name });
      setConfirmed(findBooking(existing.id) ?? null);
      return;
    }
    setConfirmed(addBooking({
      service: { kind: service.kind, slug: service.slug, name: service.name, optionLabel: service.optionLabel },
      staffId: member.id, staffName: member.name, staffPreference: staffPref,
      date, time, durationMinutes: service.durationMinutes, guests, total, customer: { ...customer, name: customer.name.trim(), email: customer.email.trim() }
    }));
  };

  const restart = () => {
    setConfirmed(null); setSlug(''); setOptionMinutes(undefined); setStaffPref('any'); setGuests(1); setDate(''); setTime('');
    setCustomer(NO_CUSTOMER); setConsent(false); setStepIdx(0); setErrors({});
  };

  const seo = <Seo title={site.pages.booking.title} description={site.pages.booking.description} noindex={false} />;

  if (rescheduleId && !existing && !confirmed) {
    return (
      <>{seo}
        <section className="page-hero"><div className="container narrow">
          <SectionHeading as="h1" eyebrow="Reschedule" title="We couldn’t find that booking" text="It may have been cancelled or removed from this browser." />
          <LinkButton to="/booking/manage">Go to my bookings</LinkButton>
        </div></section>
      </>
    );
  }

  if (confirmed) {
    return (
      <>{seo}
        <section className="section confirm">
          <div className="container narrow">
            <div className="confirm-card">
              <span className="confirm-icon"><Icon name="check" size={30} /></span>
              <p className="eyebrow">{rescheduling ? 'Demo booking updated' : 'Demo booking confirmed'}</p>
              <h1 ref={headingRef} tabIndex={-1} className="h-display">Thank you{confirmed.customer.name ? `, ${confirmed.customer.name.split(' ')[0]}` : ''}</h1>
              <p className="lead">Your demonstration reference is <strong className="ref">{confirmed.reference}</strong>.</p>
              <BookingSummary b={confirmed} />
              <DemoNotice tone="warn">{cfg.disclosure}</DemoNotice>
              <div className="btn-row btn-row--center">
                <LinkButton to="/booking/manage">View my bookings</LinkButton>
                <Button variant="outline" onClick={restart}>Make another demo booking</Button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {seo}
      <section className="page-hero page-hero--compact">
        <div className="container">
          <SectionHeading as="h1" eyebrow={rescheduling ? 'Reschedule' : 'Book an appointment'} title={rescheduling ? `Reschedule ${existing?.service.name}` : 'Reserve your time'} />
          <DemoNotice tone="warn">{cfg.disclosure}</DemoNotice>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container booking-layout">
          <div className="booking-main">
            <ol className="stepper" aria-label="Booking progress">
              {steps.map((s, i) => (
                <li key={s} className={i === stepIdx ? 'is-current' : i < stepIdx ? 'is-done' : ''} aria-current={i === stepIdx ? 'step' : undefined}>
                  <span className="step-num">{i < stepIdx ? <Icon name="check" size={14} /> : i + 1}</span>
                  <span className="step-label">{STEP_LABELS[s]}</span>
                </li>
              ))}
            </ol>

            <div className="step-panel">
              <h2 ref={headingRef} tabIndex={-1} className="h-sub step-heading">
                {step === 'service' && 'Choose your treatment or package'}
                {step === 'therapist' && 'Therapist preference'}
                {step === 'datetime' && 'Pick a date and time'}
                {step === 'details' && 'Your details'}
                {step === 'review' && 'Review your booking'}
              </h2>

              {step === 'service' && (
                <ServiceStep kind={kind} slug={slug} service={service} guests={guests} setGuests={setGuests} setOption={setOptionMinutes} pick={pickService} setKind={setKind} />
              )}

              {step === 'therapist' && (
                <fieldset className="choice-list">
                  <legend className="sr-only">Therapist preference</legend>
                  <label className={`choice ${staffPref === 'any' ? 'is-selected' : ''}`}>
                    <input type="radio" name="staff" checked={staffPref === 'any'} onChange={() => { setStaffPref('any'); setTime(''); }} />
                    <span className="choice-main"><strong>No preference</strong><span>We’ll match you with the first available specialist.</span></span>
                  </label>
                  {eligibleStaff(service).map((m) => (
                    <label key={m.id} className={`choice ${staffPref === m.id ? 'is-selected' : ''}`}>
                      <input type="radio" name="staff" checked={staffPref === m.id} onChange={() => { setStaffPref(m.id); setTime(''); }} />
                      <span className="choice-main"><strong>{m.name}</strong><span>{m.role}</span></span>
                    </label>
                  ))}
                </fieldset>
              )}

              {step === 'datetime' && service && (
                <DateTimeStep date={date} time={time} setDate={(d) => { setDate(d); setTime(''); }} setTime={setTime} duration={service.durationMinutes} pool={pool} bookings={bookings} ignoreId={existing?.id} />
              )}

              {step === 'details' && (
                <div className="form">
                  <div className="form-row">
                    <Field id="bk-name" label="Full name" error={errors.name} required>{(p) => <input {...p} autoComplete="name" value={customer.name} onChange={(e) => updateCustomer('name', e.target.value)} onBlur={() => blurCheck('name')} />}</Field>
                    <Field id="bk-email" label="Email" error={errors.email} required>{(p) => <input {...p} type="email" autoComplete="email" value={customer.email} onChange={(e) => updateCustomer('email', e.target.value)} onBlur={() => blurCheck('email')} />}</Field>
                  </div>
                  <Field id="bk-phone" label="Phone (optional)" error={errors.phone}>{(p) => <input {...p} type="tel" autoComplete="tel" value={customer.phone} onChange={(e) => updateCustomer('phone', e.target.value)} onBlur={() => blurCheck('phone')} />}</Field>
                  <Field id="bk-notes" label="Notes for your therapist (optional)" error={errors.notes} hint="Allergies, pressure preference, anything we should know. Max 500 characters.">{(p) => <textarea {...p} rows={4} value={customer.notes} onChange={(e) => updateCustomer('notes', e.target.value)} />}</Field>
                </div>
              )}

              {step === 'review' && service && (
                <div>
                  <dl className="summary-list">
                    <div><dt>Service</dt><dd>{service.name} <span className="muted">({service.optionLabel})</span></dd></div>
                    <div><dt>Therapist</dt><dd>{pool.length === 1 && staffPref !== 'any' ? pool[0].name : 'First available specialist'}</dd></div>
                    <div><dt>Date</dt><dd>{date && formatLongDate(date)}</dd></div>
                    <div><dt>Time</dt><dd>{time && formatTime(time)}</dd></div>
                    <div><dt>Guests</dt><dd>{guests}</dd></div>
                    {!rescheduling && <div><dt>Name</dt><dd>{customer.name}</dd></div>}
                    {!rescheduling && <div><dt>Email</dt><dd>{customer.email}</dd></div>}
                    <div className="summary-total"><dt>Estimated total</dt><dd>{formatPrice(total)}</dd></div>
                  </dl>
                  <p className="fine">{cfg.cancellationNote} No payment is taken.</p>
                  <label className="check">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <span>I understand this is a <strong>demonstration</strong> booking saved only in this browser and not sent to any real business.</span>
                  </label>
                </div>
              )}

              {stepError && <p className="field-error step-error" role="alert">{stepError}</p>}

              <div className="step-actions">
                {stepIdx > 0 ? <Button variant="outline" onClick={back}>Back</Button> : <span />}
                {step === 'review' ? <Button arrow onClick={confirm}>{rescheduling ? 'Confirm new time' : 'Confirm demo booking'}</Button> : <Button arrow onClick={next}>Continue</Button>}
              </div>
            </div>
          </div>

          <aside className="booking-aside" aria-label="Booking summary">
            <h2 className="h-sub">Your selection</h2>
            {service ? (
              <>
                <p className="aside-service">{service.name}</p>
                <p className="muted">{service.optionLabel}</p>
                <dl className="aside-list">
                  <div><dt>Guests</dt><dd>{guests}</dd></div>
                  {date && <div><dt>Date</dt><dd>{formatLongDate(date)}</dd></div>}
                  {time && <div><dt>Time</dt><dd>{formatTime(time)}</dd></div>}
                  {staffPref !== 'any' && pool[0] && <div><dt>Therapist</dt><dd>{pool[0].name}</dd></div>}
                </dl>
                <p className="aside-total"><span>Total</span><strong>{formatPrice(total)}</strong></p>
              </>
            ) : <p className="muted">Nothing selected yet.</p>}
            <p className="fine">Demonstration only. Availability is simulated.</p>
            <Link to="/booking/manage" className="text-link">My demo bookings <Icon name="arrow" size={16} /></Link>
          </aside>
        </div>
      </section>
    </>
  );
}

function ServiceStep({ kind, slug, service, guests, setGuests, setOption, pick, setKind }: {
  kind: ServiceKind; slug: string; service: ReturnType<typeof resolveService>; guests: number; setGuests: (n: number) => void;
  setOption: (m: number) => void; pick: (k: ServiceKind, s: string) => void; setKind: (k: ServiceKind) => void;
}) {
  return (
    <div>
      <div className="chips" role="tablist" aria-label="Service type">
        {(['treatment', 'package'] as const).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} className={`chip ${kind === k ? 'is-active' : ''}`} onClick={() => setKind(k)}>{k === 'treatment' ? 'Treatments' : 'Packages'}</button>
        ))}
      </div>
      <fieldset className="choice-list">
        <legend className="sr-only">{kind === 'treatment' ? 'Treatments' : 'Packages'}</legend>
        {kind === 'treatment'
          ? treatmentCategories.map((cat) => (
              <div key={cat.id} className="choice-group">
                <h3 className="choice-group-title">{cat.name}</h3>
                {treatments.filter((t) => t.category === cat.id).map((t) => (
                  <label key={t.slug} className={`choice ${slug === t.slug && kind === 'treatment' ? 'is-selected' : ''}`}>
                    <input type="radio" name="service" checked={slug === t.slug && kind === 'treatment'} onChange={() => pick('treatment', t.slug)} />
                    <span className="choice-main"><strong>{t.name}</strong><span>{t.options.map((o) => `${formatDuration(o.minutes)} · ${formatPrice(o.price)}`).join('  /  ')}</span></span>
                  </label>
                ))}
              </div>
            ))
          : packages.map((p) => (
              <label key={p.slug} className={`choice ${slug === p.slug && kind === 'package' ? 'is-selected' : ''}`}>
                <input type="radio" name="service" checked={slug === p.slug && kind === 'package'} onChange={() => pick('package', p.slug)} />
                <span className="choice-main"><strong>{p.name}</strong><span>{p.duration} · {formatPrice(p.price)} {p.priceNote}</span></span>
              </label>
            ))}
      </fieldset>

      {service && kind === 'treatment' && (service.source as typeof treatments[number]).options.length > 1 && (
        <fieldset className="option-row">
          <legend>Duration</legend>
          {(service.source as typeof treatments[number]).options.map((o) => (
            <label key={o.minutes} className={`pill ${service.durationMinutes === o.minutes ? 'is-selected' : ''}`}>
              <input type="radio" name="option" checked={service.durationMinutes === o.minutes} onChange={() => setOption(o.minutes)} />
              {formatDuration(o.minutes)} · {formatPrice(o.price)}
            </label>
          ))}
        </fieldset>
      )}

      {service && (
        <div className="guest-row">
          {service.fixedGuests ? (
            <p><Icon name="users" size={18} /> This package is for <strong>{service.minGuests} guests</strong>.</p>
          ) : service.maxGuests > 1 ? (
            <div className="field">
              <label htmlFor="bk-guests">Number of guests</label>
              <select id="bk-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                {Array.from({ length: service.maxGuests }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
              </select>
            </div>
          ) : (
            <p><Icon name="user" size={18} /> This treatment is for <strong>1 guest</strong>.</p>
          )}
        </div>
      )}
    </div>
  );
}

function DateTimeStep({ date, time, setDate, setTime, duration, pool, bookings, ignoreId }: {
  date: string; time: string; setDate: (d: string) => void; setTime: (t: string) => void; duration: number;
  pool: ReturnType<typeof eligibleStaff>; bookings: BookingRecord[]; ignoreId?: string;
}) {
  const days = useMemo(() => bookableDates(), []);
  const lead = parseISODate(days[0].iso).getDay();
  const slots = useMemo(() => (date ? getSlots({ iso: date, durationMinutes: duration, pool, bookings, ignoreBookingId: ignoreId }) : []), [date, duration, pool, bookings, ignoreId]);
  const hasPool = pool.length > 0;
  const dayHasSlots = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const d of days) m.set(d.iso, d.open && getSlots({ iso: d.iso, durationMinutes: duration, pool, bookings, ignoreBookingId: ignoreId }).some((s) => s.available));
    return m;
  }, [days, duration, pool, bookings, ignoreId]);
  return (
    <div>
      {!hasPool && <p className="field-error" role="alert">No therapists are available for this selection. Please go back and change your preference.</p>}
      <div className="calendar" role="group" aria-label="Choose a date">
        {WEEKDAYS.map((d) => <span key={d} className="cal-head" aria-hidden="true">{d}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
        {days.map((d) => {
          const dt = parseISODate(d.iso);
          const label = dt.toLocaleDateString(site.locale, { weekday: 'long', month: 'long', day: 'numeric' });
          const hasSlots = hasPool && !!dayHasSlots.get(d.iso);
          return (
            <button key={d.iso} type="button" className={`cal-day ${date === d.iso ? 'is-selected' : ''}`} disabled={!hasSlots} aria-pressed={date === d.iso} aria-label={`${label}${d.open ? (hasSlots ? '' : ' — fully booked') : ' — closed'}`} onClick={() => setDate(d.iso)}>
              {dt.getDate() === 1 || d === days[0] ? <small>{dt.toLocaleDateString(site.locale, { month: 'short' })}</small> : null}
              <span>{dt.getDate()}</span>
            </button>
          );
        })}
      </div>
      {date && (
        <div className="slots" role="group" aria-label={`Available times on ${formatLongDate(date)}`}>
          <h3 className="h-sub">{formatLongDate(date)}</h3>
          {slots.length === 0 && <p className="muted">We are closed on this day.</p>}
          {slots.length > 0 && !slots.some((s) => s.available) && <p className="muted">No times left on this day. Please choose another date.</p>}
          <div className="slot-grid">
            {slots.map((s) => (
              <button key={s.time} type="button" className={`slot ${time === s.time ? 'is-selected' : ''}`} disabled={!s.available} aria-pressed={time === s.time} onClick={() => setTime(s.time)} aria-label={`${formatTime(s.time)}${s.available ? '' : ' — unavailable'}`}>
                {formatTime(s.time)}
              </button>
            ))}
          </div>
          <p className="fine">Demonstration availability — simulated and not synchronised across devices.</p>
        </div>
      )}
    </div>
  );
}

export function BookingSummary({ b }: { b: BookingRecord }) {
  return (
    <dl className="summary-list">
      <div><dt>Service</dt><dd>{b.service.name} <span className="muted">({b.service.optionLabel})</span></dd></div>
      <div><dt>Therapist</dt><dd>{b.staffName}</dd></div>
      <div><dt>When</dt><dd>{formatLongDate(b.date)} at {formatTime(b.time)}</dd></div>
      <div><dt>Guests</dt><dd>{b.guests}</dd></div>
      <div className="summary-total"><dt>Estimated total</dt><dd>{formatPrice(b.total)}</dd></div>
    </dl>
  );
}

