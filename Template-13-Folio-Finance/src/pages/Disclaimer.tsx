import { site } from '../config/site';
import { PageHero, Section } from '../components/Section';
import { useSeo } from '../hooks/useSeo';

export default function Disclaimer() {
  useSeo({ title: 'Disclaimers', description: 'Important notices about this demonstration site: not financial advice, demo content, calculators, bookings, contact form and pricing.', path: '/disclaimer' });
  const l = site.legal;
  const items: [string, string][] = [
    ['Demonstration brand', l.demoNotice],
    ['Not financial advice', l.generalDisclaimer],
    ['Calculators', l.calculatorDisclaimer],
    ['Pricing', l.pricingDisclaimer],
    ['Booking', l.bookingDisclaimer],
    ['Contact form', l.contactDisclaimer],
    ['Sensitive information', l.sensitiveDataNotice],
    ['Regulatory status', l.regulatoryNote],
  ];
  return (
    <>
      <PageHero eyebrow="Legal" title="Disclaimers & notices" lead="This page collects every important notice for the template. Replace these with counsel-reviewed text before going live." />
      <Section tone="ivory">
        <div className="prose prose--wide">
          {items.map(([h, t]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{t}</p>
            </section>
          ))}
          <section>
            <h2>Template ownership</h2>
            <p>This website template is created and owned by {site.owner.name} ({site.owner.templateName}). Folio Finance is a separate, fictional business used only to demonstrate the template.</p>
          </section>
        </div>
      </Section>
    </>
  );
}
