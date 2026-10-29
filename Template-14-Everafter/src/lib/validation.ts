/** Small, dependency-free validators. Each returns an error message, or '' when the value is valid. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const required = (v: string, label: string) => (v.trim() ? '' : `Please enter ${label}.`);

export const validateEmail = (v: string) => {
  if (!v.trim()) return 'Please enter your email address.';
  return EMAIL.test(v.trim()) ? '' : 'Please enter a valid email address, such as name@example.com.';
};

/** Phone is optional unless `isRequired`; accepts digits, spaces, +, -, ( ). */
export const validatePhone = (v: string, isRequired = false) => {
  const t = v.trim();
  if (!t) return isRequired ? 'Please enter a phone number.' : '';
  const digits = t.replace(/\D/g, '');
  if (!/^[+\d][\d\s().-]*$/.test(t) || digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number (7–15 digits).';
  return '';
};

export const validateName = (v: string) => {
  const t = v.trim();
  if (!t) return 'Please enter your name.';
  if (t.length < 2) return 'Your name should be at least 2 characters.';
  return '';
};

export const validateMessage = (v: string, min = 10, max = 2000) => {
  const t = v.trim();
  if (!t) return 'Please write a short message.';
  if (t.length < min) return `Please add a little more detail (at least ${min} characters).`;
  if (t.length > max) return `Please keep your message under ${max} characters.`;
  return '';
};

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const isValidISODate = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T12:00:00`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
};
