import { img } from './images';
import type { AddOn, PackageFeature, PackageTier } from './types';

/** Starting prices are illustrative. Change `startingPrice` to update every place a price appears. */
export const packages: PackageTier[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Support for couples who have started',
    description: 'A focused partnership: expert guidance, supplier introductions and a flawless day-of team.',
    startingPrice: 6200,
    priceNote: 'Starting price · from 4 months',
    includes: ['consult', 'budget', 'suppliers', 'timeline', 'rehearsal', 'dayof'],
    image: img('bouquet-sweet')
  },
  {
    id: 'signature',
    name: 'Signature',
    tagline: 'Our complete planning experience',
    description: 'Full creative direction and management from first conversation to final farewell.',
    startingPrice: 14500,
    priceNote: 'Starting price · from 9 months',
    featured: true,
    includes: ['consult', 'budget', 'suppliers', 'timeline', 'rehearsal', 'dayof', 'design', 'venue', 'guest', 'walkthrough', 'florals'],
    image: img('como-gardens')
  },
  {
    id: 'destination',
    name: 'Destination',
    tagline: 'A wedding weekend, anywhere',
    description: 'Everything in Signature, with scouting trips, legal guidance and a guest journey for destination celebrations.',
    startingPrice: 24000,
    priceNote: 'Starting price · from 12 months',
    includes: ['consult', 'budget', 'suppliers', 'timeline', 'rehearsal', 'dayof', 'design', 'venue', 'guest', 'walkthrough', 'florals', 'scout', 'legal', 'weekend'],
    image: img('amalfi-coast')
  }
];

export const packageFeatures: PackageFeature[] = [
  { id: 'consult', group: 'Planning', label: 'Planning consultations', values: { essential: '2 sessions', signature: 'Unlimited', destination: 'Unlimited' } },
  { id: 'budget', group: 'Planning', label: 'Budget and payment calendar' },
  { id: 'suppliers', group: 'Planning', label: 'Supplier introductions' },
  { id: 'timeline', group: 'Planning', label: 'Detailed timeline and run-sheet' },
  { id: 'venue', group: 'Planning', label: 'Venue search and negotiation' },
  { id: 'design', group: 'Design', label: 'Creative direction and mood boards' },
  { id: 'florals', group: 'Design', label: 'Floral design proposal' },
  { id: 'guest', group: 'Guests', label: 'Guest accommodation and transport' },
  { id: 'scout', group: 'Destination', label: 'In-person scouting trip' },
  { id: 'legal', group: 'Destination', label: 'Legal paperwork guidance' },
  { id: 'walkthrough', group: 'On the day', label: 'Venue walk-throughs', values: { essential: '—', signature: '2 visits', destination: '3 visits' } },
  { id: 'rehearsal', group: 'On the day', label: 'Ceremony rehearsal' },
  { id: 'dayof', group: 'On the day', label: 'Day-of coordination team', values: { essential: '10 hours', signature: 'Full day', destination: 'Full weekend' } },
  { id: 'weekend', group: 'On the day', label: 'On-site weekend management' }
];

export const addOns: AddOn[] = [
  { id: 'rehearsal-dinner', label: 'Rehearsal dinner planning', description: 'Design and management of the evening before.', price: 2400, unit: 'per event' },
  { id: 'welcome-party', label: 'Welcome party', description: 'A relaxed arrival event for guests.', price: 2800, unit: 'per event' },
  { id: 'stationery', label: 'Bespoke stationery suite', description: 'Invitations, menus, signage and place cards.', price: 1900, unit: 'per suite' },
  { id: 'floral-installation', label: 'Floral installation', description: 'A hanging or arch installation to anchor the ceremony.', price: 3200, unit: 'per installation' },
  { id: 'farewell-brunch', label: 'Farewell brunch', description: 'A gentle send-off the morning after.', price: 1800, unit: 'per event' },
  { id: 'extra-day', label: 'Additional coordination day', description: 'Extend our on-site team for another day.', price: 1500, unit: 'per day' }
];
