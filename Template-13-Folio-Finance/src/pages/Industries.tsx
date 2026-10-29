import { industries } from '../config/industries';
import { IndustryCard } from '../components/Cards';
import { ConsultCTA } from '../components/ConsultCTA';
import { PageHero, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { useSeo } from '../hooks/useSeo';

export default function Industries() {
  useSeo({ title: 'Who we serve', description: 'Industry and client-segment guidance for startups, SMEs, professional services, retail, technology, property and established enterprises.', path: '/industries' });
  return (
    <>
      <PageHero eyebrow="Who we serve" title="Different businesses ask different questions." lead="Explore typical needs and the services most relevant to each segment. All scenarios are illustrative demonstration content." />
      <Section tone="ivory" srTitle="Client segments">
        <div className="grid grid--3">{industries.map((i) => <IndustryCard key={i.slug} industry={i} />)}</div>
        <Notice title="Demonstration content">Needs, challenges and outcomes are generic examples written for the template, not claims about real results.</Notice>
      </Section>
      <ConsultCTA />
    </>
  );
}
