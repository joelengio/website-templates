import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WeddingCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { Lightbox } from '../components/Lightbox';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { Breadcrumb, Button, CtaBand, DemoBanner } from '../components/ui';
import { destinations, getDestination, weddings } from '../config';
import NotFound from './NotFound';

export default function DestinationDetail() {
  const { slug } = useParams();
  const d = getDestination(slug);
  const [lb, setLb] = useState<number | null>(null);
  if (!d) return <NotFound />;
  const projects = weddings.filter((w) => w.destinationSlug === d.slug);
  const more = destinations.filter((x) => x.slug !== d.slug && (x.category === d.category || x.continent === d.continent)).slice(0, 3);

  return (
    <>
      <Seo title={`${d.name}, ${d.country} — Wedding Destination`} description={d.summary} image={d.cover.src} />
      <header className="project-hero">
        <div className="project-hero__media"><Photo image={d.cover} priority sizes="100vw" /></div>
        <div className="project-hero__veil" aria-hidden="true" />
        <div className="container project-hero__inner">
          <Breadcrumb items={[{ label: 'Destinations', to: '/destinations' }, { label: d.name }]} />
          <p className="eyebrow eyebrow--light">{d.country} · {d.category}</p>
          <h1 className="h-display">{d.name}</h1>
          <p className="project-hero__sub">{d.tagline}</p>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container project-layout">
          <Reveal className="project-story">
            <h2 className="h-display">About this destination</h2>
            <p>{d.summary}</p>
            <h3 className="h-sub">Venue styles</h3>
            <ul className="tag-list tag-list--lg">{d.venueStyles.map((v) => (<li key={v}>{v}</li>))}</ul>
            <h3 className="h-sub">Planning notes</h3>
            <ul className="checklist">{d.planningNotes.map((n) => (<li key={n}><Icon name="check" size={18} />{n}</li>))}</ul>
          </Reveal>
          <Reveal as="aside" className="project-facts">
            <h2 className="project-facts__title">Planning information</h2>
            <dl>
              <div><dt>Country</dt><dd>{d.country}</dd></div>
              <div><dt>Best season</dt><dd>{d.bestSeason}</dd></div>
              <div><dt>Guest range</dt><dd>{d.guestRange} guests</dd></div>
              <div><dt>Getting there</dt><dd>{d.travel}</dd></div>
            </dl>
            <Button to={`/plan?destination=${d.slug}`}>Plan a celebration here</Button>
          </Reveal>
        </div>
      </section>

      <section className="section section--cream section--tight" aria-labelledby="dg-title">
        <div className="container">
          <Reveal className="section-head"><div><p className="eyebrow">Gallery</p><h2 className="h-display" id="dg-title">{d.name} in pictures</h2></div></Reveal>
          <ul className="mosaic" aria-label={`${d.name} gallery`}>
            {d.gallery.map((im, i) => (
              <li key={im.src} className={`mosaic__item mosaic__item--${i % 4}`}>
                <button type="button" onClick={() => setLb(i)} aria-label={`Open photo ${i + 1} of ${d.gallery.length}: ${im.alt}`}>
                  <Photo image={im} small sizes="(min-width: 900px) 33vw, 100vw" alt="" />
                  <span className="mosaic__icon" aria-hidden="true"><Icon name="expand" size={18} /></span>
                </button>
              </li>
            ))}
          </ul>
          <DemoBanner>Demonstration destination. Venues are not named or verified, and legal requirements change — always confirm with official sources.</DemoBanner>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="section" aria-labelledby="dp-title">
          <div className="container">
            <Reveal className="section-head"><div><p className="eyebrow">Our work here</p><h2 className="h-display" id="dp-title">Celebrations in {d.name}</h2></div></Reveal>
            <ul className="grid grid--weddings">{projects.map((w) => (<li key={w.slug}><WeddingCard w={w} /></li>))}</ul>
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="section section--cream section--tight" aria-labelledby="dm-title">
          <div className="container">
            <Reveal className="section-head"><div><p className="eyebrow">Keep exploring</p><h2 className="h-display" id="dm-title">Similar destinations</h2></div><Link to="/destinations" className="link-arrow">All destinations <Icon name="arrow" size={18} /></Link></Reveal>
            <ul className="link-list">{more.map((m) => (<li key={m.slug}><Link to={`/destinations/${m.slug}`}><span>{m.name}, {m.country}</span><Icon name="arrow" size={18} /></Link></li>))}</ul>
          </div>
        </section>
      )}

      <CtaBand eyebrow="Consultation" title={`Celebrate in ${d.name}`} body="Tell us about your plans and we will explore the possibilities together." primary={{ label: 'Start your enquiry', to: `/plan?destination=${d.slug}` }} secondary={{ label: 'Contact the studio', to: '/contact' }} />
      {lb !== null && <Lightbox images={d.gallery} index={lb} title={d.name} onClose={() => setLb(null)} onIndex={setLb} />}
    </>
  );
}
