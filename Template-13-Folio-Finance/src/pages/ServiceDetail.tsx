import { Link, useParams } from 'react-router-dom';
import { industries } from '../config/industries';
import { services } from '../config/services';
import { team } from '../config/team';
import { describePricing, TeamCard } from '../components/Cards';
import { ConsultCTA } from '../components/ConsultCTA';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { LinkButton } from '../components/Button';
import { Breadcrumb, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { useSeo } from '../hooks/useSeo';
import { site } from '../config/site';
import { pages } from '../config/layout';
import NotFound from './NotFound';
import { ProcessSteps } from './Home';

export default function ServiceDetail() {
  const { slug } = useParams();
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];
  useSeo({ title: service?.name, description: service?.summary, path: `/services/${slug}`, image: service ? undefined : undefined });
  if (!service) return <NotFound />;
  const prev = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];
  const people = team.filter((m) => m.services.includes(service.slug));
  const relatedIndustries = industries.filter((i) => i.services.includes(service.slug));

  return (
    <>
      <header className="detail-hero">
        <div className="container detail-hero__grid">
          <div>
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.name }]} />
            <span className="detail-hero__icon"><Icon name={service.icon} size={30} /></span>
            <h1>{service.name}</h1>
            <p className="detail-hero__lead">{service.summary}</p>
            <div className="detail-hero__actions">
              <LinkButton to={`/book?service=${service.slug}`} variant="primary" arrow>Book a consultation</LinkButton>
              <LinkButton to={`/contact?category=${encodeURIComponent(service.name)}`} variant="secondary">Ask a question</LinkButton>
            </div>
          </div>
          <div className="detail-hero__media"><Img image={service.image} priority sizes="(max-width: 900px) 100vw, 45vw" /></div>
        </div>
      </header>

      <Section tone="ivory">
        <div className="detail-layout">
          <div className="detail-main">
            <h2 className="h3">Overview</h2>
            {service.description.map((p) => <p key={p}>{p}</p>)}
            <h2 className="h3">What you receive</h2>
            <ul className="checklist">{service.deliverables.map((d) => <li key={d}><Icon name="check" size={18} /> {d}</li>)}</ul>
            <div className="two-col">
              <div>
                <h2 className="h3">Ideal client</h2>
                <ul className="dot-list">{service.idealClient.map((d) => <li key={d}>{d}</li>)}</ul>
              </div>
              <div>
                <h2 className="h3">Benefits</h2>
                <ul className="dot-list">{service.benefits.map((d) => <li key={d}>{d}</li>)}</ul>
              </div>
            </div>
          </div>
          <aside className="detail-side" aria-label="Pricing and booking">
            <div className="price-box">
              <p className="eyebrow">Pricing model: {service.pricing.model}</p>
              <p className="price-box__price">{describePricing(service.pricing)}</p>
              <p>{service.pricing.note}</p>
              <p className="tag-demo">Demonstration pricing</p>
              <LinkButton to={`/book?service=${service.slug}`} variant="primary" arrow className="btn--block">Book a consultation</LinkButton>
              {pages.pricing && <Link to="/pricing" className="text-link">Compare engagement plans</Link>}
            </div>
          </aside>
        </div>
      </Section>

      <Section eyebrow="How it works" title="Our process" tone="stone">
        <ProcessSteps steps={service.process} />
      </Section>

      {service.faqs && service.faqs.length > 0 && (
        <Section title="Common questions" tone="ivory">
          <div className="faq">{service.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
        </Section>
      )}

      {people.length > 0 && pages.team && (
        <Section eyebrow="Your advisers" title={`People who lead ${service.name.toLowerCase()}`} tone="ivory">
          <div className="grid grid--3">{people.map((m) => <TeamCard key={m.slug} member={m} />)}</div>
          <p className="fine-print">Fictional team members for demonstration.</p>
        </Section>
      )}

      {relatedIndustries.length > 0 && pages.industries && (
        <Section title="Often used by" tone="stone">
          <ul className="pill-links">
            {relatedIndustries.map((i) => <li key={i.slug}><Link to={`/industries/${i.slug}`}>{i.name}</Link></li>)}
          </ul>
        </Section>
      )}

      <Section tone="ivory">
        <Notice title="Not advice">{site.legal.generalDisclaimer}</Notice>
        <nav className="pager" aria-label="More services">
          <Link to={`/services/${prev.slug}`}><span>Previous</span>{prev.name}</Link>
          <Link to={`/services/${next.slug}`}><span>Next</span>{next.name}</Link>
        </nav>
      </Section>
      <ConsultCTA service={service.slug} />
    </>
  );
}
