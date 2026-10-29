import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contactPage } from '../config/content';
import { addOns, plans } from '../config/plans';
import { site } from '../config/site';
import { Button, LinkButton } from '../components/Button';
import { Icon } from '../components/Icon';
import { PageHero, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { useSeo } from '../hooks/useSeo';
import { formatCurrency } from '../lib/format';
import { quotePlan } from '../lib/pricing';
import { hasErrors, validateEmail, validateMessage, validateName, validatePhone, type Errors } from '../lib/validation';

type Fields = 'name' | 'email' | 'phone' | 'category' | 'message';
type Status = 'idle' | 'demo' | 'sending' | 'sent' | 'error';

export default function Contact() {
  useSeo({ ...contactPage.seo, path: '/contact' });
  const [params] = useSearchParams();
  const cats = site.contact.form.categories;
  const normCat = (x: string) => x.toLowerCase().replace(/&/g, 'and');
  const presetRaw = params.get('category');
  const presetCat = presetRaw ? cats.find((c) => normCat(c) === normCat(presetRaw)) : undefined;
  const planId = params.get('plan');
  const plan = plans.find((p) => p.id === planId);
  const cycle = params.get('cycle') === 'annual' ? 'annual' : 'monthly';
  const addonIds = (params.get('addons') ?? '').split(',').filter((id) => addOns.some((a) => a.id === id));
  const planSummary = useMemo(() => {
    if (!plan) return '';
    const q = quotePlan(plan, cycle, addonIds, addOns);
    const names = addOns.filter((a) => addonIds.includes(a.id)).map((a) => a.name);
    return `${plan.name} plan, ${cycle} billing${names.length ? ` with ${names.join(', ')}` : ''} — demonstration estimate ${formatCurrency(q.periodTotal, { cents: true })} per ${q.periodLabel}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, cycle, addonIds.join(',')]);

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    category: presetCat ?? (plan ? 'Plan / pricing question' : cats[0]),
    message: plan ? `I'd like to know more about the ${plan.name} plan.` : '',
  });
  const [errors, setErrors] = useState<Errors<Fields>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState<'' | 'yes' | 'no'>('');
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const set = (k: Fields) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // Move focus to the error summary only after a submit attempt (not on every keystroke that clears an error).
  useEffect(() => {
    if (attempt > 0) summaryRef.current?.focus();
  }, [attempt]);
  useEffect(() => {
    if (status !== 'idle' && status !== 'sending') resultRef.current?.focus();
  }, [status]);

  const fullMessage = [values.message.trim(), planSummary && `\n\n[Plan context: ${planSummary}]`].join('');
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(`${values.category} — enquiry from ${values.name || 'website visitor'}`)}&body=${encodeURIComponent(`${fullMessage}\n\n— ${values.name}${values.phone ? `, ${values.phone}` : ''}\n${values.email}`)}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors<Fields> = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      category: cats.includes(values.category) ? undefined : 'Choose an enquiry category.',
      message: validateMessage(values.message, { min: 10, max: 1500 }),
    };
    setErrors(next);
    if (hasErrors(next)) {
      setAttempt((a) => a + 1);
      return;
    }
    const endpoint = site.contact.form.endpoint;
    if (!endpoint) {
      setStatus('demo');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, message: fullMessage }) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${values.category}\n\n${fullMessage}\n\n${values.name} <${values.email}>`);
      setCopied('yes');
    } catch {
      setCopied('no');
    }
  };

  const errorList = (Object.entries(errors) as [Fields, string | undefined][]).filter(([, m]) => m);
  const h = contactPage.hero;
  const finished = status === 'demo' || status === 'sent';

  return (
    <>
      <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} />
      <Section tone="ivory">
        <div className="contact-layout">
          <div className="contact-form-wrap">
            {status === 'demo' && (
              <div className="result-panel result-panel--demo" tabIndex={-1} ref={resultRef} role="status">
                <h2>Not sent — this is a demonstration</h2>
                <p>{site.legal.contactDisclaimer} Your message has <strong>not</strong> been delivered to anyone and was not stored.</p>
                <div className="result-panel__actions">
                  <a className="btn btn--primary" href={mailto}>Open in my email app</a>
                  <Button variant="secondary" onClick={copy}>Copy message</Button>
                  <Button variant="ghost" onClick={() => setStatus('idle')}>Edit message</Button>
                </div>
                <p className="fine-print" role="status">{copied === 'yes' ? 'Copied to clipboard.' : copied === 'no' ? 'Copy failed — select and copy the text manually.' : ''}</p>
              </div>
            )}
            {status === 'sent' && (
              <div className="result-panel result-panel--ok" tabIndex={-1} ref={resultRef} role="status">
                <h2>Message sent</h2>
                <p>Thank you, {values.name.split(' ')[0]}. Your enquiry was accepted by the configured endpoint.</p>
                <Button variant="secondary" onClick={() => { setStatus('idle'); setValues((v) => ({ ...v, message: '' })); }}>Send another message</Button>
              </div>
            )}
            {status === 'error' && (
              <div className="result-panel result-panel--error" tabIndex={-1} ref={resultRef} role="alert">
                <h2>We couldn’t send your message</h2>
                <p>The server did not accept the request. Your text is still below — please try again, or email us directly at <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.</p>
              </div>
            )}
            {!finished && (
              <form onSubmit={submit} noValidate aria-label="Enquiry form" className="form">
                <Notice title="Demonstration form">{site.legal.contactDisclaimer} {site.legal.sensitiveDataNotice}</Notice>
                {plan && <Notice title="Plan enquiry">{planSummary}</Notice>}
                {errorList.length > 0 && (
                  <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
                    <strong>Please fix {errorList.length} {errorList.length === 1 ? 'field' : 'fields'}:</strong>
                    <ul>{errorList.map(([k, m]) => <li key={k}><a href={`#c-${k}`}>{m}</a></li>)}</ul>
                  </div>
                )}
                <div className="form__row">
                  <Field id="c-name" label="Full name" error={errors.name}><input id="c-name" name="name" autoComplete="name" value={values.name} onChange={(e) => set('name')(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-err' : undefined} /></Field>
                  <Field id="c-email" label="Email address" error={errors.email}><input id="c-email" name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set('email')(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-email-err' : undefined} /></Field>
                </div>
                <div className="form__row">
                  <Field id="c-phone" label="Phone (optional)" error={errors.phone}><input id="c-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set('phone')(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'c-phone-err' : undefined} /></Field>
                  <Field id="c-category" label="Enquiry category" error={errors.category}>
                    <select id="c-category" name="category" value={values.category} onChange={(e) => set('category')(e.target.value)}>
                      {cats.map((c) => <option key={c}>{c}</option>)}
                      {!cats.includes(values.category) && <option>{values.category}</option>}
                    </select>
                  </Field>
                </div>
                <Field id="c-message" label="Your message" error={errors.message} hint={`${values.message.length}/1500 characters`}>
                  <textarea id="c-message" name="message" rows={6} value={values.message} onChange={(e) => set('message')(e.target.value)} aria-invalid={!!errors.message} aria-describedby={`${errors.message ? 'c-message-err ' : ''}c-message-hint`} />
                </Field>
                <div className="form__actions">
                  <Button type="submit" variant="primary" arrow disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Submit enquiry'}</Button>
                  <LinkButton to="/book" variant="secondary">Or book a demo consultation</LinkButton>
                </div>
              </form>
            )}
          </div>
          <aside className="contact-aside" aria-label="Contact details">
            <h2 className="h3">Contact methods</h2>
            <ul className="contact-list">
              <li><Icon name="mail" size={18} /><span><strong>Email</strong><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></span></li>
              <li><Icon name="phone" size={18} /><span><strong>Phone</strong><a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a></span></li>
            </ul>
            <h2 className="h3">Offices</h2>
            {site.offices.map((o) => (
              <div key={o.id} className="office">
                <h3>{o.name}</h3>
                <address>{o.address.map((l) => <span key={l}>{l}</span>)}</address>
                <p className="fine-print">{o.note}</p>
              </div>
            ))}
            <h2 className="h3">Business hours</h2>
            <table className="hours">
              <caption className="sr-only">Business hours</caption>
              <tbody>
                {site.hours.map((h) => (
                  <tr key={h.label}><th scope="row">{h.label}</th><td>{h.open ? `${h.open} – ${h.close}` : h.note}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="fine-print">{site.timezoneLabel}</p>
            <h2 className="h3">Follow</h2>
            <ul className="social social--dark">
              {site.social.map((s) => <li key={s.id}><a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}><Icon name={s.icon} size={18} /></a></li>)}
            </ul>
          </aside>
        </div>
      </Section>
      <Section tone="stone" eyebrow="Demonstration location" title="Where the fictional office “is”">
        <div className="map-card">
          <Icon name="pin" size={28} />
          <div>
            <p><strong>{site.offices[0].name}</strong></p>
            <p>{site.offices[0].address.join(', ')}</p>
            <p className="fine-print">No real map is embedded because this address does not exist. Add a map embed or link for a real client in <code>src/config/site.ts</code>.</p>
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field__error" id={`${id}-err`}>{error}</p>}
    </div>
  );
}
