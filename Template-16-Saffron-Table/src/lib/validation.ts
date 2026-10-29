import { daysBetween, isDateKey, toDateKey } from './dates';

export type Errors = Record<string, string>;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateName = (v: string): string | undefined => {
  const t = v.trim();
  if (!t) return 'Please enter your name.';
  if (t.length < 2) return 'Name must be at least 2 characters.';
  if (t.length > 80) return 'Name must be 80 characters or fewer.';
  return undefined;
};

export const validateEmail = (v: string): string | undefined => {
  const t = v.trim();
  if (!t) return 'Please enter your email address.';
  if (!EMAIL_RE.test(t) || t.length > 120) return 'Enter a valid email address, such as name@example.com.';
  return undefined;
};

export const validatePhone = (v: string, required = true): string | undefined => {
  const t = v.trim();
  if (!t) return required ? 'Please enter a phone number.' : undefined;
  if (!/^[+()\d][\d\s().-]*$/.test(t)) return 'Phone numbers may only contain digits, spaces and + ( ) . -';
  const digits = t.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return 'Enter a phone number with 7–15 digits.';
  return undefined;
};

export const validateMessage = (v: string, opts: { required?: boolean; min?: number; max?: number } = {}): string | undefined => {
  const { required = true, min = 10, max = 1000 } = opts;
  const t = v.trim();
  if (!t) return required ? 'Please write a message.' : undefined;
  if (t.length < min) return `Please write at least ${min} characters.`;
  if (t.length > max) return `Please keep this under ${max} characters.`;
  return undefined;
};

const compact = (e: Record<string, string | undefined>): Errors =>
  Object.fromEntries(Object.entries(e).filter(([, v]) => v)) as Errors;

export interface ContactFormValues { name: string; email: string; topic: string; message: string }
export const validateContactForm = (v: ContactFormValues): Errors =>
  compact({
    name: validateName(v.name),
    email: validateEmail(v.email),
    topic: v.topic ? undefined : 'Please choose a topic.',
    message: validateMessage(v.message),
  });

export interface PrivateInquiryValues {
  name: string; email: string; phone: string; eventType: string; date: string; guests: string;
  budget: string; message: string; consent: boolean;
}
export const validatePrivateInquiry = (
  v: PrivateInquiryValues,
  opts: { today?: Date; leadDays: number; maxGuests: number; minGuests?: number },
): Errors => {
  const today = toDateKey(opts.today ?? new Date());
  let date: string | undefined;
  if (!v.date) date = 'Please choose an event date.';
  else if (!isDateKey(v.date)) date = 'Enter a valid date.';
  else if (daysBetween(today, v.date) < opts.leadDays) date = `Events need at least ${opts.leadDays} days’ notice. Choose a later date.`;
  let guests: string | undefined;
  const n = Number(v.guests);
  const min = opts.minGuests ?? 1;
  if (!v.guests.trim()) guests = 'Please enter the number of guests.';
  else if (!Number.isInteger(n)) guests = 'Guests must be a whole number.';
  else if (n < min) guests = `Minimum ${min} guest${min === 1 ? '' : 's'}.`;
  else if (n > opts.maxGuests) guests = `Our largest space hosts up to ${opts.maxGuests} guests.`;
  let budget: string | undefined;
  if (v.budget.trim() && !(Number(v.budget) > 0)) budget = 'Enter a budget greater than zero, or leave it blank.';
  return compact({
    name: validateName(v.name),
    email: validateEmail(v.email),
    phone: validatePhone(v.phone, false),
    eventType: v.eventType ? undefined : 'Please choose an event type.',
    date,
    guests,
    budget,
    message: validateMessage(v.message, { required: false, min: 10, max: 1000 }),
    consent: v.consent ? undefined : 'Please confirm you understand this is a demo form.',
  });
};

export interface ExperienceInquiryValues { name: string; email: string; date: string; guests: string; message: string; consent: boolean }
export const validateExperienceInquiry = (
  v: ExperienceInquiryValues,
  opts: { today?: Date; maxGuests: number },
): Errors => {
  const today = toDateKey(opts.today ?? new Date());
  let date: string | undefined;
  if (v.date) {
    if (!isDateKey(v.date)) date = 'Enter a valid date.';
    else if (daysBetween(today, v.date) < 0) date = 'Please choose a date today or later.';
  }
  const n = Number(v.guests);
  let guests: string | undefined;
  if (!v.guests.trim()) guests = 'Please enter the number of guests.';
  else if (!Number.isInteger(n) || n < 1) guests = 'Guests must be a whole number of 1 or more.';
  else if (n > opts.maxGuests) guests = `This experience hosts up to ${opts.maxGuests} guests.`;
  return compact({
    name: validateName(v.name),
    email: validateEmail(v.email),
    date,
    guests,
    message: validateMessage(v.message, { required: false, max: 600 }),
    consent: v.consent ? undefined : 'Please confirm you understand this is a demo form.',
  });
};
