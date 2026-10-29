export interface InquiryValues {
  name: string;
  email: string;
  phone: string;
  topic: string;
  propertyId: string;
  message: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  website: string;
}

export type InquiryErrors = Partial<Record<keyof InquiryValues, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d][\d\s().-]{6,}$/;

export function validateInquiry(v: InquiryValues): InquiryErrors {
  const e: InquiryErrors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!EMAIL.test(v.email.trim())) e.email = 'Please enter a valid email address, like name@example.com.';
  if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = 'Please enter a valid phone number or leave it blank.';
  if (!v.topic) e.topic = 'Please choose what your inquiry is about.';
  if (v.message.trim().length < 10) e.message = 'Please write at least 10 characters so we can help.';
  else if (v.message.length > 2000) e.message = 'Please keep your message under 2000 characters.';
  if (!v.consent) e.consent = 'Please confirm you agree to be contacted about this inquiry.';
  return e;
}
