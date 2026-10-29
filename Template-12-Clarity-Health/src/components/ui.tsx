import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getImage } from '../config/images';
import { Icon, type IconName } from './Icon';

/** Responsive, lazy-loaded image driven by the image registry in src/config/images.ts. */
export function Img({ name, className, eager = false, sizes, alt }: { name: string; className?: string; eager?: boolean; sizes?: string; alt?: string }) {
  const a = getImage(name);
  return (
    <img
      src={a.src}
      alt={alt ?? a.alt}
      width={a.width}
      height={a.height}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      className={className}
    />
  );
}

interface BtnBase {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'light';
  size?: 'md' | 'lg' | 'sm';
  icon?: IconName | null;
  className?: string;
}

export function LinkButton({ to, children, variant = 'primary', size = 'md', icon = 'arrow', className = '', ...rest }: BtnBase & { to: string; state?: unknown; onClick?: () => void }) {
  return (
    <Link to={to} className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </Link>
  );
}

export function Button({
  children, variant = 'primary', size = 'md', icon = null, className = '', ...rest
}: BtnBase & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>) {
  return (
    <button type="button" className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </button>
  );
}

export function SectionHeader({ eyebrow, title, lead, as: H = 'h2', center = false, id }: { eyebrow?: string; title: string; lead?: string; as?: 'h1' | 'h2'; center?: boolean; id?: string }) {
  return (
    <div className={`section-header ${center ? 'is-center' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H id={id} className="section-title">{title}</H>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, lead, children, image }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode; image?: string }) {
  return (
    <header className="page-hero">
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
        {image && <Img name={image} className="page-hero-img" eager sizes="(min-width: 900px) 40vw, 90vw" />}
      </div>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((it, i) => (
          <li key={it.label}>
            {it.to && i < items.length - 1 ? <Link to={it.to}>{it.label}</Link> : <span aria-current={i === items.length - 1 ? 'page' : undefined}>{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Notice({ tone = 'info', title, children, role }: { tone?: 'info' | 'warning' | 'emergency'; title?: string; children: ReactNode; role?: 'note' | 'alert' | 'status' }) {
  return (
    <aside className={`notice notice-${tone}`} role={role ?? 'note'}>
      <Icon name={tone === 'info' ? 'info' : 'alert'} size={22} />
      <div>
        {title && <p className="notice-title">{title}</p>}
        <div className="notice-body">{children}</div>
      </div>
    </aside>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty-state" role="status">
      <Icon name="search" size={34} />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function Field({ id, label, error, hint, children, required }: { id: string; label: string; error?: string; hint?: string; children: ReactNode; required?: boolean }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="req" aria-hidden="true"> *</span> : <span className="opt"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-error`} role="alert"><Icon name="alert" size={16} /> {error}</p>}
    </div>
  );
}

export const describedBy = (id: string, error?: string, hint?: string) => [error ? `${id}-error` : '', hint && !error ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
