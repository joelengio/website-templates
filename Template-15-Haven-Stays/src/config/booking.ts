import type { Fee, Promotion, RatePlan, Season, Tax } from './types';

/**
 * Booking engine configuration — every number the pricing calculator uses lives here.
 * IMPORTANT: this is a front-end demonstration. Availability is simulated, nothing is sent to a hotel and no payment
 * is taken. To go live, replace src/lib/reservations.ts with calls to your property-management / booking provider.
 */
export const booking = {
  /** Set to an ISO date (e.g. '2026-06-01') to freeze "today" for demos and tests. null = real current date. */
  demoToday: null as string | null,
  minNights: 1,
  maxNights: 21,
  /** How many days ahead guests may book. */
  maxAdvanceDays: 540,
  maxRooms: 1,
  defaultAdults: 2,
  defaultChildren: 0,
  childAgeMax: 12,
  /** Weekend nights (0 = Sunday). Nights starting on these days use weekendUplift. */
  weekendDays: [5, 6],
  weekendUplift: 0.12,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  /** Simulated availability on/off. When off every room is always available (units - local reservations). */
  simulateAvailability: true,
  /** Max rooms shown "Only N left" label threshold. */
  scarcityThreshold: 2,
  storageKey: 'haven-stays:reservations:v1',
};

/** Seasonal rate multipliers. Ranges are inclusive MM-DD and may wrap the year end. Every day must fall in one season. */
export const seasons: Season[] = [
  { id: 'festive', name: 'Festive', from: '12-20', to: '01-06', multiplier: 1.45, minNights: 3, occupancy: 70 },
  { id: 'winter', name: 'Winter quiet', from: '01-07', to: '03-31', multiplier: 0.85, minNights: 1, occupancy: 25 },
  { id: 'spring', name: 'Spring', from: '04-01', to: '06-14', multiplier: 1.0, minNights: 2, occupancy: 45 },
  { id: 'summer', name: 'Summer peak', from: '06-15', to: '09-15', multiplier: 1.3, minNights: 3, occupancy: 68 },
  { id: 'autumn', name: 'Autumn', from: '09-16', to: '11-15', multiplier: 1.05, minNights: 2, occupancy: 40 },
  { id: 'quiet', name: 'Early winter', from: '11-16', to: '12-19', multiplier: 0.9, minNights: 1, occupancy: 28 },
];

export const ratePlans: RatePlan[] = [
  {
    id: 'flexible', name: 'Flexible Rate', description: 'Our standard rate with free changes and cancellation.', multiplier: 1,
    freeCancelDays: 3, lateCancelNights: 1, inclusions: ['Free cancellation up to 3 days before arrival', 'Welcome drink'],
  },
  {
    id: 'bed-breakfast', name: 'Bed & Breakfast', description: 'Flexible rate with a garden breakfast each morning.', multiplier: 1, perAdultNight: 32, perChildNight: 16,
    freeCancelDays: 3, lateCancelNights: 1, inclusions: ['Garden breakfast for every guest', 'Free cancellation up to 3 days before arrival'],
  },
  {
    id: 'advance-saver', name: 'Advance Saver', description: 'Book early, save 10%. Cancel free up to 14 days before arrival.', multiplier: 0.9,
    freeCancelDays: 14, lateCancelNights: 2, inclusions: ['10% below the flexible rate', 'Free cancellation up to 14 days before arrival'],
  },
  {
    id: 'non-refundable', name: 'Non-refundable', description: 'Our lowest rate. Pre-paid and non-refundable (illustrative policy).', multiplier: 0.82,
    freeCancelDays: null, lateCancelNights: 'all', inclusions: ['18% below the flexible rate', 'Changes not permitted (illustrative)'],
  },
];

/** Service charge, resort fee and local tax per night/stay. `taxable` fees are included in the VAT base. */
export const fees: Fee[] = [
  { id: 'service', label: 'Service charge', kind: 'percent', amount: 8, taxable: true },
  { id: 'sustainability', label: 'Sustainability levy', kind: 'perNight', amount: 6, taxable: false, note: 'Funds local reforestation (demonstration).' },
  { id: 'city-tax', label: 'Municipal tax (per adult, up to 7 nights)', kind: 'perAdultNight', amount: 3.5, taxable: false, capNights: 7 },
];

export const taxes: Tax[] = [{ id: 'vat', label: 'VAT', rate: 10 }];

/** Promotions. Automatic promotions apply on their own; coded ones when the guest enters the code. Best single discount wins. */
export const promotions: Promotion[] = [
  { id: 'early-bird', label: 'Early Bird', description: '15% off when you book at least 45 days ahead (2+ nights).', auto: true, type: 'percent', value: 15, minNights: 2, minAdvanceDays: 45, excludePlans: ['non-refundable', 'advance-saver'] },
  { id: 'extended-5', label: 'Extended Stay (5+ nights)', description: '10% off stays of 5 nights or more.', auto: true, type: 'percent', value: 10, minNights: 5 },
  { id: 'extended-10', label: 'Extended Stay (10+ nights)', description: '18% off stays of 10 nights or more.', auto: true, type: 'percent', value: 18, minNights: 10 },
  { id: 'couples', label: 'Couples Retreat', description: '12% off for two adults staying 2+ nights in a Room, Suite or Villa. Code COUPLES.', code: 'COUPLES', auto: false, type: 'percent', value: 12, minNights: 2, exactAdults: 2, noChildren: true, categories: ['Rooms', 'Suites', 'Villas'] },
  { id: 'family', label: 'Family Vacation', description: '15% off for stays of 3+ nights with at least one child in a Family room, Suite or Villa. Code FAMILY.', code: 'FAMILY', auto: false, type: 'percent', value: 15, minNights: 3, requireChildren: true, categories: ['Family', 'Suites', 'Villas'] },
  { id: 'wellness', label: 'Wellness Getaway', description: '$120 off a 3+ night stay in the Wellness Suite or Hillside Loft. Code WELLNESS.', code: 'WELLNESS', auto: false, type: 'fixed', value: 120, minNights: 3, roomIds: ['wellness-suite', 'hillside-loft'] },
  { id: 'spring-bloom', label: 'Spring Bloom', description: '12% off stays between April and May (2+ nights).', auto: true, type: 'percent', value: 12, minNights: 2, stayWindow: { from: '04-01', to: '05-31' } },
  { id: 'welcome10', label: 'Welcome 10', description: '10% off any stay of 2+ nights with code WELCOME10.', code: 'WELCOME10', auto: false, type: 'percent', value: 10, minNights: 2 },
];
