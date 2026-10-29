import { ButtonLink } from '../components/Button';
import { Img } from '../components/Img';
import { PageHero, Section, SectionHeading } from '../components/Section';
import { chefs, storyContent as s, team } from '../config/content';
import { useSeo } from '../hooks/useSeo';
import { pageSeo } from '../lib/seo';

export default function Story() {
  useSeo({ ...pageSeo('/our-story'), path: '/our-story' });
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} image="long-tables" />
      <Section labelledBy="origin-title">
        <div className="split">
          <div>
            <SectionHeading id="origin-title" title={s.origin.title} />
            {s.origin.paragraphs.map((p) => <p key={p} className="prose">{p}</p>)}
          </div>
          <div className="split__media"><Img name={s.origin.image} className="frame frame--wide" sizes="(min-width: 900px) 45vw, 100vw" /></div>
        </div>
      </Section>
      <Section tone="soft" labelledBy="phil-title">
        <SectionHeading id="phil-title" title={s.philosophy.title} />
        <ul className="points points--grid">
          {s.philosophy.items.map((p) => <li key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>)}
        </ul>
      </Section>
      <Section labelledBy="room-title">
        <SectionHeading id="room-title" title={s.atmosphere.title} lead={s.atmosphere.text} />
        <ul className="trio">
          {s.atmosphere.images.map((k) => <li key={k}><Img name={k} sizes="(min-width: 900px) 30vw, 100vw" /></li>)}
        </ul>
      </Section>
      <Section tone="light" labelledBy="chefs-title">
        <SectionHeading id="chefs-title" eyebrow="The kitchen" title="Chefs & makers" lead="Fictional demonstration profiles. Replace with your real team." />
        <ul className="chef-grid">
          {chefs.map((c) => (
            <li key={c.id} className="chef">
              {c.image ? <Img name={c.image} sizes="(min-width: 900px) 25vw, 100vw" className="chef__img" /> : <div className="chef__mono" aria-hidden="true">{c.name.split(' ').map((n) => n[0]).join('')}</div>}
              <h3>{c.name}</h3>
              <p className="chef__role">{c.role}</p>
              <p>{c.bio}</p>
              <p className="chef__sig">Signature: {c.signature}</p>
            </li>
          ))}
        </ul>
        <h3 className="h3 team-title">The wider team</h3>
        <ul className="team">
          {team.map((t) => <li key={t.name}><strong>{t.name}</strong><span>{t.role}</span></li>)}
        </ul>
      </Section>
      <Section tone="soft" labelledBy="approach-title">
        <div className="split">
          <div>
            <SectionHeading id="approach-title" title={s.approach.title} />
            <ul className="ticks ticks--large">{s.approach.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
          <div className="story-cta">
            <p className="prose">Come and see for yourself.</p>
            <ButtonLink to="/reserve" icon="arrow" size="lg">Reserve a table</ButtonLink>
            <ButtonLink to="/experiences" variant="ghost">Explore experiences</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
