import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { CtaLink, Img, Reveal, SectionHead, LinkButton } from '../components/ui';
import { ArticleCard, FacilityCard, ProgramCard, TrainerCard } from '../components/Cards';
import { home, homeSections, type HomeSectionId } from '../config/home';
import { programs } from '../config/programs';
import { trainers } from '../config/trainers';
import { classes, dayNames } from '../config/classes';
import { facilities } from '../config/facilities';
import { plans, membershipCopy } from '../config/membership';
import { testimonials, testimonialsNote } from '../config/testimonials';
import { articles } from '../config/journal';
import { site } from '../config/site';
import { formatTime, money } from '../lib/format';
import { weekdayIndex } from '../lib/schedule';
import { trainerNames } from '../components/Cards';

function Hero() {
  const h = home.hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Img image={h.image} eager className="hero-img" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="container hero-inner">
        <p className="eyebrow hero-eyebrow">{h.eyebrow}</p>
        <h1 id="hero-title" className="h-mega hero-title">
          {h.titleLines.map((l, i) => <span key={l} className={i === h.titleLines.length - 1 ? 'accent' : ''}>{l}<br /></span>)}
        </h1>
        <p className="lead hero-text">{h.text}</p>
        <div className="hero-actions">
          <CtaLink cta={h.primary} />
          <CtaLink cta={h.secondary} variant="ghost" />
        </div>
        <ul className="hero-badges" aria-label="Highlights">
          {h.badges.map((b) => <li key={b}><Icon name="check" size={16} /> {b}</li>)}
        </ul>
      </div>
      <div className="hero-scroll" aria-hidden="true"><span /> Scroll</div>
    </section>
  );
}

function Ticker() {
  const words = [...home.ticker, ...home.ticker];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {words.map((w, i) => <span key={w + i}>{w}<i /></span>)}
      </div>
    </div>
  );
}

function Positioning() {
  const p = home.positioning;
  const counts = { programs: programs.length, trainers: trainers.length, classes: classes.length };
  return (
    <section className="section section--light position">
      <div className="container split split--asym">
        <Reveal className="position-media"><Img image={p.image} sizes="(min-width: 900px) 40vw, 100vw" /></Reveal>
        <Reveal className="position-copy">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 className="h-display">{p.title}</h2>
          {p.paragraphs.map((t) => <p key={t} className="lead">{t}</p>)}
          <dl className="stat-row">
            {p.points.map((pt) => <div key={pt.label}><dd>{counts[pt.source]}</dd><dt>{pt.label}</dt></div>)}
          </dl>
          <CtaLink cta={p.cta} variant="dark" />
        </Reveal>
      </div>
    </section>
  );
}

