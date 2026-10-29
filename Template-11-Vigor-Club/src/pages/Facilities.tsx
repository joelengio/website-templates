import { useState } from 'react';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Lightbox } from '../components/Lightbox';
import { Img, PageHero, Reveal, SectionHead, LinkButton } from '../components/ui';
import { FacilityCard } from '../components/Cards';
import { facilities, gallery } from '../config/facilities';
import { ctas } from '../config/navigation';

export default function Facilities() {
  const areas = ['All', ...new Set(gallery.map((g) => g.area))];
  const [area, setArea] = useState('All');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const items = gallery.filter((g) => area === 'All' || g.area === area);

  return (
    <>
      <Seo title="Facilities" description="Six training zones: strength, cardio, functional, group exercise, private coaching and recovery. Browse the gallery." />
      <PageHero eyebrow="Facilities" title={<>Built for <span className="accent">serious</span> training.</>} intro="Six purpose-built zones under one roof. Photography is licensed stock used for demonstration — replace it with your own." />
      <section className="section section--tight">
        <div className="container">
          <h2 className="sr-only">Training zones</h2>
          <div className="facility-grid">
            {facilities.map((f, i) => <Reveal key={f.slug}><FacilityCard facility={f} index={i} /></Reveal>)}
          </div>
        </div>
      </section>
      <section className="section section--charcoal" aria-labelledby="zones-title">
        <div className="container">
          <SectionHead eyebrow="What's inside" title={<span id="zones-title">Zone by zone</span>} />
          <div className="zone-list">
            {facilities.map((f) => (
              <Reveal key={f.slug} className="zone">
                <h3 className="h-card">{f.name}</h3>
                <ul className="tick-list">{f.highlights.map((h) => <li key={h}><Icon name="check" size={18} />{h}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="gallery-title">
        <div className="container">
          <SectionHead eyebrow="Gallery" title={<span id="gallery-title">See the space</span>} intro="Select an image to open the viewer. Use ← → to browse and Esc to close." />
          <div className="chip-row" role="group" aria-label="Filter gallery by area">
            {areas.map((a) => <button key={a} type="button" className={`chip-btn ${area === a ? 'is-active' : ''}`} aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>)}
          </div>
          <ul className="masonry" aria-label="Facility images">
            {items.map((g, i) => (
              <li key={g.id}>
                <button type="button" className="masonry-item" onClick={() => setOpenIdx(i)} aria-label={`Open image: ${g.caption}`}>
                  <Img image={g.image} sizes="(min-width: 900px) 33vw, 50vw" />
                  <span className="masonry-cap">{g.caption}<Icon name="expand" size={16} /></span>
                </button>
              </li>
            ))}
          </ul>
          <div className="center-cta">
            <p className="lead">Want to see it in person? Arrange a visit.</p>
            <LinkButton to={ctas.trial.to}>{ctas.trial.label}</LinkButton>
          </div>
        </div>
      </section>
      {openIdx !== null && <Lightbox items={items} index={openIdx} onClose={() => setOpenIdx(null)} onIndex={setOpenIdx} />}
    </>
  );
}
