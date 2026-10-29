import { LinkButton } from '../components/Button';
import Icon from '../components/Icon';
import Img from '../components/Img';
import Section, { PageHero, SectionHeader } from '../components/Section';
import { about } from '../config/about';
import { seoRoutes } from '../config/seo';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';

export default function About() {
  useSeo({ ...seoRoutes['/about'], path: '/about' });
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <PageHero kicker={about.hero.kicker} title={about.hero.title} text={about.hero.text} image={{ src: about.images.story.src, alt: '' }} />
      <Section tone="cream">
        <div className="intro">
          <div className="intro__text">{about.story.map((p) => <p key={p} className="reveal">{p}</p>)}</div>
          <Img src={about.images.story.src} alt={about.images.story.alt} ratio={[4, 3]} className="reveal" />
        </div>
      </Section>
      <Section tone="limestone">
        <SectionHeader kicker="Philosophy" title="How we think about hospitality" />
        <div className="grid grid--3">{about.philosophy.map((p) => <div key={p.title} className="plain-card reveal"><h3>{p.title}</h3><p>{p.text}</p></div>)}</div>
      </Section>
      <Section tone="cream">
        <SectionHeader kicker="Facilities" title="On the property" />
        <ul className="facility-list">{about.facilities.map((f) => <li key={f} className="reveal"><Icon name="check" size={18} /> {f}</li>)}</ul>
      </Section>
      <Section tone="limestone">
        <SectionHeader kicker="The team" title="People you will meet" text="Fictional team members created for the template." />
        <div className="grid grid--4">{about.team.map((m) => <div key={m.name} className="plain-card reveal"><h3>{m.name}</h3><p className="kicker">{m.role}</p><p>{m.bio}</p></div>)}</div>
      </Section>
      <Section tone="olive">
        <div className="intro intro--rev">
          <Img src={about.sustainability.image.src} alt={about.sustainability.image.alt} ratio={[4, 3]} className="reveal" />
          <div className="intro__text">
            <h2 className="display">{about.sustainability.title}</h2>
            <p>{about.sustainability.intro}</p>
            <ul className="checks">{about.sustainability.points.map((p) => <li key={p}><Icon name="leaf" size={18} /> {p}</li>)}</ul>
            <LinkButton to="/contact" variant="light" arrow>Ask us a question</LinkButton>
          </div>
        </div>
      </Section>
    </div>
  );
}
