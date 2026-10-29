import { useCallback, useEffect, useRef } from 'react';
import type { GalleryItem } from '../config/types';
import { Icon } from './Icon';

export function Lightbox({ items, index, onClose, onIndex }: { items: GalleryItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const item = items[index];
  const go = useCallback((d: number) => onIndex((index + d + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.body.classList.add('no-scroll');
    ref.current?.querySelector<HTMLElement>('.lb-close')?.focus();
    return () => {
      document.body.classList.remove('no-scroll');
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  if (!item) return null;
  return (
    <div
      ref={ref}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <button type="button" className="lb-close" onClick={onClose} aria-label="Close image viewer"><Icon name="close" size={24} /></button>
      <button type="button" className="lb-nav lb-prev" onClick={() => go(-1)} aria-label="Previous image"><Icon name="chevronLeft" size={28} /></button>
      <figure className="lb-figure">
        <img src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} />
        <figcaption aria-live="polite">{item.caption} <span>{index + 1} / {items.length}</span></figcaption>
      </figure>
      <button type="button" className="lb-nav lb-next" onClick={() => go(1)} aria-label="Next image"><Icon name="chevronRight" size={28} /></button>
    </div>
  );
}
