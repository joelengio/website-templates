export type Errors<K extends string> = Partial<Record<K, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (v: string) => EMAIL.test(v.trim());
export const phoneDigits = (v: string) => v.replace(/\D/g, '').length;
const badPhone = (v: string) => phoneDigits(v) < 7 || phoneDigits(v) > 15 || /[^\d+()\-.\s]/.test(v);

export interface ProfileFields {
  name: string;
  email: string;
}

/** Name + email, used for class reservations. */
export function validateProfile(v: ProfileFields): Errors<keyof ProfileFields> {
  const e: Errors<keyof ProfileFields> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  return e;
}

export interface ContactFields {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

export function validateContact(v: ContactFields): Errors<keyof ContactFields> {
  const e: Errors<keyof ContactFields> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (v.phone.trim() && badPhone(v.phone)) e.phone = 'Please enter a valid phone number or leave it blank.';
  if (!v.topic) e.topic = 'Please choose what your enquiry is about.';
  if (v.message.trim().length < 10) e.message = 'Your message should be at least 10 characters.';
  else if (v.message.length > 1500) e.message = 'Please keep your message under 1500 characters.';
  return e;
}

export interface SignupFields {
  name: string;
  email: string;
  phone: string;
  startDate: string;
  planId: string;
  agree: boolean;
}

export function validateSignup(v: SignupFields, planIds: string[], todayIso: string): Errors<keyof SignupFields> {
  const e: Errors<keyof SignupFields> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (v.phone.trim() && badPhone(v.phone)) e.phone = 'Please enter a valid phone number or leave it blank.';
  if (!planIds.includes(v.planId)) e.planId = 'Please choose a plan.';
  if (!v.startDate) e.startDate = 'Please choose a preferred start date.';
  else if (v.startDate < todayIso) e.startDate = 'The start date cannot be in the past.';
  if (!v.agree) e.agree = 'Please confirm you understand this is a demonstration.';
  return e;
}
