import { useState } from 'react';
import { Link } from 'react-router-dom';
import { booking as cfg } from '../config/booking';
import { site } from '../config/site';
import { ctas } from '../config/navigation';
import { toISODate } from '../lib/format';
import { cancelBooking, deleteBooking, useBookings, type BookingRecord } from '../lib/bookings';
import { formatLongDate, formatPrice, formatTime } from '../lib/format';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Button, DemoNotice, EmptyState, LinkButton, SectionHeading } from '../components/ui';

export default function BookingManage() {
  const bookings = useBookings();
  const [confirming, setConfirming] = useState<string | null>(null);
  const today = toISODate(new Date());
  const sorted = [...bookings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const statusOf = (b: BookingRecord) => (b.status === 'cancelled' ? 'Cancelled' : b.date < today ? 'Past' : 'Upcoming');
  return (
    <>
      <Seo title={site.pages.manage.title} description={site.pages.manage.description} noindex />
      <section className="page-hero page-hero--compact">
        <div className="container">
          <SectionHeading as="h1" eyebrow="Demonstration bookings" title="My bookings" text="Bookings made on this device. Nothing here exists outside your browser." />
          <DemoNotice tone="warn">{cfg.disclosure}</DemoNotice>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container narrow">
          {sorted.length === 0 ? (
            <EmptyState title="No demo bookings yet" text="When you make a demonstration booking it will appear here, where you can review, reschedule or cancel it." action={<LinkButton to={ctas.book.to}>Make a demo booking</LinkButton>} />
          ) : (
            <ul className="booking-list" aria-label="Saved demonstration bookings">
              {sorted.map((b) => {
                const status = statusOf(b);
                return (
                  <li key={b.id} className={`booking-item is-${status.toLowerCase()}`}>
                    <div className="booking-item-head">
                      <div><p className="eyebrow">{b.reference}</p><h2 className="h-sub">{b.service.name}</h2></div>
                      <span className={`status status--${status.toLowerCase()}`}>{status}</span>
                    </div>
                    <p className="booking-when"><Icon name="calendar" size={18} /> {formatLongDate(b.date)} at {formatTime(b.time)}</p>
                    <p className="muted">{b.staffName} · {b.service.optionLabel} · {b.guests} {b.guests === 1 ? 'guest' : 'guests'} · {formatPrice(b.total)}</p>
                    <p className="muted">{b.customer.name} · {b.customer.email}</p>
                    <div className="btn-row">
                      {status === 'Upcoming' && confirming !== b.id && (
                        <>
                          <Link className="btn btn--outline btn--sm" to={`/booking?reschedule=${b.id}`}><span>Reschedule</span></Link>
                          <Button variant="ghost" className="btn--sm" onClick={() => setConfirming(b.id)}>Cancel booking</Button>
                        </>
                      )}
                      {confirming === b.id && (
                        <div className="inline-confirm" role="alertdialog" aria-label="Confirm cancellation">
                          <span>Cancel this demo booking?</span>
                          <Button className="btn--sm" onClick={() => { cancelBooking(b.id); setConfirming(null); }}>Yes, cancel it</Button>
                          <Button variant="outline" className="btn--sm" onClick={() => setConfirming(null)}>Keep it</Button>
                        </div>
                      )}
                      {status !== 'Upcoming' && <Button variant="ghost" className="btn--sm" onClick={() => deleteBooking(b.id)}><Icon name="trash" size={16} /> Remove from this device</Button>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
