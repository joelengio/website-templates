import { aboutPage, home } from '../config/content';
import { team } from '../config/team';
import { ConsultCTA } from '../components/ConsultCTA';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { LinkButton } from '../components/Button';
import { TeamCard } from '../components/Cards';
import { Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { site } from '../config/site';
import { useSeo } from '../hooks/useSeo';
import { ProcessSteps } from './Home';

export default function About() {
  useSeo({ ...aboutPage.seo, path: '/about' });
  const a = aboutPage;
  return (
    <>
      <header className="detail-hero">
        <div className="container detail-hero__grid">
          <div>
            <p className="eyebrow">{a.hero.eyebrow}</p>
            <h1>{a.hero.title}</h1>
            <p className="detail-hero__lead">{a.hero.lead}</p>
            <div className="detail-hero__actions">
              <LinkButton to="/book" variant="primary" arrow>Book a consultation</LinkButton>
              <LinkButton to="/team" variant="secondary">Meet the team</LinkButton>
            </div>
          </div>
          <div className="detail-hero__media"><Img image={a.hero.image} priority sizes="(max-width: 900px) 100vw, 45vw" /></div>
        </div>
      </header>
      <Section eyebrow="Our story" title="How the firm “began”" tone="ivory">
        <div className="prose prose--wide">{a.story.map((p) => <p key={p}>{p}</p>)}</div>
        <Notice title="Fictional history">{site.legal.demoNotice}</Notice>
      </Section>
      <Section eyebrow="Philosophy" title={a.philosophy.title} tone="navy">
        <p className="statement">{a.philosophy.text}</p>
      </Section>
      <Section eyebrow="Core values" title="What we hold ourselves to" tone="ivory">
        <div className="grid grid--4">{a.values.map((v) => <div key={v.title} className="why-item"><Icon name={v.icon} size={26} /><h3>{v.title}</h3><p>{v.text}</p></div>)}</div>
      </Section>
      <Section eyebrow="Operating approach" title="How we work" tone="stone">
        <div className="split">
          <div className="split__media"><Img image={a.image2} /></div>
          <div className="split__copy">
            <dl className="def-list">{a.approach.map((x) => <div key={x.title}><dt>{x.title}</dt><dd>{x.text}</dd></div>)}</dl>
          </div>
        </div>
      </Section>
      <Section eyebrow="Client experience" title="What working together feels like" tone="ivory">
        <div className="grid grid--3">{a.experience.map((x) => <div key={x.title} className="card card--plain"><h3 className="card__title">{x.title}</h3><p>{x.text}</p></div>)}</div>
      </Section>
      <Section eyebrow={a.processTitle} title="From first call to ongoing review" tone="stone"><ProcessSteps steps={home.process.steps} /></Section>
      <Section eyebrow="Team" title="The people (fictional)" tone="ivory" action={<LinkButton to="/team" variant="secondary" arrow>All profiles</LinkButton>}>
        <div className="grid grid--3">{team.slice(0, 3).map((m) => <TeamCard key={m.slug} member={m} />)}</div>
      </Section>
      <Section tone="stone"><Notice tone="warn" title="Credentials and awards">{site.legal.regulatoryNote} No awards, licences or certifications are claimed anywhere on this template.</Notice></Section>
      <ConsultCTA />
    </>
  );
}
