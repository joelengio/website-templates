import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button, { LinkButton } from '../components/Button';
import DateRangePicker from '../components/DateRangePicker';
import GuestPicker from '../components/GuestPicker';
import Icon from '../components/Icon';
import Img from '../components/Img';
import PriceBreakdown from '../components/PriceBreakdown';
import { PageHero } from '../components/Section';
import { booking, promotions, ratePlans } from '../config/booking';
import { rooms } from '../config/rooms';
import { seoRoutes } from '../config/seo';
import { site } from '../config/site';
import type { Room } from '../config/types';
import { useReservations } from '../hooks/useReservations';
import { useSeo } from '../hooks/useSeo';
import { availability } from '../lib/availability';
import { addDays, diffDays, formatDate } from '../lib/dates';
import { cents, plural } from '../lib/format';
import { quote } from '../lib/pricing';
import { freeCancelBy, reservationStore } from '../lib/reservations';
import { nearestAvailableStart, readStay, roomFits, today, writeStay, type StayParams } from '../lib/stay';
import { defaultLimits, validateDates, validateGuest, validateGuests, type GuestDetails } from '../lib/validation';

type Step = 'stay' | 'rooms' | 'details' | 'review';
const steps: { id: Step; label: string }[] = [
  { id: 'stay', label: 'Dates & guests' },
  { id: 'rooms', label: 'Room & rate' },
  { id: 'details', label: 'Your details' },
  { id: 'review', label: 'Review & confirm' },
];

const emptyGuest: GuestDetails = { firstName: '', lastName: '', email: '', phone: '', requests: '' };

