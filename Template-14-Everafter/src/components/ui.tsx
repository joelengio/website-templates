import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Cta, ImageRef } from '../config/types';
import { Icon } from './Icon';
import { Photo } from './Photo';
import { Reveal } from './Reveal';

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6Z" fill="currentColor" /></svg>
      <span />
    </div>
  );
}

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  cta?: Cta;
  id?: string;
}

export function SectionHead({ eyebrow, title, lead, align = 'left', as: H = 'h2', cta, id }: SectionHeadProps) {
  return (
    <Reveal className={`section-head section-head--${align}`}>
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <H className="h-display" id={id}>{title}</H>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {cta && (
        <Link to={cta.to} className="link-arrow">
          {cta.label} <Icon name="arrow" size={18} />
        </Link>
      )}
    </Reveal>
  );
}

export function Button({ to, children, variant = 'primary', ...rest }: { to: string; children: ReactNode; variant?: 'primary' | 'outline' | 'light' | 'ghost' } & Record<string, unknown>) {
  return (
    <Link to={to} className={`btn btn--${variant}`} {...rest}>
      <span>{children}</span>
    </Link>
  );
}

/** Interior page header: optional photograph, eyebrow, H1 and lead. */
export function PageHero({ eyebrow, title, lead, image, children }: { eyebrow?: string; title: string; lead?: string; image?: ImageRef; children?: ReactNode }) {
  return (
    <header className={`page-hero${image ? ' page-hero--image' : ''}`}>
      {image && (
        <div className="page-hero__media" aria-hidden="true">
          <Photo image={image} priority sizes="100vw" />
        </div>
      )}
      <div className="container page-hero__inner">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="h-display">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </header>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.label}>
            {it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden="true"> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CtaBand({ eyebrow, title, body, primary, secondary, image }: { eyebrow?: string; title: string; body?: string; primary: Cta; secondary?: Cta; image?: ImageRef }) {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      {image && (
        <div className="cta-band__media" aria-hidden="true">
          <Photo image={image} />
        </div>
      )}
      <Reveal className="container cta-band__inner">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="h-display" id="cta-title">{title}</h2>
        {body && <p className="lead">{body}</p>}
        <div className="cta-band__actions">
          <Button to={primary.to} variant="light">{primary.label}</Button>
          {secondary && <Button to={secondary.to} variant="ghost">{secondary.label}</Button>}
        </div>
      </Reveal>
    </section>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__title">{title}</p>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function DemoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="demo-note" role="note">
      <Icon name="info" size={18} />
      <p>{children}</p>
    </div>
  );
}
