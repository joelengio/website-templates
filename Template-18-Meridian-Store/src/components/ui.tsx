import { useId, useState, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { Icon } from './Icon';

export function SectionHeading({ eyebrow, title, as: Tag = 'h2', action, center, id }: { eyebrow?: string; title: string; as?: 'h1' | 'h2'; action?: ReactNode; center?: boolean; id?: string }) {
  return (
    <div className={`section-heading${center ? ' is-center' : ''}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Tag className="section-title" id={id}>{title}</Tag>
      </div>
      {action}
    </div>
  );
}

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to} className="arrow-link">{children}<Icon name="arrowRight" size={16} /></Link>;
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((it, i) => (
          <li key={it.label}>{it.to && i < items.length - 1 ? <Link to={it.to}>{it.label}</Link> : <span aria-current={i === items.length - 1 ? 'page' : undefined}>{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ eyebrow, title, text, children }: { eyebrow?: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div className="container">
        {children}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {text && <p className="lede">{text}</p>}
      </div>
    </header>
  );
}

export function EmptyState({ title, text, actions, icon = 'bag' }: { title: string; text: string; actions?: ReactNode; icon?: 'bag' | 'heart' | 'search' | 'package' }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name={icon} size={28} /></span>
      <h2 className="h3">{title}</h2>
      <p>{text}</p>
      {actions && <div className="empty-actions">{actions}</div>}
    </div>
  );
}

/** Prominent notice that checkout is a demonstration. Shown on every checkout step, the bag and order pages. */
export function DemoNotice({ compact }: { compact?: boolean }) {
  return (
    <div className={`demo-notice${compact ? ' is-compact' : ''}`} role="note">
      <span className="demo-tag">DEMO</span>
      <p>{compact ? 'Demonstration checkout — no payment is taken and no real order is placed.' : site.demo.checkoutNotice}</p>
    </div>
  );
}

interface FieldShell { label: string; error?: string; hint?: string; optional?: boolean }
export function TextField({ label, error, hint, optional, ...rest }: FieldShell & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const describedBy = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}{optional && <span className="optional"> (optional)</span>}</label>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest} />
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-error"><Icon name="alert" size={14} /> {error}</p>}
    </div>
  );
}
export function SelectField({ label, error, hint, optional, children, ...rest }: FieldShell & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  const describedBy = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}{optional && <span className="optional"> (optional)</span>}</label>
      <select id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest}>{children}</select>
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-error"><Icon name="alert" size={14} /> {error}</p>}
    </div>
  );
}
export function TextAreaField({ label, error, hint, ...rest }: FieldShell & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const describedBy = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest} />
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-error"><Icon name="alert" size={14} /> {error}</p>}
    </div>
  );
}

/** Image that degrades gracefully: when the file is missing or fails to load, a neutral placeholder with the alt text is shown. */
export function SafeImg({ src, alt, className = '', width, height, eager, sizes }: { src: string; alt: string; className?: string; width?: number; height?: number; eager?: boolean; sizes?: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  if (failed === src || !src) return <div className={`img-fallback ${className}`} role="img" aria-label={alt}><Icon name="package" size={28} /></div>;
  return <img src={src} alt={alt} className={className} width={width} height={height} sizes={sizes} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(src)} />;
}

/** Quantity stepper with accessible buttons; typing is committed on blur or Enter. */
export function QtyStepper({ value, min = 1, max, onChange, label, disabled }: { value: number; min?: number; max: number; onChange: (n: number) => void; label: string; disabled?: boolean }) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => { if (draft !== null) { const n = Number.parseInt(draft, 10); setDraft(null); onChange(Number.isFinite(n) ? n : value); } };
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={disabled || value <= min} aria-label={`Decrease quantity — ${label}`}><Icon name="minus" size={14} /></button>
      <input
        type="text" inputMode="numeric" pattern="[0-9]*" value={draft ?? String(value)} disabled={disabled} aria-label={`Quantity — ${label}`}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
      />
      <button type="button" onClick={() => onChange(value + 1)} disabled={disabled || value >= max} aria-label={`Increase quantity — ${label}`}><Icon name="plus" size={14} /></button>
    </div>
  );
}
