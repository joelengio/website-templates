import { img } from './images';
import { destinations } from './destinations';
import type { Cta } from './types';

/**
 * Homepage content and structure.
 * `sections` controls which sections render and in what order. Set `enabled: false` to hide one, or reorder the array.
 * Unknown ids are ignored, and the page always renders safely if everything is hidden.
 */
export type HomeSectionId =
  | 'intro'
  | 'philosophy'
  | 'featured'
  | 'services'
  | 'destinations'
  | 'experiences'
  | 'process'
  | 'testimonials'
  | 'journal'
  | 'cta';

export const homeSections: { id: HomeSectionId; enabled: boolean }[] = [
  { id: 'intro', enabled: true },
  { id: 'featured', enabled: true },
  { id: 'philosophy', enabled: true },
  { id: 'services', enabled: true },
  { id: 'destinations', enabled: true },
  { id: 'experiences', enabled: true },
  { id: 'process', enabled: true },
  { id: 'testimonials', enabled: true },
  { id: 'journal', enabled: true },
  { id: 'cta', enabled: true }
];

export const hero = {
  eyebrow: 'Luxury wedding & event planning',
  title: 'Celebrations composed with intention',
  subtitle: 'EVERAFTER plans weddings and private celebrations across Italy, France, the Alps and beyond — unhurried, beautifully made, and entirely looked after.',
  image: img('hero-arch'),
  primaryCta: { label: 'Begin your enquiry', to: '/plan' } satisfies Cta,
  secondaryCta: { label: 'View our weddings', to: '/weddings' } satisfies Cta,
  stats: [
    { value: '14', label: 'Years planning' },
    { value: '260+', label: 'Celebrations (fictional)' },
    { value: String(destinations.length), label: 'Destinations' }
  ]
};

export const intro = {
  eyebrow: 'The studio',
  title: 'A planning studio for people who care about how a day feels',
  body: [
    'EVERAFTER is a small, senior team of planners, designers and coordinators. We take on a limited number of celebrations each year so that every one receives our full attention.',
    'Our work is calm, edited and quietly extravagant: a long table in an olive grove, a ceremony facing the sea, a ballroom lit entirely by candles. We make the extraordinary feel effortless.'
  ],
  cta: { label: 'Our story', to: '/about' } satisfies Cta,
  image: img('bouquet-ivory', { position: '50% 35%' }),
  imageSecondary: img('table-white', { position: '50% 45%' })
};

export const philosophy = {
  eyebrow: 'Planning philosophy',
  title: 'Less, but better — and always personal',
  image: img('vineyard-gold'),
  pillars: [
    { title: 'Listen', text: 'We begin with the people, not a template. What do you love? Who must be in the room?' },
    { title: 'Edit', text: 'A limited palette and a few well-made things always outshine abundance.' },
    { title: 'Compose', text: 'Place, light, food, flowers and music are designed together as one experience.' },
    { title: 'Host', text: 'On the day we host, quietly, so that you and your guests can simply be there.' }
  ]
};

export const experiences = {
  eyebrow: 'Signature experiences',
  title: 'Moments our couples remember most',
  items: [
    { title: 'The long table', text: 'One continuous table, laid with candles and seasonal florals, for the dinner everyone talks about.', image: img('table-tulips') },
    { title: 'Golden-hour ceremony', text: 'Timed to the light, with a procession, a string trio and a place for guests to breathe.', image: img('algarve-cliffs') },
    { title: 'The house-party weekend', text: 'Three days of shared meals, boat trips and long evenings — a wedding as an experience.', image: img('como-villa') },
    { title: 'The candlelit after-party', text: 'A late-night room of firelight, great music and a very good bar.', image: img('detail-candle') }
  ]
};

export const planningProcess = {
  eyebrow: 'The process',
  title: 'From first conversation to last dance',
  steps: [
    { title: 'Consultation', text: 'A relaxed 45-minute conversation about your plans, with no obligation.' },
    { title: 'Proposal', text: 'A personalised proposal covering scope, timeline and investment.' },
    { title: 'Design', text: 'Mood boards, venue selection, suppliers and the full creative direction.' },
    { title: 'Refine', text: 'Tastings, rehearsals and a precise run-sheet, checked repeatedly.' },
    { title: 'Celebrate', text: 'We host the day, so that you can be fully present for it.' }
  ]
};

export const cta = {
  eyebrow: 'Consultation',
  title: 'Let’s talk about your day',
  body: 'Tell us what you are imagining. A planner will explore ideas with you — in this demonstration, your answers stay in your browser and are not sent to anyone.',
  primary: { label: 'Start your enquiry', to: '/plan' } satisfies Cta,
  secondary: { label: 'Contact the studio', to: '/contact' } satisfies Cta,
  image: img('arch-lakeside')
};

export const homeCounts = { featured: 4, destinations: 6, journal: 3 };
