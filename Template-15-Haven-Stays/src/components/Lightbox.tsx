import { useEffect, useRef } from 'react';
import type { Img } from '../config/types';
import { trapTab } from '../lib/focus';
import Icon from './Icon';

interface Props {
  images: (Img & { caption?: string })[];
  index: number | null;
  onIndex: (i: number | null) => void;
  label?: string;
}

/** Keyboard-accessible fullscreen lightbox: ←/→ navigate, Esc closes, focus is trapped and restored. */
export default function Lightbox({ images, index, onIndex, label = 'Image viewer' }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
      document.body.classList.add('no-scroll');
    }
    if (!open && d.open) {
      d.close();
      document.body.classList.remove('no-scroll');
      (opener.current as HTMLElement | null)?.focus?.();
    }
  }, [open]);
  useEffect(() => () => document.body.classList.remove('no-scroll'), []);

  const go = (d: number) => index !== null && onIndex((index + d + images.length) % images.length);
  const cur = index !== null ? images[index] : null;

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={label}
      onCancel={(e) => { e.preventDefault(); onIndex(null); }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'ArrowLeft') go(-1);
        else trapTab(e, ref.current);
      }}
    >
      {cur && (
        <div className="lightbox__inner">
          <button type="button" className="lightbox__close icon-btn" onClick={() => onIndex(null)} aria-label="Close image viewer"><Icon name="close" /></button>
          <figure>
            <img src={cur.src} alt={cur.alt} />
            <figcaption>{cur.caption ?? cur.alt} <span className="lightbox__count" aria-live="polite">{index! + 1} / {images.length}</span></figcaption>
          </figure>
          {images.length > 1 && (
            <>
              <button type="button" className="lightbox__nav lightbox__nav--prev icon-btn" onClick={() => go(-1)} aria-label="Previous image"><Icon name="chevron-left" /></button>
              <button type="button" className="lightbox__nav lightbox__nav--next icon-btn" onClick={() => go(1)} aria-label="Next image"><Icon name="chevron-right" /></button>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
