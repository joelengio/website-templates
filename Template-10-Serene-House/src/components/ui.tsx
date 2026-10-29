import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import type { ImageAsset } from '../config/types';
import { Icon } from './Icon';

type Variant = 'primary' | 'outline' | 'light' | 'ghost';

export function LinkButton({ variant = 'primary', arrow = true, className = '', children, ...props }: LinkProps & { variant?: Variant; arrow?: boolean }) {
  return (
    <Link className={`btn btn--${variant} ${className}`} {...props}>
      <span>{children}</span>
      {arrow && <Icon name="arrow" size={18} />}
    </Link>
  );
}

export function Button({ variant = 'primary', arrow = false, className = '', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; arrow?: boolean }) {
  return (
    <button className={`btn btn--${variant} ${className}`} {...props}>
      <span>{children}</span>
      {arrow && <Icon name="arrow" size={18} />}
    </button>
  );
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-link">
      <span>{children}</span>
      <Icon name="arrow" size={16} />
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, text, align = 'left', as: Tag = 'h2', light = false }: { eyebrow?: string; title: ReactNode; text?: string; align?: 'left' | 'center'; as?: ElementType; light?: boolean }) {
  return (
    <div className={`section-heading section-heading--${align} ${light ? 'is-light' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="h-display">{title}</Tag>
      {text && <p className="lead">{text}</p>}
    </div>
  );
}

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(() => reduceMotion() || typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    const el = ref.current;
    if (seen || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return (
    <div ref={ref} className={`reveal ${seen ? 'is-in' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

export function Img({ image, eager = false, sizes, className = '', alt }: { image: ImageAsset; eager?: boolean; sizes?: string; className?: string; alt?: string }) {
  return (
    <img
      className={className}
      src={image.src}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchPriority: 'high' as const } : {})}
    />
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty" role="status">
      <Icon name="leaf" size={32} />
      <h2 className="h-display">{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function DemoNotice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <div className={`demo-notice demo-notice--${tone}`} role="note">
      <Icon name="info" size={20} />
      <p>{children}</p>
    </div>
  );
}

export function Field({ id, label, error, hint, required, children }: { id: string; label: string; error?: string; hint?: string; required?: boolean; children: (p: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; 'aria-required'?: boolean }) => ReactNode }) {
  const describedBy = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy, 'aria-required': required })}
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}
