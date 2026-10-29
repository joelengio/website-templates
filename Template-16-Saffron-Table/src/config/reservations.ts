import type { ReservationSettings } from './types';

/**
 * Reservation SIMULATION settings. Capacity and "busy" levels are demonstration values:
 * they do not reflect any real restaurant. Reservations are stored only in this browser.
 */
export const reservationSettings: ReservationSettings = {
  slotIntervalMinutes: 30,
  diningDurationMinutes: 120,
  minPartySize: 1,
  maxPartySize: 10,
  bookingWindowDays: 60,
  sameDayLeadMinutes: 90,
  // 0 = Sunday ... 6 = Saturday. Empty array = closed.
  hours: {
    0: [
      { label: 'Lunch', open: '12:00', lastSeating: '14:30' },
      { label: 'Dinner', open: '17:30', lastSeating: '20:30' },
    ],
    1: [],
    2: [{ label: 'Dinner', open: '17:30', lastSeating: '21:00' }],
    3: [{ label: 'Dinner', open: '17:30', lastSeating: '21:00' }],
    4: [{ label: 'Dinner', open: '17:30', lastSeating: '21:00' }],
    5: [{ label: 'Dinner', open: '17:00', lastSeating: '21:30' }],
    6: [{ label: 'Dinner', open: '17:00', lastSeating: '21:30' }],
  },
  closedDates: [
    { date: '12-24', reason: 'Closed for the holiday' },
    { date: '12-25', reason: 'Closed for the holiday' },
    { date: '12-26', reason: 'Closed for the holiday' },
    { date: '01-01', reason: 'Closed for New Year’s Day' },
    { date: '07-04', reason: 'Closed for a staff day' },
  ],
  seatingAreas: [
    {
      id: 'dining-room',
      name: 'Main dining room',
      description: 'Banquettes and round tables under copper pendants. The heart of the room.',
      capacity: 48,
      minParty: 1,
      maxParty: 10,
      image: 'dining-green',
    },
    {
      id: 'bar',
      name: 'Bar & lounge',
      description: 'Low tables and stools beside the bar. Good for smaller parties and cocktails.',
      capacity: 14,
      minParty: 1,
      maxParty: 4,
      image: 'cocktail',
    },
    {
      id: 'terrace',
      name: 'Terrace',
      description: 'Covered terrace tables with heaters in cooler months.',
      capacity: 28,
      minParty: 1,
      maxParty: 8,
      image: 'terrace',
    },
    {
      id: 'chefs-counter',
      name: 'Chef’s counter',
      description: 'Eight seats at the pass. Tasting menu only; ask the team about adjustments.',
      capacity: 8,
      minParty: 2,
      maxParty: 4,
      image: 'open-kitchen',
    },
  ],
  demoLoad: {
    seed: 'saffron-table-demo',
    weekdayLoad: { 0: 0.5, 1: 0, 2: 0.3, 3: 0.4, 4: 0.55, 5: 0.8, 6: 0.9 },
    peakFrom: '19:00',
    peakTo: '20:30',
    peakBoost: 0.3,
  },
  occasions: ['Birthday', 'Anniversary', 'Business dinner', 'Date night', 'Celebration'],
};

export const reservationCopy = {
  banner:
    'Demonstration only: this reservation tool is simulated. Nothing is sent to a restaurant or booking platform, availability is fictional demo data, and no one will confirm or hold a table.',
  notePrompt:
    'Optional general note (for example, “celebrating a birthday”). Please do not enter sensitive health details here. Tell the restaurant about allergies directly.',
  largePartyNote: 'For parties larger than the maximum, please use a private dining enquiry.',
  storageNote: 'Saved only in this browser (local storage). Clearing site data removes it.',
};
