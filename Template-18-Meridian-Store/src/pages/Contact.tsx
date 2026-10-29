import { useRef, useState, type FormEvent } from 'react';
import { site } from '../config/site';
import { validateContactForm, type ContactFormFields } from '../lib/validation';
import { Seo } from '../components/Seo';
import { Breadcrumbs, DemoNotice, PageHeader, SelectField, TextAreaField, TextField } from '../components/ui';
import { Icon } from '../components/Icon';

const TOPICS = ['Order or delivery question', 'Product question', 'Returns or exchanges', 'Press and partnerships', 'Something else'];

export default function Contact() {
  const [v, setV] = useState<ContactFormFields>({ name: '', email: '', topic: '', message: '' });
  const [errors, setErrors] = useState<ReturnType<typeof validateContactForm>>({});
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateContactForm(v);
    setErrors(err);
    if (Object.keys(err).length) { requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return; }
    setSent(true);
  };
  const set = (k: keyof ContactFormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });
  return (
    <>
      <Seo title="Contact" description="Contact MERIDIAN STORE — demonstration contact form, business details and social links." path="/contact" />
      <PageHeader eyebrow="Get in touch" title="Contact us" text="Questions about an order, a product or this template? Send a message.">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }] } />
      </PageHeader>
      <div className="container contact-layout section-tight">
        <section aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="h3">Send a message</h2>
          <DemoNotice compact />
          {sent ? (
            <div className="form-success-card" role="status">
              <Icon name="check" size={22} />
              <h3 className="h4">Thanks, {v.name.split(' ')[0]} — this was a demonstration</h3>
              <p>Your message was validated in your browser but <strong>not sent or stored</strong>. In a real store this form would deliver to {site.contact.email} through your email service or helpdesk.</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setSent(false); setV({ name: '', email: '', topic: '', message: '' }); }}>Write another message</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate ref={form} aria-label="Contact form">
              <TextField label="Your name" autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
              <TextField label="Email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
              <SelectField label="Topic" value={v.topic} onChange={set('topic')} error={errors.topic}>
                <option value="">Choose a topic…</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}
              </SelectField>
              <TextAreaField label="Message" rows={6} value={v.message} onChange={set('message')} error={errors.message} hint="Please don’t include card numbers or other sensitive information." />
              <button type="submit" className="btn btn-lg">Send message (demo)</button>
            </form>
          )}
        </section>
        <aside aria-labelledby="visit-title" className="contact-info">
          <h2 id="visit-title" className="h3">Studio details</h2>
          <ul className="contact-list">
            <li><Icon name="pin" /><address>{site.contact.address.map((l) => <span key={l}>{l}<br /></span>)}</address></li>
            <li><Icon name="mail" /><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
            <li><Icon name="phone" />{site.contact.phone}</li>
            <li><Icon name="clock" />{site.contact.hours}</li>
          </ul>
          <p className="muted">{site.contact.responseTime}</p>
          <h3 className="h5">Follow</h3>
          <ul className="social">{site.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>
        </aside>
      </div>
    </>
  );
}
