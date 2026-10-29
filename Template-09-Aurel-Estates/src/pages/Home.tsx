import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { content, ctas, pages, properties, sections } from '../config';
import { priceSteps } from '../config/features';
import { resolveSections } from '../lib/sections';
import { formatPriceShort } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { LinkButton } from '../components/Button';
import { Icon } from '../components/Icon';
import { ArticleCard as ArticleCardLink } from '../components/ArticleCard';
import { PropertyCard } from '../components/PropertyCard';
import { Reveal, SectionHeading } from '../components/Section';
import { ServiceIcon } from '../components/ServiceIcon';
import { site } from '../config/site';

const types = Array.from(new Set(properties.map((p) => p.type)));

function Hero() {
  const h = content.home.hero;
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [max, setMax] = useState('');
  const [q, setQ] = useState('');
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (type) p.set('type', type);
    if (max) p.set('max', max);
    navigate(`/properties${p.toString() ? `?${p}` : ''}`);
  };
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero__img" src={h.image.src} alt={h.image.alt} width={2000} height={1333} fetchPriority="high" />
      <div className="hero__scrim" />
      <div className="container hero__inner">
        <p className="eyebrow eyebrow--light">{h.eyebrow}</p>
        <h1 id="hero-title" tabIndex={-1} data-page-heading>
          {h.title}
        </h1>
        <p className="lead">{h.lead}</p>
        <div className="hero__ctas">
          {pages.properties && (
            <LinkButton to={h.primaryCta.to} variant="brass" arrow>
              {h.primaryCta.label}
            </LinkButton>
          )}
          {pages.contact && (
            <LinkButton to={h.secondaryCta.to} variant="light">
              {h.secondaryCta.label}
            </LinkButton>
          )}
        </div>
        {pages.properties && (
          <form className="hero-search" onSubmit={onSubmit} role="search" aria-label="Quick property search">
            <div className="field">
              <label htmlFor="hs-q">Keyword</label>
              <input id="hs-q" type="search" placeholder="Pool, Fernhill, timber…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="hs-type">Type</label>
              <select id="hs-type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Any type</option>
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="hs-max">Max price</label>
              <select id="hs-max" value={max} onChange={(e) => setMax(e.target.value)}>
                <option value="">No limit</option>
                {priceSteps.map((p) => (
                  <option key={p} value={p}>
                    {formatPriceShort(p)}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn--primary">
              <Icon name="search" size={18} /> Search
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Featured() {
  const c = content.home.featured;
  if (!pages.properties) return null;
  const list = properties.filter((p) => p.featured).slice(0, c.count);
  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="container">
        <SectionHeading id="featured-title" eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
        <div className="card-grid">
          {list.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        {pages.properties && (
          <p className="section-link">
            <Link to="/properties" className="text-link">
              {c.linkLabel} <Icon name="arrow" size={16} />
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

function Neighborhoods() {
  const c = content.home.neighborhoods;
  return (
    <section className="section section--tint" aria-labelledby="hoods-title">
      <div className="container">
        <SectionHeading id="hoods-title" eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
        <ul className="hood-grid">
          {c.items.map((n) => {
            const count = properties.filter((p) => p.neighborhood === n.name).length;
            const body = (
              <>
                <img src={n.image.thumb ?? n.image.src} alt="" width={640} height={440} loading="lazy" />
                <span className="hood__text">
                  <strong>{n.name}</strong>
                  <span>{n.blurb}</span>
                  <em>
                    {count} {count === 1 ? 'home' : 'homes'}
                  </em>
                </span>
              </>
            );
            return (
              <li key={n.name}>
                <Reveal>
                  {pages.properties ? (
                    <Link className="hood" to={`/properties?area=${encodeURIComponent(n.name)}`}>
                      {body}
                    </Link>
                  ) : (
                    <div className="hood">{body}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Approach() {
  const c = content.home.approach;
  return (
    <section className="section" aria-labelledby="approach-title">
      <div className="container split">
        <Reveal className="split__media">
          <img src={c.image.src} alt={c.image.alt} width={1200} height={800} loading="lazy" />
        </Reveal>
        <Reveal className="split__text">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="approach-title">{c.title}</h2>
          {c.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <ul className="ticks">
            {c.points.map((t) => (
              <li key={t}>
                <Icon name="check" size={18} /> {t}
              </li>
            ))}
          </ul>
          {pages.about && (
            <LinkButton to="/about" variant="ghost" arrow>
              About the agency
            </LinkButton>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function ServicesTeaser() {
  const c = content.home.services;
  return (
    <section className="section section--tint" aria-labelledby="svc-title">
      <div className="container">
        <SectionHeading id="svc-title" eyebrow={c.eyebrow} title={c.title} />
        <ul className="feature-grid">
          {content.services.list.slice(0, 3).map((s) => (
            <li key={s.title}>
              <Reveal className="feature">
                <span className="feature__icon"><ServiceIcon name={s.icon} /></span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        {pages.services && (
          <p className="section-link">
            <Link to="/services" className="text-link">
              {c.linkLabel} <Icon name="arrow" size={16} />
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

function Stats() {
  const c = content.home.stats;
  return (
    <section className="stats" aria-label="Agency at a glance">
      <div className="container">
        <ul>
          {c.items.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
        <p className="stats__note">{c.note}</p>
      </div>
    </section>
  );
}

function JournalTeaser() {
  const c = content.home.journal;
  if (!pages.journal) return null;
  const list = content.articles.slice(0, c.count);
  return (
    <section className="section" aria-labelledby="journal-title">
      <div className="container">
        <SectionHeading id="journal-title" eyebrow={c.eyebrow} title={c.title} />
        <ul className="article-grid">
          {list.map((a) => (
            <li key={a.slug}>
              <Reveal>
                <ArticleCardLink slug={a.slug} />
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="section-link">
          <Link to="/journal" className="text-link">
            {c.linkLabel} <Icon name="arrow" size={16} />
          </Link>
        </p>
      </div>
    </section>
  );
}

function Cta() {
  const c = content.home.cta;
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container cta__inner">
        <div>
          <h2 id="cta-title">{c.title}</h2>
          <p>{c.body}</p>
        </div>
        <div className="cta__actions">
          {pages.properties && (
            <LinkButton to={ctas.primary.to} variant="brass">
              {ctas.primary.label}
            </LinkButton>
          )}
          {pages.contact && (
            <LinkButton to={ctas.secondary.to} variant="light">
              {ctas.secondary.label}
            </LinkButton>
          )}
        </div>
      </div>
    </section>
  );
}

const registry = {
  hero: Hero,
  featured: Featured,
  neighborhoods: Neighborhoods,
  approach: Approach,
  services: ServicesTeaser,
  stats: Stats,
  journal: JournalTeaser,
  cta: Cta,
};

export default function Home() {
  useSeo({ description: site.seo.description, path: '/' });
  const ids = resolveSections(sections.home, Object.keys(registry));
  return (
    <>
      {!ids.includes('hero') && (
        <h1 className="sr-only" tabIndex={-1} data-page-heading>
          {site.brand.name}
        </h1>
      )}
      {ids.map((id) => {
        const Section = registry[id as keyof typeof registry];
        return <Section key={id} />;
      })}
    </>
  );
}
