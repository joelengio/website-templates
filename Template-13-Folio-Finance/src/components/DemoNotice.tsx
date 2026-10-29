import type { ReactNode } from 'react';
import { Icon } from './Icon';

export function Notice({ tone = 'info', title, children }: { tone?: 'info' | 'warn' | 'success' | 'error'; title?: string; children: ReactNode }) {
  return (
    <div className={`notice notice--${tone}`} role={tone === 'error' ? 'alert' : 'note'}>
      <Icon name={tone === 'error' || tone === 'warn' ? 'alert' : tone === 'success' ? 'check' : 'info'} size={18} />
      <div>
        {title && <strong>{title}</strong>}
        <p>{children}</p>
      </div>
    </div>
  );
}
