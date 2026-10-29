/** Booking-demo settings. Availability is generated from site.hours and each doctor's working days. */
export const booking = {
  storageKey: 'clarity-health:demo-appointments:v1',
  referencePrefix: 'CH-',
  /** First bookable day = today + leadDays. */
  leadDays: 1,
  /** How many days ahead the calendar can go. */
  windowDays: 75,
  slotIntervalMinutes: 30,
  /** Fraction of slots shown as already taken (deterministic, so the demo looks realistic and stable). */
  demoBusyRatio: 0.3,
  /** ISO dates (YYYY-MM-DD) on which the clinic is closed, e.g. public holidays. */
  closedDates: [] as string[],
  /** Duplicate prevention: maximum number of upcoming confirmed demo appointments per e-mail address. */
  maxActivePerEmail: 3,
  requirePhone: false,
  pricing: { show: true, currency: 'USD', label: 'Demo price' },
  /** Changes within this many hours are flagged in the cancel/reschedule dialog (informational only). */
  policyNote: 'Demonstration policy: please give at least 24 hours’ notice to cancel or reschedule. This is placeholder wording.',
  /** Labels shown for consultation formats. */
  modeLabels: { 'in-person': 'In person', video: 'Video consultation' } as Record<string, string>
};
