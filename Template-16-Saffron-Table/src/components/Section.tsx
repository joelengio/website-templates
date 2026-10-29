import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface HeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  tone?: 'dark' | 'light';
  id?: string;
}

export function SectionHeading({ eyebrow, title, lead, align = 'left', as: Tag = 'h2', id }: HeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag id={id} className="section-heading__title">{title}</Tag>
      {lead && <p className="section-heading__lead">{lead}</p>}
    </div>
  );
}

interface SectionProps {
  id?: string;
  tone?: 'dark' | 'soft' | 'light';
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

export function Section({ id, tone = 'dark', children, className = '', labelledBy }: SectionProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={`section section--${tone} reveal ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function PageHero({ eyebrow, title, lead, image, children }: { eyebrow: string; title: string; lead?: string; image?: string; children?: ReactNode }) {
  return (
    <header className="page-hero">
      {image && <div className="page-hero__bg" style={{ backgroundImage: `url(/images/${image}.jpg)` }} aria-hidden="true" />}
      <div className="container page-hero__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-hero__title">{title}</h1>
        {lead && <p className="page-hero__lead">{lead}</p>}
        {children}
      </div>
    </header>
  );
}

export function DemoNotice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <div className={`notice notice--${tone}`} role="note">
      <strong className="notice__label">{tone === 'warn' ? 'Please note' : 'Demo'}</strong>
      <span>{children}</span>
    </div>
  );
}
