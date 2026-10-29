import type { PrivateMenu, PrivatePackage, PrivateSpace } from './types';

export const privateDiningIntro = {
  eyebrow: 'Private dining',
  title: 'Rooms for the evenings that matter',
  lead: 'Supper clubs, anniversaries, rehearsal dinners and corporate evenings. All spaces, prices and capacities are demonstration data.',
};

export const privateSpaces: PrivateSpace[] = [
  {
    id: 'saffron-room',
    name: 'The Saffron Room',
    description: 'A dark, low-lit room with its own entrance and a single long table.',
    seated: 24,
    standing: 40,
    image: 'dining-dark',
    features: ['Private entrance', 'Sound system', 'Dedicated host'],
  },
  {
    id: 'cellar-table',
    name: 'The Cellar Table',
    description: 'A candlelit cellar with one round table and the wine list on the walls.',
    seated: 12,
    standing: 18,
    image: 'dining-tables',
    features: ['Wine-led menus', 'Candlelit', 'Quiet'],
  },
  {
    id: 'terrace-private',
    name: 'The Terrace',
    description: 'A canopied terrace for long lunches and summer dinners.',
    seated: 36,
    standing: 60,
    image: 'terrace',
    features: ['Heated in winter', 'Open grill', 'Evening lighting'],
  },
];

export const privatePackages: PrivatePackage[] = [
  {
    id: 'supper',
    name: 'Intimate Supper',
    summary: 'A three-course sharing menu for smaller tables.',
    priceFrom: 95,
    priceNote: 'per person',
    minGuests: 8,
    maxGuests: 16,
    includes: ['Three-course menu', 'Welcome drink', 'Dedicated host'],
  },
  {
    id: 'celebration',
    name: 'Celebration Dinner',
    summary: 'A five-course menu with cocktails on arrival.',
    priceFrom: 130,
    priceNote: 'per person',
    minGuests: 12,
    maxGuests: 30,
    includes: ['Five-course menu', 'Cocktails on arrival', 'Floral styling', 'Printed menus'],
  },
  {
    id: 'buyout',
    name: 'Full Venue Buyout',
    summary: 'The whole restaurant for weddings, launches and corporate events.',
    priceFrom: 6500,
    priceNote: 'minimum spend',
    minGuests: 30,
    maxGuests: 80,
    includes: ['All rooms and terrace', 'Bespoke menu', 'Event manager', 'Late license subject to approval'],
  },
];

export const privateMenus: PrivateMenu[] = [
  {
    id: 'sharing',
    name: 'Sharing menu',
    price: 95,
    priceNote: 'per person',
    courses: ['Warm saffron bread', 'Shaved fennel & whipped feta', 'Lamb kofta', 'Charcoal mixed grill and vegetables', 'Dark chocolate ganache cake'],
  },
  {
    id: 'celebration-menu',
    name: 'Celebration menu',
    price: 130,
    priceNote: 'per person',
    courses: ['Welcome cocktail', 'Seared tuna, heritage tomato', 'Roasted carrot & saffron soup', 'Saffron salmon', 'Ember-glazed short rib', 'Seasonal fruit tartlets'],
  },
  {
    id: 'garden-menu',
    name: 'Garden menu (vegetarian)',
    price: 105,
    priceNote: 'per person',
    courses: ['Avocado & pomegranate', 'Charred cauliflower & chickpea', 'Wild mushroom risotto', 'Warm chocolate brownie'],
  },
];

export const eventTypes = ['Birthday', 'Anniversary', 'Wedding / rehearsal dinner', 'Corporate dinner', 'Supper club', 'Other'];
export const eventRequirements = ['Audio / visual', 'Floral styling', 'Cake service', 'Wine pairing', 'Vegetarian or vegan options', 'Accessibility support'];
/** Earliest bookable event date, in days from today. */
export const privateEventLeadDays = 7;
