export type Errors<K extends string> = Partial<Record<K, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (v: string) => EMAIL.test(v.trim());
export const phoneDigits = (v: string) => v.replace(/\D/g, '').length;

export interface CustomerFields {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export function validateCustomer(v: CustomerFields): Errors<keyof CustomerFields> {
  const e: Errors<keyof CustomerFields> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (v.phone.trim() && (phoneDigits(v.phone) < 7 || phoneDigits(v.phone) > 15 || /[^\d+()\-.\s]/.test(v.phone)))
    e.phone = 'Please enter a valid phone number or leave it blank.';
  if (v.notes.length > 500) e.notes = 'Notes must be 500 characters or fewer.';
  return e;
}

export interface ContactFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function validateContact(v: ContactFields): Errors<keyof ContactFields> {
  const e: Errors<keyof ContactFields> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (v.subject.trim().length < 3) e.subject = 'Please add a short subject.';
  if (v.message.trim().length < 10) e.message = 'Your message should be at least 10 characters.';
  else if (v.message.length > 2000) e.message = 'Please keep your message under 2000 characters.';
  return e;
}
