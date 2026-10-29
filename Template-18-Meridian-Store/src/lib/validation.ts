export type Errors<K extends string> = Partial<Record<K, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (s: string): boolean => s.length <= 254 && EMAIL.test(s.trim());

/** Luhn check — used only to REFUSE input that looks like a payment card number. The template never accepts card data. */
export function looksLikeCardNumber(s: string): boolean {
  const candidates = s.match(/\d(?:[ -]?\d){12,18}/g) ?? [];
  return candidates.some((c) => {
    const digits = c.replace(/[\s-]/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0, alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = Number(digits[i]);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  });
}
export const CARD_REFUSAL = 'This looks like a card number. The demonstration never accepts payment details — please enter fictional text instead.';

const POSTCODE: Record<string, { re: RegExp; hint: string }> = {
  US: { re: /^\d{5}(-\d{4})?$/, hint: 'a 5-digit ZIP code, e.g. 97205' },
  CA: { re: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, hint: 'a postal code like K1A 0B1' },
  GB: { re: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/, hint: 'a postcode like SW1A 1AA' },
  DE: { re: /^\d{5}$/, hint: 'a 5-digit postcode' },
  FR: { re: /^\d{5}$/, hint: 'a 5-digit postcode' },
  IE: { re: /^[A-Za-z]\d{2}\s?[A-Za-z\d]{4}$/, hint: 'an Eircode like D02 X285' },
  NL: { re: /^\d{4}\s?[A-Za-z]{2}$/, hint: 'a postcode like 1011 AB' },
  ES: { re: /^\d{5}$/, hint: 'a 5-digit postcode' },
  IT: { re: /^\d{5}$/, hint: 'a 5-digit CAP' },
  AU: { re: /^\d{4}$/, hint: 'a 4-digit postcode' },
  JP: { re: /^\d{3}-?\d{4}$/, hint: 'a postcode like 100-0001' },
  SG: { re: /^\d{6}$/, hint: 'a 6-digit postcode' }
};
export const REGION_REQUIRED = new Set(['US', 'CA', 'AU']);
export const regionLabel = (country: string): string => (country === 'US' ? 'State' : country === 'CA' ? 'Province' : country === 'AU' ? 'State / territory' : 'Region (optional)');

export interface ContactFields { email: string; firstName: string; lastName: string; phone: string }
export interface AddressFields { country: string; line1: string; line2: string; city: string; region: string; postcode: string }

const noCard = (value: string): string | undefined => (looksLikeCardNumber(value) ? CARD_REFUSAL : undefined);

export function validateContact(v: ContactFields): Errors<keyof ContactFields> {
  const e: Errors<keyof ContactFields> = {};
  if (!v.email.trim()) e.email = 'Enter an email address.'; else if (!isEmail(v.email)) e.email = 'Enter a valid email address, e.g. alex@example.com.';
  if (v.firstName.trim().length < 2) e.firstName = 'Enter a first name (at least 2 characters).'; else e.firstName = noCard(v.firstName);
  if (v.lastName.trim().length < 2) e.lastName = 'Enter a last name (at least 2 characters).'; else e.lastName = noCard(v.lastName);
  if (v.phone.trim()) {
    const digits = v.phone.replace(/\D/g, '');
    if (!/^[+\d\s().-]+$/.test(v.phone) || digits.length < 7 || digits.length > 15) e.phone = 'Enter a phone number with 7–15 digits, or leave it blank.';
    else if (looksLikeCardNumber(v.phone)) e.phone = CARD_REFUSAL;
  }
  return Object.fromEntries(Object.entries(e).filter(([, m]) => m)) as Errors<keyof ContactFields>;
}

export function validateAddress(v: AddressFields, countries: string[]): Errors<keyof AddressFields> {
  const e: Errors<keyof AddressFields> = {};
  if (!countries.includes(v.country)) e.country = 'Choose a destination we deliver to.';
  if (v.line1.trim().length < 4) e.line1 = 'Enter a street address (at least 4 characters).'; else e.line1 = noCard(v.line1);
  if (v.line2.trim() && looksLikeCardNumber(v.line2)) e.line2 = CARD_REFUSAL;
  if (v.city.trim().length < 2) e.city = 'Enter a city or town.'; else e.city = noCard(v.city);
  if (REGION_REQUIRED.has(v.country) && v.region.trim().length < 2) e.region = `Enter a ${regionLabel(v.country).toLowerCase()}.`;
  const rule = POSTCODE[v.country];
  const pc = v.postcode.trim();
  if (!pc) e.postcode = 'Enter a postal code.';
  else if (rule && !rule.re.test(pc)) e.postcode = `Enter ${rule.hint}.`;
  else if (looksLikeCardNumber(pc)) e.postcode = CARD_REFUSAL;
  return Object.fromEntries(Object.entries(e).filter(([, m]) => m)) as Errors<keyof AddressFields>;
}

export interface ContactFormFields { name: string; email: string; topic: string; message: string }
export function validateContactForm(v: ContactFormFields): Errors<keyof ContactFormFields> {
  const e: Errors<keyof ContactFormFields> = {};
  if (v.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).';
  if (!v.email.trim()) e.email = 'Enter an email address.'; else if (!isEmail(v.email)) e.email = 'Enter a valid email address.';
  if (!v.topic) e.topic = 'Choose a topic.';
  if (v.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.'; else if (v.message.length > 2000) e.message = 'Keep your message under 2,000 characters.';
  else if (looksLikeCardNumber(v.message)) e.message = CARD_REFUSAL;
  return e;
}

export const validateNewsletterEmail = (email: string): string | undefined => (!email.trim() ? 'Enter your email address.' : !isEmail(email) ? 'Enter a valid email address.' : undefined);
