import { useRef, useState, type FormEvent } from 'react';
import { site } from '../config/site';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';
import { Button, describedBy, Field, Img, LinkButton, Notice, PageHero, SectionHeader } from '../components/ui';
import { validateInquiry, type Errors, type InquiryFields } from '../lib/validation';

const TOPICS = ['General question', 'Appointment question (demo)', 'Billing or insurance question (demo)', 'Feedback about this website'];
const empty: InquiryFields = { name: '', email: '', topic: '', message: '' };

export default function Contact() {
  const [locId, setLocId] = useState(site.locations[0].id);
  const loc = site.locations.find((l) => l.id === locId) ?? site.locations[0];
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);

  const [form, setForm] = useState<InquiryFields>(empty);
  const [errors, setErrors] = useState<Errors<keyof InquiryFields>>({});
  const [checked, setChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const set = (k: keyof InquiryFields) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const copyAddress = async () => {
    const text = `${loc.name}, ${loc.addressLines.join(', ')} (fictional address)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateInquiry(form);
    setErrors(err);
    const first = (Object.keys(err) as (keyof InquiryFields)[])[0];
    if (first) {
      setChecked(false);
      formRef.current?.querySelector<HTMLElement>(`#inq-${first}`)?.focus();
      return;
    }
    setChecked(true);
  };

  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(form.topic || 'Enquiry')}&body=${encodeURIComponent(form.message)}`;

  return (
    <>
      <Seo title="Contact & locations" description={`Demonstration contact details, department contacts, opening hours and locations for the fictional ${site.brand.name} clinic, plus a validated demo inquiry form.`} />
      <PageHero eyebrow="Contact & locations" title="Find us, or say hello (it’s a demo)" lead="Every detail below is fictional. The form validates your input but has no backend, so nothing is sent.">
        <Notice tone="emergency" title="Emergency?" role="alert">{site.notices.emergency}</Notice>
      </PageHero>

      <section className="section-tight" aria-labelledby="loc-title">
        <div className="container">
          <SectionHeader title="Locations" id="loc-title" />
          <div className="chip-filter" role="tablist" aria-label="Clinic locations">
            {site.locations.map((l) => (
              <button key={l.id} role="tab" type="button" id={`tab-${l.id}`} aria-selected={l.id === locId} aria-controls="loc-panel" tabIndex={l.id === locId ? 0 : -1} className={`chip ${l.id === locId ? 'is-active' : ''}`}
                onClick={() => { setLocId(l.id); setCopied(null); }}
                onKeyDown={(e) => {
                  const i = site.locations.findIndex((x) => x.id === locId);
                  const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
                  if (n === null) return;
                  e.preventDefault();
                  const next = site.locations[(n + site.locations.length) % site.locations.length];
                  setLocId(next.id);
                  setTimeout(() => document.getElementById(`tab-${next.id}`)?.focus(), 0);
                }}>
                {l.name}
              </button>
            ))}
          </div>
          <div id="loc-panel" role="tabpanel" aria-labelledby={`tab-${loc.id}`} className="location-panel">
            <Img name={loc.image} className="rounded-img map-img" sizes="(min-width: 900px) 50vw, 92vw" />
            <div className="location-info">
              <h3>{loc.name}</h3>
              <address>{loc.addressLines.map((l) => <span key={l}>{l}<br /></span>)}<em>Fictional address — not a real location</em></address>
              <ul className="meta-list stacked">
                <li><Icon name="phone" size={18} /> <a href={`tel:${loc.phoneHref}`}>{loc.phone}</a></li>
                <li><Icon name="mail" size={18} /> <a href={`mailto:${loc.email}`}>{loc.email}</a></li>
              </ul>
              <h4>Opening hours</h4>
              <ul className="plain-list">{loc.hoursSummary.map((h) => <li key={h}>{h}</li>)}</ul>
              <h4>On site</h4>
              <ul className="tag-list">{loc.facilities.map((f) => <li key={f}>{f}</li>)}</ul>
              <p className="muted small">{loc.directions}</p>
              <div className="btn-row">
                <Button variant="secondary" icon="copy" onClick={copyAddress}>Copy address</Button>
                <LinkButton to="/book" icon="calendar">Book (demo)</LinkButton>
              </div>
              <p className="small" role="status" aria-live="polite">{copied === 'ok' ? 'Address copied to your clipboard.' : copied === 'fail' ? 'Could not access the clipboard in this browser.' : ''}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section tint" aria-labelledby="dept-title">
        <div className="container">
          <SectionHeader title="Department contacts" id="dept-title" lead="Placeholder details for a real clinic’s departments. Nobody will answer these." />
          <ul className="grid grid-4 info-grid">
            {site.departments.map((d) => (
              <li key={d.name} className="panel">
                <h3>{d.name}</h3>
                <p><Icon name="phone" size={16} /> <a href={`tel:${d.phoneHref}`}>{d.phone}</a></p>
                <p><Icon name="mail" size={16} /> <a href={`mailto:${d.email}`}>{d.email}</a></p>
                <p className="muted small">{d.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-tight" aria-labelledby="inq-title">
        <div className="container two-col">
          <div>
            <SectionHeader title="Demo inquiry form" id="inq-title" lead="Try the validation. Nothing you type is transmitted or stored." />
            <Notice title="Demonstration form — nothing is sent">{site.notices.contactForm}</Notice>
            <p className="muted small">Please do not enter medical details, symptoms, insurance numbers or identity numbers.</p>
          </div>
          <div>
            {checked ? (
              <div className="panel result" role="status">
                <Icon name="info" size={26} />
                <h3>Validated — but not sent</h3>
                <p>Your entries passed validation. Because this demonstration has no backend, <strong>your message was not sent or delivered</strong> to anyone, and nothing was stored.</p>
                <p>If you would like to try emailing the fictional address from your own email app, the link below simply opens your mail program with these words pre-filled (the address does not exist).</p>
                <div className="btn-row">
                  <a className="btn btn-secondary btn-md" href={mailto}><span>Open in my email app</span><Icon name="mail" size={18} /></a>
                  <Button variant="ghost" onClick={() => { setForm(empty); setChecked(false); }}>Start again</Button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submit} noValidate className="form" aria-label="Demo inquiry form">
                <Field id="inq-name" label="Your name" required error={errors.name}>
                  <input id="inq-name" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy('inq-name', errors.name)} />
                </Field>
                <Field id="inq-email" label="E-mail address" required error={errors.email}>
                  <input id="inq-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy('inq-email', errors.email)} />
                </Field>
                <Field id="inq-topic" label="Topic" required error={errors.topic}>
                  <select id="inq-topic" value={form.topic} onChange={set('topic')} aria-invalid={!!errors.topic} aria-describedby={describedBy('inq-topic', errors.topic)}>
                    <option value="">Choose a topic…</option>
                    {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field id="inq-message" label="Message" required error={errors.message} hint="10–1000 characters. No medical details, please.">
                  <textarea id="inq-message" rows={5} value={form.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={describedBy('inq-message', errors.message, 'hint')} />
                </Field>
                <Button type="submit" icon="arrow">Validate demo form</Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
