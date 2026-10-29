import { useState } from 'react';
import { Link } from 'react-router-dom';
import { doctors } from '../config/doctors';
import { facilities } from '../config/facilities';
import { articles } from '../config/articles';
import { home, homeSections } from '../config/home';
import { services } from '../config/services';
import { specialties } from '../config/specialties';
import { testimonials } from '../config/testimonials';
import type { HomeSectionId } from '../config/types';
import { ArticleCard, DoctorCard, FacilityCard, ServiceCard, SpecialtyCard } from '../components/Cards';
import { Icon, isIconName } from '../components/Icon';
import { Seo } from '../components/Seo';
import { Img, LinkButton, SectionHeader } from '../components/ui';
import { serviceCategories } from '../config/services';

function Hero() {
  const h = home.hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{h.eyebrow}</p>
          <h1 id="hero-title">{h.title}</h1>
          <p className="lead">{h.lead}</p>
          <div className="btn-row">
            <LinkButton to={h.primaryCta.to} size="lg" icon="calendar">{h.primaryCta.label}</LinkButton>
            <LinkButton to={h.secondaryCta.to} variant="secondary" size="lg">{h.secondaryCta.label}</LinkButton>
          </div>
          <ul className="hero-badges">
            {h.badges.map((b) => <li key={b}><Icon name="check" size={16} /> {b}</li>)}
          </ul>
        </div>
        <div className="hero-visual">
          <div className="hero-arch"><Img name={h.image} eager sizes="(min-width: 900px) 40vw, 80vw" /></div>
          <div className="hero-float"><Img name={h.floatingImage} eager sizes="200px" /></div>
          <dl className="hero-stats">
            {h.stats.map((s) => (
              <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  const s = home.intro;
  return (
    <section className="section" aria-labelledby="intro-title">
      <div className="container split">
        <div className="split-media"><Img name={s.image} sizes="(min-width: 900px) 45vw, 90vw" className="rounded-img" /></div>
        <div>
          <SectionHeader eyebrow={s.eyebrow} title={s.title} id="intro-title" />
          {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
          <ul className="check-list">{s.points.map((p) => <li key={p}><Icon name="check" size={18} /> {p}</li>)}</ul>
          <LinkButton to={s.cta.to} variant="secondary">{s.cta.label}</LinkButton>
        </div>
      </div>
    </section>
  );
}

function Specialties() {
  const s = home.specialties;
  return (
    <section className="section tint" aria-labelledby="spec-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} id="spec-title" />
        <div className="grid grid-4">{specialties.slice(0, s.count).map((x) => <SpecialtyCard key={x.id} s={x} />)}</div>
        <div className="section-cta"><LinkButton to={s.cta.to} variant="secondary">{s.cta.label}</LinkButton></div>
      </div>
    </section>
  );
}

function Doctors() {
  const s = home.doctors;
  const featured = s.featured.map((id) => doctors.find((d) => d.id === id)).filter((d) => !!d);
  return (
    <section className="section" aria-labelledby="doc-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} id="doc-title" />
        <div className="grid grid-4">{featured.map((d) => <DoctorCard key={d.id} d={d} />)}</div>
        <div className="section-cta"><LinkButton to={s.cta.to} variant="secondary">{s.cta.label}</LinkButton></div>
      </div>
    </section>
  );
}

function Services() {
  const s = home.services;
  return (
    <section className="section tint" aria-labelledby="svc-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} id="svc-title" />
        <ul className="category-grid">
          {serviceCategories.map((c) => {
            const n = services.filter((x) => x.category === c.id).length;
            return (
              <li key={c.id}>
                <Link to={`/services?category=${c.id}`} className="category-tile">
                  <strong>{c.label}</strong>
                  <span>{c.description}</span>
                  <em>{n} services <Icon name="arrow" size={16} /></em>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="grid grid-3 spaced">{s.featured.map((id) => services.find((x) => x.id === id)).filter((x) => !!x).map((x) => <ServiceCard key={x.id} s={x} />)}</div>
        <div className="section-cta"><LinkButton to={s.cta.to}>{s.cta.label}</LinkButton></div>
      </div>
    </section>
  );
}

function Why() {
  const s = home.why;
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} id="why-title" center />
        <ul className="grid grid-4 feature-grid">
          {s.items.map((it) => (
            <li key={it.title} className="feature">
              <span className="chip-icon">{isIconName(it.icon) && <Icon name={it.icon} size={24} />}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Experience() {
  const s = home.experience;
  return (
    <section className="section navy" aria-labelledby="exp-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} id="exp-title" />
        <ol className="steps">
          {s.steps.map((st, i) => (
            <li key={st.title}>
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
        <div className="section-cta"><LinkButton to={s.cta.to} variant="light" icon="calendar">{s.cta.label}</LinkButton></div>
      </div>
    </section>
  );
}

function Facilities() {
  const s = home.facilities;
  return (
    <section className="section" aria-labelledby="fac-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} id="fac-title" />
        <div className="grid grid-3">{facilities.slice(0, s.count).map((f) => <FacilityCard key={f.id} f={f} />)}</div>
        <div className="section-cta"><LinkButton to={s.cta.to} variant="secondary">{s.cta.label}</LinkButton></div>
      </div>
    </section>
  );
}

function Testimonials() {
  const s = home.testimonials;
  const [i, setI] = useState(0);
  const n = testimonials.length;
  return (
    <section className="section tint" aria-labelledby="test-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} id="test-title" />
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <figure key={t.id} className="testimonial">
              <Icon name="sparkle" size={22} />
              <blockquote>{t.quote}</blockquote>
              <figcaption><strong>{t.name}</strong><span>{t.context}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className="testimonial-carousel" aria-roledescription="carousel" aria-label="Fictional testimonials">
          <figure className="testimonial" aria-live="polite">
            <Icon name="sparkle" size={22} />
            <blockquote>{testimonials[i].quote}</blockquote>
            <figcaption><strong>{testimonials[i].name}</strong><span>{testimonials[i].context}</span></figcaption>
          </figure>
          <div className="carousel-controls">
            <button type="button" className="icon-btn" onClick={() => setI((i + n - 1) % n)} aria-label="Previous testimonial"><Icon name="chevron-left" /></button>
            <span aria-hidden="true">{i + 1} / {n}</span>
            <button type="button" className="icon-btn" onClick={() => setI((i + 1) % n)} aria-label="Next testimonial"><Icon name="chevron-right" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info() {
  const s = home.info;
  return (
    <section className="section" aria-labelledby="info-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} id="info-title" />
        <ul className="grid grid-4 info-grid">
          {s.cards.map((c) => (
            <li key={c.title}>
              <Link to={c.to} className="info-card">
                <span className="chip-icon">{isIconName(c.icon) && <Icon name={c.icon} size={22} />}</span>
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Articles() {
  const s = home.articles;
  const latest = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, s.count);
  return (
    <section className="section tint" aria-labelledby="art-title">
      <div className="container">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} id="art-title" />
        <div className="grid grid-3">{latest.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
        <div className="section-cta"><LinkButton to={s.cta.to} variant="secondary">{s.cta.label}</LinkButton></div>
      </div>
    </section>
  );
}

function ContactCta() {
  const s = home.contact;
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <Img name={s.image} className="cta-bg" sizes="100vw" />
      <div className="container cta-inner">
        <p className="eyebrow">{s.eyebrow}</p>
        <h2 id="cta-title">{s.title}</h2>
        <p>{s.text}</p>
        <div className="btn-row">
          <LinkButton to={s.primaryCta.to} size="lg" variant="light" icon="calendar">{s.primaryCta.label}</LinkButton>
          <LinkButton to={s.secondaryCta.to} size="lg" variant="ghost">{s.secondaryCta.label}</LinkButton>
        </div>
      </div>
    </section>
  );
}

const registry: Record<HomeSectionId, () => React.JSX.Element> = {
  hero: Hero, intro: Intro, specialties: Specialties, doctors: Doctors, services: Services, why: Why,
  experience: Experience, facilities: Facilities, testimonials: Testimonials, info: Info, articles: Articles, contact: ContactCta
};

export default function Home() {
  return (
    <>
      <Seo />
      {homeSections.filter((s) => s.enabled).map((s) => {
        const Section = registry[s.id];
        return Section ? <Section key={s.id} /> : null;
      })}
    </>
  );
}
