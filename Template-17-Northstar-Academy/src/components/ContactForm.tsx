import { useRef, useState, type FormEvent } from 'react';
import { site } from '../config/site';
import { validateContact, type ContactErrors, type ContactValues } from '../lib/validation';
import { Button } from './Button';

const empty: ContactValues = { name: '', email: '', topic: '', message: '', consent: false };

export function ContactForm({ topics, initialTopic = '', heading, idPrefix = 'cf' }: { topics: string[]; initialTopic?: string; heading?: string; idPrefix?: string }) {
  const [v, setV] = useState<ContactValues>({ ...empty, topic: initialTopic });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState<null | { demo: boolean }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof ContactValues>(k: K, val: ContactValues[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFailed(false);
    const errs = validateContact(v);
    setErrors(errs);
    const first = (Object.keys(errs) as (keyof ContactValues)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (!site.contact.formEndpoint) {
      // Demo mode: nothing leaves the browser.
      setSent({ demo: true });
      setTimeout(() => resultRef.current?.focus(), 0);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(site.contact.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(v) });
      if (!res.ok) throw new Error(String(res.status));
      setSent({ demo: false });
      setTimeout(() => resultRef.current?.focus(), 0);
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="form-result" role="status" tabIndex={-1} ref={resultRef}>
        <h2 className="h3">{sent.demo ? 'Demo form validated' : 'Message sent'}</h2>
        <p>
          {sent.demo
            ? 'Thanks — your answers passed validation. This is a demonstration form, so nothing was sent or stored anywhere.'
            : 'Thank you. We will reply soon.'}
        </p>
        <Button variant="ghost" onClick={() => { setSent(null); setV({ ...empty, topic: initialTopic }); }}>Send another</Button>
      </div>
    );
  }

  const field = (k: keyof ContactValues) => ({ id: `${idPrefix}-${k}`, name: k, 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': errors[k] ? `${idPrefix}-${k}-err` : undefined });
  const err = (k: keyof ContactValues) => errors[k] && <p className="field__error" id={`${idPrefix}-${k}-err`}>{errors[k]}</p>;

  return (
    <form ref={formRef} className="form" onSubmit={submit} noValidate aria-label={heading ?? 'Contact form'}>
      {failed && <p className="form__alert" role="alert">Something went wrong sending your message. Please try again.</p>}
      <div className="field">
        <label htmlFor={`${idPrefix}-name`}>Name</label>
        <input {...field('name')} type="text" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} />
        {err('name')}
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-email`}>Email</label>
        <input {...field('email')} type="email" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} />
        {err('email')}
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-topic`}>Topic</label>
        <select {...field('topic')} value={v.topic} onChange={(e) => set('topic', e.target.value)}>
          <option value="">Choose a topic…</option>
          {topics.map((t) => <option key={t}>{t}</option>)}
        </select>
        {err('topic')}
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-message`}>Message</label>
        <textarea {...field('message')} rows={5} value={v.message} onChange={(e) => set('message', e.target.value)} />
        {err('message')}
      </div>
      <div className="field field--check">
        <input {...field('consent')} type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} />
        <label htmlFor={`${idPrefix}-consent`}>I understand this is a demonstration form and nothing will be sent.</label>
        {err('consent')}
      </div>
      <Button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send inquiry'}</Button>
    </form>
  );
}
