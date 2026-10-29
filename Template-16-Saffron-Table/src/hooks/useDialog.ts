import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const focusables = (el: HTMLElement): HTMLElement[] =>
  Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null || n === document.activeElement);

interface Options {
  active: boolean;
  onClose: () => void;
  /** Make #root inert and lock body scroll (for portal dialogs). */
  modal?: boolean;
}

/** Focus trap + Escape + focus restore (+ inert background & scroll lock for modal dialogs). */
export function useDialog(ref: RefObject<HTMLElement | null>, { active, onClose, modal = true }: Options): void {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = document.getElementById('root');
    const prevOverflow = document.body.style.overflow;
    if (modal) {
      root?.setAttribute('inert', '');
      document.body.style.overflow = 'hidden';
    }
    const initial = el.querySelector<HTMLElement>('[data-autofocus]') ?? focusables(el)[0] ?? el;
    initial.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables(el);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !el.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (modal) {
        root?.removeAttribute('inert');
        document.body.style.overflow = prevOverflow;
      }
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [active, modal, ref]);
}
