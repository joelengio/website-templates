/**
 * ─── BOOKING (DEMO) CONFIGURATION ─────────────────────────────────────────
 * No backend exists: availability is generated locally and deterministically,
 * and bookings are saved in this browser's localStorage only.
 */
export const booking = {
  /** First bookable day is today + leadDays. */
  leadDays: 1,
  /** Number of days ahead that can be booked. */
  windowDays: 42,
  /** Minutes between start times offered. */
  slotIntervalMinutes: 60,
  /** 0–1: share of generated demo slots shown as already taken. */
  demoBusyRatio: 0.32,
  /** Dates (YYYY-MM-DD) the house is closed in addition to the weekly hours. */
  closedDates: [] as string[],
  /** Show a fixed "prepay" style deposit? No payment is ever taken in this template. */
  storageKey: 'serene-house-demo-bookings-v1',
  /** Cancellation window shown in the summary (informational). */
  cancellationNote: 'Demonstration policy: free changes up to 24 hours before your appointment.',
  disclosure:
    'This is a demonstration booking. It is saved only in this browser and is NOT sent to any real business. Availability is simulated and not synchronised across devices.'
};
