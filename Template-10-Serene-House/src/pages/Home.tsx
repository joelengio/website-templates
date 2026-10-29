import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { homeContent as c, homeSections } from '../config/home';
import { treatments } from '../config/treatments';
import { packages } from '../config/packages';
import { galleryItems } from '../config/gallery';
import { testimonials, testimonialsNotice } from '../config/testimonials';
import { articles } from '../config/journal';
import { ctas } from '../config/navigation';
import { site } from '../config/site';
import type { HomeSectionId } from '../config/types';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { ArticleCard, PackageCard, TreatmentCard } from '../components/Cards';
import { NewsletterForm } from '../components/NewsletterForm';
import { Img, LinkButton, Reveal, SectionHeading, TextLink } from '../components/ui';

const Hero = () => (
  <section className="hero" aria-labelledby="hero-title">
    <div className="container hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">{c.hero.eyebrow}</p>
        <h1 id="hero-title" className="h-hero">{c.hero.title}</h1>
        <p className="lead">{c.hero.text}</p>
        <div className="btn-row">
          <LinkButton to={c.hero.primary.to}>{c.hero.primary.label}</LinkButton>
          <LinkButton to={c.hero.secondary.to} variant="outline" arrow={false}>{c.hero.secondary.label}</LinkButton>
        </div>
        <ul className="hero-points">
          {c.hero.highlights.map((h) => <li key={h}><Icon name="leaf" size={16} /> {h}</li>)}
        </ul>
      </div>
      <div className="hero-art">
        <div className="arch-frame"><Img image={c.hero.image} eager sizes="(min-width: 900px) 50vw, 100vw" /></div>
        <p className="hero-badge"><span>Est.</span> a quiet house<br />for restoration</p>
      </div>
    </div>
  </section>
);

