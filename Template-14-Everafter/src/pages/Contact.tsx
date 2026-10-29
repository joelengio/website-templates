import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Accordion } from '../components/Accordion';
import { SelectField, TextArea, TextField } from '../components/forms';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { CtaBand, DemoBanner, PageHero } from '../components/ui';
import { contactFaqs, img, site } from '../config';
import { required, validateEmail, validateMessage, validateName, validatePhone } from '../lib/validation';

const topics = ['Wedding planning', 'Destination wedding', 'Day-of coordination', 'Private celebration', 'Corporate event', 'Something else'];

interface Values { name: string; email: string; phone: string; topic: string; message: string; consent: boolean }
const empty: Values = { name: '', email: '', phone: '', topic: '', message: '', consent: false };

export function validateContact(v: Values) {
  const e: Partial<Record<keyof Values, string>> = {};
  const n = validateName(v.name); if (n) e.name = n;
  const m = validateEmail(v.email); if (m) e.email = m;
  const p = validatePhone(v.phone); if (p) e.phone = p;
  const t = required(v.topic, 'a topic'); if (t) e.topic = 'Please choose what your message is about.';
  const msg = validateMessage(v.message); if (msg) e.message = msg;
  if (!v.consent) e.consent = 'Please confirm that you understand this is a demonstration.';
  return e;
}

export default function Contact() {
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({});
  const [done, setDone] = useState<Values | null>(null);
  const summary = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateContact(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setTimeout(() => summary.current?.focus(), 0);
      return;
    }
    setDone(v);
    setTimeout(() => doneRef.current?.focus(), 0);
  };

  const errList = Object.entries(errors).filter(([, m]) => m);

  return (
    <>
      <Seo title="Contact" description="Contact the EVERAFTER studio: demonstration office details, opening hours, a validated contact form, social links and frequently asked questions." />
      <PageHero eyebrow="Contact" title="Let’s begin a conversation" lead="Tell us a little about your plans. In this demonstration, the form checks your details but does not send them anywhere." image={img('rose-arch')} />

      <section className="section" aria-label="Contact details and form">
        <div className="container contact-grid">
          <Reveal className="contact-info">
            <h2 className="h-display">Studio details</h2>
            <ul className="contact-list">
              <li><Icon name="mail" /><div><strong>Email</strong><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></div></li>
              <li><Icon name="phone" /><div><strong>Phone</strong><a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a></div></li>
              <li><Icon name="pin" /><div><strong>{site.contact.office.name}</strong>{site.contact.office.lines.map((l) => (<span key={l}>{l}</span>))}<small>{site.contact.office.note}</small></div></li>
              <li><Icon name="clock" /><div><strong>Opening hours</strong>
                <table className="hours"><caption className="sr-only">Opening hours</caption><tbody>{site.contact.hours.map((h) => (<tr key={h.days}><th scope="row">{h.days}</th><td>{h.time}</td></tr>))}</tbody></table>
                <small>Typical reply: {site.contact.responseTime.toLowerCase()}</small></div></li>
            </ul>
            <h3 className="h-sub">Follow the studio</h3>
            <ul className="tag-list">{site.social.map((s) => (<li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>))}</ul>
            <div className="map-card" role="img" aria-label="Stylised map placeholder for the fictional demonstration office">
              <svg viewBox="0 0 400 220" aria-hidden="true" focusable="false"><rect width="400" height="220" fill="#efe6d6" /><g stroke="#d9c9ac" strokeWidth="1.2" fill="none"><path d="M0 60 C120 40 200 100 400 70" /><path d="M0 150 C100 170 220 120 400 160" /><path d="M110 0 C120 90 90 160 130 220" /><path d="M270 0 C260 80 300 150 280 220" /></g><circle cx="196" cy="108" r="9" fill="#5e1f2e" /><circle cx="196" cy="108" r="18" fill="none" stroke="#5e1f2e" strokeOpacity=".35" /></svg>
              <p>Fictional office location — shown for layout only.</p>
            </div>
          </Reveal>

          <Reveal className="contact-form-wrap">
            {done ? (
              <div className="result" role="status" tabIndex={-1} ref={doneRef}>
                <Icon name="info" size={28} />
                <h2 className="h-display">Preview only — nothing was sent</h2>
                <p>Thank you, {done.name.split(' ')[0]}. Your message passed validation, but this demonstration website has no backend, so <strong>it was not delivered to any planner</strong> and nobody will reply.</p>
                <p>On a live site, this is where your form would be connected. See the demo notice and the customization guide for how.</p>
                <dl className="result__summary">
                  <div><dt>Name</dt><dd>{done.name}</dd></div>
                  <div><dt>Email</dt><dd>{done.email}</dd></div>
                  <div><dt>Topic</dt><dd>{done.topic}</dd></div>
                </dl>
                <div className="result__actions">
                  <button type="button" className="btn btn--outline" onClick={() => { setDone(null); setV(empty); }}><span>Write another message</span></button>
                  <Link to="/plan" className="btn btn--primary"><span>Try the enquiry questionnaire</span></Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate aria-labelledby="contact-form-title" className="form">
                <h2 className="h-display" id="contact-form-title">Send a message</h2>
                {errList.length > 0 && (
                  <div className="error-summary" role="alert" tabIndex={-1} ref={summary}>
                    <p><strong>Please check the form</strong></p>
                    <ul>{errList.map(([k, m]) => (<li key={k}>{m}</li>))}</ul>
                  </div>
                )}
                <div className="form__row">
                  <TextField label="Your name" name="name" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
                  <TextField label="Email address" name="email" type="email" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
                </div>
                <div className="form__row">
                  <TextField label="Phone" name="phone" type="tel" autoComplete="tel" value={v.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} optional />
                  <SelectField label="What is this about?" name="topic" value={v.topic} onChange={(e) => set('topic', e.target.value)} error={errors.topic}>
                    <option value="">Choose a topic</option>
                    {topics.map((t) => (<option key={t}>{t}</option>))}
                  </SelectField>
                </div>
                <TextArea label="Your message" name="message" rows={6} value={v.message} onChange={(e) => set('message', e.target.value)} error={errors.message} hint="Tell us about your date, place and guest numbers if you know them." />
                <div className={`consent${errors.consent ? ' has-error' : ''}`}>
                  <label><input type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? 'consent-err' : undefined} /> I understand this is a demonstration and my message will not be sent to a real planner.</label>
                  {errors.consent && <p className="field__error" id="consent-err" role="alert"><Icon name="info" size={16} />{errors.consent}</p>}
                </div>
                <button type="submit" className="btn btn--primary"><span>Preview message</span></button>
              </form>
            )}
            <DemoBanner>No backend is connected. Validation runs in your browser and the message is never transmitted or stored.</DemoBanner>
          </Reveal>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="cfaq-title">
        <div className="container container--narrow">
          <Reveal className="section-head section-head--center"><div><p className="eyebrow">Questions</p><h2 className="h-display" id="cfaq-title">Before you get in touch</h2></div></Reveal>
          <Accordion items={contactFaqs} />
        </div>
      </section>
      <CtaBand eyebrow="Consultation" title="Prefer a guided start?" body="The enquiry questionnaire takes about five minutes and helps us understand your plans." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Read the demo notice', to: '/demo-notice' }} />
    </>
  );
}
