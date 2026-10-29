import { about, images, site } from '../config';
import { useSeo } from '../hooks/useSeo';
import { LinkButton } from '../components/Button';
import { PageHero, Section } from '../components/ui';

export default function About() {
  useSeo({ title: 'About', description: about.intro, path: '/about' });
  return (
    <>
      <PageHero eyebrow="About" title={about.title} intro={about.intro} />
      <Section>
        <div className="about-story">
          <div>
            {about.story.map((p) => <p key={p} className="lead">{p}</p>)}
            <p className="fine">{site.disclosure}</p>
          </div>
          <img src={images.about.thumb} srcSet={`${images.about.thumb} 800w, ${images.about.src} 1600w`} sizes="(min-width:900px) 480px, 92vw" width={images.about.width} height={images.about.height} loading="lazy" alt={images.about.alt} />
        </div>
      </Section>
      <Section tone="soft">
        <h2 className="section-title">Educational philosophy</h2>
        <ul className="philosophy">
          {about.philosophy.map((p) => (
            <li key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>
          ))}
        </ul>
      </Section>
      <Section>
        <h2 className="section-title">Our methodology</h2>
        <ol className="method">
          {about.methodology.map((m) => (
            <li key={m.step}><span className="method__n" aria-hidden="true">{m.step}</span><h3>{m.title}</h3><p>{m.text}</p></li>
          ))}
        </ol>
      </Section>
      <Section tone="ink">
        <div className="split">
          <div>
            <p className="eyebrow eyebrow--light">Mission</p>
            <h2 className="section-title">{about.mission}</h2>
          </div>
          <div>
            <h3 className="h4">Team (fictional)</h3>
            <ul className="team">
              {about.team.map((t) => (
                <li key={t.name}><span className="team__avatar" aria-hidden="true">{t.name.split(' ').map((s) => s[0]).join('')}</span><span><strong>{t.name}</strong><br />{t.role}</span></li>
              ))}
            </ul>
            <LinkButton to="/contact" variant="light">Get in touch</LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
