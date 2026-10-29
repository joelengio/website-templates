import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LinkButton } from './Button';

export function SectionHeader({ kicker, title, text, align = 'left', as: H = 'h2', action }: { kicker?: string; title: string; text?: string; align?: 'left' | 'center'; as?: 'h1' | 'h2'; action?: { label: string; to: string } }) {
  return (
    <header className={`section-head section-head--${align} reveal`}>
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <H className="display">{title}</H>
        {text && <p className="lead">{text}</p>}
      </div>
      {action && <LinkButton to={action.to} variant="text" arrow>{action.label}</LinkButton>}
    </header>
  );
}

export default function Section({ id, tone = 'cream', children, className = '', labelledBy }: { id?: string; tone?: 'cream' | 'limestone' | 'olive' | 'charcoal'; children: ReactNode; className?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`section section--${tone} ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function PageHero({ title, text, kicker, image, children }: { title: string; text?: string; kicker?: string; image?: { src: string; alt: string }; children?: ReactNode }) {
  return (
    <header className={`page-hero${image ? ' page-hero--image' : ''}`}>
      {image && <img src={image.src} alt="" width="1600" height="1000" className="page-hero__bg" fetchPriority="high" />}
      <div className="container page-hero__inner">
        {kicker && <p className="kicker">{kicker}</p>}
        <h1 className="display">{title}</h1>
        {text && <p className="lead">{text}</p>}
        {children}
      </div>
    </header>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
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
