import { aboutContent as a } from '../config/about';
import { staff } from '../config/staff';
import { treatmentCategories } from '../config/treatments';
import { homeContent } from '../config/home';
import { site } from '../config/site';
import { ctas } from '../config/navigation';
import { Seo } from '../components/Seo';
import { Img, LinkButton, Reveal, SectionHeading } from '../components/ui';

export default function About() {
  return (
    <>
      <Seo title={site.pages.about.title} description={site.pages.about.description} image={a.story.image.src} />
      <section className="page-hero"><div className="container"><SectionHeading as="h1" eyebrow={a.hero.eyebrow} title={a.hero.title} text={a.hero.text} /></div></section>

      <section className="section section--tight">
        <div className="container split">
          <Reveal><div className="arch-frame arch-frame--tall"><Img image={a.story.image} sizes="(min-width: 900px) 40vw, 90vw" /></div></Reveal>
          <Reveal delay={100}>
            <SectionHeading eyebrow={a.story.eyebrow} title={a.story.title} />
            {a.story.paragraphs.map((p) => <p key={p} className="body-lg">{p}</p>)}
          </Reveal>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="about-phil">
        <div className="container">
          <SectionHeading eyebrow={a.philosophy.eyebrow} title={<span id="about-phil">{a.philosophy.title}</span>} text={a.philosophy.text} />
          <div className="grid grid-3 pillars-light">
            {homeContent.philosophy.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}><div className="pillar pillar--light"><span className="pillar-num">0{i + 1}</span><h3>{p.title}</h3><p>{p.text}</p></div></Reveal>
            ))}
          </div>
          <p className="fine">Our menu spans {treatmentCategories.map((c) => c.name.toLowerCase()).join(', ')}.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="about-team">
        <div className="container">
          <SectionHeading eyebrow={a.team.eyebrow} title={<span id="about-team">{a.team.title}</span>} align="center" />
          <ul className="grid grid-3 team">
            {staff.map((m, i) => (
              <li key={m.id}>
                <Reveal delay={(i % 3) * 90}>
                  <article className="team-card">
                    <div className="team-photo"><Img image={m.image} alt={`Illustrated portrait of ${m.name}`} sizes="(min-width: 900px) 30vw, 90vw" /></div>
                    <h3>{m.name}</h3>
                    <p className="eyebrow">{m.role}</p>
                    <p>{m.bio}</p>
                    <p className="fine">Speaks: {m.languages.join(', ')}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="demo-label">Team members and portraits are fictional demonstration content.</p>
        </div>
      </section>

      <section className="facilities" aria-labelledby="about-fac">
        <div className="facilities-bg"><Img image={a.facilities.image} sizes="100vw" /></div>
        <div className="container">
          <SectionHeading eyebrow={a.facilities.eyebrow} title={<span id="about-fac">{a.facilities.title}</span>} light />
          <div className="grid grid-2 facility-grid">
            {a.facilities.items.map((f) => <div key={f.title} className="facility"><h3>{f.title}</h3><p>{f.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="about-values">
        <div className="container">
          <SectionHeading eyebrow={a.values.eyebrow} title={<span id="about-values">{a.values.title}</span>} />
          <blockquote className="mission">{a.values.mission}</blockquote>
          <div className="grid grid-4">
            {a.values.items.map((v) => <div key={v.title} className="value"><h3>{v.title}</h3><p>{v.text}</p></div>)}
          </div>
          <div className="btn-row"><LinkButton to={ctas.book.to}>{ctas.book.label}</LinkButton></div>
        </div>
      </section>
    </>
  );
}
