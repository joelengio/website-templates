import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button, { LinkButton } from '../components/Button';
import DateRangePicker from '../components/DateRangePicker';
import GuestPicker from '../components/GuestPicker';
import Modal from '../components/Modal';
import PriceBreakdown from '../components/PriceBreakdown';
import ReservationSummary from '../components/ReservationSummary';
import { Breadcrumb } from '../components/Section';
import { ratePlans } from '../config/booking';
import { rooms } from '../config/rooms';
import { site } from '../config/site';
import { useReservations } from '../hooks/useReservations';
import { useSeo } from '../hooks/useSeo';
import { availability } from '../lib/availability';
import { diffDays, formatDate } from '../lib/dates';
import { cents } from '../lib/format';
import { quote } from '../lib/pricing';
import { cancellationFee, reservationStore } from '../lib/reservations';
import { today } from '../lib/stay';
import { defaultLimits, validateStay } from '../lib/validation';
import NotFound from './NotFound';

export default function ReservationDetail() {
  const { id = '' } = useParams();
  const list = useReservations();
  const r = list.find((x) => x.id === id);
  useSeo({ title: r ? `Reservation ${r.id}` : 'Reservation not found', description: 'Manage a demonstration reservation.', path: `/reservations/${id}`, noindex: true });

  const [editing, setEditing] = useState(false);
  const [ci, setCi] = useState(r?.checkIn ?? '');
  const [co, setCo] = useState(r?.checkOut ?? '');
  const [adults, setAdults] = useState(r?.adults ?? 2);
  const [children, setChildren] = useState(r?.children ?? 0);
  const [roomId, setRoomId] = useState(r?.roomId ?? '');
  const [planId, setPlanId] = useState(r?.ratePlanId ?? '');
  const [msg, setMsg] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const t = today();

  const preview = useMemo(() => {
    if (!r || !editing) return null;
    const room = rooms.find((x) => x.id === roomId);
    if (!room) return null;
    const errors = validateStay({ checkIn: ci, checkOut: co, adults, children }, defaultLimits(t), room);
    if (errors.length) return { errors: errors.map((e) => e.message) };
    const avail = availability(room, ci, co, list, r.id);
    if (!avail.available) return { errors: ['Not available (simulated) for those dates.'] };
    const q = quote({ room, ratePlanId: planId, checkIn: ci, checkOut: co, adults, children, promoCode: r.promoCode, today: t });
    return { quote: q, diff: q.total - r.quote.total };
  }, [r, editing, roomId, ci, co, adults, children, planId, list, t]);

  if (!r) return <NotFound />;
  const upcoming = r.status === 'confirmed' && r.checkIn > t;
  const fee = cancellationFee(r, t);
  const nonRef = ratePlans.find((p) => p.id === r.ratePlanId)?.freeCancelDays === null;

  const save = () => {
    const res = reservationStore.change(r.id, { checkIn: ci, checkOut: co, adults, children, roomId, ratePlanId: planId });
    if (res.ok) {
      setMsg({ tone: 'ok', text: 'Reservation updated. The price below is recalculated for the new details.' });
      setEditing(false);
    } else setMsg({ tone: 'bad', text: res.message });
  };

  return (
    <section className="section section--cream">
      <div className="container narrow">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Manage reservation', to: '/reservations' }, { label: r.id }]} />
        <h1 className="display">Reservation {r.id}</h1>
        <div className="notice" role="note"><p>{site.demoNotice}</p></div>
        {msg && <p className={`alert alert--${msg.tone}`} role={msg.tone === 'bad' ? 'alert' : 'status'}>{msg.text}</p>}
        <ReservationSummary r={r} />
        {r.status === 'cancelled' && <p className="alert alert--bad" role="status">Cancelled on {formatDate(r.cancelledAt!.slice(0, 10))}. {r.cancellationFee ? `Illustrative late-cancellation charge: ${cents(r.cancellationFee)} (nothing was actually charged).` : 'No cancellation charge.'}</p>}
        <PriceBreakdown quote={r.quote} />

        {upcoming && !editing && (
          <div className="form__actions">
            <Button onClick={() => { setEditing(true); setMsg(null); setCi(r.checkIn); setCo(r.checkOut); setAdults(r.adults); setChildren(r.children); setRoomId(r.roomId); setPlanId(r.ratePlanId); }} disabled={nonRef} title={nonRef ? 'Non-refundable rates cannot be changed' : undefined}>Change reservation</Button>
            <Button variant="secondary" onClick={() => setConfirmCancel(true)}>Cancel reservation</Button>
            {nonRef && <p className="muted">Non-refundable rates cannot be changed in this demonstration (illustrative policy).</p>}
          </div>
        )}
        {r.status === 'confirmed' && !upcoming && <p className="muted">Reservations can no longer be changed on or after the arrival date.</p>}

        {editing && (
          <form className="panel form" onSubmit={(e) => { e.preventDefault(); save(); }} aria-label="Change reservation">
            <h2 className="display display--sm">Change reservation</h2>
            <div className="bw bw--panel bw--stack">
              <DateRangePicker idPrefix="chg" checkIn={ci} checkOut={co} onChange={(a, b) => { setCi(a); setCo(b); }} />
              <GuestPicker idPrefix="chg" adults={adults} children={children} onChange={(a, c) => { setAdults(a); setChildren(c); }} />
            </div>
            <div className="form__row">
              <div className="field"><label htmlFor="chg-room">Room</label><select id="chg-room" value={roomId} onChange={(e) => setRoomId(e.target.value)}>{rooms.filter((x) => x.units > 0).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
              <div className="field"><label htmlFor="chg-plan">Rate plan</label><select id="chg-plan" value={planId} onChange={(e) => setPlanId(e.target.value)}>{ratePlans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            </div>
            <div aria-live="polite">
              {preview && 'errors' in preview && preview.errors && <ul className="errors">{preview.errors.map((e) => <li key={e}>{e}</li>)}</ul>}
              {preview && 'quote' in preview && preview.quote && (
                <div className="preview">
                  <p><strong>New total: {cents(preview.quote.total)}</strong> · {preview.quote.nights} {preview.quote.nights === 1 ? 'night' : 'nights'} ({diffDays(ci, co)} nights)</p>
                  <p className={(preview.diff ?? 0) > 0 ? 'diff diff--up' : 'diff'}>{preview.diff === 0 ? 'No change in price.' : `${(preview.diff ?? 0) > 0 ? 'Increase' : 'Decrease'} of ${cents(Math.abs(preview.diff ?? 0))} versus your current total.`}</p>
                </div>
              )}
            </div>
            <div className="form__actions">
              <Button variant="ghost" onClick={() => setEditing(false)}>Discard changes</Button>
              <Button type="submit" disabled={!preview || !('quote' in preview)}>Save changes</Button>
            </div>
          </form>
        )}
        <p><Link to="/reservations" className="btn btn--text">← All reservations</Link> <LinkButton to="/booking" variant="text">Make another reservation</LinkButton></p>
      </div>
      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel this reservation?">
        <p>{fee ? `Under the ${ratePlans.find((p) => p.id === r.ratePlanId)?.name} policy, cancelling now would incur an illustrative charge of ${cents(fee)}. Nothing is actually charged in this demonstration.` : 'This cancellation is free of charge under your rate plan.'}</p>
        <div className="form__actions">
          <Button variant="ghost" onClick={() => setConfirmCancel(false)}>Keep reservation</Button>
          <Button onClick={() => { const res = reservationStore.cancel(r.id); setConfirmCancel(false); setMsg(res.ok ? { tone: 'ok', text: 'Reservation cancelled.' } : { tone: 'bad', text: res.message }); }}>Yes, cancel it</Button>
        </div>
      </Modal>
    </section>
  );
}
