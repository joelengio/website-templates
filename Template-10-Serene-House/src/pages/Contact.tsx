import { useState, type FormEvent } from 'react';
import { site } from '../config/site';
import { images } from '../config/images';
import { formatTime } from '../lib/format';
import { validateContact, type ContactFields, type Errors } from '../lib/validation';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Button, DemoNotice, Field, Img, SectionHeading } from '../components/ui';

const empty: ContactFields = { name: '', email: '', subject: '', message: '' };
type Status = 'idle' | 'sending' | 'demo' | 'sent' | 'failed';

export default function Contact() {
  const c = site.contact;
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Errors<keyof ContactFields>>({});
  const [status, setStatus] = useState<Status>('idle');
  const today = new Date().getDay();

  // Errors are cleared while typing (never on blur) so the layout cannot shift under a click on the submit button.
  const set = (k: keyof ContactFields) => (e: { target: { value: string } }) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validateContact(next)[k] }));
  };
  const blur = (k: keyof ContactFields) => () => {
    const msg = validateContact(values)[k];
    if (msg && values[k]) setErrors((er) => ({ ...er, [k]: msg }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`contact-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    if (!c.formEndpoint) {
      setStatus('demo');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(c.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(values) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setValues(empty);
    } catch {
      setStatus('failed');
    }
  };

  const mailto = `mailto:${c.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`)}`;

  return (
    <>
      <Seo title={site.pages.contact.title} description={site.pages.contact.description} />
      <section className="page-hero"><div className="container"><SectionHeading as="h1" eyebrow="Contact" title="Come and find us" text="We would love to hear from you — questions, gift ideas or help choosing a treatment." /></div></section>
      <section className="section section--tight">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2 className="h-sub">Visit & call</h2>
            <ul className="info-list">
              <li><Icon name="pin" /><address>{c.addressLines.map((l) => <span key={l}>{l}<br /></span>)}</address></li>
              <li><Icon name="phone" /><a href={`tel:${c.phoneHref}`}>{c.phone}</a></li>
              <li><Icon name="mail" /><a href={`mailto:${c.email}`}>{c.email}</a></li>
            </ul>
            <h2 className="h-sub">Opening hours</h2>
            <table className="hours">
              <caption className="sr-only">Opening hours</caption>
              <tbody>
                {site.hours.map((h) => (
                  <tr key={h.day} className={h.day === today ? 'is-today' : ''} aria-current={h.day === today ? 'date' : undefined}>
                    <th scope="row">{h.label}</th>
                    <td>{h.open && h.close ? `${formatTime(h.open)} – ${formatTime(h.close)}` : 'Closed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="contact-form-wrap">
            <h2 className="h-sub">Send a message</h2>
            {!c.formEndpoint && <DemoNotice tone="warn">Demonstration form: your message is validated in the browser but is <strong>not delivered</strong> to a real business.</DemoNotice>}
            {status === 'sent' && <div className="alert alert--ok" role="status"><Icon name="check" /> Thank you — your message has been sent.</div>}
            {status === 'failed' && <div className="alert alert--err" role="alert">Sorry, your message could not be sent. Please try again or email us directly at <a href={`mailto:${c.email}`}>{c.email}</a>.</div>}
            {status === 'demo' && (
              <div className="alert alert--warn" role="status">
                <p><strong>Message not sent.</strong> This demonstration site has no email service configured, so nothing was delivered. Your message passed validation.</p>
                <p>To actually contact a business, connect a form endpoint in <code>src/config/site.ts</code>, or open your own email app:</p>
                <a className="btn btn--outline" href={mailto}><span>Open in email app</span></a>
              </div>
            )}
            <form onSubmit={submit} noValidate className="form">
              <div className="form-row">
                <Field id="contact-name" label="Your name" error={errors.name} required>{(p) => <input {...p} name="name" autoComplete="name" value={values.name} onChange={set('name')} onBlur={blur('name')} />}</Field>
                <Field id="contact-email" label="Email" error={errors.email} required>{(p) => <input {...p} name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} onBlur={blur('email')} />}</Field>
              </div>
              <Field id="contact-subject" label="Subject" error={errors.subject} required>{(p) => <input {...p} name="subject" value={values.subject} onChange={set('subject')} onBlur={blur('subject')} />}</Field>
              <Field id="contact-message" label="Message" error={errors.message} required>{(p) => <textarea {...p} name="message" rows={6} value={values.message} onChange={set('message')} onBlur={blur('message')} />}</Field>
              <Button type="submit" arrow disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : c.formEndpoint ? 'Send message' : 'Validate message (demo)'}</Button>
            </form>
          </div>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="map-title">
        <div className="container">
          <SectionHeading eyebrow="Location" title={<span id="map-title">Find the house</span>} />
          {c.mapEmbedUrl ? (
            <iframe className="map-embed" title={`Map showing ${site.brand.name}`} src={c.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <figure className="map-demo">
              <Img image={images.contactMap} sizes="(min-width: 1000px) 1100px, 100vw" alt="" />
              <div className="map-pin"><Icon name="pin" size={36} /></div>
              <figcaption>
                <strong>{site.brand.name}</strong>
                <span>{c.addressLines.join(', ')}</span>
                <em>{c.mapLabel}</em>
              </figcaption>
            </figure>
          )}
        </div>
      </section>
    </>
  );
}
