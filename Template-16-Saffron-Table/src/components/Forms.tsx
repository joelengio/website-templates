import { useRef, useState, type FormEvent } from 'react';
import { contactContent } from '../config/content';
import { eventRequirements, eventTypes, privateEventLeadDays, privateSpaces, privatePackages } from '../config/privateDining';
import type { Experience } from '../config/types';
import { addDays, toDateKey } from '../lib/dates';
import { saveInquiry } from '../lib/inquiries';
import {
  validateContactForm,
  validateExperienceInquiry,
  validatePrivateInquiry,
  type Errors,
} from '../lib/validation';
import { Button } from './Button';
import { CheckField, ErrorSummary, SelectField, TextArea, TextField } from './Field';
import { Icon } from './Icon';

const focusSummary = (root: HTMLElement | null) => {
  requestAnimationFrame(() => root?.querySelector<HTMLElement>('[data-error-summary]')?.focus());
};

function SuccessPanel({ refCode, title, children, onReset }: { refCode: string; title: string; children: React.ReactNode; onReset: () => void }) {
  return (
    <div className="success-panel" role="status" aria-live="polite">
      <Icon name="check" size={28} />
      <h3>{title}</h3>
      <p>{children}</p>
      <p className="success-panel__ref">Demo reference: <strong>{refCode}</strong></p>
      <Button variant="ghost" onClick={onReset}>Send another demo message</Button>
    </div>
  );
}

const DEMO_NOTE = 'Demonstration form: your details are validated and kept only in this browser. Nothing is sent to the restaurant or any server.';

/* ---------- Contact ---------- */
export function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', topic: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateContactForm(v);
    setErrors(errs);
    if (Object.keys(errs).length) return focusSummary(formRef.current);
    setDone(saveInquiry('contact', v.topic, { Name: v.name, Email: v.email, Message: v.message }).ref);
  };

  if (done)
    return (
      <SuccessPanel refCode={done} title="Demo message recorded locally" onReset={() => { setDone(null); setV({ name: '', email: '', topic: '', message: '' }); }}>
        This is a demonstration: your message was <strong>not sent</strong> to anyone. Connect the form to your own email or CRM service before launch.
      </SuccessPanel>
    );

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="form" aria-label="Contact form (demo)">
      <ErrorSummary errors={errors} />
      <TextField label="Your name" required autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
      <TextField label="Email" required type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} />
      <SelectField label="Topic" required value={v.topic} onChange={set('topic')} error={errors.topic}>
        <option value="">Choose a topic</option>
        {contactContent.topics.map((t) => <option key={t}>{t}</option>)}
      </SelectField>
      <TextArea label="Message" required rows={5} value={v.message} onChange={set('message')} error={errors.message} hint="Please don’t include allergy or health details. Confirm those with the restaurant directly." />
      <p className="form__demo">{DEMO_NOTE}</p>
      <Button type="submit" icon="arrow">Send demo message</Button>
    </form>
  );
}

/* ---------- Private dining ---------- */
const maxPrivateGuests = Math.max(...privateSpaces.map((s) => s.standing), ...privatePackages.map((p) => p.maxGuests));

