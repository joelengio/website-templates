import { useState, type FormEvent } from 'react';
import { site } from '../config/site';
import { validateNewsletterEmail } from '../lib/validation';
import { Icon } from './Icon';

/** Demonstration newsletter form. The address is validated in the browser and then discarded: it is never stored or transmitted. */
export function NewsletterForm({ id = 'newsletter' }: { id?: string }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateNewsletterEmail(email);
    setError(err);
    if (!err) { setDone(true); setEmail(''); }
  };
  if (done) return <p className="form-success" role="status"><Icon name="check" size={18} /> Thank you — this was a demonstration, so nothing was saved or sent.</p>;
  return (
    <form onSubmit={submit} noValidate className="newsletter-form">
      <div className={`field${error ? ' has-error' : ''}`}>
        <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
        <input id={`${id}-email`} type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} />
        {error && <p id={`${id}-err`} className="field-error"><Icon name="alert" size={14} /> {error}</p>}
      </div>
      <button type="submit" className="btn">{site.newsletter.button}</button>
    </form>
  );
}
