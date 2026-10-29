import { useMemo, useState } from 'react';
import { addOns, planFeatures, plans, pricing, pricingFaqs } from '../config/plans';
import { site } from '../config/site';
import { ConsultCTA } from '../components/ConsultCTA';
import { Icon } from '../components/Icon';
import { LinkButton } from '../components/Button';
import { PageHero, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { useSeo } from '../hooks/useSeo';
import { discountFor, quotePlan, type BillingCycle } from '../lib/pricing';
import { formatCurrency } from '../lib/format';

export default function Pricing() {
  useSeo({ title: 'Engagement plans & pricing', description: 'Compare three demonstration advisory engagement plans with monthly and annual pricing, optional add-ons and an FAQ. All prices are demonstration values.', path: '/pricing' });
  const [cycle, setCycle] = useState<BillingCycle>(pricing.defaultCycle);
  const [selected, setSelected] = useState<string[]>([]);
  const toggleAddOn = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const quotes = useMemo(() => plans.map((p) => quotePlan(p, cycle, selected, addOns)), [cycle, selected]);
  const maxDiscount = Math.max(...plans.map((p) => discountFor(p)));
  const enquiryLink = (planId: string) => {
    const q = new URLSearchParams({ category: 'Plan / pricing question', plan: planId, cycle });
    if (selected.length) q.set('addons', selected.join(','));
    return `/contact?${q.toString()}`;
  };
  const groups = [...new Set(planFeatures.map((f) => f.group))];

  return (
    <>
      <PageHero eyebrow="Pricing" title={pricing.heading} lead={pricing.intro} />
      <Section tone="ivory">
        <Notice tone="warn" title="Demonstration prices">{site.legal.pricingDisclaimer}</Notice>

        <div className="billing" role="group" aria-label="Billing period">
          <button type="button" className={`billing__opt${cycle === 'monthly' ? ' is-active' : ''}`} aria-pressed={cycle === 'monthly'} onClick={() => setCycle('monthly')}>Monthly</button>
          <button type="button" className={`billing__opt${cycle === 'annual' ? ' is-active' : ''}`} aria-pressed={cycle === 'annual'} onClick={() => setCycle('annual')}>Annual <span className="billing__save">save up to {maxDiscount}%</span></button>
        </div>

        <div className="plans" data-cycle={cycle}>
          {plans.map((plan, i) => {
            const q = quotes[i];
            return (
              <article key={plan.id} className={`plan${plan.highlight ? ' plan--highlight' : ''}`} aria-labelledby={`plan-${plan.id}`} data-plan={plan.id}>
                {plan.highlight && <p className="plan__badge">Most popular (demo)</p>}
                <h2 id={`plan-${plan.id}`} className="plan__name">{plan.name}</h2>
                <p className="plan__tagline">{plan.tagline}</p>
                <p className="plan__price" aria-live="polite">
                  <span className="plan__amount" data-testid={`price-${plan.id}`}>{formatCurrency(q.periodTotal, { cents: q.periodTotal % 1 !== 0 })}</span>
                  <span className="plan__per"> / {q.periodLabel}</span>
                </p>
                <p className="plan__sub">
                  {cycle === 'annual' ? (
                    <>≈ {formatCurrency(q.effectiveMonthly, { cents: true })} per month · save {formatCurrency(q.annualSaving)} ({q.discountPercent}% off)</>
                  ) : (
                    <>Billed monthly · switch to annual to save {discountFor(plan)}%</>
                  )}
                </p>
                {selected.length > 0 && <p className="plan__addons">Includes {selected.length} add-on{selected.length > 1 ? 's' : ''} ({formatCurrency(q.addOnsPeriod, { cents: q.addOnsPeriod % 1 !== 0 })} / {q.periodLabel})</p>}
                <p className="plan__ideal"><strong>Ideal for:</strong> {plan.idealFor}</p>
                <ul className="checklist">{plan.includes.map((x) => <li key={x}><Icon name="check" size={17} /> {x}</li>)}</ul>
                <LinkButton to={enquiryLink(plan.id)} variant={plan.highlight ? 'primary' : 'secondary'} arrow className="btn--block">{plan.cta}</LinkButton>
                <p className="plan__fine">Demonstration price · enquiry only, nothing is purchased</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="addons" eyebrow="Optional add-ons" title="Tailor a plan" lead="Tick add-ons to see the totals above update. Annual billing applies the same discount to add-ons." tone="stone">
        <fieldset className="addons">
          <legend className="sr-only">Optional add-ons</legend>
          {addOns.map((a) => {
            const checked = selected.includes(a.id);
            const monthly = a.monthly;
            return (
              <label key={a.id} className={`addon${checked ? ' is-checked' : ''}`}>
                <input type="checkbox" checked={checked} onChange={() => toggleAddOn(a.id)} />
                <span className="addon__body">
                  <strong>{a.name}</strong>
                  <span>{a.description}</span>
                </span>
                <span className="addon__price">{formatCurrency(monthly)} <small>/ month</small></span>
              </label>
            );
          })}
        </fieldset>
        <p className="fine-print">Add-on prices are shown at the monthly rate. {selected.length === 0 && 'No add-ons selected.'}</p>
      </Section>

      <Section id="compare" eyebrow="Compare" title="What each plan includes" tone="ivory">
        <div className="table-scroll compare" role="region" aria-label="Plan comparison table (scrolls horizontally on small screens)" tabIndex={0}>
          <table>
            <caption className="sr-only">Comparison of engagement plans</caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {plans.map((p, i) => (
                  <th scope="col" key={p.id}>
                    {p.name}
                    <span className="compare__price">{formatCurrency(quotes[i].effectiveMonthly)}<small>/mo{cycle === 'annual' ? ' (annual)' : ''}</small></span>
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((g) => (
              <tbody key={g}>
                <tr className="compare__group"><th scope="rowgroup" colSpan={plans.length + 1}>{g}</th></tr>
                {planFeatures.filter((f) => f.group === g).map((f) => (
                  <tr key={f.id}>
                    <th scope="row">{f.label}</th>
                    {f.values.map((v, i) => (
                      <td key={plans[i].id}>
                        {v === true ? <><Icon name="check" size={18} label="Included" /></> : v === false ? <><span aria-hidden="true">—</span><span className="sr-only">Not included</span></> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Questions about plans" tone="stone">
        <div className="faq">{pricingFaqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
      </Section>
      <ConsultCTA title="Not sure which plan fits?" text="Book a demonstration introductory call or send an enquiry. Neither option purchases anything." />
    </>
  );
}