const Intro = () => (
  <section className="section intro" aria-labelledby="intro-title">
    <div className="container split">
      <Reveal className="intro-media">
        <div className="arch-frame arch-frame--tall"><Img image={c.intro.image} sizes="(min-width: 900px) 40vw, 90vw" /></div>
        <div className="intro-inset"><Img image={c.intro.secondaryImage} sizes="260px" /></div>
      </Reveal>
      <Reveal delay={100}>
        <SectionHeading eyebrow={c.intro.eyebrow} title={c.intro.title} />
        {c.intro.paragraphs.map((p) => <p key={p} className="body-lg">{p}</p>)}
        <TextLink to={c.intro.link.to}>{c.intro.link.label}</TextLink>
        <dl className="stats">
          {c.intro.stats.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
        </dl>
      </Reveal>
    </div>
  </section>
);

const Treatments = () => (
  <section className="section section--cream" aria-labelledby="home-treatments">
    <div className="container">
      <div className="section-head-row">
        <SectionHeading eyebrow={c.treatments.eyebrow} title={<span id="home-treatments">{c.treatments.title}</span>} text={c.treatments.text} />
        <TextLink to={ctas.viewTreatments.to}>{ctas.viewTreatments.label}</TextLink>
      </div>
      <div className="grid grid-3">
        {(treatments.filter((t) => t.featured).concat(treatments.filter((t) => !t.featured))).slice(0, c.treatments.count).map((t, i) => (
          <Reveal key={t.slug} delay={i * 90}><TreatmentCard t={t} /></Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Philosophy = () => (
  <section className="philosophy" aria-labelledby="phil-title">
    <div className="philosophy-bg"><Img image={c.philosophy.image} sizes="100vw" /></div>
    <div className="container philosophy-inner">
      <Reveal>
        <SectionHeading eyebrow={c.philosophy.eyebrow} title={<span id="phil-title">{c.philosophy.title}</span>} text={c.philosophy.text} light />
      </Reveal>
      <div className="pillars">
        {c.philosophy.pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="pillar"><span className="pillar-num">0{i + 1}</span><h3>{p.title}</h3><p>{p.text}</p></div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Packages = () => (
  <section className="section" aria-labelledby="home-packages">
    <div className="container">
      <div className="section-head-row">
        <SectionHeading eyebrow={c.packages.eyebrow} title={<span id="home-packages">{c.packages.title}</span>} text={c.packages.text} />
        <TextLink to={ctas.viewPackages.to}>{ctas.viewPackages.label}</TextLink>
      </div>
      <div className="grid grid-3">
        {packages.filter((p) => p.featured).slice(0, c.packages.count).map((p, i) => (
          <Reveal key={p.slug} delay={i * 90}><PackageCard p={p} /></Reveal>
        ))}
      </div>
    </div>
  </section>
);

const GallerySection = () => (
  <section className="section section--cream" aria-labelledby="home-gallery">
    <div className="container">
      <div className="section-head-row">
        <SectionHeading eyebrow={c.gallery.eyebrow} title={<span id="home-gallery">{c.gallery.title}</span>} />
        <TextLink to="/gallery">Open the gallery</TextLink>
      </div>
      <ul className="strip">
        {galleryItems.slice(0, c.gallery.count).map((g) => (
          <li key={g.id}>
            <Link to="/gallery" aria-label={`${g.caption} — open gallery`}><Img image={g.image} sizes="(min-width: 1024px) 16vw, 45vw" /></Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="section" aria-labelledby="home-testimonials">
    <div className="container">
      <SectionHeading eyebrow={c.testimonials.eyebrow} title={<span id="home-testimonials">{c.testimonials.title}</span>} align="center" />
      <p className="demo-label">{testimonialsNotice}</p>
      <div className="grid grid-2 quotes">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 80}>
            <figure className="quote-card">
              <Icon name="star" size={18} />
              <blockquote>“{t.quote}”</blockquote>
              <figcaption><strong>{t.name}</strong><span>{t.detail}</span></figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Journal = () => (
  <section className="section section--cream" aria-labelledby="home-journal">
    <div className="container">
      <div className="section-head-row">
        <SectionHeading eyebrow={c.journal.eyebrow} title={<span id="home-journal">{c.journal.title}</span>} />
        <TextLink to="/journal">Read the journal</TextLink>
      </div>
      <div className="grid grid-3">
        {articles.slice(0, c.journal.count).map((a, i) => <Reveal key={a.slug} delay={i * 90}><ArticleCard a={a} /></Reveal>)}
      </div>
    </div>
  </section>
);

const BookingCta = () => (
  <section className="cta-band" aria-labelledby="cta-title">
    <div className="cta-bg"><Img image={c.booking.image} sizes="100vw" /></div>
    <div className="container cta-inner">
      <Reveal>
        <p className="eyebrow">{c.booking.eyebrow}</p>
        <h2 id="cta-title" className="h-display">{c.booking.title}</h2>
        <p className="lead">{c.booking.text}</p>
        <div className="btn-row btn-row--center">
          <LinkButton to={c.booking.primary.to}>{c.booking.primary.label}</LinkButton>
          <LinkButton to={c.booking.secondary.to} variant="outline" arrow={false}>{c.booking.secondary.label}</LinkButton>
        </div>
      </Reveal>
    </div>
  </section>
);

const Newsletter = () => (
  <section className="section newsletter" aria-labelledby="nl-title">
    <div className="container narrow">
      <Reveal>
        <SectionHeading eyebrow={c.newsletter.eyebrow} title={<span id="nl-title">{c.newsletter.title}</span>} text={c.newsletter.text} align="center" />
        <NewsletterForm />
      </Reveal>
    </div>
  </section>
);

const sectionMap: Record<HomeSectionId, () => ReactElement> = {
  hero: Hero, intro: Intro, treatments: Treatments, philosophy: Philosophy, packages: Packages,
  gallery: GallerySection, testimonials: Testimonials, journal: Journal, booking: BookingCta, newsletter: Newsletter
};

export default function Home() {
  return (
    <>
      <Seo title={undefined} description={site.pages.home.description} />
      {homeSections.filter((s) => s.enabled).map((s) => {
        const Section = sectionMap[s.id];
        return Section ? <Section key={s.id} /> : null;
      })}
    </>
  );
}
