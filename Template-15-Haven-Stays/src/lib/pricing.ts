import { booking as bookingDefaults, fees as feeDefaults, promotions as promoDefaults, ratePlans as planDefaults, seasons as seasonDefaults, taxes as taxDefaults } from '../config/booking';
import { rooms as roomDefaults } from '../config/rooms';
import type { Fee, Promotion, RatePlan, Room, Season, Tax } from '../config/types';
import { diffDays, inMonthDayRange, monthDay, nightsBetween, weekday } from './dates';

export interface PricingConfig {
  booking: Pick<typeof bookingDefaults, 'weekendDays' | 'weekendUplift'>;
  seasons: Season[];
  ratePlans: RatePlan[];
  fees: Fee[];
  taxes: Tax[];
  promotions: Promotion[];
}

export const defaultPricingConfig: PricingConfig = {
  booking: bookingDefaults,
  seasons: seasonDefaults,
  ratePlans: planDefaults,
  fees: feeDefaults,
  taxes: taxDefaults,
  promotions: promoDefaults,
};

export interface PriceRequest {
  room: Room;
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  promoCode?: string;
  /** ISO date "today", used for advance-purchase promotions. */
  today: string;
}

export interface NightLine {
  date: string;
  season: string;
  seasonId: string;
  weekend: boolean;
  /** Integer cents, after season, weekend and rate-plan multipliers. */
  rate: number;
}
export interface AppliedPromo {
  id: string;
  label: string;
  amount: number;
  code?: string;
}
export interface PriceLine {
  id: string;
  label: string;
  amount: number;
  note?: string;
}
export interface PromoCheck {
  promo: Promotion;
  eligible: boolean;
  reason?: string;
}
export interface Quote {
  nights: number;
  nightly: NightLine[];
  roomSubtotal: number;
  addons: PriceLine[];
  discount: AppliedPromo | null;
  rejectedCode?: string;
  fees: PriceLine[];
  taxes: PriceLine[];
  total: number;
  averageNightly: number;
  planName: string;
  promoChecks: PromoCheck[];
}

export function seasonFor(date: string, seasons: Season[] = seasonDefaults): Season {
  const md = monthDay(date);
  const s = seasons.find((x) => inMonthDayRange(md, x.from, x.to));
  if (!s) throw new Error(`No season configured for ${date}. Seasons must cover the whole year.`);
  return s;
}

export const isWeekendNight = (date: string, cfg: Pick<PricingConfig['booking'], 'weekendDays'> = bookingDefaults) => cfg.weekendDays.includes(weekday(date));

/** Nightly rate in integer cents for a single night. */
export function nightlyRate(room: Room, plan: RatePlan, date: string, cfg: PricingConfig = defaultPricingConfig): NightLine {
  const season = seasonFor(date, cfg.seasons);
  const weekend = isWeekendNight(date, cfg.booking);
  const raw = room.baseRate * 100 * season.multiplier * (weekend ? 1 + cfg.booking.weekendUplift : 1) * plan.multiplier;
  return { date, season: season.name, seasonId: season.id, weekend, rate: Math.round(raw) };
}

/** Minimum nights for a stay (season of the check-in night, never below the global floor). */
export function requiredMinNights(checkIn: string, _checkOut: string, seasons: Season[] = seasonDefaults, floor = bookingDefaults.minNights): number {
  // the minimum-stay rule of the check-in night's season governs the whole stay
  return Math.max(floor, seasonFor(checkIn, seasons).minNights);
}

/** Why a promotion does (not) apply. */
export function checkPromo(p: Promotion, req: PriceRequest, nights: number, planId: string): PromoCheck {
  const no = (reason: string): PromoCheck => ({ promo: p, eligible: false, reason });
  if (p.minNights && nights < p.minNights) return no(`Requires a stay of at least ${p.minNights} nights.`);
  if (p.maxNights && nights > p.maxNights) return no(`Valid for stays up to ${p.maxNights} nights.`);
  if (p.stayWindow && !inMonthDayRange(monthDay(req.checkIn), p.stayWindow.from, p.stayWindow.to)) return no('Check-in date is outside the promotion’s stay window.');
  if (p.minAdvanceDays !== undefined && diffDays(req.today, req.checkIn) < p.minAdvanceDays) return no(`Must be booked at least ${p.minAdvanceDays} days before arrival.`);
  if (p.categories && !p.categories.includes(req.room.category)) return no(`Applies to ${p.categories.join(', ')} accommodation.`);
  if (p.roomIds && !p.roomIds.includes(req.room.id)) return no('Not available for the selected room.');
  if (p.excludePlans?.includes(planId)) return no('Not combinable with the selected rate plan.');
  if (p.requireChildren && req.children < 1) return no('Requires at least one child in the party.');
  if (p.noChildren && req.children > 0) return no('Valid for adults-only stays.');
  if (p.exactAdults !== undefined && req.adults !== p.exactAdults) return no(`Valid for exactly ${p.exactAdults} adults.`);
  return { promo: p, eligible: true };
}

