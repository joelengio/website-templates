import { promotions } from '../config/booking';
import { rooms } from '../config/rooms';
import type { Offer } from '../config/types';
import { addDays, weekday } from './dates';
import { cents } from './format';
import { quote } from './pricing';
import { today } from './stay';

/** A representative future stay used to display an "example price" on offer cards. */
export function sampleStay(nights: number) {
  let start = addDays(today(), 70);
  while (weekday(start) !== 2) start = addDays(start, 1); // a Tuesday arrival
  return { checkIn: start, checkOut: addDays(start, nights) };
}

export function offerSample(offer: Offer): string | undefined {
  const promo = promotions.find((p) => p.id === offer.promoId);
  const room = rooms.find((r) => r.slug === offer.roomSlug) ?? rooms[2];
  if (!promo) return undefined;
  const { checkIn, checkOut } = sampleStay(Math.max(offer.suggestedNights, promo.minNights ?? 1));
  const adults = promo.exactAdults ?? 2;
  const children = promo.requireChildren ? 1 : 0;
  const q = quote({ room, ratePlanId: 'flexible', checkIn, checkOut, adults, children, promoCode: promo.code, today: today() });
  if (!q.discount) return `Example: ${q.nights} nights in ${room.name} from ${cents(q.total)} total`;
  return `Example: ${q.nights} nights in ${room.name} — ${cents(q.total)} total, saving ${cents(q.discount.amount)}`;
}
