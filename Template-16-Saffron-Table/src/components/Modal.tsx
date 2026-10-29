import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from '../hooks/useDialog';
import { Icon } from './Icon';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(ref, { active: open, onClose });
  if (!open) return null;
  return createPortal(
    // Backdrop click is a pointer convenience; keyboard users close with Escape or the close button.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <header className="modal__head">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
