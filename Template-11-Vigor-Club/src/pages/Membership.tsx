import { useMemo, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Button, CheckField, DemoBadge, PageHero, SectionHead, TextField } from '../components/ui';
import { comparison, faqs, membershipCopy, plans } from '../config/membership';
import { bookingSettings } from '../config/booking';
import { site } from '../config/site';
import { isoDate } from '../lib/format';
import { money } from '../lib/format';
import { readJSON, writeJSON } from '../lib/storage';
import { annualSaving, annualTotal, priceFor, type Billing } from '../lib/pricing';
import { submitForm } from '../lib/forms';
import { validateSignup, type SignupFields } from '../lib/validation';

function Tick({ v }: { v: boolean | string }) {
  if (v === true) return <><Icon name="check" size={18} className="tick" /><span className="sr-only">Included</span></>;
  if (v === false) return <><Icon name="minus" size={18} className="dash" /><span className="sr-only">Not included</span></>;
  return <>{v}</>;
}

type Phase = 'form' | 'review' | 'done';

function Signup({ billing, setBilling, planId, setPlanId }: { billing: Billing; setBilling: (b: Billing) => void; planId: string; setPlanId: (id: string) => void }) {
  const todayIso = isoDate(new Date());
  const [phase, setPhase] = useState<Phase>('form');
  const [v, setV] = useState<SignupFields>({ name: '', email: '', phone: '', startDate: '', planId, agree: false });
  const [errors, setErrors] = useState<ReturnType<typeof validateSignup>>({});
  const [result, setResult] = useState<{ status: 'demo' | 'sent' | 'error'; message?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const plan = plans.find((p) => p.id === planId) ?? plans[0];
  const fields = { ...v, planId };

  const review = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateSignup({ ...fields, agree: true }, plans.map((p) => p.id), todayIso);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setPhase('review');
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  const confirm = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateSignup(fields, plans.map((p) => p.id), todayIso);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    const payload = { type: 'membership-signup', ...fields, billing, price: priceFor(plan, billing) };
    const res = await submitForm(payload);
    setBusy(false);
    if (res.status === 'error') { setResult(res); return; }
    const list = readJSON<unknown[]>(bookingSettings.inquiriesKey, []);
    writeJSON(bookingSettings.inquiriesKey, [...(Array.isArray(list) ? list : []), { ...payload, at: new Date().toISOString(), delivered: res.status === 'sent' }].slice(-20));
    setResult(res);
    setPhase('done');
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  return (
    <section id="join" className="section section--light" aria-labelledby="join-title">
      <div className="container signup">
        <div>
          <p className="eyebrow">Join the club <DemoBadge>Demo flow</DemoBadge></p>
          <h2 id="join-title" className="h-display" ref={headingRef} tabIndex={-1}>
            {phase === 'done' ? (result?.status === 'sent' ? 'Enquiry sent' : 'Demo enquiry recorded') : phase === 'review' ? 'Review your details' : 'Start your membership enquiry'}
          </h2>
          <p className="lead">{membershipCopy.disclaimer}</p>
        </div>
        <div className="signup-card">
          {phase === 'done' ? (
            <div className="confirm confirm--light" role="status">
              <Icon name="check" size={28} />
              {result?.status === 'sent' ? (
                <p>{site.forms.successNote}</p>
              ) : (
                <>
                  <p><b>This was a demonstration.</b> Your details were validated and saved in this browser only. They were <b>not sent</b> to anyone, no payment was taken and no membership was created or activated.</p>
                </>
              )}
              <p>Plan: <b>{plan.name}</b> · {billing === 'annual' ? 'billed annually' : 'billed monthly'} · {money(priceFor(plan, billing))}/month · preferred start {v.startDate}</p>
              <Button variant="dark" onClick={() => { setPhase('form'); setV({ name: '', email: '', phone: '', startDate: '', planId, agree: false }); setResult(null); }}>Start another enquiry</Button>
            </div>
          ) : phase === 'review' ? (
            <form onSubmit={confirm} noValidate aria-label="Review membership enquiry" className="form">
              <dl className="review-list">
                <div><dt>Plan</dt><dd>{plan.name} — {money(priceFor(plan, billing))}/month ({billing})</dd></div>
                <div><dt>Name</dt><dd>{v.name}</dd></div>
                <div><dt>Email</dt><dd>{v.email}</dd></div>
                {v.phone && <div><dt>Phone</dt><dd>{v.phone}</dd></div>}
                <div><dt>Preferred start</dt><dd>{v.startDate}</dd></div>
              </dl>
              <CheckField label="I understand this is a demonstration: no payment will be taken and no membership will be activated." checked={v.agree} error={errors.agree} onChange={(e) => setV({ ...v, agree: e.target.checked })} />
              {result?.status === 'error' && <p className="field-error" role="alert">{result.message}</p>}
              <div className="btn-row">
                <Button variant="ghost" onClick={() => setPhase('form')} disabled={busy}>Back</Button>
                <Button type="submit" variant="dark" disabled={busy}>{busy ? 'Working…' : 'Submit demo enquiry'}</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={review} noValidate aria-label="Membership enquiry" className="form">
              <fieldset className="plan-picker">
                <legend>Plan</legend>
                {plans.map((p) => (
                  <label key={p.id} className={`plan-option ${planId === p.id ? 'is-selected' : ''}`}>
                    <input type="radio" name="plan" value={p.id} checked={planId === p.id} onChange={() => setPlanId(p.id)} />
                    <span><b>{p.name}</b><small>{money(priceFor(p, billing))}/mo</small></span>
                  </label>
                ))}
                {errors.planId && <p className="field-error" role="alert">{errors.planId}</p>}
              </fieldset>
              <fieldset className="plan-picker">
                <legend>Billing</legend>
                {(['monthly', 'annual'] as Billing[]).map((b) => (
                  <label key={b} className={`plan-option ${billing === b ? 'is-selected' : ''}`}>
                    <input type="radio" name="billing" value={b} checked={billing === b} onChange={() => setBilling(b)} />
                    <span><b>{b === 'monthly' ? 'Monthly' : 'Annual'}</b></span>
                  </label>
                ))}
              </fieldset>
              <div className="form-grid">
                <TextField label="Full name" name="name" autoComplete="name" required value={v.name} error={errors.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
                <TextField label="Email" name="email" type="email" autoComplete="email" required value={v.email} error={errors.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
                <TextField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={v.phone} error={errors.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />
                <TextField label="Preferred start date" name="startDate" type="date" min={todayIso} required value={v.startDate} error={errors.startDate} onChange={(e) => setV({ ...v, startDate: e.target.value })} />
              </div>
              <Button type="submit" variant="dark">Review enquiry</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Membership() {
  const [params] = useSearchParams();
  const initialPlan = plans.some((p) => p.id === params.get('plan')) ? (params.get('plan') as string) : (plans.find((p) => p.highlight) ?? plans[0]).id;
  const [billing, setBilling] = useState<Billing>('monthly');
  const [planId, setPlanId] = useState(initialPlan);
  const groups = useMemo(() => [...new Set(comparison.map((r) => r.group))], []);
  const choose = (id: string) => {
    setPlanId(id);
    window.setTimeout(() => document.getElementById('join')?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }), 0);
  };

  return (
    <>
      <Seo title="Membership & Pricing" description="Compare VIGOR CLUB membership plans with monthly and annual pricing. Demonstration prices; no payment is processed." />
      <PageHero eyebrow={membershipCopy.eyebrow} title={<>{membershipCopy.title.split(' ').slice(0, -1).join(' ')} <span className="accent">{membershipCopy.title.split(' ').slice(-1)}</span></>} intro={membershipCopy.intro} />
      <section className="section section--tight" aria-labelledby="plans-title">
        <div className="container">
          <h2 id="plans-title" className="sr-only">Membership plans</h2>
          <div className="billing" role="radiogroup" aria-label="Billing period">
            {(['monthly', 'annual'] as Billing[]).map((b) => (
              <button key={b} type="button" role="radio" aria-checked={billing === b} className={`billing-opt ${billing === b ? 'is-active' : ''}`} onClick={() => setBilling(b)}>
                {b === 'monthly' ? 'Monthly' : 'Annual'}{b === 'annual' && <small>Save with annual</small>}
              </button>
            ))}
          </div>
          <p className="fine-print center">{billing === 'annual' ? membershipCopy.annualNote : 'Billed monthly, shown as the price per month.'}</p>
          <div className="plan-grid">
            {plans.map((p) => (
              <article key={p.id} className={`plan ${p.highlight ? 'is-featured' : ''}`} aria-labelledby={`plan-${p.id}`}>
                {p.badge && <span className="plan-badge">{p.badge}</span>}
                <h3 id={`plan-${p.id}`} className="h-card">{p.name}</h3>
                <p className="plan-tag">{p.tagline}</p>
                <p className="plan-price" aria-live="polite"><b>{money(priceFor(p, billing))}</b><span> / month</span></p>
                <p className="plan-sub">{billing === 'annual' ? `${money(annualTotal(p))} billed yearly — save ${money(annualSaving(p))} vs monthly` : `Or ${money(p.annualMonthly)}/month billed annually`}{p.joiningFee ? ` · ${money(p.joiningFee)} joining fee` : ' · No joining fee'}</p>
                <ul className="tick-list">{p.benefits.map((b) => <li key={b}><Icon name="check" size={18} />{b}</li>)}</ul>
                <button type="button" className={`btn ${p.highlight ? 'btn--primary' : 'btn--ghost'}`} onClick={() => choose(p.id)} aria-label={`${p.cta} (demo enquiry)`}><span>{p.cta}</span><Icon name="arrow" size={18} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--charcoal" aria-labelledby="compare-title">
        <div className="container">
          <SectionHead eyebrow="Compare" title={<span id="compare-title">Plan comparison</span>} intro="Scroll sideways on small screens to see every plan." />
          <div className="table-wrap" role="region" aria-label="Plan comparison table" tabIndex={0}>
            <table className="compare">
              <caption className="sr-only">Comparison of {plans.map((p) => p.name).join(', ')} plans</caption>
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Feature</span></th>
                  {plans.map((p) => <th key={p.id} scope="col" className={p.highlight ? 'is-featured' : ''}>{p.name}<small>{money(priceFor(p, billing))}/mo</small></th>)}
                </tr>
              </thead>
              {groups.map((g) => (
                <tbody key={g}>
                  <tr className="group-row"><th scope="colgroup" colSpan={plans.length + 1}>{g}</th></tr>
                  {comparison.filter((r) => r.group === g).map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      {plans.map((p) => <td key={p.id} className={p.highlight ? 'is-featured' : ''}><Tick v={r.values[p.id] ?? false} /></td>)}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <Signup billing={billing} setBilling={setBilling} planId={planId} setPlanId={setPlanId} />

      <section className="section" aria-labelledby="faq-title">
        <div className="container narrow-wide">
          <SectionHead eyebrow="FAQ" title={<span id="faq-title">Questions, answered</span>} />
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
