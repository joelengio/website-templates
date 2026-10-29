import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from '../hooks/useDialog';

/** Accessible modal dialog: focus moves in, Tab is trapped, Escape closes, focus returns to the opener. */
export function Modal({ open, onClose, label, children, className = '', side }: { open: boolean; onClose: () => void; label: string; children: ReactNode; className?: string; side?: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(open, onClose, ref);
  if (!open) return null;
  return createPortal(
    <div className={`modal modal--${side ?? 'center'}`}>
      <div className="modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={ref} className={`modal__panel ${className}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
