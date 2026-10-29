import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  tone?: 'ivory' | 'stone' | 'navy' | 'white';
  children?: ReactNode;
  headingId?: string;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
  as?: 'h1' | 'h2';
  /** Visually hidden h2 for sections that have no visible heading (keeps the heading outline valid). */
  srTitle?: string;
}

export function Section({ id, eyebrow, title, lead, tone = 'ivory', children, headingId, align = 'left', className = '', action, as: H = 'h2', srTitle }: SectionProps) {
  const hid = headingId ?? (id ? `${id}-title` : undefined);
  return (
    <section id={id} className={`section section--${tone} ${className}`.trim()} aria-labelledby={title ? hid : undefined}>
      <div className="container">
        {(eyebrow || title || lead) && (
          <header className={`section__head section__head--${align}`}>
            <div>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && (
                <H id={hid} className="section__title">
                  {title}
                </H>
              )}
              {lead && <p className="section__lead">{lead}</p>}
            </div>
            {action && <div className="section__action">{action}</div>}
          </header>
        )}
        {srTitle && <h2 className="sr-only">{srTitle}</h2>}
        {children}
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-hero">
      <div className="container page-hero__inner">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title">{title}</h1>
        {lead && <p className="page-hero__lead">{lead}</p>}
        {children}
      </div>
    </header>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => (
          <li key={item.label}>
            {item.to && i < items.length - 1 ? <Link to={item.to}>{item.label}</Link> : <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
