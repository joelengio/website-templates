import type { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

export function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onClose, danger }: { open: boolean; title: string; children: ReactNode; confirmLabel: string; onConfirm: () => void; onClose: () => void; danger?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} label={title} className="dialog">
      <h2 className="dialog__title">{title}</h2>
      <div>{children}</div>
      <div className="dialog__actions">
        <Button variant="ghost" onClick={onClose} data-autofocus>Cancel</Button>
        <Button variant={danger ? 'ink' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
