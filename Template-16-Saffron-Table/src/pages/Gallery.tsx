import { useMemo, useState } from 'react';
import { Img } from '../components/Img';
import { Lightbox } from '../components/Lightbox';
import { PageHero } from '../components/Section';
import { galleryCategories, galleryContent, galleryItems } from '../config/gallery';
import { images } from '../config/images';
import { useSeo } from '../hooks/useSeo';
import { pageSeo } from '../lib/seo';

export default function Gallery() {
  useSeo({ ...pageSeo('/gallery'), path: '/gallery' });
  const [cat, setCat] = useState('All');
  const [index, setIndex] = useState<number | null>(null);
  const items = useMemo(() => (cat === 'All' ? galleryItems : galleryItems.filter((g) => g.category === cat)), [cat]);
  return (
    <>
      <PageHero {...galleryContent} image="dining-green" />
      <section className="section section--dark">
        <div className="container">
          <div className="chips chips--center" role="group" aria-label="Filter photos by category">
            {['All', ...galleryCategories].map((c) => (
              <button key={c} type="button" className={`chip${cat === c ? ' is-on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <p className="results-count" role="status" aria-live="polite">{items.length} photographs</p>
          <ul className="gallery">
            {items.map((g, i) => {
              const img = (images as Record<string, { alt: string }>)[g.image];
              return (
                <li key={g.image + g.category} className="gallery__item">
                  <button type="button" onClick={() => setIndex(i)} aria-label={`Open photo: ${g.caption}`} aria-haspopup="dialog">
                    <Img name={g.image} sizes="(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw" alt={img?.alt ?? g.caption} />
                    <span className="gallery__cap">{g.caption}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
