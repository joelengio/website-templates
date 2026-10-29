import { team, teamDisclosure } from '../config/team';
import { TeamCard } from '../components/Cards';
import { ConsultCTA } from '../components/ConsultCTA';
import { PageHero, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { useSeo } from '../hooks/useSeo';

export default function Team() {
  useSeo({ title: 'Our team', description: 'Meet the fictional advisers of Folio Finance — a demonstration team showing individual profiles, specializations and associated services.', path: '/team' });
  return (
    <>
      <PageHero eyebrow="Our team" title="Specialists who work as one team." lead="Six fictional advisers with distinct specializations. Open a profile to see their focus, demonstration credentials and services." />
      <Section tone="ivory" srTitle="Advisers">
        <Notice title="Fictional people">{teamDisclosure}</Notice>
        <div className="grid grid--3 team-grid">{team.map((m) => <TeamCard key={m.slug} member={m} />)}</div>
      </Section>
      <ConsultCTA />
    </>
  );
}
