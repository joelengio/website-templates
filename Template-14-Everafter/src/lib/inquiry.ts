import { addOns, destinationOptions, eventTypes, packages, questionnaireSettings as qs, seasons, serviceOptions } from '../config';
import { isValidISODate, todayISO, validateEmail, validateName, validatePhone } from './validation';

export type DateMode = 'exact' | 'flexible' | 'undecided';

export interface InquiryAnswers {
  eventType: string;
  dateMode: DateMode | '';
  date: string;
  season: string;
  year: string;
  destination: string;
  customDestination: string;
  guests: string;
  styles: string[];
  services: string[];
  budget: string;
  name: string;
  email: string;
  phone: string;
  partnerName: string;
  company: string;
  contactMethod: string;
  notes: string;
  packageId: string;
  addOns: string[];
}

export const emptyAnswers: InquiryAnswers = {
  eventType: '',
  dateMode: '',
  date: '',
  season: '',
  year: '',
  destination: '',
  customDestination: '',
  guests: '',
  styles: [],
  services: [],
  budget: '',
  name: '',
  email: '',
  phone: '',
  partnerName: '',
  company: '',
  contactMethod: 'email',
  notes: '',
  packageId: '',
  addOns: []
};

export type StepId = 'type' | 'date' | 'destination' | 'guests' | 'style' | 'services' | 'budget' | 'contact' | 'review';

export interface StepDef {
  id: StepId;
  title: string;
  /** Short label used in the progress indicator. */
  label: string;
  optional?: boolean;
}

export const steps: StepDef[] = [
  { id: 'type', title: 'What are we celebrating?', label: 'Event' },
  { id: 'date', title: 'When would you like to celebrate?', label: 'Date' },
  { id: 'destination', title: 'Where would you like to celebrate?', label: 'Place' },
  { id: 'guests', title: 'How many guests do you expect?', label: 'Guests' },
  { id: 'style', title: 'Which styles speak to you?', label: 'Style' },
  { id: 'services', title: 'How can we help?', label: 'Services' },
  { id: 'budget', title: 'Do you have a budget in mind?', label: 'Budget', optional: true },
  { id: 'contact', title: 'How can we reach you?', label: 'Details' },
  { id: 'review', title: 'Review your enquiry', label: 'Review' }
];

export type Errors = Partial<Record<keyof InquiryAnswers | 'form', string>>;

export const servicesFor = (eventType: string) => serviceOptions.filter((s) => !s.appliesTo || !eventType || s.appliesTo.includes(eventType));

/** Services that make sense for the chosen event type, with unavailable selections dropped. */
export function sanitizeServices(a: InquiryAnswers): string[] {
  const allowed = new Set(servicesFor(a.eventType).map((s) => s.id));
  return a.services.filter((s) => allowed.has(s));
}

export const yearOptions = () => {
  const y = new Date().getFullYear();
  return [y, y + 1, y + 2, y + 3].map(String);
};

export function validateStep(id: StepId, a: InquiryAnswers): Errors {
  const e: Errors = {};
  switch (id) {
    case 'type':
      if (!a.eventType) e.eventType = 'Please choose the type of event.';
      break;
    case 'date':
      if (!a.dateMode) e.dateMode = 'Please choose how firm your date is.';
      else if (a.dateMode === 'exact') {
        if (!a.date) e.date = 'Please choose your preferred date.';
        else if (!isValidISODate(a.date)) e.date = 'That date does not look right. Please use the date picker.';
        else if (a.date < todayISO()) e.date = 'Please choose a date in the future.';
      } else if (a.dateMode === 'flexible') {
        if (!a.season) e.season = 'Please choose a season.';
        if (!a.year) e.year = 'Please choose a year.';
      }
      break;
    case 'destination':
      if (!a.destination) e.destination = 'Please choose a destination, or tell us you would like suggestions.';
      else if (a.destination === 'other' && a.customDestination.trim().length < 2) e.customDestination = 'Please tell us where you are thinking of.';
      break;
    case 'guests': {
      const n = Number(a.guests);
      if (!a.guests.trim()) e.guests = 'Please enter an estimated number of guests.';
      else if (!Number.isInteger(n)) e.guests = 'Please enter a whole number.';
      else if (n < qs.minGuests) e.guests = `Please enter at least ${qs.minGuests} guests.`;
      else if (n > qs.maxGuests) e.guests = `Please enter ${qs.maxGuests} guests or fewer — larger events are handled by conversation.`;
      break;
    }
    case 'style':
      if (a.styles.length === 0) e.styles = 'Please choose at least one style. Choose as many as you like.';
      break;
    case 'services':
      if (sanitizeServices(a).length === 0) e.services = 'Please choose at least one service.';
      break;
    case 'budget':
      break;
    case 'contact': {
      const n = validateName(a.name);
      if (n) e.name = n;
      const m = validateEmail(a.email);
      if (m) e.email = m;
      const p = validatePhone(a.phone, a.contactMethod === 'phone');
      if (p) e.phone = p;
      if (a.notes.length > qs.notesMaxLength) e.notes = `Please keep notes under ${qs.notesMaxLength} characters.`;
      if (a.eventType === 'corporate' && a.company.trim().length < 2) e.company = 'Please enter your company or organisation.';
      break;
    }
    case 'review':
      break;
  }
  return e;
}

export const validateAll = (a: InquiryAnswers): { errors: Errors; firstInvalid: StepId | null } => {
  for (const s of steps) {
    const errors = validateStep(s.id, a);
    if (Object.keys(errors).length) return { errors, firstInvalid: s.id };
  }
  return { errors: {}, firstInvalid: null };
};

/** Non-blocking advice shown beside an answer. */
export function guestAdvice(a: InquiryAnswers): string {
  const n = Number(a.guests);
  if (!Number.isFinite(n) || !a.guests) return '';
  if (a.eventType === 'elopement' && n > qs.elopementMaxGuests) return `Elopements are usually up to ${qs.elopementMaxGuests} guests. You can continue — we may suggest a small wedding format instead.`;
  if (n >= qs.largeEventGuests) return 'Events of this size involve extra production and permits. We will talk through the format on your consultation.';
  return '';
}

export const labelOf = (list: { id: string; label: string }[], id: string) => list.find((o) => o.id === id)?.label ?? id;

export function summarise(a: InquiryAnswers) {
  const dest = a.destination === 'other' ? a.customDestination.trim() : labelOf(destinationOptions, a.destination);
  let when = 'Not decided';
  if (a.dateMode === 'exact') when = a.date;
  if (a.dateMode === 'flexible') when = `${labelOf(seasons, a.season)} ${a.year}`;
  const pkg = packages.find((p) => p.id === a.packageId);
  return {
    event: labelOf(eventTypes, a.eventType),
    when,
    destination: dest,
    guests: a.guests,
    styles: a.styles,
    services: sanitizeServices(a),
    budget: a.budget,
    packageName: pkg?.name ?? '',
    addOnNames: a.addOns.map((id) => addOns.find((x) => x.id === id)?.label).filter(Boolean) as string[]
  };
}

/** A clearly fake reference. It is generated locally and is NOT an enquiry number issued by any planner. */
export const makeDemoReference = (seed = Date.now()) => `DEMO-${seed.toString(36).toUpperCase().slice(-6)}`;
