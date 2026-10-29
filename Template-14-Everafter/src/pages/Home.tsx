import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard, DestinationCard, ServiceCard, WeddingCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { Button, CtaBand, Ornament, SectionHead } from '../components/ui';
import { articles, cta, destinations, experiences, hero, homeCounts, homeSections, intro, philosophy, planningProcess, services, site, testimonials, weddings, type HomeSectionId } from '../config';

const sectionRenderers: Record<HomeSectionId, () => React.ReactNode> = {
  intro: () => (
    <section className="section intro" aria-labelledby="intro-title">
      <div className="container intro__grid">
        <Reveal className="intro__media">
          <div className="arch"><Photo image={intro.image} sizes="(min-width: 900px) 40vw, 80vw" /></div>
          <div className="intro__media2"><Photo image={intro.imageSecondary} small /></div>
        </Reveal>
        <Reveal className="intro__text">
          <p className="eyebrow">{intro.eyebrow}</p>
          <h2 className="h-display" id="intro-title">{intro.title}</h2>
          {intro.body.map((p) => (<p key={p}>{p}</p>))}
          <Link to={intro.cta.to} className="link-arrow">{intro.cta.label} <Icon name="arrow" size={18} /></Link>
        </Reveal>
      </div>
    </section>
  ),
  featured: () => (
    <section className="section section--cream" aria-labelledby="featured-title">
      <div className="container">
        <SectionHead id="featured-title" eyebrow="Featured weddings" title="Recent celebrations" lead="A selection from our fictional portfolio — each one designed around the people and the place." cta={{ label: 'All weddings', to: '/weddings' }} />
        <div className="grid grid--featured">
          {weddings.slice(0, homeCounts.featured).map((w, i) => (
            <Reveal key={w.slug} delay={i * 80}><WeddingCard w={w} tall={i === 0} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  ),
  philosophy: () => (
    <section className="section philosophy" aria-labelledby="philosophy-title">
      <div className="philosophy__bg" aria-hidden="true"><Photo image={philosophy.image} /></div>
      <div className="container philosophy__inner">
        <Reveal>
          <p className="eyebrow eyebrow--light">{philosophy.eyebrow}</p>
          <h2 className="h-display" id="philosophy-title">{philosophy.title}</h2>
        </Reveal>
        <ol className="pillars">
          {philosophy.pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80}>
              <span className="pillars__n">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  ),
  services: () => (
    <section className="section" aria-labelledby="services-title">
      <div className="container">
        <SectionHead id="services-title" eyebrow="Planning services" title="Support, shaped to you" lead="From complete planning to a calm team on the day itself." cta={{ label: 'All services', to: '/services' }} />
        <div className="grid grid--services">
          {services.slice(0, 4).map((s, i) => (<Reveal key={s.slug} delay={i * 80}><ServiceCard s={s} /></Reveal>))}
        </div>
      </div>
    </section>
  ),
  destinations: () => (
    <section className="section section--cream" aria-labelledby="dest-title">
      <div className="container">
        <SectionHead id="dest-title" eyebrow="Wedding destinations" title="Places we love to celebrate" lead="Demonstration destinations with local partners and illustrative photography." cta={{ label: 'All destinations', to: '/destinations' }} />
        <div className="grid grid--destinations">
          {destinations.slice(0, homeCounts.destinations).map((d, i) => (<Reveal key={d.slug} delay={(i % 3) * 80}><DestinationCard d={d} /></Reveal>))}
        </div>
      </div>
    </section>
  ),
  experiences: () => (
    <section className="section" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead id="exp-title" eyebrow={experiences.eyebrow} title={experiences.title} align="center" />
        <div className="experiences">
          {experiences.items.map((x, i) => (
            <Reveal key={x.title} className={`experience${i % 2 ? ' experience--flip' : ''}`}>
              <div className="experience__media"><Photo image={x.image} sizes="(min-width: 900px) 50vw, 100vw" /></div>
              <div className="experience__text">
                <span className="experience__n">0{i + 1}</span>
                <h3 className="h-display">{x.title}</h3>
                <p>{x.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  ),
  process: () => (
    <section className="section section--burgundy" aria-labelledby="process-title">
      <div className="container">
        <SectionHead id="process-title" eyebrow={planningProcess.eyebrow} title={planningProcess.title} align="center" />
        <ol className="steps">
          {planningProcess.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 70}>
              <span className="steps__n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  ),
  testimonials: () => (
    <section className="section" aria-labelledby="t-title">
      <div className="container container--narrow">
        <SectionHead id="t-title" eyebrow="Kind words" title="From couples we have worked with" align="center" lead="Fictional testimonials written for demonstration." />
        <Testimonials />
      </div>
    </section>
  ),
  journal: () => (
    <section className="section section--cream" aria-labelledby="j-title">
      <div className="container">
        <SectionHead id="j-title" eyebrow="The journal" title="Notes on planning and design" cta={{ label: 'Read the journal', to: '/journal' }} />
        <div className="grid grid--journal">
          {articles.slice(0, homeCounts.journal).map((a, i) => (<Reveal key={a.slug} delay={i * 80}><ArticleCard a={a} /></Reveal>))}
        </div>
      </div>
    </section>
  ),
  cta: () => <CtaBand eyebrow={cta.eyebrow} title={cta.title} body={cta.body} primary={cta.primary} secondary={cta.secondary} image={cta.image} />
};

function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  return (
    <div className="testimonials" role="group" aria-roledescription="carousel" aria-label="Testimonials">
      <Ornament />
      <blockquote key={i} className="testimonials__quote">
        <p>“{t.quote}”</p>
        <footer><strong>{t.names}</strong><span>{t.detail}</span></footer>
      </blockquote>
      <div className="testimonials__nav">
        <button type="button" onClick={() => setI((i - 1 + testimonials.length) % testimonials.length)} aria-label="Previous testimonial"><Icon name="chevronLeft" /></button>
        <ul aria-label="Choose testimonial">
          {testimonials.map((x, n) => (
            <li key={x.names}><button type="button" className={n === i ? 'is-active' : ''} aria-label={`Testimonial ${n + 1} of ${testimonials.length}: ${x.names}`} aria-current={n === i ? 'true' : undefined} onClick={() => setI(n)} /></li>
          ))}
        </ul>
        <button type="button" onClick={() => setI((i + 1) % testimonials.length)} aria-label="Next testimonial"><Icon name="chevronRight" /></button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Seo />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__media"><Photo image={hero.image} priority sizes="100vw" /></div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="container hero__inner">
          <p className="eyebrow eyebrow--light">{hero.eyebrow}</p>
          <h1 className="h-display" id="hero-title">{hero.title}</h1>
          <p className="hero__sub">{hero.subtitle}</p>
          <div className="hero__actions">
            <Button to={hero.primaryCta.to} variant="light">{hero.primaryCta.label}</Button>
            <Button to={hero.secondaryCta.to} variant="ghost">{hero.secondaryCta.label}</Button>
          </div>
        </div>
        <ul className="hero__stats" aria-label={`${site.brand.name} at a glance`}>
          {hero.stats.map((s) => (<li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>))}
        </ul>
      </section>
      {homeSections.filter((s) => s.enabled && sectionRenderers[s.id]).map((s) => (<div key={s.id} data-section={s.id}>{sectionRenderers[s.id]()}</div>))}
    </>
  );
}
