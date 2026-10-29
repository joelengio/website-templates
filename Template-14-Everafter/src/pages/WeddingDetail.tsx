import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Lightbox } from '../components/Lightbox';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { WeddingCard } from '../components/Cards';
import { Breadcrumb, Button, CtaBand, DemoBanner } from '../components/ui';
import { getDestination, services, weddings } from '../config';
import NotFound from './NotFound';

export default function WeddingDetail() {
  const { slug } = useParams();
  const w = weddings.find((x) => x.slug === slug);
  const [lb, setLb] = useState<number | null>(null);
  if (!w) return <NotFound />;
  const dest = getDestination(w.destinationSlug);
  const idx = weddings.indexOf(w);
  const next = weddings[(idx + 1) % weddings.length];
  const related = weddings.filter((x) => x.slug !== w.slug && (x.region === w.region || x.style === w.style)).slice(0, 3);
  const svc = w.services.map((name) => services.find((s) => s.title === name));

  return (
    <>
      <Seo title={`${w.title} — ${w.location}`} description={w.summary} image={w.cover.src} type="article" />
      <header className="project-hero">
        <div className="project-hero__media"><Photo image={w.cover} priority sizes="100vw" /></div>
        <div className="project-hero__veil" aria-hidden="true" />
        <div className="container project-hero__inner">
          <Breadcrumb items={[{ label: 'Weddings', to: '/weddings' }, { label: w.title }]} />
          <p className="eyebrow eyebrow--light">{w.eventType} · {w.location}</p>
          <h1 className="h-display">{w.title}</h1>
          <p className="project-hero__sub">{w.summary}</p>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container project-layout">
          <Reveal className="project-story">
            <h2 className="h-display">The story</h2>
            {w.story.map((p) => (<p key={p}>{p}</p>))}
            <ul className="highlights" aria-label="Highlights">
              {w.highlights.map((h) => (<li key={h}><Icon name="check" size={16} />{h}</li>))}
            </ul>
          </Reveal>
          <Reveal as="aside" className="project-facts">
            <h2 className="project-facts__title">At a glance</h2>
            <dl>
              <div><dt>Location</dt><dd>{dest ? <Link to={`/destinations/${dest.slug}`}>{w.location}</Link> : w.location}</dd></div>
              <div><dt>Event type</dt><dd>{w.eventType}</dd></div>
              <div><dt>Style</dt><dd>{w.style}</dd></div>
              <div><dt>Theme</dt><dd>{w.theme}</dd></div>
              <div><dt>Guests</dt><dd>{w.guests}</dd></div>
              <div><dt>Date</dt><dd>{w.season} {w.year}</dd></div>
              <div><dt>Palette</dt><dd><span className="swatches">{w.palette.map((c) => (<span key={c} className="swatch" style={{ background: c }} title={c}><span className="sr-only">{c}</span></span>))}</span></dd></div>
            </dl>
            <h3 className="project-facts__sub">Services involved</h3>
            <ul className="tag-list">
              {w.services.map((name, i) => (<li key={name}>{svc[i] ? <Link to={`/services/${svc[i]!.slug}`}>{name}</Link> : name}</li>))}
            </ul>
            <Button to="/plan" variant="primary">Plan something similar</Button>
          </Reveal>
        </div>
      </section>

      <section className="section section--cream section--tight" aria-labelledby="gallery-title">
        <div className="container">
          <Reveal className="section-head">
            <div><p className="eyebrow">Gallery</p><h2 className="h-display" id="gallery-title">Photographs</h2></div>
            <p className="fineprint fineprint--inline">Select any image to open the full-screen gallery.</p>
          </Reveal>
          <ul className="mosaic" aria-label={`${w.title} gallery`}>
            {w.gallery.map((im, i) => (
              <li key={im.src} className={`mosaic__item mosaic__item--${i % 4}`}>
                <button type="button" onClick={() => setLb(i)} aria-label={`Open photo ${i + 1} of ${w.gallery.length}: ${im.alt}`}>
                  <Photo image={im} small sizes="(min-width: 900px) 33vw, 100vw" alt="" />
                  <span className="mosaic__icon" aria-hidden="true"><Icon name="expand" size={18} /></span>
                </button>
              </li>
            ))}
          </ul>
          <DemoBanner>Illustrative photography: images show real places and details, and do not depict this fictional wedding.</DemoBanner>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-title">
          <div className="container">
            <Reveal className="section-head"><div><p className="eyebrow">Continue exploring</p><h2 className="h-display" id="related-title">Related weddings</h2></div>
              <Link to={`/weddings/${next.slug}`} className="link-arrow">Next: {next.title} <Icon name="arrow" size={18} /></Link></Reveal>
            <ul className="grid grid--weddings">
              {related.map((r) => (<li key={r.slug}><WeddingCard w={r} /></li>))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title="Let’s plan your own story" body="Begin a short enquiry and a planner would respond with ideas — in this demonstration, nothing is sent." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Book a consultation', to: '/contact' }} />
      {lb !== null && <Lightbox images={w.gallery} index={lb} title={w.title} onClose={() => setLb(null)} onIndex={setLb} />}
    </>
  );
}
