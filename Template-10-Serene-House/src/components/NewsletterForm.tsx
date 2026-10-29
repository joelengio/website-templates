import { useState, type FormEvent } from 'react';
import { homeContent } from '../config/home';
import { isEmail } from '../lib/validation';
import { Button } from './ui';

/** Demo newsletter form: validates the address but nothing is stored or transmitted. */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Please enter a valid email address.');
      setDone(false);
      return;
    }
    setError('');
    setDone(true);
  };
  return (
    <form className="newsletter-form" onSubmit={submit} noValidate>
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <div className="newsletter-row">
        <input id="nl-email" type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(e) => { setEmail(e.target.value); setDone(false); }} aria-invalid={!!error} aria-describedby="nl-msg" />
        <Button type="submit" variant="light">Subscribe (demo)</Button>
      </div>
      <p id="nl-msg" className={error ? 'field-error' : 'newsletter-note'} role={error || done ? 'status' : undefined}>
        {error || (done ? 'Thank you — this is a demonstration, so your address was validated but NOT saved or sent anywhere.' : homeContent.newsletter.demoNote)}
      </p>
    </form>
  );
}
