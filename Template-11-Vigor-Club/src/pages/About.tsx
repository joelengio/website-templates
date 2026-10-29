import { Seo } from '../components/Seo';
import { CtaLink, Img, PageHero, Reveal, SectionHead } from '../components/ui';
import { TrainerCard } from '../components/Cards';
import { about } from '../config/about';
import { images } from '../config/images';
import { trainers } from '../config/trainers';
import { facilities } from '../config/facilities';
import { ctas } from '../config/navigation';
import { site } from '../config/site';

export default function About() {
  return (
    <>
      <Seo title="About" description={`The story, mission and values behind ${site.brand.name}, a fictional premium training club used to demonstrate this website template.`} image={images.aboutStory.src} />
      <PageHero eyebrow={about.hero.eyebrow} title={about.hero.title} intro={about.hero.intro} image={images.aboutFloor} />
      <section className="section">
        <div className="container split split--asym">
          <Reveal className="position-media"><Img image={images.aboutStory} sizes="(min-width: 900px) 40vw, 100vw" /></Reveal>
          <Reveal className="position-copy">
            <h2 className="h-display">{about.story.title}</h2>
            {about.story.paragraphs.map((p) => <p key={p} className="lead lead--body">{p}</p>)}
            <dl className="stat-row">
              {about.stats.map((s) => <div key={s.label}><dd>{s.value}</dd><dt>{s.label}</dt></div>)}
            </dl>
          </Reveal>
        </div>
      </section>
      <section className="section section--light">
        <div className="container split">
          <Reveal>
            <p className="eyebrow">Mission</p>
            <h2 className="h-display">{about.mission.title}</h2>
            <p className="lead lead--big">{about.mission.text}</p>
          </Reveal>
          <Reveal>
            <h2 className="h-sub">Values</h2>
            <ul className="values">
              {about.values.map((v, i) => (
                <li key={v.title}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><div><h3>{v.title}</h3><p>{v.text}</p></div></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      <section className="section philosophy">
        <Img image={images.philosophy} className="philosophy-bg" />
        <div className="philosophy-shade" aria-hidden="true" />
        <div className="container philosophy-inner">
          <Reveal>
            <p className="eyebrow">Philosophy</p>
            <h2 className="h-display h-display--xl">{about.philosophy.title}</h2>
          </Reveal>
          <ol className="pillars pillars--list">
            {about.philosophy.points.map((p, i) => <Reveal as="li" key={p}><span className="pillar-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><p>{p}</p></Reveal>)}
          </ol>
        </div>
      </section>
      <section className="section section--charcoal">
        <div className="container">
          <SectionHead eyebrow="Team" title={about.team.title} intro={about.team.text}><CtaLink cta={{ label: 'All trainers', to: '/trainers' }} variant="ghost" /></SectionHead>
          <div className="grid grid--trainers">{trainers.map((t) => <TrainerCard key={t.slug} trainer={t} />)}</div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <Reveal>
            <p className="eyebrow">Community</p>
            <h2 className="h-display">{about.community.title}</h2>
            <p className="lead lead--body">{about.community.text}</p>
          </Reveal>
          <Reveal className="about-img"><Img image={images.aboutCommunity} sizes="(min-width: 900px) 50vw, 100vw" /></Reveal>
        </div>
      </section>
      <section className="section section--charcoal">
        <div className="container">
          <SectionHead eyebrow="Facilities" title={about.facilities.title} intro={about.facilities.text}><CtaLink cta={{ label: 'Tour the facilities', to: '/facilities' }} variant="ghost" /></SectionHead>
          <ul className="chip-list chip-list--big">{facilities.map((f) => <li key={f.slug} className="chip">{f.name}</li>)}</ul>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container center-cta">
          <p className="lead">Template credit: {site.template.creditLabel}. {site.brand.name} itself is fictional.</p>
          <CtaLink cta={ctas.trial} />
        </div>
      </section>
    </>
  );
}