function ProgramsSection() {
  const p = home.programs;
  return (
    <section className="section" aria-labelledby="home-programs">
      <div className="container">
        <SectionHead eyebrow={p.eyebrow} title={<span id="home-programs">{p.title}</span>} intro={p.intro}>
          <CtaLink cta={p.cta} variant="ghost" />
        </SectionHead>
        <div className="grid grid--cards">
          {programs.slice(0, p.limit).map((pr, i) => <Reveal key={pr.slug}><ProgramCard program={pr} index={i} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  const p = home.philosophy;
  return (
    <section className="section philosophy">
      <Img image={p.image} className="philosophy-bg" />
      <div className="philosophy-shade" aria-hidden="true" />
      <div className="container philosophy-inner">
        <Reveal>
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 className="h-display h-display--xl">{p.title}</h2>
          <p className="lead">{p.text}</p>
        </Reveal>
        <ol className="pillars">
          {p.pillars.map((x, i) => (
            <Reveal as="li" key={x.title}>
              <span className="pillar-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{x.title}</h3>
              <p>{x.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FacilitiesSection() {
  const f = home.facilities;
  return (
    <section className="section section--charcoal" aria-labelledby="home-facilities">
      <div className="container">
        <SectionHead eyebrow={f.eyebrow} title={<span id="home-facilities">{f.title}</span>} intro={f.intro}>
          <CtaLink cta={f.cta} variant="ghost" />
        </SectionHead>
        <div className="facility-grid">
          {facilities.slice(0, 4).map((x, i) => <Reveal key={x.slug}><FacilityCard facility={x} index={i} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function SchedulePreview() {
  const s = home.schedule;
  const today = useMemo(() => weekdayIndex(new Date()), []);
  const [day, setDay] = useState(today);
  const list = classes.filter((c) => c.day === day).sort((a, b) => a.start.localeCompare(b.start));
  return (
    <section className="section" aria-labelledby="home-schedule">
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={<span id="home-schedule">{s.title}</span>} intro={s.intro}>
          <CtaLink cta={s.cta} />
        </SectionHead>
        <div className="day-tabs" role="group" aria-label="Choose a day">
          {dayNames.map((d, i) => (
            <button key={d} type="button" className={`day-tab ${i === day ? 'is-active' : ''}`} aria-pressed={i === day} onClick={() => setDay(i)}>
              <span>{d.slice(0, 3)}</span>
            </button>
          ))}
        </div>
        <ul className="preview-list" aria-label={`Classes on ${dayNames[day]}`}>
          {list.map((c) => (
            <li key={c.id}>
              <span className="preview-time">{formatTime(c.start)}</span>
              <span className="preview-title">{c.title}</span>
              <span className="preview-meta">{c.duration} min · {trainerNames([c.trainerSlug])[0]} · {c.room}</span>
              <Link to={`/schedule?day=${day}&class=${c.id}`} className="preview-link" aria-label={`Details and booking for ${c.title} on ${dayNames[day]} at ${formatTime(c.start)}`}>
                Details <Icon name="arrow" size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TrainersSection() {
  const t = home.trainers;
  return (
    <section className="section section--charcoal" aria-labelledby="home-trainers">
      <div className="container">
        <SectionHead eyebrow={t.eyebrow} title={<span id="home-trainers">{t.title}</span>} intro={t.intro}>
          <CtaLink cta={t.cta} variant="ghost" />
        </SectionHead>
        <div className="grid grid--trainers">
          {trainers.slice(0, 4).map((tr) => <Reveal key={tr.slug}><TrainerCard trainer={tr} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function MembershipSection() {
  const m = home.membership;
  return (
    <section className="section section--light" aria-labelledby="home-membership">
      <div className="container">
        <SectionHead eyebrow={m.eyebrow} title={<span id="home-membership">{m.title}</span>} intro={m.intro}>
          <CtaLink cta={m.cta} variant="dark" />
        </SectionHead>
        <div className="plan-grid plan-grid--compact">
          {plans.map((pl) => (
            <Reveal key={pl.id} className={`plan ${pl.highlight ? 'is-featured' : ''}`}>
              {pl.badge && <span className="plan-badge">{pl.badge}</span>}
              <h3 className="h-card">{pl.name}</h3>
              <p className="plan-tag">{pl.tagline}</p>
              <p className="plan-price"><b>{money(pl.monthly)}</b><span> / month</span></p>
              <Link to={`/membership?plan=${pl.id}`} className="btn btn--dark"><span>View {pl.name}</span><Icon name="arrow" size={18} /></Link>
            </Reveal>
          ))}
        </div>
        <p className="fine-print">{membershipCopy.disclaimer}</p>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = home.testimonials;
  return (
    <section className="section" aria-labelledby="home-testi">
      <div className="container">
        <SectionHead eyebrow={t.eyebrow} title={<span id="home-testi">{t.title}</span>} intro={testimonialsNote} />
        <div className="quote-grid">
          {testimonials.map((q) => (
            <Reveal as="article" key={q.name} className="quote">
              <blockquote><p>“{q.quote}”</p></blockquote>
              <p className="quote-by"><b>{q.name}</b><span>{q.detail}</span></p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function JournalSection() {
  const j = home.journal;
  return (
    <section className="section section--charcoal" aria-labelledby="home-journal">
      <div className="container">
        <SectionHead eyebrow={j.eyebrow} title={<span id="home-journal">{j.title}</span>} intro={j.intro}>
          <CtaLink cta={j.cta} variant="ghost" />
        </SectionHead>
        <div className="grid grid--cards">
          {articles.slice(0, j.limit).map((a) => <Reveal key={a.slug}><ArticleCard article={a} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const c = home.cta;
  return (
    <section className="cta-band">
      <Img image={c.image} className="cta-bg" />
      <div className="cta-shade" aria-hidden="true" />
      <div className="container cta-inner">
        <Reveal>
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="h-mega">{c.title}</h2>
          <p className="lead">{c.text}</p>
          <div className="hero-actions">
            <LinkButton to={c.primary.to}>{c.primary.label}</LinkButton>
            <LinkButton to={c.secondary.to} variant="ghost">{c.secondary.label}</LinkButton>
          </div>
          <p className="fine-print">{site.contact.phone} · {site.contact.email} · {site.legal.demoDisclaimer.split('.')[0]}.</p>
        </Reveal>
      </div>
    </section>
  );
}

const registry: Record<HomeSectionId, () => ReactNode> = {
  hero: Hero, ticker: Ticker, positioning: Positioning, programs: ProgramsSection, philosophy: Philosophy,
  facilities: FacilitiesSection, schedule: SchedulePreview, trainers: TrainersSection, membership: MembershipSection,
  testimonials: Testimonials, journal: JournalSection, cta: FinalCta
};

export default function Home() {
  return (
    <>
      <Seo />
      {homeSections.filter((s) => s.visible).map((s) => {
        const C = registry[s.id];
        return C ? <C key={s.id} /> : null;
      })}
    </>
  );
}