const pct = (base: number, rate: number) => Math.round((base * rate) / 100);

/** Full price breakdown. Every amount is an integer number of cents so totals always reconcile. */
export function quote(req: PriceRequest, cfg: PricingConfig = defaultPricingConfig): Quote {
  const plan = cfg.ratePlans.find((p) => p.id === req.ratePlanId);
  if (!plan) throw new Error(`Unknown rate plan ${req.ratePlanId}`);
  const dates = nightsBetween(req.checkIn, req.checkOut);
  const nightly = dates.map((d) => nightlyRate(req.room, plan, d, cfg));
  const nights = nightly.length;
  const roomSubtotal = nightly.reduce((s, n) => s + n.rate, 0);

  const addons: PriceLine[] = [];
  if (plan.perAdultNight) addons.push({ id: 'breakfast-adults', label: `Breakfast · ${req.adults} ${req.adults === 1 ? 'adult' : 'adults'} × ${nights} nights`, amount: Math.round(plan.perAdultNight * 100) * req.adults * nights });
  if (plan.perChildNight && req.children) addons.push({ id: 'breakfast-children', label: `Breakfast · ${req.children} ${req.children === 1 ? 'child' : 'children'} × ${nights} nights`, amount: Math.round(plan.perChildNight * 100) * req.children * nights });
  const addonTotal = addons.reduce((s, a) => s + a.amount, 0);

  // Promotions: best eligible single discount (automatic + the entered code)
  const code = req.promoCode?.trim().toUpperCase();
  const candidates = cfg.promotions.filter((p) => p.auto || (code && p.code === code));
  const promoChecks = candidates.map((p) => checkPromo(p, req, nights, plan.id));
  let rejectedCode: string | undefined;
  if (code && !cfg.promotions.some((p) => p.code === code)) rejectedCode = 'unknown';
  else if (code) {
    const c = promoChecks.find((x) => x.promo.code === code);
    if (c && !c.eligible) rejectedCode = c.reason ?? 'not eligible';
  }
  const discountBase = roomSubtotal; // discounts apply to the room charge only
  let discount: AppliedPromo | null = null;
  for (const c of promoChecks) {
    if (!c.eligible) continue;
    const amount = c.promo.type === 'percent' ? pct(discountBase, c.promo.value) : Math.min(discountBase, Math.round(c.promo.value * 100));
    if (!discount || amount > discount.amount) discount = { id: c.promo.id, label: c.promo.label, amount, code: c.promo.code };
  }

  const base = roomSubtotal + addonTotal - (discount?.amount ?? 0);
  const feeLines: PriceLine[] = [];
  for (const f of cfg.fees) {
    const billedNights = f.capNights ? Math.min(f.capNights, nights) : nights;
    let amount = 0;
    if (f.kind === 'percent') amount = pct(base, f.amount);
    else if (f.kind === 'perNight') amount = Math.round(f.amount * 100) * billedNights;
    else if (f.kind === 'perAdultNight') amount = Math.round(f.amount * 100) * req.adults * billedNights;
    else amount = Math.round(f.amount * 100);
    feeLines.push({ id: f.id, label: f.label, amount, note: f.note });
  }
  const taxableFees = feeLines.filter((l) => cfg.fees.find((f) => f.id === l.id)?.taxable).reduce((s, l) => s + l.amount, 0);
  const vatBase = base + taxableFees;
  const taxLines = cfg.taxes.map((t) => ({ id: t.id, label: `${t.label} (${t.rate}%)`, amount: pct(vatBase, t.rate) }));

  const total = base + feeLines.reduce((s, l) => s + l.amount, 0) + taxLines.reduce((s, l) => s + l.amount, 0);
  return {
    nights,
    nightly,
    roomSubtotal,
    addons,
    discount,
    rejectedCode,
    fees: feeLines,
    taxes: taxLines,
    total,
    averageNightly: nights ? Math.round(roomSubtotal / nights) : 0,
    planName: plan.name,
    promoChecks,
  };
}

/** Lowest per-night price across the plans for a stay, for "from" labels. */
export function lowestPlan(req: Omit<PriceRequest, 'ratePlanId'>, cfg: PricingConfig = defaultPricingConfig) {
  return cfg.ratePlans.map((p) => ({ plan: p, quote: quote({ ...req, ratePlanId: p.id }, cfg) })).sort((a, b) => a.quote.total - b.quote.total)[0];
}

export const findRoom = (id: string, list: Room[] = roomDefaults) => list.find((r) => r.id === id);
