/**
 * ─── DEMO BOOKING SETTINGS ─────────────────────────────────────────────────
 * Class booking is a DEMONSTRATION: reservations live in the visitor's browser only (localStorage).
 * No server, no email, no payment. Connect your own booking system before taking real bookings.
 */
export const bookingSettings = {
  /** localStorage keys — change when you rebrand so demos on one domain do not collide. */
  storageKey: 'vigor-club-demo-reservations-v1',
  profileKey: 'vigor-club-demo-profile-v1',
  inquiriesKey: 'vigor-club-demo-inquiries-v1',
  /** How many weeks ahead visitors can browse and book (1 = this week only). */
  weeksAhead: 3,
  /** Minutes before class start when booking closes. */
  cutoffMinutes: 15,
  /** Range of simulated "already booked" places for demonstration (0–1 of capacity). */
  demoOccupancy: { min: 0.3, max: 1 },
  /** Prefix for reservation reference codes. */
  referencePrefix: 'VC',
  demoLabel: 'Demonstration booking — stored only in this browser',
  demoExplainer:
    'This booking system is a demonstration. Reservations are saved on this device only; nothing is sent to the club, no confirmation email is sent, and no payment is taken.'
};
