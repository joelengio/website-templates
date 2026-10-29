import { useEffect, useRef, useState, useId, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import type { Cta, ImageAsset } from '../config/types';
import { intensityLabels } from '../config/programs';
import { Icon } from './Icon';

/* ---------- buttons ---------- */
type Variant = 'primary' | 'ghost' | 'light' | 'dark';

export function LinkButton({ to, children, variant = 'primary', arrow = true, className = '' }: { to: string; children: ReactNode; variant?: Variant; arrow?: boolean; className?: string }) {
  return (
    <Link to={to} className={`btn btn--${variant} ${className}`}>
      <span>{children}</span>
      {arrow && <Icon name="arrow" size={18} />}
    </Link>
  );
}

export function CtaLink({ cta, ...rest }: { cta: Cta; variant?: Variant; arrow?: boolean; className?: string }) {
  return <LinkButton to={cta.to} {...rest}>{cta.label}</LinkButton>;
}

export function Button({ variant = 'primary', children, className = '', type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button type={type} className={`btn btn--${variant} ${className}`} {...rest}>
      <span>{children}</span>
    </button>
  );
}

/* ---------- layout helpers ---------- */
export function Reveal({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [seen, setSeen] = useState(reduce || typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (seen || !ref.current) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting || e.boundingClientRect.top < 0) && (setSeen(true), io.disconnect()), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return (
    <Tag ref={ref as never} className={`reveal ${seen ? 'is-in' : ''} ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, intro, align = 'left', as: H = 'h2', children }: { eyebrow?: string; title: ReactNode; intro?: string; align?: 'left' | 'center'; as?: 'h1' | 'h2'; children?: ReactNode }) {
  return (
    <header className={`section-head section-head--${align}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <H className="h-display">{title}</H>
        {intro && <p className="lead">{intro}</p>}
      </div>
      {children && <div className="section-head-aside">{children}</div>}
    </header>
  );
}

export function Img({ image, className = '', eager = false, sizes }: { image: ImageAsset; className?: string; eager?: boolean; sizes?: string }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      sizes={sizes}
      className={className}
    />
  );
}

export function PageHero({ eyebrow, title, intro, image, children }: { eyebrow: string; title: ReactNode; intro?: string; image?: ImageAsset; children?: ReactNode }) {
  return (
    <section className="page-hero">
      {image && <Img image={image} eager className="page-hero-img" />}
      <div className="container page-hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-mega">{title}</h1>
        {intro && <p className="lead">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
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

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty" role="status">
      <Icon name="search" size={28} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Intensity({ level }: { level: number }) {
  return (
    <span className="intensity" role="img" aria-label={`Intensity ${level} of 5: ${intensityLabels[level]}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= level ? 'on' : ''} />
      ))}
    </span>
  );
}

export function DemoBadge({ children = 'Demo' }: { children?: ReactNode }) {
  return <span className="demo-badge">{children}</span>;
}

/* ---------- form fields ---------- */
interface FieldShell {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, ...rest }: FieldShell & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const describedBy = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{rest.required && <span aria-hidden="true"> *</span>}</label>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest} />
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

export function TextArea({ label, error, hint, ...rest }: FieldShell & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const describedBy = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{rest.required && <span aria-hidden="true"> *</span>}</label>
      <textarea id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest} />
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

export function SelectField({ label, error, hint, children, ...rest }: FieldShell & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  const describedBy = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{rest.required && <span aria-hidden="true"> *</span>}</label>
      <select id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest}>{children}</select>
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

export function CheckField({ label, error, ...rest }: { label: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={`field field--check ${error ? 'has-error' : ''}`}>
      <input id={id} type="checkbox" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      <label htmlFor={id}>{label}</label>
      {error && <p className="field-error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}
