import { Link, useParams } from 'react-router-dom';
import { industries } from '../config/industries';
import { services } from '../config/services';
import { ServiceCard } from '../components/Cards';
import { ConsultCTA } from '../components/ConsultCTA';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { LinkButton } from '../components/Button';
import { Breadcrumb, Section } from '../components/Section';
import { useSeo } from '../hooks/useSeo';
import NotFound from './NotFound';

export default function IndustryDetail() {
  const { slug } = useParams();
  const industry = industries.find((i) => i.slug === slug);
  useSeo({ title: industry ? `${industry.name} advisory` : undefined, description: industry?.summary, path: `/industries/${slug}` });
  if (!industry) return <NotFound />;
  const rel = industry.services.map((s) => services.find((x) => x.slug === s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const others = industries.filter((i) => i.slug !== industry.slug).slice(0, 4);
  return (
    <>
      <header className="detail-hero">
        <div className="container detail-hero__grid">
          <div>
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Who we serve', to: '/industries' }, { label: industry.name }]} />
            <span className="detail-hero__icon"><Icon name={industry.icon} size={30} /></span>
            <h1>{industry.name}</h1>
            <p className="detail-hero__lead">{industry.intro}</p>
            <div className="detail-hero__actions">
              <LinkButton to="/book" variant="primary" arrow>Book a consultation</LinkButton>
              <LinkButton to={`/contact?category=${encodeURIComponent('General enquiry')}`} variant="secondary">Send an enquiry</LinkButton>
            </div>
          </div>
          <div className="detail-hero__media"><Img image={industry.image} priority sizes="(max-width: 900px) 100vw, 45vw" /></div>
        </div>
      </header>
      <Section tone="ivory">
        <div className="three-col">
          <div><h2 className="h3">Typical needs</h2><ul className="checklist">{industry.needs.map((n) => <li key={n}><Icon name="check" size={18} /> {n}</li>)}</ul></div>
          <div><h2 className="h3">Common challenges</h2><ul className="dot-list">{industry.challenges.map((n) => <li key={n}>{n}</li>)}</ul></div>
          <div><h2 className="h3">Example outcomes</h2><ul className="dot-list">{industry.outcomes.map((n) => <li key={n}>{n}</li>)}</ul></div>
        </div>
        <aside className="scenario"><p className="eyebrow">{industry.scenario.title}</p><p>{industry.scenario.text}</p></aside>
      </Section>
      <Section eyebrow="Relevant services" title={`Services for ${industry.name.toLowerCase()}`} tone="stone">
        <div className="grid grid--3">{rel.map((s) => <ServiceCard key={s.slug} service={s} />)}</div>
      </Section>
      <Section title="Other segments" tone="ivory">
        <ul className="pill-links">{others.map((i) => <li key={i.slug}><Link to={`/industries/${i.slug}`}>{i.name}</Link></li>)}</ul>
      </Section>
      <ConsultCTA />
    </>
  );
}
