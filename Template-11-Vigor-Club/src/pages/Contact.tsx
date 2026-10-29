import { useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Button, DemoBadge, Img, PageHero, SelectField, TextArea, TextField } from '../components/ui';
import { images } from '../config/images';
import { plans } from '../config/membership';
import { site } from '../config/site';
import { trainers } from '../config/trainers';
import { bookingSettings } from '../config/booking';
import { submitForm } from '../lib/forms';
import { readJSON, writeJSON } from '../lib/storage';
import { validateContact, type ContactFields } from '../lib/validation';

export const topics = [
  { value: 'general', label: 'General question' },
  { value: 'membership', label: 'Membership enquiry' },
  { value: 'training', label: 'Personal training' },
  { value: 'classes', label: 'Classes & timetable' }
];

type Outcome = { status: 'demo' | 'sent' | 'error'; message?: string };

export default function Contact() {
  const [params] = useSearchParams();
  const topicParam = params.get('topic') ?? '';
  const trainerParam = trainers.find((t) => t.slug === params.get('trainer'));
  const [v, setV] = useState<ContactFields & { plan: string }>({
    name: '', email: '', phone: '',
    topic: topics.some((t) => t.value === topicParam) ? topicParam : '',
    message: trainerParam ? `Hi, I’d like to find out about training with ${trainerParam.name}.` : '',
    plan: ''
  });
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({});
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [busy, setBusy] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateContact(v);
    setErrors(errs);
    setOutcome(null);
    if (Object.keys(errs).length) {
      window.setTimeout(() => document.querySelector<HTMLElement>('.has-error input, .has-error select, .has-error textarea')?.focus(), 0);
      return;
    }
    setBusy(true);
    const payload = { type: 'contact', ...v };
    const res = await submitForm(payload);
    setBusy(false);
    setOutcome(res);
    if (res.status !== 'error') {
      const list = readJSON<unknown[]>(bookingSettings.inquiriesKey, []);
      writeJSON(bookingSettings.inquiriesKey, [...(Array.isArray(list) ? list : []), { ...payload, at: new Date().toISOString(), delivered: res.status === 'sent' }].slice(-20));
      if (res.status === 'sent') setV({ ...v, name: '', email: '', phone: '', message: '' });
    }
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };

  const c = site.contact;
  return (
    <>
      <Seo title="Contact" description="Contact VIGOR CLUB (fictional): demonstration address, opening hours and a validated enquiry form for membership, training and classes." />
      <PageHero eyebrow="Contact" title={<>Let’s <span className="accent">talk.</span></>} intro="Questions about membership, classes or coaching? Send a message — this demonstration form validates your enquiry but does not deliver it unless you configure a form endpoint." />
      <section className="section section--tight">
        <div className="container contact-grid">
          <div className="contact-form-wrap">
            <h2 className="h-display">Send an enquiry</h2>
            <form onSubmit={submit} noValidate aria-label="Enquiry form" className="form">
              <div className="form-grid">
                <TextField label="Your name" name="name" autoComplete="name" required value={v.name} error={errors.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
                <TextField label="Email" name="email" type="email" autoComplete="email" required value={v.email} error={errors.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
                <TextField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={v.phone} error={errors.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />
                <SelectField label="What is it about?" name="topic" required value={v.topic} error={errors.topic} onChange={(e) => setV({ ...v, topic: e.target.value })}>
                  <option value="">Choose a topic…</option>
                  {topics.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </SelectField>
              </div>
              {v.topic === 'membership' && (
                <SelectField label="Plan of interest (optional)" name="plan" value={v.plan} onChange={(e) => setV({ ...v, plan: e.target.value })}>
                  <option value="">Not sure yet</option>
                  {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </SelectField>
              )}
              <TextArea label="Message" name="message" rows={6} required value={v.message} error={errors.message} hint={`${v.message.length}/1500 characters`} onChange={(e) => setV({ ...v, message: e.target.value })} />
              <p className="fine-print">{site.forms.endpoint ? 'Your enquiry will be sent to the club.' : 'Demonstration mode: your message is validated but not sent anywhere.'}</p>
              <Button type="submit" disabled={busy}>{busy ? 'Working…' : site.forms.endpoint ? 'Send message' : 'Validate message (demo)'}</Button>
            </form>
            <div ref={resultRef} tabIndex={-1} className="form-result" aria-live="polite">
              {outcome?.status === 'demo' && (
                <div className="notice notice--warn" role="status">
                  <Icon name="info" size={22} />
                  <div><h3>Message not sent</h3><p>Your enquiry passed validation, but this demonstration site has no backend configured, so nothing was delivered. To receive real enquiries, set <code>site.forms.endpoint</code> in <code>src/config/site.ts</code>.</p></div>
                </div>
              )}
              {outcome?.status === 'sent' && (
                <div className="notice notice--ok" role="status"><Icon name="check" size={22} /><div><h3>Message sent</h3><p>{site.forms.successNote}</p></div></div>
              )}
              {outcome?.status === 'error' && (
                <div className="notice notice--err" role="alert"><Icon name="x" size={22} /><div><h3>Could not send</h3><p>{outcome.message}</p></div></div>
              )}
            </div>
          </div>
          <aside className="contact-side" aria-label="Business information">
            <div className="map-card">
              <Img image={images.contactMap} sizes="(min-width: 900px) 40vw, 100vw" />
              <div className="map-pin"><Icon name="pin" size={22} /><span><b>{site.brand.name}</b>{c.addressLines[0]}</span></div>
            </div>
            <DemoBadge>Fictional location</DemoBadge>
            <address className="contact-lines">
              <p><Icon name="pin" size={18} /><span>{c.addressLines.join(', ')}</span></p>
              <p><Icon name="phone" size={18} /><a href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}>{c.phone}</a></p>
              <p><Icon name="mail" size={18} /><a href={`mailto:${c.email}`}>{c.email}</a></p>
            </address>
            <p className="note">{c.locationNote}</p>
            <h2 className="h-sub">Opening hours</h2>
            <table className="hours">
              <tbody>{site.hours.map((h) => <tr key={h.days}><th scope="row">{h.days}</th><td>{h.hours}</td></tr>)}</tbody>
            </table>
            <p className="fine-print">{site.holidayNote}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
