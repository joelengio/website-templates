import { Link } from 'react-router-dom';
import type { Article, Destination, Service, WeddingProject } from '../config/types';
import { formatDate } from '../lib/format';
import { Icon } from './Icon';
import { Photo } from './Photo';

type Level = 'h2' | 'h3';

export function WeddingCard({ w, tall, level: H = 'h3' }: { w: WeddingProject; tall?: boolean; level?: Level }) {
  return (
    <article className={`wcard${tall ? ' wcard--tall' : ''}`}>
      <Link to={`/weddings/${w.slug}`} className="wcard__link">
        <div className="wcard__media">
          <Photo image={w.cover} small sizes="(min-width: 900px) 33vw, 100vw" />
        </div>
        <div className="wcard__body">
          <p className="wcard__meta">{w.location}</p>
          <H className="wcard__title">{w.title}</H>
          <p className="wcard__tags">{w.eventType} · {w.style} · {w.guests} guests</p>
        </div>
      </Link>
    </article>
  );
}

export function DestinationCard({ d, level: H = 'h3' }: { d: Destination; level?: Level }) {
  return (
    <article className="dcard">
      <Link to={`/destinations/${d.slug}`} className="dcard__link">
        <div className="dcard__media"><Photo image={d.cover} small /></div>
        <div className="dcard__body">
          <p className="dcard__meta">{d.country} · {d.category}</p>
          <H className="dcard__title">{d.name}</H>
          <p className="dcard__tag">{d.tagline}</p>
        </div>
      </Link>
    </article>
  );
}

export function ServiceCard({ s, level: H = 'h3' }: { s: Service; level?: Level }) {
  return (
    <article className="scard">
      <Link to={`/services/${s.slug}`} className="scard__link">
        <div className="scard__media"><Photo image={s.image} small /></div>
        <div className="scard__body">
          <H className="scard__title">{s.title}</H>
          <p>{s.summary}</p>
          <span className="scard__price">{s.priceLabel}</span>
          <span className="link-arrow">Explore <Icon name="arrow" size={16} /></span>
        </div>
      </Link>
    </article>
  );
}

export function ArticleCard({ a, feature, level: H = 'h3' }: { a: Article; feature?: boolean; level?: Level }) {
  return (
    <article className={`acard${feature ? ' acard--feature' : ''}`}>
      <Link to={`/journal/${a.slug}`} className="acard__link">
        <div className="acard__media"><Photo image={a.image} small={!feature} sizes="(min-width: 900px) 50vw, 100vw" /></div>
        <div className="acard__body">
          <p className="acard__meta">{a.category} · {formatDate(a.date, { year: 'numeric', month: 'short', day: 'numeric' })} · {a.readMinutes} min read</p>
          <H className="acard__title">{a.title}</H>
          <p>{a.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
