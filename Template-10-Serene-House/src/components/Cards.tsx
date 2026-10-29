import { Link } from 'react-router-dom';
import type { Article, SpaPackage, Treatment } from '../config/types';
import { packageCategories } from '../config/packages';
import { treatmentCategories } from '../config/treatments';
import { formatDuration, formatPrice, formatShortDate } from '../lib/format';
import { packageSavings } from '../config/packages';
import { Icon } from './Icon';
import { Img } from './ui';

export const priceFrom = (t: Treatment) => Math.min(...t.options.map((o) => o.price));

export function TreatmentCard({ t }: { t: Treatment }) {
  const cat = treatmentCategories.find((c) => c.id === t.category)?.name;
  const mins = t.options.map((o) => o.minutes);
  return (
    <article className="card treatment-card">
      <Link to={`/treatments/${t.slug}`} className="card-media" aria-label={`${t.name} — view details`} tabIndex={-1}>
        <Img image={t.image} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="card-body">
        <p className="eyebrow">{cat}</p>
        <h3 className="card-title"><Link to={`/treatments/${t.slug}`}>{t.name}</Link></h3>
        <p className="card-text">{t.summary}</p>
        <div className="card-meta">
          <span><Icon name="clock" size={16} /> {mins.length > 1 ? `${formatDuration(Math.min(...mins))} – ${formatDuration(Math.max(...mins))}` : formatDuration(mins[0])}</span>
          <strong>{t.options.length > 1 ? 'from ' : ''}{formatPrice(priceFrom(t))}</strong>
        </div>
      </div>
    </article>
  );
}

export function PackageCard({ p }: { p: SpaPackage }) {
  const saving = packageSavings(p);
  const cat = packageCategories.find((c) => c.id === p.category)?.name;
  return (
    <article className={`card package-card ${p.highlight ? 'is-highlight' : ''}`}>
      <Link to={`/packages#${p.slug}`} className="card-media" tabIndex={-1} aria-label={`${p.name} — view breakdown`}>
        <Img image={p.image} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
        {p.highlight && <span className="badge">Most loved</span>}
      </Link>
      <div className="card-body">
        <p className="eyebrow">{cat}</p>
        <h3 className="card-title"><Link to={`/packages#${p.slug}`}>{p.name}</Link></h3>
        <p className="card-text">{p.tagline}</p>
        <div className="card-meta">
          <span><Icon name="clock" size={16} /> {p.duration}</span>
          <strong>{formatPrice(p.price)} <small>{p.priceNote}</small></strong>
        </div>
        {saving > 0 && <p className="saving">Save {formatPrice(saving)} vs. booking separately</p>}
      </div>
    </article>
  );
}

export function ArticleCard({ a }: { a: Article }) {
  return (
    <article className="card article-card">
      <Link to={`/journal/${a.slug}`} className="card-media" tabIndex={-1} aria-label={`Read ${a.title}`}>
        <Img image={a.image} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="card-body">
        <p className="eyebrow">{a.category} · {a.readMinutes} min read</p>
        <h3 className="card-title"><Link to={`/journal/${a.slug}`}>{a.title}</Link></h3>
        <p className="card-text">{a.excerpt}</p>
        <p className="card-date">{formatShortDate(a.date)} · {a.author}</p>
      </div>
    </article>
  );
}
