import { home } from '../config/content';
import { LinkButton } from './Button';

export function ConsultCTA({ title, text, service }: { title?: string; text?: string; service?: string }) {
  const c = home.cta;
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-band__inner">
        <div>
          <p className="eyebrow eyebrow--light">{c.eyebrow}</p>
          <h2 id="cta-title">{title ?? c.title}</h2>
          <p>{text ?? c.text}</p>
        </div>
        <div className="cta-band__actions">
          <LinkButton to={service ? `/book?service=${service}` : c.primary.to} variant="light" arrow>
            {c.primary.label}
          </LinkButton>
          <LinkButton to={c.secondary.to} variant="ghost" className="btn--on-dark">
            {c.secondary.label}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
