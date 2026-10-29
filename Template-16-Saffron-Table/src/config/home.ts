import type { HomeSection } from './types';

/**
 * Homepage sections render in the order listed here.
 * Set `enabled: false` to hide a section, or move entries to reorder them.
 */
export const homeSections: HomeSection[] = [
  { id: 'hero', enabled: true },
  { id: 'concept', enabled: true },
  { id: 'signature', enabled: true },
  { id: 'philosophy', enabled: true },
  { id: 'menus', enabled: true },
  { id: 'atmosphere', enabled: true },
  { id: 'privateDining', enabled: true },
  { id: 'awards', enabled: true },
  { id: 'testimonials', enabled: true },
  { id: 'journal', enabled: true },
  { id: 'reserveCta', enabled: true },
];

export const homeContent = {
  hero: {
    eyebrow: 'Seasonal cooking · Open-fire kitchen',
    title: 'A table set for the long evening',
    lead: 'Saffron Table is a chef-led dining room built around fire, spice and the quiet generosity of a well-set table. This is a fictional demonstration restaurant.',
    image: 'hero-table',
    primaryCta: { label: 'Reserve a table', to: '/reserve' },
    secondaryCta: { label: 'View the menus', to: '/menus' },
    facts: ['Dinner Tuesday–Sunday', 'Sunday lunch', '48 seats · Chef’s counter'],
  },
  concept: {
    eyebrow: 'The idea',
    title: 'Slow fire, deep spice, honest produce',
    paragraphs: [
      'Saffron Table cooks over embers and in copper, building every plate around a single idea: that spice, used with restraint, makes the season taste more like itself.',
      'The room is warm, low-lit and unhurried. Dishes arrive when they are ready; the wine list is short and personal; nothing on the menu is there to impress anyone but the person eating it.',
    ],
    images: ['dining-dark', 'chef-plating'],
    stats: [
      { value: '7', label: 'Course tasting menu' },
      { value: '48', label: 'Seats in the main room' },
      { value: '14', label: 'Producers we cook with' },
    ],
  },
  signature: {
    eyebrow: 'On the pass',
    title: 'Signature dishes',
    lead: 'A few plates the kitchen returns to every season.',
    itemIds: ['saffron-salmon', 'ember-short-rib', 'saffron-seafood-paella', 'chocolate-ganache-cake'],
  },
  philosophy: {
    eyebrow: 'Chef’s philosophy',
    title: 'Cook less. Season better. Serve warm.',
    quote:
      'I want you to remember the evening, not the technique. If a plate makes you pause and then reach for the bread, we have done our job.',
    cite: 'Chef Elias Marrow (fictional demonstration chef)',
    points: [
      { title: 'Fire first', text: 'Embers give us flavour no pan can imitate, so most dishes begin over coals.' },
      { title: 'Spice with restraint', text: 'Saffron, sumac and smoked chilli are accents, never a disguise.' },
      { title: 'Produce decides', text: 'The menu changes when the market does, sometimes mid-service.' },
    ],
    image: 'chef-portrait',
  },
  menus: {
    eyebrow: 'Featured menus',
    title: 'Three ways to dine',
    lead: 'Set menus for the whole table, or order à la carte from the full menu.',
  },
  atmosphere: {
    eyebrow: 'Atmosphere',
    title: 'Low light, long tables, warm copper',
    lead: 'A glimpse of the dining room, the kitchen and the evenings in between.',
    images: ['dining-green', 'open-kitchen', 'dining-tables', 'terrace', 'dining-window'],
  },
  privateDining: {
    eyebrow: 'Private dining',
    title: 'Your evening, our rooms',
    lead: 'Three distinct spaces for supper clubs, celebrations and corporate dinners, with menus written around your guests.',
    images: ['dining-teal', 'group-dinner'],
  },
  awards: {
    eyebrow: 'Recognition',
    title: 'Fictional accolades',
    disclaimer:
      'These awards are fictional and exist only to demonstrate the layout. Replace them with real recognition or hide this section.',
  },
  testimonials: {
    eyebrow: 'Guest notes',
    title: 'What guests say',
    disclaimer: 'Demonstration testimonials written for this template. They are not real guest reviews.',
  },
  journal: {
    eyebrow: 'The journal',
    title: 'Notes from the kitchen',
    lead: 'Seasonal menus, chef stories and culinary guides.',
    count: 3,
  },
  reserveCta: {
    eyebrow: 'Join us',
    title: 'Reserve your table',
    text: 'Choose a date, party size and seating area. Reservations in this template are a local simulation: nothing is sent to a restaurant.',
    image: 'pasta-table',
    cta: { label: 'Start a reservation', to: '/reserve' },
    secondary: { label: 'Private dining enquiries', to: '/private-dining' },
  },
};
