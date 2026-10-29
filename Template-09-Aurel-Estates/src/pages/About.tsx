import { content, ctas, pages, sections } from '../config';
import { resolveSections } from '../lib/sections';
import { useSeo } from '../hooks/useSeo';
import { LinkButton } from '../components/Button';
import { PageHero, Reveal, SectionHeading } from '../components/Section';

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

function Intro() {
  const c = content.about.intro;
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} />
      <section className="section section--flush">
        <div className="container split">
          <Reveal className="split__text">
            {c.body.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </Reveal>
          <Reveal className="split__media">
            <img src={c.image.src} alt={c.image.alt} width={1200} height={800} loading="lazy" />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Values() {
  const c = content.about.values;
  return (
    <section className="section section--tint" aria-labelledby="values-title">
      <div className="container">
        <SectionHeading id="values-title" title={c.title} />
        <ul className="feature-grid feature-grid--4">
          {c.items.map((v) => (
            <li key={v.title}>
              <Reveal className="feature feature--plain">
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Team() {
  const c = content.about.team;
  return (
    <section className="section" id="team" aria-labelledby="team-title">
      <div className="container">
        <SectionHeading id="team-title" title={c.title} lead={c.lead} />
        <ul className="team-grid">
          {c.members.map((m) => (
            <li key={m.name}>
              <Reveal className="member">
                <span className="member__avatar" aria-hidden="true">
                  {initials(m.name)}
                </span>
                <h3>{m.name}</h3>
                <p className="member__role">{m.role}</p>
                <p>{m.bio}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Cta() {
  const c = content.about.cta;
  return (
    <section className="cta">
      <div className="container cta__inner">
        <div>
          <h2>{c.title}</h2>
          <p>{c.body}</p>
        </div>
        <div className="cta__actions">
          {pages.contact && (
            <LinkButton to={ctas.secondary.to} variant="brass">
              {ctas.secondary.label}
            </LinkButton>
          )}
        </div>
      </div>
    </section>
  );
}

const registry = { intro: Intro, values: Values, team: Team, cta: Cta };

export default function About() {
  useSeo({ title: 'About & Team', description: content.about.intro.body[0], path: '/about' });
  const ids = resolveSections(sections.about, Object.keys(registry));
  return (
    <>
      {!ids.includes('intro') && (
        <h1 className="sr-only" tabIndex={-1} data-page-heading>
          About
        </h1>
      )}
      {ids.map((id) => {
        const S = registry[id as keyof typeof registry];
        return <S key={id} />;
      })}
    </>
  );
}
