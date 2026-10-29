import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import type { ImageRef } from '../config/types';
import { Icon } from './Icon';

interface Props {
  images: ImageRef[];
  index: number;
  title: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/**
 * Fullscreen gallery dialog: arrow keys / swipe / buttons to navigate, Home/End to jump, Esc to close,
 * thumbnail strip, focus trapped inside and restored to the opener on close, background scroll locked.
 */
export function Lightbox({ images, index, title, onClose, onIndex }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const [loadedSrc, setLoadedSrc] = useState('');
  const count = images.length;
  const current = images[index];
  const loaded = loadedSrc === current.src;

  const go = useCallback((delta: number) => onIndex((index + delta + count) % count), [index, count, onIndex]);

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Everything behind the dialog becomes inert (not focusable, hidden from assistive tech).
    const app = document.getElementById('root');
    if (app) app.inert = true;
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      if (app) app.inert = false;
      opener.current?.focus?.();
    };
  }, []);

  // Keep the active thumbnail in view.
  useEffect(() => {
    root.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [index]);

  // Warm the cache for neighbours.
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const im = images[(i + count) % count];
      if (im) new Image().src = im.src;
    });
  }, [index, images, count]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onIndex(count - 1);
    } else if (e.key === 'Tab') {
      const items = Array.from(root.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} — photo gallery`} ref={root} onKeyDown={onKey}>
      <div className="lightbox__bar">
        <p className="lightbox__count" aria-live="polite">
          <span className="sr-only">Photo </span>
          {index + 1} / {count}
        </p>
        <p className="lightbox__title">{title}</p>
        <button type="button" className="lightbox__close" ref={closeBtn} onClick={onClose} aria-label="Close gallery">
          <Icon name="close" size={24} />
        </button>
      </div>
      <div className="lightbox__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={(e) => e.target === e.currentTarget && onClose()}>
        {count > 1 && (
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
            <Icon name="chevronLeft" size={28} />
          </button>
        )}
        <figure className={`lightbox__figure${loaded ? ' is-loaded' : ''}`}>
          <img key={current.src} src={current.src} alt={current.alt} onLoad={() => setLoadedSrc(current.src)} draggable={false} />
          <figcaption>{current.alt}</figcaption>
        </figure>
        {count > 1 && (
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next photo">
            <Icon name="chevronRight" size={28} />
          </button>
        )}
      </div>
      {count > 1 && (
        <ul className="lightbox__thumbs" aria-label="Photo thumbnails">
          {images.map((im, i) => (
            <li key={im.src}>
              <button type="button" onClick={() => onIndex(i)} aria-label={`Show photo ${i + 1}: ${im.alt}`} aria-current={i === index ? 'true' : undefined}>
                <img src={im.small} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body
  );
}
