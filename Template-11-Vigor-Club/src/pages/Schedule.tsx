import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { site } from '../config/site';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { Button, DemoBadge, EmptyState, Intensity, PageHero, TextField } from '../components/ui';
import { bookingSettings } from '../config/booking';
import { classes, dayNames } from '../config/classes';
import { programs, getProgram } from '../config/programs';
import { trainers } from '../config/trainers';
import type { ClassSession } from '../config/types';
import { addMinutes, formatLongDate, formatShortDate, formatTime, isoDate, parseIso } from '../lib/format';
import { availability, lastBookableDate, sessionsOn, startOfWeek, weekDates, weekdayIndex, addDays } from '../lib/schedule';
import { book, cancel, findClass, loadProfile, loadReservations, programName, trainerName, type Reservation } from '../lib/reservations';
import { validateProfile } from '../lib/validation';

type Filters = { program: string; trainer: string };

function DemoNotice() {
  return (
    <aside className="demo-banner" aria-label="Demonstration notice">
      <Icon name="info" size={20} />
      <p><b>{bookingSettings.demoLabel}.</b> {bookingSettings.demoExplainer}</p>
    </aside>
  );
}

function ClassModal({ session, date, now, reservations, onChange, onClose }: { session: ClassSession; date: string; now: Date; reservations: Reservation[]; onChange: (r: Reservation[]) => void; onClose: () => void }) {
  const mine = reservations.find((r) => r.classId === session.id && r.date === date);
  const avail = availability(session, date, now, !!mine);
  const program = getProgram(session.programSlug);
  const [profile, setProfile] = useState(() => loadProfile());
  const [errors, setErrors] = useState<ReturnType<typeof validateProfile>>({});
  const [formError, setFormError] = useState('');
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);
  const [storedOk, setStoredOk] = useState(true);
  const [cancelled, setCancelled] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateProfile(profile);
    setErrors(errs);
    setFormError('');
    if (Object.keys(errs).length) return;
    const result = book(session, date, profile, reservations);
    if (!result.ok) { setFormError(result.message); return; }
    setStoredOk(result.stored);
    setConfirmed(result.reservation);
    onChange(loadReservations());
  };

  const doCancel = (ref: string) => {
    onChange(cancel(ref, reservations));
    setConfirmed(null);
    setCancelled(true);
  };

  const heading = `${session.title}`;
  return (
    <Modal title={heading} onClose={onClose}>
      <p className="modal-sub"><DemoBadge>Demo booking</DemoBadge> {formatLongDate(date)} · {formatTime(session.start)}–{formatTime(addMinutes(session.start, session.duration))}</p>
      <dl className="facts facts--row">
        <div><dt>Duration</dt><dd>{session.duration} min</dd></div>
        <div><dt>Trainer</dt><dd><Link to={`/trainers/${session.trainerSlug}`}>{trainerName(session.trainerSlug)}</Link></dd></div>
        <div><dt>Room</dt><dd>{session.room}</dd></div>
        <div><dt>Level</dt><dd>{program?.level}</dd></div>
        <div><dt>Intensity</dt><dd>{program && <Intensity level={program.intensity} />}</dd></div>
        <div><dt>Demo places</dt><dd>{avail.full && !mine ? 'Full' : `${avail.left} of ${session.capacity} left`}</dd></div>
      </dl>
      <p>{session.blurb}</p>
      {program && <p><Link to={`/programs/${program.slug}`}>About {program.name} <Icon name="arrow" size={14} /></Link></p>}

      {confirmed ? (
        <div className="confirm" role="status">
          <Icon name="check" size={28} />
          <h3>Demo reservation saved</h3>
          <p>Reference <b>{confirmed.ref}</b> for {session.title}, {formatLongDate(confirmed.date)} at {formatTime(session.start)}.</p>
          <p className="note">{bookingSettings.demoExplainer}</p>
          {!storedOk && <p className="field-error" role="alert">Your browser blocked local storage, so this reservation will not persist after you leave the page.</p>}
          <div className="btn-row">
            <Button onClick={onClose} data-autofocus>Done</Button>
            <Button variant="ghost" onClick={() => doCancel(confirmed.ref)}>Cancel this reservation</Button>
          </div>
        </div>
      ) : cancelled ? (
        <div className="confirm" role="status">
          <Icon name="check" size={28} />
          <h3>Reservation cancelled</h3>
          <p>Your demo place has been released.</p>
          <Button onClick={onClose} data-autofocus>Close</Button>
        </div>
      ) : mine ? (
        <div className="confirm" role="status">
          <Icon name="check" size={28} />
          <h3>You are booked in (demo)</h3>
          <p>Reference <b>{mine.ref}</b>. Reserved as {mine.name}.</p>
          <div className="btn-row">
            <Button variant="ghost" onClick={() => doCancel(mine.ref)} data-autofocus>Cancel reservation</Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
      ) : avail.closed ? (
        <p className="note" role="status">Booking for this class has closed ({bookingSettings.cutoffMinutes} minutes before the start, or already started).</p>
      ) : avail.full ? (
        <p className="note" role="status">This class is full in the demonstration. Try another time or <Link to="/contact?topic=general">ask the team</Link>.</p>
      ) : (
        <form onSubmit={submit} noValidate className="form" aria-label={`Reserve ${session.title}`}>
          <h3 className="h-sub">Reserve a demo place</h3>
          <div className="form-grid">
            <TextField label="Full name" name="name" autoComplete="name" required value={profile.name} error={errors.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <TextField label="Email" name="email" type="email" autoComplete="email" required value={profile.email} error={errors.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          {formError && <p className="field-error" role="alert">{formError}</p>}
          <p className="fine-print">Saved in this browser only. No email is sent and no payment is taken.</p>
          <Button type="submit">Confirm demo reservation</Button>
        </form>
      )}
    </Modal>
  );
}

function ReservationsPanel({ reservations, now, onCancel, onOpen }: { reservations: Reservation[]; now: Date; onCancel: (r: Reservation) => void; onOpen: (r: Reservation) => void }) {
  const rows = reservations
    .map((r) => ({ r, c: findClass(r.classId)! }))
    .filter((x) => x.c)
    .sort((a, b) => (a.r.date + a.c.start).localeCompare(b.r.date + b.c.start));
  return (
    <section id="reservations" className="reservations" aria-labelledby="res-title" tabIndex={-1}>
      <h2 id="res-title" className="h-display">My demo reservations</h2>
      <p className="note">{bookingSettings.demoLabel}.</p>
      {rows.length === 0 ? (
        <EmptyState title="No reservations yet" text="Choose a day above, open a class and reserve a demonstration place. Your reservations will appear here." />
      ) : (
        <ul className="res-list">
          {rows.map(({ r, c }) => {
            const past = new Date(`${r.date}T${c.start}:00`).getTime() < now.getTime();
            return (
              <li key={r.ref} className={past ? 'is-past' : ''}>
                <div>
                  <p className="res-date">{formatLongDate(r.date)} · {formatTime(c.start)}</p>
                  <p className="res-title">{c.title} <span>with {trainerName(c.trainerSlug)} · {c.room}</span></p>
                  <p className="res-ref">Ref {r.ref}{past ? ' · completed (demo)' : ''}</p>
                </div>
                <div className="btn-row">
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => onOpen(r)}><span>Details</span></button>
                  {!past && <button type="button" className="btn btn--ghost btn--sm" onClick={() => onCancel(r)}><span>Cancel<span className="sr-only"> {c.title} on {formatShortDate(r.date)}</span></span></button>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function Schedule() {
  const [params, setParams] = useSearchParams();
  const [now, setNow] = useState(() => new Date());
  const today = useMemo(() => new Date(now.getFullYear(), now.getMonth(), now.getDate()), [now]);
  const todayIso = isoDate(today);
  const [reservations, setReservations] = useState<Reservation[]>(() => loadReservations());
  const [filters, setFilters] = useState<Filters>({ program: 'All', trainer: 'All' });
  const [toCancel, setToCancel] = useState<Reservation | null>(null);
  const [cancelledNote, setCancelledNote] = useState('');

  // Initial day/class from ?day=&class= (used by links from other pages).
  const initial = useMemo(() => {
    const d = Number(params.get('day'));
    if (!Number.isInteger(d) || params.get('day') === null || d < 0 || d > 6) return { date: todayIso, offset: 0 };
    const mon = startOfWeek(today);
    let date = addDays(mon, d);
    if (isoDate(date) < todayIso) date = addDays(date, 7);
    const offset = Math.round((startOfWeek(date).getTime() - mon.getTime()) / (7 * 86_400_000));
    return { date: isoDate(date), offset };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [open, setOpen] = useState<{ id: string; date: string } | null>(() => {
    const id = params.get('class');
    return id && findClass(id) ? { id, date: initial.date } : null;
  });
  const [offset, setOffset] = useState(initial.offset);
  const [date, setDate] = useState(initial.date);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    // Strip the one-off deep-link parameters so reloads and shared URLs stay clean.
    if (params.has('class') || params.has('day')) {
      const next = new URLSearchParams(params);
      next.delete('class'); next.delete('day');
      setParams(next, { replace: true });
    }
    // run once for the initial deep link
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dates = weekDates(today, offset);
  const last = lastBookableDate(today);
  const programsWithClasses = programs.filter((p) => classes.some((c) => c.programSlug === p.slug));
  const trainersWithClasses = trainers.filter((t) => classes.some((c) => c.trainerSlug === t.slug));

  const dayList = sessionsOn(date).filter((c) => (filters.program === 'All' || c.programSlug === filters.program) && (filters.trainer === 'All' || c.trainerSlug === filters.trainer));
  const filtersOn = filters.program !== 'All' || filters.trainer !== 'All';
  const dayHasAny = sessionsOn(date).length > 0;

  const pickWeek = (o: number) => {
    setOffset(o);
    const idx = weekdayIndex(parseIso(date));
    const ds = weekDates(today, o);
    const candidate = ds[idx] >= todayIso ? ds[idx] : ds.find((d) => d >= todayIso) ?? ds[0];
    setDate(candidate);
  };

  const openSession = open ? findClass(open.id) : undefined;
  const cancelSession = toCancel ? findClass(toCancel.classId) : undefined;

  return (
    <>
      <Seo title="Class Schedule & Booking" description={`Browse the weekly ${site.brand.name} class timetable, filter by class type and trainer, and reserve a demonstration place.`} />
      <PageHero eyebrow="Classes & schedule" title={<>Pick a day. <span className="accent">Pick a class.</span></>} intro="Filter the weekly timetable by class and trainer, then reserve a place. Booking is a demonstration with no server." />
      <section className="section section--tight">
        <div className="container">
          <DemoNotice />

          <div className="week-nav">
            <button type="button" className="icon-btn icon-btn--bordered" onClick={() => pickWeek(offset - 1)} disabled={offset <= 0} aria-label="Previous week"><Icon name="chevronLeft" size={20} /></button>
            <p className="week-label" aria-live="polite">{formatShortDate(dates[0])} – {formatShortDate(dates[6])}{offset === 0 ? ' · this week' : ''}</p>
            <button type="button" className="icon-btn icon-btn--bordered" onClick={() => pickWeek(offset + 1)} disabled={offset >= bookingSettings.weeksAhead - 1} aria-label="Next week"><Icon name="chevronRight" size={20} /></button>
          </div>
          <div className="day-tabs day-tabs--dates" role="group" aria-label="Choose a day">
            {dates.map((d, i) => {
              const past = d < todayIso || d > last;
              return (
                <button key={d} type="button" className={`day-tab ${d === date ? 'is-active' : ''}`} aria-pressed={d === date} disabled={past} onClick={() => setDate(d)}>
                  <span>{dayNames[i].slice(0, 3)}</span> <b>{parseIso(d).getDate()}</b>
                  <span className="sr-only"> — {dayNames[i]} {formatShortDate(d)}{d === todayIso ? ', today' : ''}</span>
                </button>
              );
            })}
          </div>

          <div className="filter-bar filter-bar--schedule">
            <div className="chip-row" role="group" aria-label="Filter by class type">
              {[{ slug: 'All', name: 'All classes' }, ...programsWithClasses.map((p) => ({ slug: p.slug, name: p.name }))].map((p) => (
                <button key={p.slug} type="button" className={`chip-btn ${filters.program === p.slug ? 'is-active' : ''}`} aria-pressed={filters.program === p.slug} onClick={() => setFilters({ ...filters, program: p.slug })}>{p.name}</button>
              ))}
            </div>
            <label className="select-inline">
              <span>Trainer</span>
              <select value={filters.trainer} onChange={(e) => setFilters({ ...filters, trainer: e.target.value })}>
                <option value="All">All trainers</option>
                {trainersWithClasses.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </select>
            </label>
          </div>

          <h2 className="h-sub schedule-day-title" aria-live="polite">{formatLongDate(date)}{date === todayIso ? ' — today' : ''}</h2>
          {dayList.length ? (
            <ul className="class-list" aria-label={`Classes on ${formatLongDate(date)}`}>
              {dayList.map((c) => {
                const mine = reservations.some((r) => r.classId === c.id && r.date === date);
                const av = availability(c, date, now, mine);
                const state = mine ? 'Booked' : av.closed ? 'Closed' : av.full ? 'Full' : `${av.left} left`;
                return (
                  <li key={c.id} className={`class-row ${mine ? 'is-booked' : ''} ${av.closed && !mine ? 'is-closed' : ''}`}>
                    <div className="class-time"><b>{formatTime(c.start)}</b><span>{c.duration} min</span></div>
                    <div className="class-main">
                      <h3 className="h-card">{c.title}</h3>
                      <p>{programName(c.programSlug)} · {trainerName(c.trainerSlug)} · {c.room}</p>
                    </div>
                    <div className={`class-state ${mine ? 'is-mine' : av.full || av.closed ? 'is-off' : ''}`}><span>{state}</span><small>of {c.capacity} demo places</small></div>
                    <Button variant={mine ? 'ghost' : 'primary'} onClick={() => setOpen({ id: c.id, date })} aria-label={`${mine ? 'Manage' : av.closed || av.full ? 'Details' : 'Book'} — ${c.title}, ${formatTime(c.start)}`}>{mine ? 'Manage' : av.closed || av.full ? 'Details' : 'Book'}</Button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              title={filtersOn && dayHasAny ? 'No classes match these filters' : 'No classes on this day'}
              text={filtersOn && dayHasAny ? 'Try another class type or trainer, or clear the filters.' : 'There are no group classes scheduled for this day. Choose another day.'}
              action={filtersOn ? <Button variant="ghost" onClick={() => setFilters({ program: 'All', trainer: 'All' })}>Clear filters</Button> : undefined}
            />
          )}
          {cancelledNote && <p className="note" role="status">{cancelledNote}</p>}

          <ReservationsPanel reservations={reservations} now={now} onCancel={setToCancel} onOpen={(r) => setOpen({ id: r.classId, date: r.date })} />
        </div>
      </section>

      {open && openSession && (
        <ClassModal session={openSession} date={open.date} now={now} reservations={reservations} onChange={setReservations} onClose={() => setOpen(null)} />
      )}
      {toCancel && cancelSession && (
        <Modal title="Cancel this reservation?" onClose={() => setToCancel(null)}>
          <p>Cancel your demo place in <b>{cancelSession.title}</b> on {formatLongDate(toCancel.date)} at {formatTime(cancelSession.start)}?</p>
          <div className="btn-row">
            <Button onClick={() => { setReservations(cancel(toCancel.ref, reservations)); setCancelledNote(`Reservation ${toCancel.ref} cancelled.`); setToCancel(null); window.setTimeout(() => document.getElementById('reservations')?.focus(), 0); }} data-autofocus>Yes, cancel it</Button>
            <Button variant="ghost" onClick={() => setToCancel(null)}>Keep reservation</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