export default function Booking() {
  useSeo({ ...seoRoutes['/booking'], path: '/booking' });
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const stay = readStay(sp);
  const reservations = useReservations();
  const t = today();
  const limits = defaultLimits(t);

  const dateErrors = validateDates({ checkIn: stay.checkIn, checkOut: stay.checkOut }, limits);
  const guestErrors = validateGuests(stay.adults, stay.children);
  const stayValid = !dateErrors.length && !guestErrors.length;
  const nights = stayValid ? diffDays(stay.checkIn, stay.checkOut) : 0;
  const selected: Room | undefined = rooms.find((r) => r.id === stay.room);
  const selectedPlan = ratePlans.find((p) => p.id === stay.plan);
  const [step, setStep] = useState<Step>(stayValid && stay.checkIn && stay.checkOut ? 'rooms' : 'stay');
  const [touched, setTouched] = useState(!!(stay.checkIn || stay.checkOut));
  const [guest, setGuest] = useState<GuestDetails>(emptyGuest);
  const [gErr, setGErr] = useState<Partial<Record<keyof GuestDetails, string>>>({});
  const [ack, setAck] = useState(false);
  const [submitErr, setSubmitErr] = useState<{ code: string; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [promoInput, setPromoInput] = useState(stay.promo);
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  const set = (patch: Partial<StayParams>, replace = true) => setSp(writeStay({ ...stay, ...patch }), { replace });

  // A valid selection is required for steps 3–4.
  const effectiveStep: Step = !stayValid ? 'stay' : (step === 'details' || step === 'review') && !(selected && selectedPlan) ? 'rooms' : step;
  const stepIndex = steps.findIndex((s) => s.id === effectiveStep);

  // Move focus to the step heading whenever the step changes (and on arrival with a prefilled search).
  useEffect(() => {
    if (mounted.current || effectiveStep !== 'stay') heading.current?.focus({ preventScroll: true });
    mounted.current = true;
  }, [effectiveStep]);

  const candidates = useMemo(() => {
    if (!stayValid) return [];
    return rooms
      .filter((r) => r.units > 0)
      .map((room) => {
        const fit = roomFits(room, stay.adults, stay.children);
        const avail = availability(room, stay.checkIn, stay.checkOut, reservations);
        const quotes = ratePlans.map((plan) => ({ plan, quote: quote({ room, ratePlanId: plan.id, checkIn: stay.checkIn, checkOut: stay.checkOut, adults: stay.adults, children: stay.children, promoCode: stay.promo, today: t }) }));
        return { room, fit, avail, quotes };
      });
  }, [stayValid, stay.checkIn, stay.checkOut, stay.adults, stay.children, stay.promo, reservations, t]);

  const bookable = candidates.filter((c) => c.fit.fits && c.avail.available).sort((a, b) => (a.room.id === stay.room ? -1 : b.room.id === stay.room ? 1 : a.quotes[0].quote.total - b.quotes[0].quote.total));
  const soldOut = candidates.filter((c) => c.fit.fits && !c.avail.available);
  const unfit = candidates.filter((c) => !c.fit.fits);
  const alt = stayValid && !bookable.length ? nearestAvailableStart(stay.checkIn, stay.checkOut, stay.adults, stay.children, reservations) : null;
  const promoKnown = !stay.promo || promotions.some((p) => p.code === stay.promo.toUpperCase());

  const current = selected && selectedPlan && stayValid ? quote({ room: selected, ratePlanId: selectedPlan.id, checkIn: stay.checkIn, checkOut: stay.checkOut, adults: stay.adults, children: stay.children, promoCode: stay.promo, today: t }) : null;

  const submitGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateGuest(guest);
    setGErr(errs);
    const first = Object.keys(errs)[0];
    if (first) return void document.getElementById(`g-${first}`)?.focus();
    setStep('review');
  };

  const confirm = () => {
    if (submitting || !selected || !selectedPlan) return;
    setSubmitting(true);
    const res = reservationStore.create({ roomId: selected.id, ratePlanId: selectedPlan.id, checkIn: stay.checkIn, checkOut: stay.checkOut, adults: stay.adults, children: stay.children, guest, promoCode: current?.discount?.code });
    if (res.ok) nav(`/booking/confirmation/${res.value.id}`);
    else {
      setSubmitErr({ code: res.code, message: res.message });
      setSubmitting(false);
    }
  };

  const field = (name: keyof GuestDetails, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={`field${gErr[name] ? ' has-error' : ''}`}>
      <label htmlFor={`g-${name}`}>{label}</label>
      <input id={`g-${name}`} value={guest[name]} aria-invalid={!!gErr[name]} aria-describedby={gErr[name] ? `g-${name}-err` : undefined} onChange={(e) => setGuest({ ...guest, [name]: e.target.value })} {...props} />
      {gErr[name] && <p id={`g-${name}-err`} className="field-error" role="alert">{gErr[name]}</p>}
    </div>
  );

  const summary = (
    <aside className="summary" aria-labelledby="summary-h">
      <h2 id="summary-h" className="summary__title">Your stay</h2>
      {stayValid ? (
        <>
          <p className="summary__dates"><Icon name="calendar" size={18} /> {formatDate(stay.checkIn, { day: 'numeric', month: 'short' })} → {formatDate(stay.checkOut, { day: 'numeric', month: 'short', year: 'numeric' })} · {plural(nights, 'night')}</p>
          <p className="summary__dates"><Icon name="users" size={18} /> {plural(stay.adults, 'adult')}{stay.children ? `, ${plural(stay.children, 'child', 'children')}` : ''}</p>
        </>
      ) : <p className="muted">Choose dates and guests to see prices.</p>}
      {selected && current && selectedPlan ? (
        <>
          <p className="summary__room"><strong>{selected.name}</strong><span>{selectedPlan.name}</span></p>
          <PriceBreakdown quote={current} compact />
        </>
      ) : stayValid ? <p className="muted">Select a room and rate to see a full breakdown.</p> : null}
      <p className="note">{site.demoNotice}</p>
    </aside>
  );

  return (
    <>
      <PageHero kicker="Reservations" title="Reserve your stay" text="A complete booking flow with transparent pricing — a local demonstration with simulated availability." />
      <section className="section section--cream booking">
        <div className="container">
          <div className="notice" role="note"><Icon name="info" size={20} /> <p><strong>Demonstration only.</strong> {site.demoNotice} Availability is simulated and no real hotel receives your details.</p></div>
          <nav aria-label="Booking progress" className="steps">
            <ol>
              {steps.map((s, i) => (
                <li key={s.id} aria-current={i === stepIndex ? 'step' : undefined} className={i < stepIndex ? 'is-done' : i === stepIndex ? 'is-current' : ''}>
                  {i < stepIndex ? <button type="button" onClick={() => setStep(s.id)}><span className="steps__n">{i + 1}</span> {s.label}</button> : <span><span className="steps__n">{i + 1}</span> {s.label}</span>}
                </li>
              ))}
            </ol>
          </nav>

          <div className="booking__layout">
            <div className="booking__main">
              {effectiveStep === 'stay' && (
                <section aria-labelledby="step-h">
                  <h2 id="step-h" ref={heading} tabIndex={-1} className="display display--sm">When would you like to stay?</h2>
                  {selected && <p className="selected-room"><Icon name="check" size={18} /> Booking <strong>{selected.name}</strong> — pick your dates to continue.</p>}
                  <div className="panel">
                    <div className="bw bw--panel bw--stack">
                      <DateRangePicker idPrefix="bk" checkIn={stay.checkIn} checkOut={stay.checkOut} error={touched ? dateErrors[0]?.message : undefined} onChange={(a, b) => set({ checkIn: a, checkOut: b })} />
                      <GuestPicker idPrefix="bk" adults={stay.adults} children={stay.children} error={guestErrors[0]?.message} onChange={(a, c) => set({ adults: a, children: c })} />
                      <Button arrow onClick={() => { setTouched(true); if (stayValid) setStep('rooms'); }}>See available rooms</Button>
                    </div>
                  </div>
                  {touched && dateErrors.length > 0 && <ul className="errors" role="alert">{dateErrors.map((e) => <li key={e.code}>{e.message}</li>)}</ul>}
                </section>
              )}

              {effectiveStep === 'rooms' && (
                <section aria-labelledby="step-h">
                  <h2 id="step-h" ref={heading} tabIndex={-1} className="display display--sm">Choose your room & rate</h2>
                  <div className="panel panel--compact">
                    <div className="bw bw--panel bw--stack">
                      <DateRangePicker idPrefix="bk" checkIn={stay.checkIn} checkOut={stay.checkOut} onChange={(a, b) => set({ checkIn: a, checkOut: b, room: '', plan: '' })} />
                      <GuestPicker idPrefix="bk" adults={stay.adults} children={stay.children} onChange={(a, c) => set({ adults: a, children: c, room: '', plan: '' })} />
                    </div>
                    <form className="promo" onSubmit={(e) => { e.preventDefault(); set({ promo: promoInput.trim().toUpperCase() }); }}>
                      <label htmlFor="promo">Promo code</label>
                      <div>
                        <input id="promo" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="e.g. WELCOME10" autoComplete="off" />
                        <Button type="submit" variant="secondary">Apply</Button>
                        {stay.promo && <Button variant="text" onClick={() => { setPromoInput(''); set({ promo: '' }); }}>Remove</Button>}
                      </div>
                      <p role="status" className={promoKnown ? 'muted' : 'field-error'}>{stay.promo ? (promoKnown ? `Code ${stay.promo.toUpperCase()} applied where eligible.` : `Sorry, “${stay.promo}” is not a valid code.`) : 'Optional. Automatic offers apply on their own. Try WELCOME10, COUPLES, FAMILY or WELLNESS.'}</p>
                    </form>
                  </div>
                  <p className="results-line" role="status">{plural(bookable.length, 'room')} available for {plural(nights, 'night')} (simulated)</p>
                  {bookable.length === 0 && (
                    <div className="empty" role="status">
                      <h3>No rooms available for those dates</h3>
                      <p>{unfit.length === candidates.length ? 'None of our rooms can host a party of this size. Try fewer guests or contact us about combining rooms.' : 'Every room that fits your party is sold out (simulated) for these dates.'}</p>
                      {alt && <Button variant="primary" onClick={() => set({ checkIn: alt, checkOut: addDays(alt, nights), room: '', plan: '' })}>Move my stay to {formatDate(alt, { day: 'numeric', month: 'short' })}</Button>}
                      <LinkButton to="/contact" variant="text">Contact reservations</LinkButton>
                    </div>
                  )}
                  <ul className="offer-list">
                    {bookable.map(({ room, avail, quotes }) => (
                      <li key={room.id} className={`offer-room${room.id === stay.room ? ' is-selected' : ''}`}>
                        <div className="offer-room__media"><Img src={room.images[0].src} alt="" ratio={[4, 3]} /></div>
                        <div className="offer-room__body">
                          <h3><Link to={`/rooms/${room.slug}`}>{room.name}</Link> {room.id === stay.room && <span className="badge badge--accent">Your selection</span>}</h3>
                          <p className="muted">{room.beds} · {room.areaSqm} m² · up to {room.maxOccupancy} guests</p>
                          {avail.left <= 2 && <p className="scarcity">Only {avail.left} left (simulated)</p>}
                          <ul className="plans">
                            {quotes.map(({ plan, quote: q }) => (
                              <li key={plan.id} className="plan">
                                <div>
                                  <h4>{plan.name}</h4>
                                  <p className="muted">{plan.description}</p>
                                  {q.discount && <p className="plan__promo"><Icon name="tag" size={14} /> {q.discount.label}: −{cents(q.discount.amount)}</p>}
                                  {stay.promo && q.rejectedCode && q.rejectedCode !== 'unknown' && <p className="muted">Code {stay.promo}: {q.rejectedCode}</p>}
                                </div>
                                <div className="plan__price">
                                  <p><strong>{cents(q.total)}</strong><span>total · {cents(Math.round(q.total / q.nights))} avg/night incl. taxes</span></p>
                                  <Button variant={plan.id === stay.plan && room.id === stay.room ? 'primary' : 'secondary'} onClick={() => { set({ room: room.id, plan: plan.id }); setStep('details'); }} aria-label={`Select ${room.name}, ${plan.name}, total ${cents(q.total)}`}>Select</Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {soldOut.length > 0 && (
                    <details className="more"><summary>{plural(soldOut.length, 'room')} sold out for your dates (simulated)</summary><ul>{soldOut.map((c) => <li key={c.room.id}>{c.room.name} — sold out from {formatDate(c.avail.firstSoldOut!, { day: 'numeric', month: 'short' })}</li>)}</ul></details>
                  )}
                  {unfit.length > 0 && bookable.length > 0 && (
                    <details className="more"><summary>{plural(unfit.length, 'room')} not suitable for your party</summary><ul>{unfit.map((c) => <li key={c.room.id}>{c.room.name} — {c.fit.reason}</li>)}</ul></details>
                  )}
                </section>
              )}

              {effectiveStep === 'details' && selected && (
                <section aria-labelledby="step-h">
                  <h2 id="step-h" ref={heading} tabIndex={-1} className="display display--sm">Your details</h2>
                  <p className="muted">Only used within this browser demonstration. Please do not enter real sensitive information.</p>
                  <form onSubmit={submitGuest} noValidate className="form">
                    <div className="form__row">{field('firstName', 'First name', { autoComplete: 'given-name' })}{field('lastName', 'Last name', { autoComplete: 'family-name' })}</div>
                    <div className="form__row">{field('email', 'Email', { type: 'email', autoComplete: 'email' })}{field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}</div>
                    <div className={`field${gErr.requests ? ' has-error' : ''}`}>
                      <label htmlFor="g-requests">Special requests (optional)</label>
                      <textarea id="g-requests" rows={4} maxLength={600} value={guest.requests} aria-invalid={!!gErr.requests} onChange={(e) => setGuest({ ...guest, requests: e.target.value })} />
                      <p className="muted">{guest.requests.length}/500 · Requests are noted but cannot be guaranteed.</p>
                      {gErr.requests && <p className="field-error" role="alert">{gErr.requests}</p>}
                    </div>
                    <div className="form__actions"><Button variant="ghost" onClick={() => setStep('rooms')}>Back</Button><Button type="submit" arrow>Review reservation</Button></div>
                  </form>
                </section>
              )}

              {effectiveStep === 'review' && selected && selectedPlan && current && (
                <section aria-labelledby="step-h">
                  <h2 id="step-h" ref={heading} tabIndex={-1} className="display display--sm">Review your reservation</h2>
                  <dl className="review-list">
                    <div><dt>Room</dt><dd>{selected.name} · {selected.beds}</dd></div>
                    <div><dt>Rate plan</dt><dd>{selectedPlan.name}</dd></div>
                    <div><dt>Check-in</dt><dd>{formatDate(stay.checkIn)} from {booking.checkInTime}</dd></div>
                    <div><dt>Check-out</dt><dd>{formatDate(stay.checkOut)} by {booking.checkOutTime}</dd></div>
                    <div><dt>Guests</dt><dd>{plural(stay.adults, 'adult')}{stay.children ? `, ${plural(stay.children, 'child', 'children')}` : ''}</dd></div>
                    <div><dt>Guest</dt><dd>{guest.firstName} {guest.lastName} · {guest.email} · {guest.phone}</dd></div>
                    {guest.requests && <div><dt>Requests</dt><dd>{guest.requests}</dd></div>}
                    <div><dt>Cancellation</dt><dd>{selectedPlan.freeCancelDays === null ? 'Non-refundable (illustrative policy).' : `Free cancellation until ${formatDate(freeCancelBy({ ratePlanId: selectedPlan.id, checkIn: stay.checkIn })!, { day: 'numeric', month: 'short', year: 'numeric' })}; later cancellations incur an illustrative charge.`}</dd></div>
                  </dl>
                  <PriceBreakdown quote={current} />
                  <label className="check check--block">
                    <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                    <span>I understand this is a demonstration: nothing is reserved at a real hotel, no payment is taken and the reservation is stored only in this browser.</span>
                  </label>
                  {submitErr && (
                    <div className="alert" role="alert">
                      <p><strong>{submitErr.code === 'DUPLICATE' ? 'Possible duplicate reservation' : 'We could not complete this reservation'}</strong></p>
                      <p>{submitErr.message}</p>
                      {submitErr.code === 'DUPLICATE' ? <LinkButton to="/reservations" variant="secondary">Manage your reservations</LinkButton> : <Button variant="secondary" onClick={() => { setSubmitErr(null); setStep('rooms'); }}>Choose another room or date</Button>}
                    </div>
                  )}
                  <div className="form__actions">
                    <Button variant="ghost" onClick={() => setStep('details')}>Back</Button>
                    <Button disabled={!ack || submitting} onClick={confirm} arrow>{submitting ? 'Confirming…' : 'Confirm demonstration booking'}</Button>
                  </div>
                </section>
              )}
            </div>
            {summary}
          </div>
        </div>
      </section>
    </>
  );
}
