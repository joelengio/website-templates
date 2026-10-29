export type Errors<K extends string> = Partial<Record<K, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Enter your name.';
  if (v.length < 2) return 'Name must be at least 2 characters.';
  if (v.length > 80) return 'Name must be 80 characters or fewer.';
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Enter your email address.';
  if (v.length > 120 || !EMAIL.test(v)) return 'Enter a valid email address, like name@example.com.';
  return undefined;
}

/** Phone is optional; when provided it must look like a phone number (7–15 digits, common punctuation). */
export function validatePhone(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (!/^[+()\d][\d\s().-]*$/.test(v)) return 'Phone may contain only digits, spaces, + ( ) . and -.';
  const digits = v.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return 'Enter a phone number with 7 to 15 digits.';
  return undefined;
}

/**
 * Guards against people typing sensitive numbers into free-text boxes. Any run of 9+ digits (ignoring spaces and
 * dashes) is rejected, which covers account, card and tax-identifier style numbers.
 */
export function containsSensitiveNumber(text: string): boolean {
  return /\d(?:[\s-]?\d){8,}/.test(text);
}

export function validateMessage(value: string, opts: { min?: number; max: number; required?: boolean; label?: string }): string | undefined {
  const label = opts.label ?? 'message';
  const v = value.trim();
  if (!v) return opts.required === false ? undefined : `Enter your ${label}.`;
  if (opts.min && v.length < opts.min) return `Please write at least ${opts.min} characters.`;
  if (v.length > opts.max) return `Keep your ${label} under ${opts.max} characters.`;
  if (containsSensitiveNumber(v)) return 'Please remove long account, card or identification numbers — never share sensitive financial details here.';
  return undefined;
}

export const hasErrors = (e: object) => Object.values(e).some(Boolean);
