import { useId, useState, type FormEvent } from 'react';
import { validateEmail } from '../lib/validation';

/** Demonstration newsletter form: validates the address, then explains that nothing was subscribed (no backend). */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    setDone(!err);
  };

  return (
    <form className="newsletter" onSubmit={submit} noValidate aria-labelledby={`${id}-t`}>
      <p className="newsletter__title" id={`${id}-t`}>Notes from the studio</p>
      <div className="newsletter__row">
        <label className="sr-only" htmlFor={`${id}-e`}>Email for studio notes</label>
        <input id={`${id}-e`} type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(e) => { setEmail(e.target.value); setDone(false); }} aria-invalid={error ? true : undefined} aria-describedby={`${id}-m`} />
        <button type="submit" className="btn btn--light"><span>Preview</span></button>
      </div>
      <p className={`newsletter__msg${error ? ' is-error' : ''}`} id={`${id}-m`} role={error ? 'alert' : 'status'}>
        {error || (done ? 'Demonstration only: no subscription was created and nothing was sent.' : 'Demonstration form — nothing is sent or stored.')}
      </p>
    </form>
  );
}
