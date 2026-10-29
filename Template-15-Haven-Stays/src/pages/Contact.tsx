import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Accordion from '../components/Accordion';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Section, { PageHero } from '../components/Section';
import { directions, faqs, openingHours, policies } from '../config/policies';
import { seoRoutes } from '../config/seo';
import { site } from '../config/site';
import { useSeo } from '../hooks/useSeo';
import { validateContact, type ContactForm } from '../lib/validation';

const topics = ['General enquiry', 'Rooms & suites', 'Dining', 'Experiences', 'Weddings & events', 'Accessibility', 'Press'];

export default function Contact() {
  useSeo({ ...seoRoutes['/contact'], path: '/contact' });
  const [sp] = useSearchParams();
  const topicParam = sp.get('topic');
  const venue = sp.get('venue');
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', topic: topics.find((t) => t.startsWith(topicParam ?? '~')) ?? '', message: venue ? `I would like to enquire about ${venue}.\n\n` : '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [sent, setSent] = useState<ContactForm | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const { contact } = site;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(form);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) return void document.getElementById(`c-${first}`)?.focus();
    setSent(form);
    setTimeout(() => statusRef.current?.focus(), 0);
  };
  const bind = (k: keyof ContactForm) => ({ id: `c-${k}`, value: form[k], 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `c-${k}-err` : undefined, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value }) });
  const err = (k: keyof ContactForm) => errors[k] && <p id={`c-${k}-err`} className="field-error" role="alert">{errors[k]}</p>;

  return (
    <>
      <PageHero kicker="Contact" title="We’d love to hear from you" text="Questions about a stay, a celebration or an experience? Send an enquiry — this form is a demonstration." />
      <Section tone="cream" id="enquiry">
        <div className="contact-grid">
          <div>
            <h2 className="display display--sm">Contact details</h2>
            <address className="contact-list">
              <p><Icon name="pin" size={18} /> <span>{contact.address.join(', ')}</span></p>
              <p><Icon name="phone" size={18} /> <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a></p>
              <p><Icon name="mail" size={18} /> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
              <p><Icon name="mail" size={18} /> <a href={`mailto:${contact.reservationsEmail}`}>{contact.reservationsEmail}</a> (reservations)</p>
              <p><Icon name="clock" size={18} /> {contact.frontDeskHours}</p>
            </address>
            <h3 className="h3">Opening hours</h3>
            <ul className="hours">{openingHours.map((h) => <li key={h.label}><span>{h.label}</span> {h.time}</li>)}</ul>
            <h3 className="h3">Directions</h3>
            <ul className="plain">{directions.map((d) => <li key={d.title}><strong>{d.title}.</strong> {d.text}</li>)}</ul>
          </div>
          <div>
            {sent ? (
              <div className="notice notice--strong" ref={statusRef} tabIndex={-1} role="status">
                <Icon name="info" size={20} />
                <div>
                  <p><strong>Thank you, {sent.name.split(' ')[0]} — demonstration only.</strong></p>
                  <p>Your message was validated in the browser but <strong>not sent or stored anywhere</strong>. To receive real enquiries, connect this form to your email or CRM service (see CUSTOMIZATION_GUIDE.md).</p>
                  <Button variant="secondary" onClick={() => { setSent(null); setForm({ name: '', email: '', topic: '', message: '' }); }}>Write another message</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="form panel" aria-labelledby="form-h">
                <h2 id="form-h" className="display display--sm">Send an enquiry</h2>
                <div className={`field${errors.name ? ' has-error' : ''}`}><label htmlFor="c-name">Your name</label><input {...bind('name')} autoComplete="name" />{err('name')}</div>
                <div className={`field${errors.email ? ' has-error' : ''}`}><label htmlFor="c-email">Email</label><input type="email" {...bind('email')} autoComplete="email" />{err('email')}</div>
                <div className={`field${errors.topic ? ' has-error' : ''}`}><label htmlFor="c-topic">Topic</label><select {...bind('topic')}><option value="">Choose a topic…</option>{topics.map((t) => <option key={t}>{t}</option>)}</select>{err('topic')}</div>
                <div className={`field${errors.message ? ' has-error' : ''}`}><label htmlFor="c-message">Message</label><textarea rows={6} {...bind('message')} /><p className="muted">{form.message.length}/1500</p>{err('message')}</div>
                <Button type="submit" arrow>Send enquiry</Button>
                <p className="note">Demonstration only — nothing is transmitted.</p>
              </form>
            )}
          </div>
        </div>
      </Section>
      <Section tone="limestone" id="faq">
        <h2 className="display display--sm">Frequently asked questions</h2>
        <Accordion items={faqs} />
      </Section>
      <Section tone="cream" id="policies">
        <h2 className="display display--sm">Hotel policies</h2>
        <div className="grid grid--3">{policies.map((p) => <div key={p.id} className="plain-card"><h3>{p.title}</h3><p>{p.text}</p></div>)}</div>
      </Section>
    </>
  );
}
