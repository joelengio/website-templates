/**
 * DEMONSTRATION booking settings. Appointments are stored only in the visitor's browser (localStorage);
 * nothing is transmitted. "Availability" is generated from these rules plus a deterministic demo pattern.
 */
export const booking = {
  /** Visitors can pick dates from tomorrow (minDaysAhead) up to this many days ahead. */
  minDaysAhead: 1,
  maxDaysAhead: 60,
  /** Weekdays that offer slots: 0 = Sunday … 6 = Saturday. */
  openWeekdays: [1, 2, 3, 4, 5],
  dayStart: '09:00',
  dayEnd: '17:00',
  slotStepMinutes: 30,
  /** Lunch window with no slots. Set both to '' to disable. */
  breakStart: '12:30',
  breakEnd: '13:30',
  /** Share of slots shown as already taken (0–1) so the demo feels like a real diary. */
  demoBusyRatio: 0.28,
  consultationTypes: [
    { id: 'intro', name: 'Introductory call', duration: 30, description: 'A short first conversation to explore fit and priorities.', mode: 'Video call (demo)' },
    { id: 'review', name: 'Planning review', duration: 60, description: 'A deeper session on goals, cash flow and next steps.', mode: 'Video call (demo)' },
    { id: 'office', name: 'In-person meeting', duration: 60, description: 'An office meeting at the demonstration address.', mode: 'Harbour Square (fictional)' },
  ],
  maxNoteLength: 400,
  text: {
    heading: 'Book a demonstration consultation',
    lead: 'Walk through a realistic booking flow. Your appointment is saved only in this browser.',
  },
};
