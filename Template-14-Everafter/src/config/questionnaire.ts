import type { Option } from './types';
import { destinations } from './destinations';

/**
 * Event planning questionnaire content. All option labels and thresholds are configurable.
 * `appliesTo` on a service option lists event-type ids it is offered for (omit for all).
 */
export interface ServiceOption extends Option {
  appliesTo?: string[];
}

export const eventTypes: Option[] = [
  { id: 'wedding', label: 'Wedding', hint: 'Ceremony and celebration' },
  { id: 'elopement', label: 'Elopement or micro-wedding', hint: 'Intimate, up to 25 guests' },
  { id: 'vow-renewal', label: 'Vow renewal', hint: 'Celebrating an anniversary' },
  { id: 'rehearsal', label: 'Rehearsal dinner or welcome party', hint: 'The evening before' },
  { id: 'private', label: 'Private celebration', hint: 'Milestone birthday or anniversary' },
  { id: 'corporate', label: 'Corporate event', hint: 'Retreat, dinner or launch' }
];

export const dateModes: Option[] = [
  { id: 'exact', label: 'We have a date', hint: 'Choose a specific day' },
  { id: 'flexible', label: 'We have a season', hint: 'Roughly when' },
  { id: 'undecided', label: 'Not decided yet', hint: 'We would like advice' }
];

export const seasons: Option[] = [
  { id: 'spring', label: 'Spring (Mar – May)' },
  { id: 'summer', label: 'Summer (Jun – Aug)' },
  { id: 'autumn', label: 'Autumn (Sep – Nov)' },
  { id: 'winter', label: 'Winter (Dec – Feb)' }
];

export const destinationOptions: Option[] = [
  ...destinations.map((d) => ({ id: d.slug, label: `${d.name}, ${d.country}`, hint: d.category })),
  { id: 'other', label: 'Somewhere else', hint: 'Tell us where' },
  { id: 'open', label: 'We would like suggestions', hint: 'Open to ideas' }
];

export const styleOptions: Option[] = [
  { id: 'romantic-garden', label: 'Romantic garden', hint: 'Blooms, soft light' },
  { id: 'rustic-heritage', label: 'Rustic heritage', hint: 'Vineyards, stone, long tables' },
  { id: 'coastal', label: 'Coastal elegance', hint: 'Sea, linen, golden hour' },
  { id: 'modern-classic', label: 'Modern classic', hint: 'Black tie, clean lines' },
  { id: 'bohemian', label: 'Bohemian natural', hint: 'Foraged, relaxed, organic' },
  { id: 'grand', label: 'Heritage grandeur', hint: 'Castles, ballrooms, candlelight' },
  { id: 'alpine', label: 'Alpine intimate', hint: 'Mountains, huts, firelight' }
];

export const serviceOptions: ServiceOption[] = [
  { id: 'full', label: 'Full planning', hint: 'Everything, start to finish', appliesTo: ['wedding', 'elopement', 'vow-renewal', 'private'] },
  { id: 'partial', label: 'Partial planning', hint: 'Support where you need it' },
  { id: 'coordination', label: 'Day-of coordination', hint: 'A calm team on the day' },
  { id: 'destination', label: 'Destination management', hint: 'Scouting, travel, guest journey', appliesTo: ['wedding', 'elopement', 'vow-renewal', 'rehearsal', 'private'] },
  { id: 'styling', label: 'Venue styling', hint: 'Layout, lighting, linen' },
  { id: 'floral', label: 'Floral & event design', hint: 'Flowers and installations' },
  { id: 'private', label: 'Private celebration planning', hint: 'Dinners and weekends', appliesTo: ['private', 'rehearsal', 'vow-renewal'] },
  { id: 'corporate', label: 'Corporate event production', hint: 'Programme and delivery', appliesTo: ['corporate'] },
  { id: 'stationery', label: 'Stationery & signage', hint: 'Invitations and menus', appliesTo: ['wedding', 'elopement', 'vow-renewal', 'rehearsal', 'private'] }
];

export const budgetOptions: Option[] = [
  { id: 'under-10k', label: 'Under $10,000' },
  { id: '10-25k', label: '$10,000 – $25,000' },
  { id: '25-50k', label: '$25,000 – $50,000' },
  { id: '50-100k', label: '$50,000 – $100,000' },
  { id: '100k-plus', label: '$100,000 or more' },
  { id: 'discuss', label: 'I would prefer to discuss this', hint: 'No obligation' }
];

export const contactMethods: Option[] = [
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'video', label: 'Video call' }
];

export const questionnaireSettings = {
  /** Allowed guest range. */
  minGuests: 2,
  maxGuests: 1000,
  /** Shown as a gentle note above this number. */
  largeEventGuests: 250,
  /** Elopements are offered for up to this many guests; a warning shows above it. */
  elopementMaxGuests: 25,
  draftStorageKey: 'everafter.inquiry-draft.v1',
  /** Maximum characters in the free-text notes field. */
  notesMaxLength: 1200
};
