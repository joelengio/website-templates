import { Link, useParams } from 'react-router-dom';
import { services } from '../config/services';
import { team, teamDisclosure } from '../config/team';
import { ConsultCTA } from '../components/ConsultCTA';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { LinkButton } from '../components/Button';
import { Breadcrumb, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { useSeo } from '../hooks/useSeo';
import NotFound from './NotFound';

export default function TeamDetail() {
  const { slug } = useParams();
  const member = team.find((m) => m.slug === slug);
  useSeo({ title: member ? `${member.name} — ${member.role}` : undefined, description: member?.summary, path: `/team/${slug}` });
  if (!member) return <NotFound />;
  const mine = member.services.map((s) => services.find((x) => x.slug === s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const others = team.filter((m) => m.slug !== member.slug);
  return (
    <>
      <header className="detail-hero detail-hero--profile">
        <div className="container detail-hero__grid">
          <div>
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Team', to: '/team' }, { label: member.name }]} />
            <p className="eyebrow">{member.role}</p>
            <h1>{member.name}</h1>
            <p className="detail-hero__lead">{member.summary}</p>
            <p className="tag-demo">Fictional person — demonstration profile</p>
            <div className="detail-hero__actions">
              <LinkButton to={`/book?service=${member.services[0] ?? ''}`} variant="primary" arrow>Book a consultation</LinkButton>
              <LinkButton to="/contact" variant="secondary">Send an enquiry</LinkButton>
            </div>
          </div>
          <div className="detail-hero__portrait"><Img image={member.image} priority sizes="(max-width: 900px) 70vw, 380px" /></div>
        </div>
      </header>
      <Section tone="ivory">
        <div className="detail-layout">
          <div className="detail-main">
            <h2 className="h3">Biography</h2>
            {member.bio.map((p) => <p key={p}>{p}</p>)}
            <h2 className="h3">Focus areas</h2>
            <ul className="pill-links pill-links--static">{member.focus.map((f) => <li key={f}><span>{f}</span></li>)}</ul>
          </div>
          <aside className="detail-side" aria-label="Profile facts">
            <div className="price-box">
              <p className="eyebrow">Specialization</p>
              <p className="price-box__price price-box__price--sm">{member.specialization}</p>
              <p className="eyebrow">Demonstration credentials</p>
              <ul className="dot-list">{member.credentials.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </aside>
        </div>
        <Notice title="Fictional identity">{teamDisclosure}</Notice>
      </Section>
      <Section eyebrow="Associated services" title={`Where ${member.name.split(' ')[0]} helps`} tone="stone">
        <ul className="link-list">
          {mine.map((s) => (
            <li key={s.slug}><Link to={`/services/${s.slug}`}><Icon name={s.icon} size={20} /><span><strong>{s.name}</strong><em>{s.summary}</em></span><Icon name="arrow" size={16} /></Link></li>
          ))}
        </ul>
      </Section>
      <Section title="More of the team" tone="ivory">
        <ul className="pill-links">{others.map((m) => <li key={m.slug}><Link to={`/team/${m.slug}`}>{m.name}</Link></li>)}</ul>
      </Section>
      <ConsultCTA service={member.services[0]} />
    </>
  );
}
