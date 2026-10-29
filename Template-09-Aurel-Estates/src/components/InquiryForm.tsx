import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { content } from '../config';
import { properties } from '../config/properties';
import { site } from '../config/site';
import { validateInquiry, type InquiryErrors, type InquiryValues } from '../lib/validation';
import { Button } from './Button';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'demo'; values: InquiryValues }
  | { kind: 'sent' }
  | { kind: 'error'; message: string };

const empty = (propertyId: string, topic: string): InquiryValues => ({
  name: '',
  email: '',
  phone: '',
  topic,
  propertyId,
  message: '',
  consent: false,
  website: '',
});

export function InquiryForm({ propertyId = '', topic }: { propertyId?: string; topic?: string }) {
  const uid = useId();
  const defaultTopic = topic ?? (propertyId ? 'viewing' : '');
  const [values, setValues] = useState<InquiryValues>(() => empty(propertyId, defaultTopic));
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof InquiryValues, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const demo = !site.forms.endpoint;
  const selected = properties.find((p) => p.id === values.propertyId);

  // Selected property follows the page (e.g. navigating between property routes).
  useEffect(() => {
    setValues((v) => ({ ...v, propertyId, topic: v.topic || (propertyId ? 'viewing' : v.topic) }));
  }, [propertyId]);

  useEffect(() => {
    if (status.kind === 'demo' || status.kind === 'sent' || status.kind === 'error') statusRef.current?.focus();
  }, [status]);

  const set = <K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) setErrors(validateInquiry(next));
  };
  const blur = (key: keyof InquiryValues) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateInquiry(values));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateInquiry(values);
    setErrors(found);
    setTouched({ name: true, email: true, phone: true, topic: true, message: true, consent: true });
    const firstKey = (Object.keys(found) as (keyof InquiryValues)[])[0];
    if (firstKey) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    if (values.website) {
      // Honeypot filled: pretend nothing happened, send nothing.
      setStatus({ kind: 'idle' });
      return;
    }
    if (demo) {
      setStatus({ kind: 'demo', values });
      return;
    }
    setStatus({ kind: 'sending' });
    try {
      const { website: _hp, consent: _c, ...payload } = values;
      const res = await fetch(site.forms.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, propertyTitle: selected?.title ?? '' }),
      });
      if (!res.ok) throw new Error(`The server responded with status ${res.status}.`);
      setStatus({ kind: 'sent' });
      setValues(empty(propertyId, defaultTopic));
      setTouched({});
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Network error.' });
    }
  };

  const fid = (n: string) => `${uid}-${n}`;
  const err = (k: keyof InquiryValues) => (touched[k] ? errors[k] : undefined);
  const aria = (k: keyof InquiryValues) => ({ 'aria-invalid': err(k) ? true : undefined, 'aria-describedby': err(k) ? fid(`${k}-err`) : undefined });
  const Err = ({ k }: { k: keyof InquiryValues }) => (err(k) ? <p className="field-error" id={fid(`${k}-err`)}>{errors[k]}</p> : null);

  if (status.kind === 'sent') {
    return (
      <div className="form-status form-status--success" role="status" tabIndex={-1} ref={statusRef}>
        <h3>Inquiry sent</h3>
        <p>Thank you — your message was delivered to our team. We will reply by email.</p>
        <Button variant="ghost" onClick={() => setStatus({ kind: 'idle' })}>
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="inquiry-form" onSubmit={onSubmit} noValidate aria-label="Inquiry form">
      {demo && (
        <p className="demo-note" role="note">
          <strong>Demo form.</strong> {site.forms.demoNotice}
        </p>
      )}

      {status.kind === 'demo' && (
        <div className="form-status form-status--demo" role="status" tabIndex={-1} ref={statusRef}>
          <h3>Demo only — nothing was sent</h3>
          <p>Your entries passed validation, but this template has no email service connected, so no message was delivered or saved.</p>
          <dl>
            <dt>Name</dt>
            <dd>{status.values.name}</dd>
            <dt>Email</dt>
            <dd>{status.values.email}</dd>
            {selected && (
              <>
                <dt>Property</dt>
                <dd>{selected.title}</dd>
              </>
            )}
          </dl>
          <p className="muted">To receive real inquiries, set VITE_FORM_ENDPOINT (see CUSTOMIZATION_GUIDE.md).</p>
        </div>
      )}
      {status.kind === 'error' && (
        <div className="form-status form-status--error" role="alert" tabIndex={-1} ref={statusRef}>
          <h3>We couldn’t send your inquiry</h3>
          <p>{status.message} Please try again, or contact us at {site.contact.email}.</p>
        </div>
      )}

      <div className="field">
        <label htmlFor={fid('property')}>Property</label>
        <select id={fid('property')} name="propertyId" value={values.propertyId} onChange={(e) => set('propertyId', e.target.value)}>
          <option value="">General inquiry (no specific property)</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} — {p.neighborhood}
            </option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={fid('name')}>Full name *</label>
          <input id={fid('name')} name="name" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} onBlur={() => blur('name')} {...aria('name')} />
          <Err k="name" />
        </div>
        <div className="field">
          <label htmlFor={fid('email')}>Email *</label>
          <input id={fid('email')} name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')} {...aria('email')} />
          <Err k="email" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={fid('phone')}>Phone (optional)</label>
          <input id={fid('phone')} name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} onBlur={() => blur('phone')} {...aria('phone')} />
          <Err k="phone" />
        </div>
        <div className="field">
          <label htmlFor={fid('topic')}>I’m interested in *</label>
          <select id={fid('topic')} name="topic" value={values.topic} onChange={(e) => set('topic', e.target.value)} onBlur={() => blur('topic')} {...aria('topic')}>
            <option value="">Choose a topic…</option>
            {content.contact.topics.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <Err k="topic" />
        </div>
      </div>

      <div className="field">
        <label htmlFor={fid('message')}>Message *</label>
        <textarea id={fid('message')} name="message" rows={5} value={values.message} onChange={(e) => set('message', e.target.value)} onBlur={() => blur('message')} {...aria('message')} />
        <Err k="message" />
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
        </label>
      </div>

      <div className="field">
        <label className="check">
          <input type="checkbox" name="consent" checked={values.consent} onChange={(e) => set('consent', e.target.checked)} onBlur={() => blur('consent')} {...aria('consent')} />
          <span>I agree to be contacted about this inquiry. *</span>
        </label>
        <Err k="consent" />
      </div>

      <Button type="submit" variant="primary" disabled={status.kind === 'sending'}>
        {status.kind === 'sending' ? 'Sending…' : demo ? 'Validate inquiry (demo)' : 'Send inquiry'}
      </Button>
    </form>
  );
}
