import { useMemo, useState } from 'react';
import { promotions } from '../config/booking';
import { rooms } from '../config/rooms';
import type { Offer } from '../config/types';
import { addDays } from '../lib/dates';
import { cents } from '../lib/format';
import { sampleStay } from '../lib/offers';
import { checkPromo, quote } from '../lib/pricing';
import { today } from '../lib/stay';
import { LinkButton } from './Button';
import Icon from './Icon';
import { writeStay } from '../lib/stay';

/** Lets a visitor test whether their party/dates/room qualify for an offer and see the resulting price. */
export default function OfferChecker({ offer }: { offer: Offer }) {
  const promo = promotions.find((p) => p.id === offer.promoId)!;
  const initialRoom = rooms.find((r) => r.slug === offer.roomSlug)?.id ?? rooms[2].id;
  const sample = sampleStay(Math.max(offer.suggestedNights, promo.minNights ?? 1));
  const [roomId, setRoomId] = useState(initialRoom);
  const [checkIn, setCheckIn] = useState(sample.checkIn);
  const [nights, setNights] = useState(Math.max(offer.suggestedNights, promo.minNights ?? 1));
  const [adults, setAdults] = useState(promo.exactAdults ?? 2);
  const [children, setChildren] = useState(promo.requireChildren ? 1 : 0);
  const t = today();
  const room = rooms.find((r) => r.id === roomId)!;
  const checkOut = addDays(checkIn || t, nights);
  const result = useMemo(() => {
    if (!checkIn || checkIn < t) return null;
    const req = { room, ratePlanId: 'flexible', checkIn, checkOut, adults, children, promoCode: promo.code, today: t };
    const q = quote(req);
    const chk = checkPromo(promo, req, nights, 'flexible');
    return { q, chk, withOffer: q.discount?.id === promo.id };
  }, [room, checkIn, checkOut, adults, children, nights, promo, t]);

  return (
    <form className="panel offer-check" onSubmit={(e) => e.preventDefault()} aria-labelledby="oc-h">
      <h2 id="oc-h" className="panel__title">Check your eligibility</h2>
      <div className="form__row form__row--3">
        <div className="field"><label htmlFor="oc-room">Room</label><select id="oc-room" value={roomId} onChange={(e) => setRoomId(e.target.value)}>{rooms.filter((r) => r.units > 0).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
        <div className="field"><label htmlFor="oc-in">Check-in</label><input id="oc-in" type="date" min={t} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></div>
        <div className="field"><label htmlFor="oc-n">Nights</label><input id="oc-n" type="number" min={1} max={21} value={nights} onChange={(e) => setNights(Math.min(21, Math.max(1, Number(e.target.value) || 1)))} /></div>
        <div className="field"><label htmlFor="oc-a">Adults</label><input id="oc-a" type="number" min={1} max={room.maxAdults} value={adults} onChange={(e) => setAdults(Math.min(room.maxAdults, Math.max(1, Number(e.target.value) || 1)))} /></div>
        <div className="field"><label htmlFor="oc-c">Children</label><input id="oc-c" type="number" min={0} max={room.maxChildren} value={children} onChange={(e) => setChildren(Math.min(room.maxChildren, Math.max(0, Number(e.target.value) || 0)))} /></div>
      </div>
      <div className="offer-check__result" role="status" aria-live="polite">
        {!result ? <p className="field-error">Choose a check-in date today or later.</p> : result.chk.eligible ? (
          <>
            <p className="ok"><Icon name="check" size={18} /> <strong>Eligible.</strong> {promo.label} {result.withOffer ? 'is applied' : 'qualifies, although a larger discount may apply instead'}.</p>
            <p>Estimated total (Flexible Rate, taxes and fees included): <strong>{cents(result.q.total)}</strong>{result.q.discount && <> — saving {cents(result.q.discount.amount)} with {result.q.discount.label}</>}.</p>
          </>
        ) : (
          <p className="bad"><Icon name="info" size={18} /> <strong>Not eligible for this stay:</strong> {result.chk.reason}</p>
        )}
      </div>
      <LinkButton to={`/booking?${writeStay({ checkIn: checkIn >= t ? checkIn : '', checkOut: checkIn >= t ? checkOut : '', adults, children, room: roomId, promo: promo.code ?? '' })}`} arrow>Book with this offer</LinkButton>
    </form>
  );
}
