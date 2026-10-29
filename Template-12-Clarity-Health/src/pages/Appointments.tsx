import { useState } from 'react';
import { Link } from 'react-router-dom';
import { booking as cfg } from '../config/booking';
import { site } from '../config/site';
import { recordSummary, SummaryList } from '../components/BookingParts';
import { Dialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';
import { Button, EmptyState, LinkButton, Notice, PageHero } from '../components/ui';
import { cancelBooking, clearAllBookings, deleteBooking, isActive, storageUnavailable, useBookings, type BookingRecord } from '../lib/bookings';
import { serviceById } from '../lib/catalog';
import { formatDate, formatTime, toISODate } from '../lib/format';

type Pending = { kind: 'cancel' | 'delete' | 'clear'; rec?: BookingRecord } | null;

export default function Appointments() {
  const all = useBookings();
  const [pending, setPending] = useState<Pending>(null);
  const [message, setMessage] = useState('');
  const today = toISODate(new Date());

  const upcoming = all.filter((b) => isActive(b)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = all.filter((b) => b.status === 'confirmed' && b.date < today).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const cancelled = all.filter((b) => b.status === 'cancelled');

  const run = () => {
    if (!pending) return;
    if (pending.kind === 'cancel' && pending.rec) {
      cancelBooking(pending.rec.id);
      setMessage(`Demo appointment ${pending.rec.reference} was cancelled. Nothing was sent to any clinic.`);
    } else if (pending.kind === 'delete' && pending.rec) {
      deleteBooking(pending.rec.id);
      setMessage(`Demo appointment ${pending.rec.reference} was removed from this browser.`);
    } else if (pending.kind === 'clear') {
      clearAllBookings();
      setMessage('All demo appointments were deleted from this browser.');
    }
    setPending(null);
  };

  const card = (b: BookingRecord) => {
    const svc = serviceById(b.serviceId);
    return (
      <li key={b.id} className={`appt ${b.status === 'cancelled' ? 'is-cancelled' : ''}`}>
        <div className="appt-head">
          <div>
            <p className="card-kicker">Reference {b.reference}</p>
            <h3>{svc?.name ?? 'Service no longer in configuration'}</h3>
            <p className="appt-when"><Icon name="calendar" size={18} /> {formatDate(b.date)} · {formatTime(b.time)}</p>
          </div>
          <span className={`status status-${b.status === 'cancelled' ? 'cancelled' : b.date < today ? 'past' : 'confirmed'}`}>
            {b.status === 'cancelled' ? 'Cancelled' : b.date < today ? 'Past' : 'Demo confirmed'}
          </span>
        </div>
        <SummaryList s={{ ...recordSummary(b), service: undefined, date: undefined, time: undefined }} contact={b.contact} />
        <div className="btn-row">
          {isActive(b) && (
            <>
              <LinkButton to={`/book?reschedule=${b.id}`} variant="secondary" size="sm" icon="edit">Reschedule<span className="sr-only"> {b.reference}</span></LinkButton>
              <Button variant="ghost" size="sm" icon="close" onClick={() => setPending({ kind: 'cancel', rec: b })}>Cancel<span className="sr-only"> {b.reference}</span></Button>
            </>
          )}
          {(b.status === 'cancelled' || b.date < today) && <Button variant="ghost" size="sm" icon="trash" onClick={() => setPending({ kind: 'delete', rec: b })}>Remove<span className="sr-only"> {b.reference}</span></Button>}
        </div>
      </li>
    );
  };

  const list = (title: string, items: BookingRecord[], id: string) =>
    items.length > 0 && (
      <section aria-labelledby={id} className="appt-section">
        <h2 id={id} className="h3">{title} <span className="count">{items.length}</span></h2>
        <ul className="appt-list">{items.map(card)}</ul>
      </section>
    );

  return (
    <>
      <Seo title="My demo appointments" description="View, reschedule or cancel the demonstration appointments saved in this browser. Nothing is sent to any clinic." noindex />
      <PageHero eyebrow="Demonstration appointments" title="My demo appointments" lead="Appointments you create in the booking demo are saved only in this browser. View, reschedule, cancel or delete them here.">
        <Notice title="Local, not real">{site.notices.privacy}</Notice>
      </PageHero>
      <section className="section-tight">
        <div className="container">
          <div aria-live="polite" role="status" className="flash-wrap">{message && <p className="flash"><Icon name="check" size={18} /> {message}</p>}</div>
          {storageUnavailable() && <Notice tone="warning" title="Saving is blocked in this browser" role="alert">Your browser did not allow localStorage, so demo appointments last only until you leave or refresh the page.</Notice>}

          {all.length === 0 ? (
            <EmptyState title="No demo appointments yet" action={<LinkButton to="/book" icon="calendar">Book a demo appointment</LinkButton>}>
              When you confirm a demo booking, it appears here so you can reschedule or cancel it.
            </EmptyState>
          ) : (
            <>
              {list('Upcoming', upcoming, 'up-title')}
              {upcoming.length === 0 && <p className="muted">No upcoming demo appointments. <Link to="/book">Book one</Link>.</p>}
              {list('Past', past, 'past-title')}
              {list('Cancelled', cancelled, 'cx-title')}
              <p className="muted small">{cfg.policyNote}</p>
              <div className="btn-row">
                <LinkButton to="/book" icon="calendar">Book another demo appointment</LinkButton>
                <Button variant="ghost" icon="trash" onClick={() => setPending({ kind: 'clear' })}>Delete all demo data</Button>
              </div>
            </>
          )}
        </div>
      </section>

      <Dialog
        open={pending?.kind === 'cancel'}
        onClose={() => setPending(null)}
        title="Cancel this demo appointment?"
        description="This only changes the demonstration record saved in your browser. No clinic is notified."
        footer={<><Button variant="ghost" onClick={() => setPending(null)} data-autofocus>Keep appointment</Button><Button onClick={run} icon="close">Cancel appointment</Button></>}
      >
        {pending?.rec && <p><strong>{serviceById(pending.rec.serviceId)?.name}</strong><br />{formatDate(pending.rec.date)} at {formatTime(pending.rec.time)} · {pending.rec.reference}</p>}
        <p className="muted small">{cfg.policyNote}</p>
      </Dialog>
      <Dialog
        open={pending?.kind === 'delete'}
        onClose={() => setPending(null)}
        title="Remove this record?"
        description="The record is deleted from this browser permanently."
        footer={<><Button variant="ghost" onClick={() => setPending(null)} data-autofocus>Keep it</Button><Button onClick={run} icon="trash">Remove</Button></>}
      >
        {pending?.rec && <p>{pending.rec.reference} · {formatDate(pending.rec.date)}</p>}
      </Dialog>
      <Dialog
        open={pending?.kind === 'clear'}
        onClose={() => setPending(null)}
        title="Delete all demo data?"
        description="This removes every demo appointment, including the name, e-mail address and phone number you entered, from this browser."
        footer={<><Button variant="ghost" onClick={() => setPending(null)} data-autofocus>Keep data</Button><Button onClick={run} icon="trash">Delete everything</Button></>}
      >
        <p>This cannot be undone.</p>
      </Dialog>
    </>
  );
}
