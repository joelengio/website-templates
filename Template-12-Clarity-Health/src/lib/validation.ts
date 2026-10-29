export type Errors<K extends string> = Partial<Record<K, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Allowed characters in a person's name: letters (any script), marks, spaces, apostrophes, hyphens, dots. */
const NAME = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.-]*$/u;

export const isEmail = (v: string) => EMAIL.test(v.trim());
export const phoneDigits = (v: string) => v.replace(/\D/g, '').length;
export const normalizeEmail = (v: string) => v.trim().toLowerCase();

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
}

/**
 * Basic contact validation for the demo booking. Deliberately limited to name, e-mail and an optional phone number:
 * the demo never collects medical, insurance or identity information.
 */
export function validateContactDetails(v: ContactDetails, requirePhone = false): Errors<keyof ContactDetails> {
  const e: Errors<keyof ContactDetails> = {};
  const name = v.name.trim();
  if (name.length < 2) e.name = 'Please enter your name (at least 2 characters).';
  else if (name.length > 80) e.name = 'Please keep your name under 80 characters.';
  else if (!NAME.test(name)) e.name = 'Names can contain letters, spaces, hyphens and apostrophes only.';
  if (!v.email.trim()) e.email = 'Please enter an e-mail address.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid e-mail address, for example name@example.com.';
  const phone = v.phone.trim();
  if (!phone && requirePhone) e.phone = 'Please enter a phone number.';
  else if (phone && (phoneDigits(phone) < 7 || phoneDigits(phone) > 15 || /[^\d+()\-.\s]/.test(phone)))
    e.phone = 'Please enter a valid phone number (7–15 digits) or leave it blank.';
  return e;
}

export interface InquiryFields {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export function validateInquiry(v: InquiryFields): Errors<keyof InquiryFields> {
  const e: Errors<keyof InquiryFields> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter an e-mail address.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid e-mail address, for example name@example.com.';
  if (!v.topic) e.topic = 'Please choose a topic.';
  const msg = v.message.trim();
  if (msg.length < 10) e.message = 'Your message should be at least 10 characters.';
  else if (v.message.length > 1000) e.message = 'Please keep your message under 1000 characters.';
  return e;
}
