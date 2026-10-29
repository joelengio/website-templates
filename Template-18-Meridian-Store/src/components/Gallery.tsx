import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductImage } from '../config/types';
import { Icon } from './Icon';
import { SafeImg } from './ui';
import { useDialog } from './useDialog';

function Lightbox({ images, index, setIndex, onClose }: { images: ProductImage[]; index: number; setIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  useDialog(true, onClose, ref);
  const go = useCallback((d: number) => { setZoom(false); setIndex((index + d + images.length) % images.length); }, [index, images.length, setIndex]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go]);
  const img = images[index];
  return (
    <div className="lightbox" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Product image viewer" tabIndex={-1}>
        <div className="lightbox-bar">
          <p aria-live="polite">Image {index + 1} of {images.length}</p>
          <div>
            <button type="button" className="icon-btn" onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? 'Zoom out' : 'Zoom in'}><Icon name="expand" /></button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close image viewer" data-autofocus><Icon name="close" /></button>
          </div>
        </div>
        <div className={`lightbox-stage${zoom ? ' is-zoom' : ''}`}>
          {images.length > 1 && <button type="button" className="lightbox-nav prev" onClick={() => go(-1)} aria-label="Previous image"><Icon name="chevronLeft" size={26} /></button>}
          <SafeImg key={img.src} src={img.src} alt={img.alt} className="lightbox-img" eager />
          {images.length > 1 && <button type="button" className="lightbox-nav next" onClick={() => go(1)} aria-label="Next image"><Icon name="chevronRight" size={26} /></button>}
        </div>
        <p className="lightbox-caption">{img.alt}</p>
      </div>
    </div>
  );
}

/** Product gallery with thumbnails, previous/next controls and a fullscreen viewer (arrow keys, Escape, focus trap). */
export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  // when the available images change (variant selection) show the first one
  const signature = images.map((i) => i.src).join('|');
  const [lastSig, setLastSig] = useState(signature);
  if (signature !== lastSig) { setLastSig(signature); setIndex(0); }
  const safe = Math.min(index, images.length - 1);
  const cur = images[safe];
  return (
    <div className="gallery" role="group" aria-roledescription="carousel" aria-label={`${name} images`}>
      <div className="gallery-main">
        <button type="button" className="gallery-open" onClick={() => setOpen(true)} aria-label={`Open image ${safe + 1} of ${images.length} in full screen`}>
          <SafeImg key={cur.src} src={cur.src} alt={cur.alt} width={800} height={1000} eager className="gallery-img" />
          <span className="gallery-expand" aria-hidden="true"><Icon name="expand" size={18} /></span>
        </button>
        {images.length > 1 && (
          <div className="gallery-arrows">
            <button type="button" className="icon-btn" onClick={() => setIndex((safe - 1 + images.length) % images.length)} aria-label="Previous image"><Icon name="chevronLeft" /></button>
            <button type="button" className="icon-btn" onClick={() => setIndex((safe + 1) % images.length)} aria-label="Next image"><Icon name="chevronRight" /></button>
          </div>
        )}
        <p className="gallery-count" aria-live="polite">{safe + 1} / {images.length}</p>
      </div>
      {images.length > 1 && (
        <ul className="gallery-thumbs" aria-label="Choose image">
          {images.map((img, i) => (
            <li key={img.src}>
              <button type="button" onClick={() => setIndex(i)} aria-label={`Show image ${i + 1}: ${img.alt}`} aria-current={i === safe ? 'true' : undefined} className={i === safe ? 'is-active' : ''}>
                <SafeImg src={img.src} alt="" width={120} height={150} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && <Lightbox images={images} index={safe} setIndex={setIndex} onClose={() => setOpen(false)} />}
    </div>
  );
}
