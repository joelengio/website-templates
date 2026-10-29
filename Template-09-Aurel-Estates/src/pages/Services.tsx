import { useState } from 'react';
import { content, ctas, pages, sections } from '../config';
import { resolveSections } from '../lib/sections';
import { useSeo } from '../hooks/useSeo';
import { LinkButton } from '../components/Button';
import { Icon } from '../components/Icon';
import { ServiceIcon } from '../components/ServiceIcon';
import { PageHero, Reveal, SectionHeading } from '../components/Section';

function Intro() {
  const c = content.services.intro;
  return <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.body} />;
}

function List() {
  return (
    <section className="section" aria-label="Our services">
      <div className="container">
        <ul className="feature-grid feature-grid--3">
          {content.services.list.map((s) => (
            <li key={s.title}>
              <Reveal className="feature">
                <span className="feature__icon"><ServiceIcon name={s.icon} /></span>
                <h2 className="h3">{s.title}</h2>
                <p>{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Process() {
  const c = content.services.process;
  return (
    <section className="section section--tint" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading id="process-title" title={c.title} />
        <ol className="steps">
          {c.steps.map((s, i) => (
            <li key={s.title}>
              <Reveal>
                <span className="steps__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  const c = content.services.faq;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container container--narrow">
        <SectionHeading id="faq-title" title={c.title} />
        <div className="accordion">
          {c.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className={`accordion__item${isOpen ? ' is-open' : ''}`}>
                <h3>
                  <button type="button" id={`faq-btn-${i}`} aria-expanded={isOpen} aria-controls={`faq-panel-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    {it.q}
                    <Icon name="chevron" size={18} />
                  </button>
                </h3>
                <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} hidden={!isOpen}>
                  <p>{it.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  const c = content.services.cta;
  return (
    <section className="cta">
      <div className="container cta__inner">
        <div>
          <h2>{c.title}</h2>
          <p>{c.body}</p>
        </div>
        <div className="cta__actions">
          {pages.contact && (
            <LinkButton to={ctas.sell.to} variant="brass">
              {ctas.sell.label}
            </LinkButton>
          )}
          {pages.properties && (
            <LinkButton to={ctas.primary.to} variant="light">
              {ctas.primary.label}
            </LinkButton>
          )}
        </div>
      </div>
    </section>
  );
}

const registry = { intro: Intro, list: List, process: Process, faq: Faq, cta: Cta };

export default function Services() {
  useSeo({ title: 'Services', description: content.services.intro.body, path: '/services' });
  const ids = resolveSections(sections.services, Object.keys(registry));
  return (
    <>
      {!ids.includes('intro') && (
        <h1 className="sr-only" tabIndex={-1} data-page-heading>
          Services
        </h1>
      )}
      {ids.map((id) => {
        const S = registry[id as keyof typeof registry];
        return <S key={id} />;
      })}
    </>
  );
}
