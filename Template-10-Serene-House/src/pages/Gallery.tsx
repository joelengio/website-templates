import { useCallback, useMemo, useState } from 'react';
import { galleryCategories, galleryItems } from '../config/gallery';
import { site } from '../config/site';
import { Seo } from '../components/Seo';
import { Lightbox } from '../components/Lightbox';
import { Img, SectionHeading } from '../components/ui';

export default function Gallery() {
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(() => galleryItems.filter((g) => cat === 'all' || g.category === cat), [cat]);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <Seo title={site.pages.gallery.title} description={site.pages.gallery.description} />
      <section className="page-hero"><div className="container"><SectionHeading as="h1" eyebrow="Gallery" title="Inside the house" text="Light, linen, botanicals and quiet details. Select any image to view it larger." /></div></section>
      <section className="section section--tight">
        <div className="container">
          <div className="chips" role="group" aria-label="Filter gallery by category">
            {[{ id: 'all', name: 'All' }, ...galleryCategories].map((c) => (
              <button key={c.id} type="button" className={`chip ${cat === c.id ? 'is-active' : ''}`} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.name}</button>
            ))}
          </div>
          <p className="result-count" role="status" aria-live="polite">{items.length} images shown</p>
          <ul className="masonry">
            {items.map((g, i) => (
              <li key={g.id}>
                <button type="button" className="masonry-item" onClick={() => setOpen(i)} aria-label={`Open image: ${g.caption}`} aria-haspopup="dialog">
                  <Img image={g.image} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                  <span className="masonry-cap">{g.caption}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="demo-label">Gallery images are original illustrations created for this template. Replace them with your own photography.</p>
        </div>
      </section>
      {open !== null && <Lightbox items={items} index={open} onClose={close} onIndex={setOpen} />}
    </>
  );
}
