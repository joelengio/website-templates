import { useLocation, useNavigate } from 'react-router-dom';
import { toolsPage } from '../config/content';
import { site } from '../config/site';
import { BreakEvenCalculator } from '../components/calculators/BreakEvenCalculator';
import { CompoundCalculator } from '../components/calculators/CompoundCalculator';
import { LoanCalculator } from '../components/calculators/LoanCalculator';
import { Icon } from '../components/Icon';
import { PageHero, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { ConsultCTA } from '../components/ConsultCTA';
import { useSeo } from '../hooks/useSeo';
import type { KeyboardEvent } from 'react';
import type { IconName } from '../config/types';

const tabs: { id: string; label: string; icon: IconName; blurb: string }[] = [
  { id: 'compound', label: 'Savings growth', icon: 'chart', blurb: 'See how a starting amount and regular contributions might grow under an assumed rate.' },
  { id: 'loan', label: 'Loan payment', icon: 'calc', blurb: 'Estimate a level monthly payment and view the amortization schedule.' },
  { id: 'break-even', label: 'Break-even', icon: 'target', blurb: 'Find the sales volume where revenue covers fixed and variable costs.' },
];

export default function Tools() {
  useSeo({ ...toolsPage.seo, path: '/tools' });
  const { hash } = useLocation();
  const navigate = useNavigate();
  const active = tabs.find((t) => `#${t.id}` === hash)?.id ?? 'compound';
  const go = (id: string) => navigate({ hash: id }, { replace: true, preventScrollReset: true });
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault();
    go(tabs[n].id);
    document.getElementById(`tab-${tabs[n].id}`)?.focus();
  };
  const t = toolsPage.hero;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <Section tone="ivory">
        <Notice tone="warn" title="Estimates, not advice">{site.legal.calculatorDisclaimer}</Notice>
        <p className="fine-print">Amounts are shown in {site.currency.code} as a display currency only. No exchange rates are applied, and {site.legal.sensitiveDataNotice.toLowerCase()}</p>
        <div className="tabs" role="tablist" aria-label="Financial calculators">
          {tabs.map((tab, i) => (
            <button key={tab.id} id={`tab-${tab.id}`} role="tab" type="button" aria-selected={active === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={active === tab.id ? 0 : -1} className={`tab${active === tab.id ? ' is-active' : ''}`} onClick={() => go(tab.id)} onKeyDown={(e) => onKey(e, i)}>
              <Icon name={tab.icon} size={18} /> {tab.label}
            </button>
          ))}
        </div>
        {tabs.map((tab) => (
          <div key={tab.id} id={`panel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} hidden={active !== tab.id} className="tabpanel">
            {active === tab.id && (
              <>
                <h2 className="h3">{tab.label} calculator</h2>
                <p className="tabpanel__blurb">{tab.blurb}</p>
                {tab.id === 'compound' && <CompoundCalculator />}
                {tab.id === 'loan' && <LoanCalculator />}
                {tab.id === 'break-even' && <BreakEvenCalculator />}
              </>
            )}
          </div>
        ))}
      </Section>
      <ConsultCTA title="Want to talk the numbers through?" text="Book a demonstration consultation to see how an adviser might use these tools with you." />
    </>
  );
}
