import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChoiceGroup, SelectField, TextArea, TextField } from '../components/forms';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';
import { DemoBanner, PageHero } from '../components/ui';
import { addOns, budgetOptions, contactMethods, dateModes, destinationOptions, eventTypes, packages, questionnaireSettings as qs, seasons, serviceOptions, styleOptions, img } from '../config';
import { emptyAnswers, guestAdvice, makeDemoReference, sanitizeServices, servicesFor, steps, summarise, validateAll, validateStep, yearOptions, type Errors, type InquiryAnswers, type StepId } from '../lib/inquiry';
import { readJSON, writeJSON } from '../lib/storage';
import { formatDate, formatPrice } from '../lib/format';
import { todayISO } from '../lib/validation';

interface Draft { answers: InquiryAnswers; step: number; savedAt: string }

const packageServices: Record<string, string[]> = { essential: ['partial', 'coordination'], signature: ['full'], destination: ['full', 'destination'] };

/** Builds the starting answers from URL parameters set by service, package and destination pages. */
export function answersFromParams(p: URLSearchParams): InquiryAnswers {
  const a: InquiryAnswers = { ...emptyAnswers };
  const pkg = packages.find((x) => x.id === p.get('package'));
  if (pkg) {
    a.packageId = pkg.id;
    a.services = packageServices[pkg.id] ?? [];
    a.addOns = (p.get('addons') ?? '').split(',').filter((id) => addOns.some((x) => x.id === id));
    if (pkg.id === 'destination') a.eventType = 'wedding';
  }
  const service = p.get('service');
  if (service && serviceOptions.some((s) => s.id === service)) a.services = [service];
  const dest = p.get('destination');
  if (dest && destinationOptions.some((d) => d.id === dest)) a.destination = dest;
  return a;
}

