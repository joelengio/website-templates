import { describe, expect, it } from 'vitest';
import { rooms } from '../config/rooms';
import { seasons } from '../config/booking';
import { defaultPricingConfig, nightlyRate, quote, requiredMinNights, seasonFor, type PricingConfig } from './pricing';
import { addDays, diffDays, monthDay } from './dates';

const room = rooms.find((r) => r.id === 'garden-king')!;
const plan = (id: string) => defaultPricingConfig.ratePlans.find((p) => p.id === id)!;
const req = (over: Record<string, unknown> = {}) => ({ room, ratePlanId: 'flexible', checkIn: '2026-05-05', checkOut: '2026-05-08', adults: 2, children: 0, today: '2026-01-01', ...over }) as Parameters<typeof quote>[0];

// A controlled config so expectations are exact arithmetic, not a restatement of the formula.
const simple: PricingConfig = {
  booking: { weekendDays: [5, 6], weekendUplift: 0.1 },
  seasons: [{ id: 'all', name: 'All year', from: '01-01', to: '12-31', multiplier: 1, minNights: 1, occupancy: 0 }, ],
  ratePlans: [{ id: 'flex', name: 'Flex', description: '', multiplier: 1, freeCancelDays: 3, lateCancelNights: 1, inclusions: [] }, { id: 'bb', name: 'B&B', description: '', multiplier: 1, perAdultNight: 10, perChildNight: 5, freeCancelDays: 3, lateCancelNights: 1, inclusions: [] }],
  fees: [
    { id: 'svc', label: 'Service', kind: 'percent', amount: 10, taxable: true },
    { id: 'levy', label: 'Levy', kind: 'perNight', amount: 5, taxable: false },
    { id: 'city', label: 'City', kind: 'perAdultNight', amount: 2, taxable: false, capNights: 2 },
  ],
  taxes: [{ id: 'vat', label: 'VAT', rate: 20 }],
  promotions: [
    { id: 'p10', label: 'Ten', description: '', auto: true, type: 'percent', value: 10, minNights: 3 },
    { id: 'fixed', label: 'Fixed', description: '', auto: false, code: 'FIX', type: 'fixed', value: 50 },
  ],
};
const r100 = { ...room, baseRate: 100 };

describe('seasons', () => {
  it('covers every day of a leap year exactly once', () => {
    for (let i = 0; i < 366; i++) {
      const d = addDays('2028-01-01', i);
      expect(seasons.filter((s) => (s.from <= s.to ? monthDay(d) >= s.from && monthDay(d) <= s.to : monthDay(d) >= s.from || monthDay(d) <= s.to))).toHaveLength(1);
    }
  });
  it('resolves the festive season across the year end', () => {
    expect(seasonFor('2026-12-31').id).toBe('festive');
    expect(seasonFor('2027-01-03').id).toBe('festive');
    expect(seasonFor('2027-01-07').id).toBe('winter');
    expect(seasonFor('2026-07-14').id).toBe('summer');
  });
  it('uses the check-in season for minimum nights', () => {
    expect(requiredMinNights('2026-07-01', '2026-07-02')).toBe(3);
    expect(requiredMinNights('2027-02-02', '2027-02-03')).toBe(1);
  });
});

describe('nightly rates', () => {
  it('applies season, weekend and plan multipliers', () => {
    // 2026-07-14 is a Tuesday in summer: 245 × 1.30
    expect(nightlyRate(room, plan('flexible'), '2026-07-14').rate).toBe(31850);
    // 2026-07-17 is a Friday: 245 × 1.30 × 1.12
    expect(nightlyRate(room, plan('flexible'), '2026-07-17').rate).toBe(35672);
    expect(nightlyRate(room, plan('non-refundable'), '2026-07-14').rate).toBe(Math.round(245 * 100 * 1.3 * 0.82));
  });
  it('prices a stay that crosses a season boundary night by night', () => {
    const q = quote(req({ checkIn: '2026-06-13', checkOut: '2026-06-17' }));
    expect(q.nightly.map((n) => n.seasonId)).toEqual(['spring', 'spring', 'summer', 'summer']);
    expect(q.roomSubtotal).toBe(q.nightly.reduce((s, n) => s + n.rate, 0));
  });
});

