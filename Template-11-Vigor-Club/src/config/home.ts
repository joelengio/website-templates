import { images } from './images';

/**
 * ─── HOMEPAGE ──────────────────────────────────────────────────────────────
 * `sections` controls ORDER and VISIBILITY. Set `visible: false` to hide a section; reorder to move it.
 * Valid ids: hero, ticker, positioning, programs, philosophy, facilities, schedule, trainers, membership, testimonials, journal, cta
 */
export const homeSections: { id: HomeSectionId; visible: boolean }[] = [
  { id: 'hero', visible: true },
  { id: 'ticker', visible: true },
  { id: 'positioning', visible: true },
  { id: 'programs', visible: true },
  { id: 'philosophy', visible: true },
  { id: 'facilities', visible: true },
  { id: 'schedule', visible: true },
  { id: 'trainers', visible: true },
  { id: 'membership', visible: true },
  { id: 'testimonials', visible: true },
  { id: 'journal', visible: true },
  { id: 'cta', visible: true }
];

export type HomeSectionId =
  | 'hero' | 'ticker' | 'positioning' | 'programs' | 'philosophy' | 'facilities'
  | 'schedule' | 'trainers' | 'membership' | 'testimonials' | 'journal' | 'cta';

export const home = {
  hero: {
    eyebrow: 'Premium strength & conditioning club',
    titleLines: ['Train with', 'intent.'],
    text: 'Coach-led strength, conditioning, boxing and recovery in one considered space. Join a club built around craft, community and honest progress.',
    primary: { label: 'Join the club', to: '/membership' },
    secondary: { label: 'View timetable', to: '/schedule' },
    image: images.heroMain,
    badges: ['Coach-led classes', 'Six training zones', 'All levels welcome']
  },
  ticker: ['Strength', 'Conditioning', 'Boxing', 'Mobility', 'Performance', 'Recovery', 'Community'],
  positioning: {
    eyebrow: 'The club',
    title: 'A gym with a point of view.',
    paragraphs: [
      'Vigor Club pairs a serious training floor with the attention of a boutique studio. Every class is coached, every zone is purposeful, and every member is treated as an athlete in progress.',
      'No gimmicks and no guarantees — just good coaching, smart programming and a room full of people who show up.'
    ],
    /** Figures are counted from programs.ts, trainers.ts and classes.ts so they never go stale. */
    points: [
      { source: 'programs', label: 'coached programs' },
      { source: 'trainers', label: 'expert trainers' },
      { source: 'classes', label: 'classes every week' }
    ] as { source: 'programs' | 'trainers' | 'classes'; label: string }[],
    cta: { label: 'Our story', to: '/about' },
    image: images.introLifter
  },
  programs: { eyebrow: 'Training programs', title: 'Eight ways to get stronger.', intro: 'From barbell fundamentals to boxing rounds and mobility — pick your focus or mix them all.', limit: 6, cta: { label: 'All programs', to: '/programs' } },
  philosophy: {
    eyebrow: 'Philosophy',
    title: 'Technique first. Effort always. Recovery earned.',
    text: 'We believe confidence is built by learning to move well, training with purpose and recovering properly. Our coaches focus on the process — the results are yours to define.',
    pillars: [
      { title: 'Technique', text: 'Clear coaching so effort turns into progress.' },
      { title: 'Effort', text: 'Intensity that is scaled to you, never to a stereotype.' },
      { title: 'Recovery', text: 'Smart rest and mobility to keep you training.' }
    ],
    image: images.philosophy
  },
  facilities: { eyebrow: 'Facilities', title: 'Six zones. One standard.', intro: 'Purpose-built spaces for lifting, conditioning, group classes, private coaching and recovery.', cta: { label: 'Tour the facilities', to: '/facilities' } },
  schedule: { eyebrow: 'This week', title: 'The weekly timetable.', intro: 'Pick a day to preview classes, then open the full schedule to book a demo place.', cta: { label: 'Open full schedule', to: '/schedule' } },
  trainers: { eyebrow: 'Coaches', title: 'Meet the team.', intro: 'Six fictional coaches with different specialities and one shared standard.', cta: { label: 'All trainers', to: '/trainers' } },
  membership: { eyebrow: 'Membership', title: 'Find your plan.', intro: 'Floor, Club or Elite — compare monthly and annual pricing.', cta: { label: 'Compare plans', to: '/membership' } },
  testimonials: { eyebrow: 'Member stories', title: 'In their words.' },
  journal: { eyebrow: 'Journal', title: 'Notes from the floor.', intro: 'Practical, balanced articles from our coaches.', limit: 3, cta: { label: 'Read the journal', to: '/journal' } },
  cta: {
    eyebrow: 'Ready when you are',
    title: 'Your first session starts here.',
    text: 'Send a quick enquiry and we will help you choose a plan, class or coach. This demonstration form is validated but not delivered.',
    primary: { label: 'Request a free trial', to: '/contact?topic=membership' },
    secondary: { label: 'Talk to the team', to: '/contact' },
    image: images.cta
  }
};
