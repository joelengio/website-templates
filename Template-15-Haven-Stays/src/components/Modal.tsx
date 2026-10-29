import { useEffect, useRef, type ReactNode } from 'react';
import { trapTab } from '../lib/focus';
import Icon from './Icon';

/** Accessible modal built on the native <dialog>: focus trap, Escape to close, focus returns to the opener. */
export default function Modal({ open, onClose, title, children, className = '', hideTitle = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string; hideTitle?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
      document.body.classList.add('no-scroll');
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) {
      document.body.classList.remove('no-scroll');
      (opener.current as HTMLElement | null)?.focus?.();
      opener.current = null;
    }
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  // Clicking the backdrop (the dialog element itself) closes the modal.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) onClose();
    };
    d.addEventListener('click', onClick);
    return () => d.removeEventListener('click', onClick);
  }, [onClose]);

  return (
    <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={(e) => { e.preventDefault(); onClose(); }} onKeyDown={(e) => trapTab(e, ref.current)}>
      {open && (
        <div className="modal__body">
          <div className="modal__head">
            <h2 className={hideTitle ? 'sr-only' : 'modal__title'}>{title}</h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
              <Icon name="close" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
