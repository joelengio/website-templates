import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

export function Reveal({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'li' | 'article' }) {
  const ref = useReveal<HTMLDivElement>();
  const Comp = Tag as 'div';
  return (
    <Comp ref={ref} className={`reveal ${className}`}>
      {children}
    </Comp>
  );
}

export function SectionHeading({ eyebrow, title, lead, id, align = 'left', inverse }: { eyebrow?: string; title: string; lead?: string; id?: string; align?: 'left' | 'center'; inverse?: boolean }) {
  return (
    <Reveal className={`section-heading section-heading--${align}${inverse ? ' is-inverse' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="page-hero">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 tabIndex={-1} data-page-heading>
          {title}
        </h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