export function PrivateInquiryForm({ presetPackage }: { presetPackage?: string }) {
  const empty = { name: '', email: '', phone: '', eventType: '', date: '', guests: '', budget: '', message: '', consent: false };
  const [v, setV] = useState(empty);
  const [space, setSpace] = useState('');
  const [reqs, setReqs] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));
  const minDate = addDays(toDateKey(new Date()), privateEventLeadDays);
  const pkg = privatePackages.find((p) => p.id === presetPackage);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validatePrivateInquiry(v, { leadDays: privateEventLeadDays, maxGuests: maxPrivateGuests });
    setErrors(errs);
    if (Object.keys(errs).length) return focusSummary(formRef.current);
    setDone(
      saveInquiry('private-dining', `${v.eventType} for ${v.guests}`, {
        Name: v.name, Email: v.email, Date: v.date, Guests: v.guests, Space: space || 'No preference', Requirements: reqs.join(', ') || 'None',
      }).ref,
    );
  };

  if (done)
    return (
      <SuccessPanel refCode={done} title="Demo enquiry recorded locally" onReset={() => { setDone(null); setV(empty); setReqs([]); setSpace(''); }}>
        Your private dining enquiry was validated but <strong>not sent</strong> to a restaurant. In a live site this is where your enquiry service would take over.
      </SuccessPanel>
    );

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="form form--grid" aria-label="Private dining enquiry form (demo)">
      <div className="form__full"><ErrorSummary errors={errors} /></div>
      {pkg && <p className="form__full form__preset">Package selected: <strong>{pkg.name}</strong></p>}
      <TextField label="Your name" required autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
      <TextField label="Email" required type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} />
      <TextField label="Phone" type="tel" autoComplete="tel" inputMode="tel" value={v.phone} onChange={set('phone')} error={errors.phone} />
      <SelectField label="Event type" required value={v.eventType} onChange={set('eventType')} error={errors.eventType}>
        <option value="">Choose event type</option>
        {eventTypes.map((t) => <option key={t}>{t}</option>)}
      </SelectField>
      <TextField label="Event date" required type="date" min={minDate} value={v.date} onChange={set('date')} error={errors.date} hint={`Earliest date: ${minDate}`} />
      <TextField label="Number of guests" required type="number" inputMode="numeric" min={1} max={maxPrivateGuests} value={v.guests} onChange={set('guests')} error={errors.guests} />
      <SelectField label="Preferred space" value={space} onChange={(e) => setSpace(e.target.value)}>
        <option value="">No preference</option>
        {privateSpaces.map((s) => <option key={s.id} value={s.name}>{s.name} (seats {s.seated})</option>)}
      </SelectField>
      <TextField label="Approximate budget (USD)" type="number" inputMode="decimal" min={0} value={v.budget} onChange={set('budget')} error={errors.budget} />
      <fieldset className="form__full fieldset">
        <legend>Event requirements <span className="field__opt">(optional)</span></legend>
        <div className="check-grid">
          {eventRequirements.map((r) => (
            <CheckField key={r} label={r} checked={reqs.includes(r)} onChange={(c) => setReqs((p) => (c ? [...p, r] : p.filter((x) => x !== r)))} />
          ))}
        </div>
      </fieldset>
      <div className="form__full"><TextArea label="Tell us about your event" rows={4} value={v.message} onChange={set('message')} error={errors.message} hint="Please don’t include allergy or health details here." /></div>
      <div className="form__full"><CheckField label="I understand this is a demonstration form and nothing will be sent to the restaurant." checked={v.consent} onChange={(c) => setV((p) => ({ ...p, consent: c }))} error={errors.consent} /></div>
      <p className="form__full form__demo">{DEMO_NOTE}</p>
      <div className="form__full"><Button type="submit" icon="arrow" size="lg">Submit demo enquiry</Button></div>
    </form>
  );
}

/* ---------- Experience inquiry (used inside a dialog) ---------- */
export function ExperienceInquiryForm({ experience, onDone }: { experience: Experience; onDone: () => void }) {
  const maxGuests = Number(experience.guests.match(/(\d+)\s*(?:guests)?$/)?.[1] ?? 60) || 60;
  const empty = { name: '', email: '', date: '', guests: '', message: '', consent: false };
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateExperienceInquiry(v, { maxGuests });
    setErrors(errs);
    if (Object.keys(errs).length) return focusSummary(formRef.current);
    setDone(saveInquiry('experience', experience.title, { Name: v.name, Email: v.email, Date: v.date || 'Flexible', Guests: v.guests }).ref);
  };

  if (done)
    return (
      <div className="success-panel" role="status" aria-live="polite">
        <Icon name="check" size={28} />
        <h3>Demo enquiry recorded locally</h3>
        <p>Your enquiry about <strong>{experience.title}</strong> was <strong>not sent</strong> to a restaurant. This is a demonstration.</p>
        <p className="success-panel__ref">Demo reference: <strong>{done}</strong></p>
        <Button onClick={onDone}>Close</Button>
      </div>
    );

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="form" aria-label={`Enquire about ${experience.title} (demo)`}>
      <ErrorSummary errors={errors} />
      <TextField label="Your name" required autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} data-autofocus />
      <TextField label="Email" required type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} />
      <TextField label="Preferred date" type="date" min={toDateKey(new Date())} value={v.date} onChange={set('date')} error={errors.date} />
      <TextField label={`Guests (${experience.guests})`} required type="number" inputMode="numeric" min={1} max={maxGuests} value={v.guests} onChange={set('guests')} error={errors.guests} />
      <TextArea label="Message" rows={3} value={v.message} onChange={set('message')} error={errors.message} />
      <CheckField label="I understand this is a demonstration and nothing will be sent." checked={v.consent} onChange={(c) => setV((p) => ({ ...p, consent: c }))} error={errors.consent} />
      <Button type="submit" icon="arrow">Submit demo enquiry</Button>
    </form>
  );
}
