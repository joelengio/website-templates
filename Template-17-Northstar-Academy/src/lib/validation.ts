export interface ContactValues { name: string; email: string; topic: string; message: string; consent: boolean }
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (v.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).';
  if (!v.email.trim()) e.email = 'Enter your email address.';
  else if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address, like name@example.com.';
  if (!v.topic) e.topic = 'Choose a topic.';
  if (v.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).';
  if (!v.consent) e.consent = 'Please confirm you understand this is a demonstration form.';
  return e;
}
