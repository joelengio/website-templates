import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { images } from '../config/images';
import type { GalleryItem } from '../config/types';
import { useDialog } from '../hooks/useDialog';
import { Icon } from './Icon';

interface Props {
  items: GalleryItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}

const SWIPE_PX = 48;

export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const open = index !== null;
  const ref = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useDialog(ref, { active: open, onClose });

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'Home') { e.preventDefault(); onIndex(0); }
      else if (e.key === 'End') { e.preventDefault(); onIndex(items.length - 1); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, go, onIndex, items.length]);

  // Preload neighbours for instant navigation
  useEffect(() => {
    if (index === null) return;
    [index + 1, index - 1].forEach((i) => {
      const item = items[(i + items.length) % items.length];
      const img = (images as Record<string, { src: string }>)[item.image];
      if (img) new Image().src = img.src;
    });
  }, [index, items]);

  if (index === null) return null;
  const item = items[index];
  const img = (images as Record<string, (typeof images)[keyof typeof images]>)[item.image];

  return createPortal(
    // Backdrop click is a pointer convenience; keyboard users close with Escape or the close button.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="lightbox-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={`Photo viewer, image ${index + 1} of ${items.length}`}
        tabIndex={-1}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const s = touchStart.current;
          touchStart.current = null;
          if (!s) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - s.x;
          const dy = t.clientY - s.y;
          if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
        }}
      >
        <button type="button" className="icon-btn lightbox__close" onClick={onClose} aria-label="Close photo viewer" data-autofocus>
          <Icon name="close" size={24} />
        </button>
        <button type="button" className="icon-btn lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
          <Icon name="chevron-left" size={26} />
        </button>
        <figure className="lightbox__figure">
          {img && <img key={item.image} src={img.src} alt={img.alt} className="lightbox__img" draggable={false} />}
          <figcaption>
            <span>{item.caption}</span>
            <span className="lightbox__count" aria-live="polite">
              {index + 1} / {items.length}
            </span>
          </figcaption>
        </figure>
        <button type="button" className="icon-btn lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next photo">
          <Icon name="chevron" size={26} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
