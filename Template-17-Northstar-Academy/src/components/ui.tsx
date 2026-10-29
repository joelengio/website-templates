import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function SectionHeader({ eyebrow, title, intro, action, as: H = 'h2', align = 'left' }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; action?: { label: string; to: string }; as?: 'h1' | 'h2'; align?: 'left' | 'center' }) {
  return (
    <header className={`section-head section-head--${align}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <H className="section-title">{title}</H>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {action && (
        <Link to={action.to} className="text-link">
          {action.label} <Icon name="arrow" size={16} />
        </Link>
      )}
    </header>
  );
}

export function Section({ id, className = '', children, tone }: { id?: string; className?: string; children: ReactNode; tone?: 'soft' | 'ink' | 'cobalt' }) {
  return (
    <section id={id} className={`section${tone ? ` section--${tone}` : ''} ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 data-page-heading tabIndex={-1}>{title}</h1>
        {intro && <p className="page-hero__intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function ProgressBar({ percent, label, tone = 'cobalt' }: { percent: number; label?: string; tone?: 'cobalt' | 'teal' }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="progress">
      <div className="progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p} aria-label={label ?? 'Progress'}>
        <div className={`progress__fill progress__fill--${tone}`} style={{ width: `${p}%` }} />
      </div>
      <span className="progress__value" aria-hidden="true">{p}%</span>
    </div>
  );
}

export function ProgressRing({ percent, size = 96, label, children }: { percent: number; size?: number; label?: string; children?: ReactNode }) {
  const p = Math.max(0, Math.min(100, percent));
  const stroke = Math.max(8, size / 9);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={label ?? `${p}% complete`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--c-soft)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p === 100 ? 'var(--c-teal)' : 'var(--c-cobalt)'} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} className="ring__arc" />
      </svg>
      <span className="ring__label" aria-hidden="true">{children ?? `${p}%`}</span>
    </div>
  );
}

/** Demonstration rating — always labelled as fictional demo data. */
export function Rating({ value, count, compact }: { value: number; count: number; compact?: boolean }) {
  return (
    <span className="rating" title="Fictional demonstration rating">
      <Icon name="star" size={14} className="rating__star" />
      <strong>{value.toFixed(1)}</strong>
      {!compact && <span className="rating__count">({count.toLocaleString('en-US')})</span>}
      <span className="rating__demo">demo rating</span>
    </span>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q} className="faq__item">
          <summary>
            <span>{f.q}</span>
            <Icon name="chevron" size={22} className="faq__chev" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty" role="status">
      <Icon name="search" size={28} />
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function DemoNotice({ compact }: { compact?: boolean }) {
  return (
    <aside className={`demo-notice${compact ? ' demo-notice--compact' : ''}`} aria-label="Demonstration limitations">
      <Icon name="shield" size={22} />
      <div>
        <strong>Local demonstration.</strong>{' '}
        {compact
          ? 'Progress lives only in this browser — no real account, server records or payments.'
          : 'Progress is stored locally in this browser. No real user account exists and no server-side learning records are kept. Enrollments are demonstrations, no payments take place, certificates are not accredited, and clearing browser storage removes your data.'}
      </div>
    </aside>
  );
}
