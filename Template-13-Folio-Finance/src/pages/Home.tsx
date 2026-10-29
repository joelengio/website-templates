import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../config/articles';
import { calculators } from '../config/calculators';
import { home, testimonials } from '../config/content';
import { industries } from '../config/industries';
import { homeSections, pages } from '../config/layout';
import { services } from '../config/services';
import type { HomeSectionConfig } from '../config/types';
import { ArticleCard, IndustryCard, ServiceCard } from '../components/Cards';
import { Chart } from '../components/Chart';
import { ConsultCTA } from '../components/ConsultCTA';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { LinkButton } from '../components/Button';
import { Section } from '../components/Section';
import { useSeo } from '../hooks/useSeo';
import { computeCompound } from '../lib/finance';
import { formatCompactCurrency, formatCurrency } from '../lib/format';

function Hero() {
  const h = home.hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Img image={h.image} priority sizes="100vw" />
      </div>
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--light">{h.eyebrow}</p>
          <h1 id="hero-title">{h.title}</h1>
          <p className="hero__lead">{h.lead}</p>
          <div className="hero__actions">
            <LinkButton to={h.primary.to} variant="primary" arrow>
              {h.primary.label}
            </LinkButton>
            <LinkButton to={h.secondary.to} variant="ghost" className="btn--on-dark">
              {h.secondary.label}
            </LinkButton>
          </div>
        </div>
        <aside className="hero__panel" aria-label={h.panel.label}>
          <p className="hero__panel-label">{h.panel.label}</p>
          <dl>
            {h.panel.items.map((it) => (
              <div key={it.caption}>
                <dt>{it.caption}</dt>
                <dd>{it.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Stats() {
  const s = home.stats;
  return (
    <section className="stats" aria-label="Firm statistics (demonstration data)">
      <div className="container">
        <dl className="stats__grid">
          {s.items.map((it) => (
            <div key={it.label}>
              <dd>{it.value}</dd>
              <dt>{it.label}</dt>
            </div>
          ))}
        </dl>
        <p className="stats__note">{s.label}</p>
      </div>
    </section>
  );
}

function ServicesSection() {
  const c = home.services;
  const list = c.featured.map((slug) => services.find((s) => s.slug === slug)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <Section id="home-services" eyebrow={c.eyebrow} title={c.title} lead={c.lead} tone="ivory" action={pages.services && <LinkButton to="/services" variant="secondary" arrow>All services</LinkButton>}>
      <div className="grid grid--4">
        {list.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>
    </Section>
  );
}

function AboutSection() {
  const c = home.about;
  return (
    <Section id="home-about" tone="stone">
      <div className="split">
        <div className="split__media">
          <Img image={c.image} />
        </div>
        <div className="split__copy">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="section__title" id="home-about-title">{c.title}</h2>
          {c.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="checklist">
            {c.bullets.map((b) => (
              <li key={b}>
                <Icon name="check" size={18} /> {b}
              </li>
            ))}
          </ul>
          {pages.about && <LinkButton to={c.cta.to} variant="secondary" arrow>{c.cta.label}</LinkButton>}
        </div>
      </div>
    </Section>
  );
}

function AdvisorySection() {
  const c = home.advisory;
  return (
    <Section id="home-advisory" eyebrow={c.eyebrow} title={c.title} tone="navy">
      <div className="grid grid--4 advisory-grid">
        {c.areas.map((a, i) => (
          <div key={a.title} className="advisory-item">
            <span className="advisory-item__num" aria-hidden="true">0{i + 1}</span>
            <Icon name={a.icon} size={26} />
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SegmentsSection() {
  const c = home.segments;
  return (
    <Section id="home-segments" eyebrow={c.eyebrow} title={c.title} lead={c.lead} tone="ivory" action={pages.industries && <LinkButton to="/industries" variant="secondary" arrow>All segments</LinkButton>}>
      <ul className="segment-list">
        {industries.map((ind) => (
          <li key={ind.slug}>
            <Link to={`/industries/${ind.slug}`}>
              <Icon name={ind.icon} size={20} />
              <span>{ind.name}</span>
              <Icon name="arrow" size={16} />
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid grid--3 segment-cards">
        {industries.slice(0, 3).map((ind) => (
          <IndustryCard key={ind.slug} industry={ind} />
        ))}
      </div>
    </Section>
  );
}

function WhySection() {
  const c = home.why;
  return (
    <Section id="home-why" eyebrow={c.eyebrow} title={c.title} tone="stone">
      <div className="grid grid--4">
        {c.reasons.map((r) => (
          <div key={r.title} className="why-item">
            <Icon name={r.icon} size={26} />
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ProcessSteps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="process">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="process__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

function ProcessSection() {
  const c = home.process;
  return (
    <Section id="home-process" eyebrow={c.eyebrow} title={c.title} tone="ivory">
      <ProcessSteps steps={c.steps} />
    </Section>
  );
}

function ToolPreview() {
  const c = home.toolPreview;
  const d = calculators.homePreview.defaults;
  const [initial, setInitial] = useState(d.initial);
  const [monthly, setMonthly] = useState(d.monthly);
  const [rate, setRate] = useState(d.annualRate);
  const [years, setYears] = useState(d.years);
  const result = useMemo(() => computeCompound({ initial, monthly, annualRate: rate, years, frequency: 12 }), [initial, monthly, rate, years]);
  const slider = (id: string, label: string, value: number, set: (n: number) => void, min: number, max: number, step: number, fmt: (n: number) => string) => (
    <div className="slider">
      <div className="slider__top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{fmt(value)}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
    </div>
  );
  return (
    <Section id="home-tool" eyebrow={c.eyebrow} title={c.title} lead={c.lead} tone="navy" action={pages.tools && <LinkButton to="/tools" variant="light" arrow>{c.cta.label}</LinkButton>}>
      <div className="tool-preview">
        <div className="tool-preview__controls">
          {slider('tp-initial', 'Starting amount', initial, setInitial, 0, 100000, 1000, (n) => formatCurrency(n))}
          {slider('tp-monthly', 'Monthly contribution', monthly, setMonthly, 0, 2000, 25, (n) => formatCurrency(n))}
          {slider('tp-rate', 'Annual return assumption', rate, setRate, 0, 12, 0.5, (n) => `${n}%`)}
          {slider('tp-years', 'Years', years, setYears, 1, 40, 1, (n) => `${n} yrs`)}
          <p className="tool-preview__result" aria-live="polite">
            Estimated value after {years} years: <strong>{formatCurrency(result.futureValue)}</strong>
          </p>
          <p className="tool-preview__note">Illustration only — not a forecast, recommendation or guarantee.</p>
        </div>
        <div className="tool-preview__chart">
          <Chart
            kind="stackedArea"
            xs={result.series.map((p) => p.year)}
            series={[
              { name: 'Contributions', values: result.series.map((p) => p.contributions), color: 'var(--c-bronze-light)' },
              { name: 'Estimated growth', values: result.series.map((p) => Math.max(0, p.growth)), color: 'var(--c-ivory)' },
            ]}
            xFormat={(y) => `Year ${y}`}
            yFormat={formatCompactCurrency}
            valueFormat={(v) => formatCurrency(v)}
            xTitle="Year"
            ariaLabel="Preview of projected savings balance by year"
            showTotal
            totalLabel="Estimated balance"
          />
        </div>
      </div>
    </Section>
  );
}

function Testimonials() {
  const c = home.testimonials;
  return (
    <Section id="home-testimonials" eyebrow={c.eyebrow} title={c.title} lead={c.notice} tone="ivory">
      <div className="grid grid--2">
        {testimonials.map((t) => (
          <figure key={t.id} className="testimonial">
            <Icon name="quote" size={26} />
            <blockquote>
              <p>{t.quote}</p>
            </blockquote>
            <figcaption>
              <strong>{t.name}</strong>
              <span>{t.role} · {t.segment}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function InsightsSection() {
  const c = home.insights;
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <Section id="home-insights" eyebrow={c.eyebrow} title={c.title} lead={c.lead} tone="stone" action={pages.insights && <LinkButton to="/insights" variant="secondary" arrow>All insights</LinkButton>}>
      <div className="grid grid--3">
        {latest.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </Section>
  );
}

const renderers: Record<HomeSectionConfig['id'], () => ReactNode> = {
  hero: Hero,
  stats: Stats,
  services: ServicesSection,
  about: AboutSection,
  advisory: AdvisorySection,
  segments: SegmentsSection,
  why: WhySection,
  process: ProcessSection,
  toolPreview: ToolPreview,
  testimonials: Testimonials,
  insights: InsightsSection,
  cta: () => <ConsultCTA />,
};

export default function Home() {
  useSeo({ title: undefined, description: home.seo.description, path: '/' });
  return (
    <>
      {homeSections
        .filter((s) => s.enabled)
        .map((s) => {
          const Render = renderers[s.id];
          return Render ? <Render key={s.id} /> : null;
        })}
    </>
  );
}