export default function Plan() {
  const [params] = useSearchParams();
  const initial = useMemo(() => answersFromParams(params), [params]);
  const stored = useMemo(() => readJSON<Draft | null>(qs.draftStorageKey, null), []);
  const [answers, setAnswers] = useState<InquiryAnswers>(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [saveDraft, setSaveDraft] = useState(false);
  const [draftOffer, setDraftOffer] = useState<Draft | null>(stored);
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState<{ ref: string; at: string } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const def = steps[step];

  // Persist the draft only when the visitor has opted in.
  useEffect(() => {
    if (!saveDraft || done) return;
    writeJSON(qs.draftStorageKey, { answers, step, savedAt: new Date().toISOString() } satisfies Draft);
  }, [saveDraft, answers, step, done]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [step, done]);

  const update = useCallback(<K extends keyof InquiryAnswers>(k: K, v: InquiryAnswers[K]) => {
    setAnswers((a) => {
      const next = { ...a, [k]: v };
      if (k === 'eventType') next.services = sanitizeServices(next);
      return next;
    });
    setErrors((e) => ({ ...e, [k]: undefined }));
  }, []);

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    const errs = validateStep(def.id, answers);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"], .has-error input');
      first?.focus();
      return;
    }
    if (def.id === 'review') return finish();
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };
  const jump = (i: number) => {
    setErrors({});
    setStep(i);
  };

  const finish = () => {
    const all = validateAll(answers);
    if (all.firstInvalid) {
      setErrors(all.errors);
      setStep(steps.findIndex((s) => s.id === all.firstInvalid));
      return;
    }
    if (!consent) {
      setErrors({ form: 'Please confirm that you understand this enquiry is a demonstration and will not be sent.' });
      return;
    }
    window.localStorage.removeItem(qs.draftStorageKey);
    setSaveDraft(false);
    setDone({ ref: makeDemoReference(), at: new Date().toISOString() });
  };

  const restart = () => {
    setAnswers(initial);
    setStep(0);
    setDone(null);
    setConsent(false);
    setErrors({});
  };

  const resume = () => {
    if (!draftOffer) return;
    setAnswers({ ...emptyAnswers, ...draftOffer.answers });
    setStep(Math.min(draftOffer.step, steps.length - 1));
    setSaveDraft(true);
    setDraftOffer(null);
  };
  const discardDraft = () => {
    try { window.localStorage.removeItem(qs.draftStorageKey); } catch { /* storage unavailable */ }
    setDraftOffer(null);
    setSaveDraft(false);
  };
  const toggleSave = (on: boolean) => {
    setSaveDraft(on);
    if (!on) { try { window.localStorage.removeItem(qs.draftStorageKey); } catch { /* ignore */ } }
  };

  const summary = summarise(answers);
  const pkg = packages.find((p) => p.id === answers.packageId);
  const errorList = Object.entries(errors).filter(([, m]) => m) as [string, string][];

  const download = () => {
    const lines = [
      'EVERAFTER — DEMONSTRATION ENQUIRY SUMMARY',
      'This summary was generated in your browser. It was NOT sent to any planner.',
      '',
      `Reference: ${done?.ref}`,
      `Event: ${summary.event}`,
      `When: ${summary.when}`,
      `Where: ${summary.destination}`,
      `Guests: ${summary.guests}`,
      `Styles: ${summary.styles.map((s) => styleOptions.find((o) => o.id === s)?.label).join(', ')}`,
      `Services: ${summary.services.map((s) => serviceOptions.find((o) => o.id === s)?.label).join(', ')}`,
      `Budget: ${budgetOptions.find((b) => b.id === answers.budget)?.label ?? 'Not given'}`,
      pkg ? `Package: ${pkg.name}` : '',
      summary.addOnNames.length ? `Add-ons: ${summary.addOnNames.join(', ')}` : '',
      `Name: ${answers.name}`,
      `Email: ${answers.email}`,
      answers.phone ? `Phone: ${answers.phone}` : '',
      answers.notes ? `Notes: ${answers.notes}` : ''
    ].filter(Boolean);
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'everafter-demo-enquiry.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const body = (id: StepId) => {
    switch (id) {
      case 'type':
        return <ChoiceGroup legend="Type of event" name="eventType" type="radio" options={eventTypes} value={answers.eventType} onChange={(v) => update('eventType', v as string)} error={errors.eventType} />;
      case 'date':
        return (
          <>
            <ChoiceGroup legend="How firm is your date?" name="dateMode" type="radio" columns={3} options={dateModes} value={answers.dateMode} onChange={(v) => update('dateMode', v as InquiryAnswers['dateMode'])} error={errors.dateMode} />
            {answers.dateMode === 'exact' && (
              <TextField label="Preferred date" name="date" type="date" min={todayISO()} value={answers.date} onChange={(e) => update('date', e.target.value)} error={errors.date} hint="Choose the day you would most like to celebrate." />
            )}
            {answers.dateMode === 'flexible' && (
              <div className="form__row">
                <SelectField label="Season" name="season" value={answers.season} onChange={(e) => update('season', e.target.value)} error={errors.season}>
                  <option value="">Choose a season</option>
                  {seasons.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
                </SelectField>
                <SelectField label="Year" name="year" value={answers.year} onChange={(e) => update('year', e.target.value)} error={errors.year}>
                  <option value="">Choose a year</option>
                  {yearOptions().map((y) => (<option key={y}>{y}</option>))}
                </SelectField>
              </div>
            )}
            {answers.dateMode === 'undecided' && <p className="note">No problem — we will suggest dates based on your style and destination.</p>}
          </>
        );
      case 'destination':
        return (
          <>
            <ChoiceGroup legend="Preferred destination" name="destination" type="radio" columns={3} options={destinationOptions} value={answers.destination} onChange={(v) => update('destination', v as string)} error={errors.destination} />
            {answers.destination === 'other' && <TextField label="Where are you thinking of?" name="customDestination" value={answers.customDestination} onChange={(e) => update('customDestination', e.target.value)} error={errors.customDestination} />}
          </>
        );
      case 'guests': {
        const advice = guestAdvice(answers);
        return (
          <>
            <TextField label="Estimated number of guests" name="guests" type="number" inputMode="numeric" min={qs.minGuests} max={qs.maxGuests} value={answers.guests} onChange={(e) => update('guests', e.target.value)} error={errors.guests} hint={`Between ${qs.minGuests} and ${qs.maxGuests}. An estimate is fine.`} />
            {advice && <p className="note" role="status">{advice}</p>}
          </>
        );
      }
      case 'style':
        return <ChoiceGroup legend="Style preferences" name="styles" type="checkbox" columns={2} options={styleOptions} value={answers.styles} onChange={(v) => update('styles', v as string[])} error={errors.styles} hint="Choose as many as you like." />;
      case 'services':
        return <ChoiceGroup legend="Planning services" name="services" type="checkbox" options={servicesFor(answers.eventType)} value={sanitizeServices(answers)} onChange={(v) => update('services', v as string[])} error={errors.services} hint="Services shown are suited to your type of event." />;
      case 'budget':
        return <ChoiceGroup legend="Approximate total budget (optional)" name="budget" type="radio" columns={2} options={budgetOptions} value={answers.budget} onChange={(v) => update('budget', v as string)} hint="This is optional and helps us suggest the right format. You can skip this step." />;
      case 'contact': {
        const wedding = ['wedding', 'elopement', 'vow-renewal'].includes(answers.eventType);
        return (
          <>
            <div className="form__row">
              <TextField label="Your name" name="name" autoComplete="name" value={answers.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
              <TextField label="Email address" name="email" type="email" autoComplete="email" value={answers.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
            </div>
            <div className="form__row">
              <TextField label="Phone" name="phone" type="tel" autoComplete="tel" value={answers.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone} optional={answers.contactMethod !== 'phone'} />
              <SelectField label="Preferred way to be contacted" name="contactMethod" value={answers.contactMethod} onChange={(e) => update('contactMethod', e.target.value)}>
                {contactMethods.map((m) => (<option key={m.id} value={m.id}>{m.label}</option>))}
              </SelectField>
            </div>
            {wedding && <TextField label="Your partner’s name" name="partnerName" value={answers.partnerName} onChange={(e) => update('partnerName', e.target.value)} optional />}
            {answers.eventType === 'corporate' && <TextField label="Company or organisation" name="company" autoComplete="organization" value={answers.company} onChange={(e) => update('company', e.target.value)} error={errors.company} />}
            <TextArea label="Anything else we should know?" name="notes" rows={4} maxLength={qs.notesMaxLength + 200} value={answers.notes} onChange={(e) => update('notes', e.target.value)} error={errors.notes} optional hint={`${answers.notes.length}/${qs.notesMaxLength} characters`} />
          </>
        );
      }
      case 'review':
        return (
          <>
            <dl className="review">
              {[
                ['Event', summary.event, 0],
                ['Date', summary.when === answers.date ? formatDate(answers.date) : summary.when, 1],
                ['Destination', summary.destination, 2],
                ['Guests', summary.guests, 3],
                ['Styles', summary.styles.map((s) => styleOptions.find((o) => o.id === s)?.label).join(', '), 4],
                ['Services', summary.services.map((s) => serviceOptions.find((o) => o.id === s)?.label).join(', '), 5],
                ['Budget', budgetOptions.find((b) => b.id === answers.budget)?.label ?? 'Not provided', 6],
                ['Contact', `${answers.name} · ${answers.email}${answers.phone ? ` · ${answers.phone}` : ''}`, 7]
              ].map(([k, v, i]) => (
                <div key={k as string}><dt>{k}</dt><dd>{v}</dd><dd className="review__edit"><button type="button" className="link-btn" onClick={() => jump(i as number)}>Edit<span className="sr-only"> {k}</span></button></dd></div>
              ))}
              {pkg && <div><dt>Package</dt><dd>{pkg.name} (from {formatPrice(pkg.startingPrice)} — illustrative)</dd><dd className="review__edit"><Link className="link-btn" to="/packages">Change</Link></dd></div>}
              {summary.addOnNames.length > 0 && <div><dt>Add-ons</dt><dd>{summary.addOnNames.join(', ')}</dd><dd /></div>}
              {answers.notes && <div><dt>Notes</dt><dd>{answers.notes}</dd><dd /></div>}
            </dl>
            <div className={`consent${errors.form ? ' has-error' : ''}`}>
              <label><input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErrors({}); }} aria-describedby="plan-consent-note" /> I understand this enquiry is a demonstration. It will not be sent to a real planner.</label>
              <p className="field__hint" id="plan-consent-note">Completing the questionnaire only shows a preview on this device.</p>
              {errors.form && <p className="field__error" role="alert"><Icon name="info" size={16} />{errors.form}</p>}
            </div>
          </>
        );
    }
  };

  if (done) {
    return (
      <>
        <Seo title="Enquiry preview complete" description="Demonstration enquiry preview. Nothing was sent." noindex />
        <section className="section plan-done">
          <div className="container container--narrow">
            <div className="result" role="status">
              <Icon name="info" size={30} />
              <p className="eyebrow">Step 10 of 10 · Demonstration complete</p>
              <h1 className="h-display" ref={heading} tabIndex={-1}>Preview complete — nothing was sent</h1>
              <p className="lead">Thank you, {answers.name.split(' ')[0]}. This is a demonstration website with no backend, so <strong>your enquiry was not delivered to any planner</strong>. No booking, reservation or appointment has been made, and nobody will reply.</p>
              <p className="demo-ref">Demo reference <strong>{done.ref}</strong> — generated in your browser at {formatDate(done.at, { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'short', day: 'numeric' })}. It is not an enquiry number.</p>
              <dl className="result__summary">
                <div><dt>Event</dt><dd>{summary.event}</dd></div>
                <div><dt>When</dt><dd>{summary.when === answers.date ? formatDate(answers.date) : summary.when}</dd></div>
                <div><dt>Where</dt><dd>{summary.destination}</dd></div>
                <div><dt>Guests</dt><dd>{summary.guests}</dd></div>
              </dl>
              <div className="result__actions">
                <button type="button" className="btn btn--primary" onClick={download}><span>Download summary (.txt)</span></button>
                <button type="button" className="btn btn--outline" onClick={restart}><span>Start a new enquiry</span></button>
                <Link to="/contact" className="btn btn--outline"><span>Contact page</span></Link>
              </div>
              <p className="fineprint">Want this to reach a real inbox? See CUSTOMIZATION_GUIDE.md — “Connecting a backend”.</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo title="Plan Your Celebration" description="A guided nine-step enquiry for weddings and events: choose your event, date, destination, guests, style, services and budget. Demonstration only — nothing is sent." />
      <PageHero eyebrow="Enquiry" title="Plan your celebration" lead="A short guided questionnaire, about five minutes. You can go back at any time." image={img('arch-lakeside')} />
      <section className="section section--tight plan" aria-label="Event planning questionnaire">
        <div className="container container--narrow">
          <DemoBanner><strong>Demonstration only.</strong> This website has no backend, so your answers are <strong>not sent to a planner</strong> and no booking or enquiry is created.</DemoBanner>

          {draftOffer && (
            <div className="draft-offer" role="region" aria-label="Saved draft">
              <p>You have a saved draft from {formatDate(draftOffer.savedAt, { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.</p>
              <div><button type="button" className="btn btn--primary btn--sm" onClick={resume}><span>Resume draft</span></button> <button type="button" className="btn btn--outline btn--sm" onClick={discardDraft}><span>Delete draft</span></button></div>
            </div>
          )}

          {pkg && (
            <p className="note" role="note">Enquiring about the <strong>{pkg.name}</strong> package{summary.addOnNames.length ? ` with ${summary.addOnNames.join(', ')}` : ''}. <Link to="/packages">Change</Link></p>
          )}

          <nav aria-label="Progress" className="progress">
            <p className="progress__text" aria-live="polite">Step {step + 1} of {steps.length}: <strong>{def.label}</strong></p>
            <div className="progress__bar" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step + 1} aria-label="Questionnaire progress"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
            <ol>
              {steps.map((s, i) => (
                <li key={s.id} className={i < step ? 'is-done' : i === step ? 'is-current' : ''}>
                  {i < step ? (<button type="button" onClick={() => jump(i)} aria-label={`Go back to step ${i + 1}: ${s.label}`}>{i + 1}</button>) : (<span aria-current={i === step ? 'step' : undefined}>{i + 1}<span className="sr-only"> {s.label}{i === step ? ' (current step)' : ''}</span></span>)}
                  <em aria-hidden="true">{s.label}</em>
                </li>
              ))}
            </ol>
          </nav>

          <form className="plan__form" onSubmit={next} noValidate>
            <h2 className="h-display plan__title" ref={heading} tabIndex={-1}>{def.title}</h2>
            {def.optional && <p className="plan__optional">Optional — you can continue without answering.</p>}
            {errorList.length > 0 && def.id !== 'review' && (
              <div className="error-summary" role="alert"><p><strong>Please check your answer</strong></p><ul>{errorList.map(([k, m]) => (<li key={k}>{m}</li>))}</ul></div>
            )}
            <div className="plan__body">{body(def.id)}</div>
            <div className="plan__actions">
              <button type="button" className="btn btn--outline" onClick={back} disabled={step === 0}><Icon name="arrowLeft" size={16} /><span>Back</span></button>
              {def.optional && answers.budget && (<button type="button" className="btn btn--ghost-dark" onClick={() => update('budget', '')}><span>Clear</span></button>)}
              <button type="submit" className="btn btn--primary"><span>{def.id === 'review' ? 'Complete preview' : def.optional && !answers.budget ? 'Skip' : 'Continue'}</span>{def.id !== 'review' && <Icon name="arrow" size={16} />}</button>
            </div>
            <div className="plan__draft">
              <label><input type="checkbox" checked={saveDraft} onChange={(e) => toggleSave(e.target.checked)} /> Save my progress in this browser</label>
              <p className="field__hint">Optional. Stored only on this device (local storage), never sent anywhere. Untick to delete it.</p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
