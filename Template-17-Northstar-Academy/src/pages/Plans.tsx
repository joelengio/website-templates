import { useState } from 'react';
import { annualSavingPercent, comparisonRows, planFaqs, plans } from '../config';
import { money } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { ContactForm } from '../components/ContactForm';
import { Icon } from '../components/Icon';
import { FaqList, PageHero, Section } from '../components/ui';

export default function Plans() {
  useSeo({ title: 'Plans & pricing', description: 'Compare demonstration learning plans. No payments are processed; prices are illustrative.', path: '/plans' });
  const [annual, setAnnual] = useState(false);
  const [inquiry, setInquiry] = useState('');

  return (
    <>
      <PageHero eyebrow="Plans & pricing" title="Choose how you want to learn" intro="Demonstration plans only — no real payments or subscriptions are created anywhere in this template." />
      <Section>
        <div className="billing-toggle" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={!annual} className={!annual ? 'is-on' : ''} onClick={() => setAnnual(false)}>Monthly</button>
          <button type="button" aria-pressed={annual} className={annual ? 'is-on' : ''} onClick={() => setAnnual(true)}>Annual <span className="chip chip--coral">save up to 20%</span></button>
        </div>
        <ul className="plan-grid">
          {plans.map((p) => {
            const price = annual ? p.annualMonthly : p.monthly;
            return (
              <li key={p.id} className={`plan${p.highlighted ? ' is-highlighted' : ''}`} data-plan={p.id}>
                {p.highlighted && <span className="plan__flag">Most popular</span>}
                <h2>{p.name}</h2>
                <p className="plan__aud">{p.audience}</p>
                <p className="plan__price" data-testid={`price-${p.id}`}>
                  {price === 0 ? 'Free' : <>{money(price)}<small>/month</small></>}
                </p>
                <p className="plan__bill">
                  {p.monthly === 0 ? 'Always free (demo)' : annual ? `Billed ${money(p.annualMonthly * 12)} per year · save ${annualSavingPercent(p)}%` : 'Billed monthly (demo)'}
                </p>
                <ul className="plan__features">
                  {p.features.map((f) => <li key={f}><Icon name="check" size={16} /> {f}</li>)}
                </ul>
                <a href="#inquiry" className={`btn ${p.highlighted ? 'btn--primary' : 'btn--ghost'} btn--block`} onClick={() => setInquiry(p.name)}>{p.cta}</a>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="soft">
        <h2 className="section-title">Compare plans</h2>
        {/* Scrollable region must be keyboard-focusable (axe: scrollable-region-focusable). */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Plan comparison table, scrollable">
          <table className="compare">
            <caption className="sr-only">Features included in each plan</caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {plans.map((p) => <th scope="col" key={p.id}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((r) => (
                <tr key={r.key}>
                  <th scope="row">{r.label}</th>
                  {plans.map((p) => (
                    <td key={p.id}>
                      {p.includes.includes(r.key) ? <><Icon name="check" size={18} className="yes" /><span className="sr-only">Included</span></> : <><span aria-hidden="true">—</span><span className="sr-only">Not included</span></>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="inquiry">
        <div className="split">
          <div>
            <p className="eyebrow">Enrollment inquiry</p>
            <h2 className="section-title">Ask about a plan</h2>
            <p className="section-intro">Tell us which plan interests you. In demo mode the form validates your answers but does not send anything.</p>
          </div>
          <ContactForm key={inquiry} topics={plans.map((p) => p.name).concat('Something else')} initialTopic={inquiry} heading="Plan inquiry" idPrefix="pi" />
        </div>
      </Section>

      <Section tone="soft">
        <h2 className="section-title">Pricing questions</h2>
        <FaqList items={planFaqs} />
      </Section>
    </>
  );
}
