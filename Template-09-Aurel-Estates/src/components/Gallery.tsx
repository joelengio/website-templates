import { useCallback, useEffect, useState } from 'react';
import type { PropertyImage } from '../config/types';
import { Icon } from './Icon';
import { Modal } from './Modal';

export function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;
  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, go]);

  const current = images[index];
  return (
    <section className="gallery" aria-roledescription="carousel" aria-label={`${title} photo gallery`}>
      <div className="gallery__stage">
        <button type="button" className="gallery__open" onClick={() => setOpen(true)} aria-label={`View larger — photo ${index + 1} of ${count}, full screen`}>
          <img src={current.src} alt={current.alt} width={1600} height={1067} />
          <span className="gallery__expand">
            <Icon name="expand" size={18} /> View larger
          </span>
        </button>
        {count > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(index - 1)} aria-label="Previous photo">
              <Icon name="left" />
            </button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(index + 1)} aria-label="Next photo">
              <Icon name="right" />
            </button>
          </>
        )}
        <p className="gallery__counter" aria-live="polite">
          Photo {index + 1} of {count}
        </p>
      </div>
      <ul className="gallery__thumbs" aria-label="Choose a photo">
        {images.map((im, i) => (
          <li key={im.src}>
            <button type="button" className={i === index ? 'is-active' : ''} aria-label={`Show photo ${i + 1}: ${im.alt}`} aria-current={i === index} onClick={() => setIndex(i)}>
              <img src={im.thumb ?? im.src} alt="" width={160} height={110} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      <Modal open={open} onClose={() => setOpen(false)} label={`${title} — photo ${index + 1} of ${count}`} side="full" className="lightbox">
        <button type="button" className="lightbox__close" data-autofocus aria-label="Close gallery" onClick={() => setOpen(false)}>
          <Icon name="close" size={24} />
        </button>
        <figure className="lightbox__figure">
          <img src={current.src} alt={current.alt} />
          <figcaption>
            {current.alt} <span>({index + 1} / {count})</span>
          </figcaption>
        </figure>
        {count > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(index - 1)} aria-label="Previous photo">
              <Icon name="left" />
            </button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(index + 1)} aria-label="Next photo">
              <Icon name="right" />
            </button>
          </>
        )}
      </Modal>
    </section>
  );
}
