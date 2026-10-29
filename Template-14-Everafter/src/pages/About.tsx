import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { CtaBand, Ornament, PageHero } from '../components/ui';
import { about, approach, behindTheScenes, img, team, values } from '../config';

const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');

export default function About() {
  return (
    <>
      <Seo title="About the Studio" description="The story, philosophy, team and values behind EVERAFTER, a fictional luxury wedding and event planning studio." image={about.hero.image.src} />
      <PageHero eyebrow={about.hero.eyebrow} title={about.hero.title} lead={about.hero.subtitle} image={about.hero.image} />

      <section className="section" aria-labelledby="story-title">
        <div className="container split">
          <Reveal className="story">
            <h2 className="h-display" id="story-title">{about.story.title}</h2>
            {about.story.body.map((p) => (<p key={p}>{p}</p>))}
          </Reveal>
          <Reveal className="arch arch--tall"><Photo image={about.story.image} sizes="(min-width: 900px) 40vw, 90vw" /></Reveal>
        </div>
      </section>

      <section className="section section--burgundy quote-band" aria-label="Planning philosophy">
        <Reveal className="container container--narrow center">
          <Ornament />
          <blockquote>
            <p>“{about.philosophy.quote}”</p>
            <footer>{about.philosophy.attribution}</footer>
          </blockquote>
        </Reveal>
      </section>

      <section className="section" aria-labelledby="values-title">
        <div className="container">
          <Reveal className="section-head"><div><p className="eyebrow">What guides us</p><h2 className="h-display" id="values-title">Core values</h2></div></Reveal>
          <ul className="values">
            {values.map((v, i) => (<Reveal as="li" key={v.title} delay={i * 70}><span>0{i + 1}</span><h3>{v.title}</h3><p>{v.text}</p></Reveal>))}
          </ul>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="approach-title">
        <div className="container">
          <Reveal className="section-head"><div><p className="eyebrow">How we work</p><h2 className="h-display" id="approach-title">Our approach</h2></div></Reveal>
          <ol className="approach">
            {approach.map((a, i) => (<Reveal as="li" key={a.title} delay={i * 70}><h3>{a.title}</h3><p>{a.text}</p></Reveal>))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="team-title">
        <div className="container">
          <Reveal className="section-head"><div><p className="eyebrow">The team</p><h2 className="h-display" id="team-title">The people behind the plans</h2></div><p className="fineprint fineprint--inline">Fictional team members.</p></Reveal>
          <ul className="team">
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={(i % 3) * 70} className="member">
                <div className="member__mono" aria-hidden="true">{initials(m.name)}</div>
                <h3>{m.name}</h3>
                <p className="member__role">{m.role}</p>
                <p>{m.bio}</p>
                <p className="member__spec"><span>Specialty</span> {m.specialty}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="bts-title">
        <div className="container">
          <Reveal className="section-head"><div><p className="eyebrow">Behind the scenes</p><h2 className="h-display" id="bts-title">Inside the studio</h2></div></Reveal>
          <div className="bts">
            <div className="bts__media"><Photo image={img('florals-lilac')} small /></div>
            <ul>
              {behindTheScenes.map((b) => (<Reveal as="li" key={b.title}><h3>{b.title}</h3><p>{b.text}</p></Reveal>))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Work with us" title="Come and meet the studio" body="Book a relaxed consultation to talk through your plans." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Contact us', to: '/contact' }} />
    </>
  );
}