describe('quote arithmetic (controlled config)', () => {
  // 2026-05-04 Mon → 05-07 Thu: 3 weekday nights at $100
  const base = { room: r100, checkIn: '2026-05-04', checkOut: '2026-05-07', adults: 2, children: 1, today: '2026-05-01' };
  it('computes fees, taxable base and VAT exactly', () => {
    const q = quote({ ...base, ratePlanId: 'flex' }, simple);
    // 3 nights × 100 = 300.00; auto promo p10 (3+ nights) = 30.00 → 270.00
    expect(q.roomSubtotal).toBe(30000);
    expect(q.discount).toMatchObject({ id: 'p10', amount: 3000 });
    const fee = (id: string) => q.fees.find((f) => f.id === id)!.amount;
    expect(fee('svc')).toBe(2700); // 10% of 270
    expect(fee('levy')).toBe(1500); // 5 × 3 nights
    expect(fee('city')).toBe(800); // 2 × 2 adults × min(3, cap 2) nights
    // VAT base = 270 + taxable fees (service 27) = 297 → 20% = 59.40
    expect(q.taxes[0].amount).toBe(5940);
    expect(q.total).toBe(27000 + 2700 + 1500 + 800 + 5940);
  });
  it('adds per-person plan extras before discounts and fees', () => {
    const q = quote({ ...base, ratePlanId: 'bb' }, simple);
    expect(q.addons.map((a) => a.amount)).toEqual([2 * 10 * 3 * 100, 1 * 5 * 3 * 100]);
    expect(q.total).toBe(
      q.roomSubtotal + q.addons.reduce((s, a) => s + a.amount, 0) - (q.discount?.amount ?? 0) + q.fees.reduce((s, f) => s + f.amount, 0) + q.taxes.reduce((s, t) => s + t.amount, 0),
    );
  });
  it('applies the weekend uplift only to Friday and Saturday nights', () => {
    const q = quote({ ...base, ratePlanId: 'flex', checkIn: '2026-05-08', checkOut: '2026-05-11' }, simple); // Fri Sat Sun
    expect(q.nightly.map((n) => n.rate)).toEqual([11000, 11000, 10000]);
  });
  it('picks the best single discount and honours codes', () => {
    const q = quote({ ...base, ratePlanId: 'flex', promoCode: 'fix' }, simple);
    expect(q.discount).toMatchObject({ id: 'fixed', amount: 5000 }); // $50 beats 10% of $300 = $30
  });
  it('reports unknown and ineligible codes without discounting', () => {
    expect(quote({ ...base, ratePlanId: 'flex', promoCode: 'NOPE' }, simple).rejectedCode).toBe('unknown');
    const short = quote({ ...base, ratePlanId: 'flex', checkOut: '2026-05-05', promoCode: 'NOPE' }, simple);
    expect(short.discount).toBeNull();
  });
  it('never discounts below zero', () => {
    const q = quote({ ...base, ratePlanId: 'flex', room: { ...r100, baseRate: 10 }, checkOut: '2026-05-05', promoCode: 'FIX' }, simple);
    expect(q.discount!.amount).toBe(q.roomSubtotal);
  });
  it('single-night stay prices one night', () => {
    const q = quote({ ...base, ratePlanId: 'flex', checkOut: '2026-05-05' }, simple);
    expect(q.nights).toBe(1);
    expect(q.roomSubtotal).toBe(10000);
    expect(q.fees.find((f) => f.id === 'city')!.amount).toBe(400);
  });
});

describe('promotions (real config)', () => {
  it('Early Bird needs 45 days advance and is excluded from saver plans', () => {
    const early = quote(req({ today: '2026-03-01', checkIn: '2026-05-05', checkOut: '2026-05-08' }));
    expect(early.discount?.id === 'early-bird' || early.discount?.id === 'spring-bloom').toBe(true);
    const saver = quote(req({ ratePlanId: 'advance-saver', today: '2026-03-01' }));
    expect(saver.promoChecks.find((c) => c.promo.id === 'early-bird')?.eligible).toBe(false);
  });
  it('extended stay 10+ nights beats 5+ nights', () => {
    const q = quote(req({ checkIn: '2026-10-05', checkOut: '2026-10-16', today: '2026-10-01' }));
    expect(diffDays('2026-10-05', '2026-10-16')).toBe(11);
    expect(q.discount?.id).toBe('extended-10');
  });
  it('COUPLES needs exactly two adults and no children, FAMILY needs children', () => {
    const suite = rooms.find((r) => r.id === 'terrace-suite')!;
    const base = { room: suite, checkIn: '2026-10-05', checkOut: '2026-10-08', today: '2026-10-01' };
    expect(quote({ ...base, ratePlanId: 'flexible', adults: 2, children: 0, promoCode: 'COUPLES' }).discount?.id).toBe('couples');
    expect(quote({ ...base, ratePlanId: 'flexible', adults: 2, children: 1, promoCode: 'COUPLES' }).rejectedCode).toMatch(/adults-only/);
    expect(quote({ ...base, ratePlanId: 'flexible', adults: 2, children: 1, promoCode: 'FAMILY' }).discount?.id).toBe('family');
    expect(quote({ ...base, ratePlanId: 'flexible', adults: 2, children: 0, promoCode: 'FAMILY' }).rejectedCode).toMatch(/child/);
  });
  it('WELLNESS fixed amount only applies to its rooms', () => {
    const w = rooms.find((r) => r.id === 'wellness-suite')!;
    const b = { checkIn: '2026-10-05', checkOut: '2026-10-08', adults: 2, children: 0, today: '2026-10-01', ratePlanId: 'flexible', promoCode: 'WELLNESS' };
    expect(quote({ ...b, room: w }).discount).toMatchObject({ id: 'wellness', amount: 12000 });
    expect(quote({ ...b, room }).rejectedCode).toMatch(/Not available/);
  });
});
