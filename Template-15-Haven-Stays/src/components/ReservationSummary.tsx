import { booking, ratePlans } from '../config/booking';
import { formatDate } from '../lib/dates';
import { plural } from '../lib/format';
import { freeCancelBy, type Reservation } from '../lib/reservations';

export default function ReservationSummary({ r }: { r: Reservation }) {
  const plan = ratePlans.find((p) => p.id === r.ratePlanId);
  const free = freeCancelBy(r);
  return (
    <dl className="review-list">
      <div><dt>Confirmation code</dt><dd><strong className="code">{r.id}</strong></dd></div>
      <div><dt>Status</dt><dd><span className={`badge badge--${r.status === 'confirmed' ? 'ok' : 'bad'}`}>{r.status === 'confirmed' ? 'Confirmed (demonstration)' : 'Cancelled'}</span></dd></div>
      <div><dt>Room</dt><dd>{r.roomName}</dd></div>
      <div><dt>Rate plan</dt><dd>{plan?.name ?? r.ratePlanId}</dd></div>
      <div><dt>Check-in</dt><dd>{formatDate(r.checkIn)} · from {booking.checkInTime}</dd></div>
      <div><dt>Check-out</dt><dd>{formatDate(r.checkOut)} · by {booking.checkOutTime}</dd></div>
      <div><dt>Nights</dt><dd>{r.quote.nights}</dd></div>
      <div><dt>Guests</dt><dd>{plural(r.adults, 'adult')}{r.children ? `, ${plural(r.children, 'child', 'children')}` : ''}</dd></div>
      <div><dt>Guest</dt><dd>{r.guest.firstName} {r.guest.lastName}<br />{r.guest.email} · {r.guest.phone}</dd></div>
      {r.guest.requests && <div><dt>Special requests</dt><dd>{r.guest.requests}</dd></div>}
      <div><dt>Cancellation</dt><dd>{free ? `Free until ${formatDate(free, { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Non-refundable (illustrative)'}</dd></div>
    </dl>
  );
}
