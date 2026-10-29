import { useState } from 'react';
import Img from '../components/Img';
import Lightbox from '../components/Lightbox';
import Section, { PageHero } from '../components/Section';
import { gallery, galleryCategories } from '../config/gallery';
import { seoRoutes } from '../config/seo';
import { useSeo } from '../hooks/useSeo';
import { plural } from '../lib/format';

export default function Gallery() {
  useSeo({ ...seoRoutes['/gallery'], path: '/gallery' });
  const [cat, setCat] = useState<(typeof galleryCategories)[number]>('All');
  const [lb, setLb] = useState<number | null>(null);
  const items = cat === 'All' ? gallery : gallery.filter((g) => g.category === cat);
  return (
    <>
      <PageHero kicker="Gallery" title="A look around" text="Original illustrations stand in for photography in this template. Replace them with your own images." />
      <Section tone="cream">
        <div className="chips chips--lg" role="group" aria-label="Filter gallery by category">
          {galleryCategories.map((c) => <button key={c} type="button" className={`chip${cat === c ? ' is-on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <p role="status" className="results-line">{plural(items.length, 'image')}</p>
        <ul className="masonry">
          {items.map((g, i) => (
            <li key={g.src} className={i % 5 === 0 ? 'wide' : ''}>
              <button type="button" onClick={() => setLb(i)} aria-label={`Open ${g.caption} fullscreen`}>
                <Img src={g.src} alt={g.alt} ratio={[8, 5]} />
                <span>{g.caption}</span>
              </button>
            </li>
          ))}
        </ul>
        <Lightbox images={items} index={lb} onIndex={setLb} label="Gallery viewer" />
      </Section>
    </>
  );
}
