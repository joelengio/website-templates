import { Link } from 'react-router-dom';
import type { Article, Attraction, Experience, Offer, Review } from '../config/types';
import { promotions } from '../config/booking';
import Icon from './Icon';
import Img from './Img';

export function ExperienceCard({ e }: { e: Experience }) {
  return (
    <article className="card reveal">
      <Link to={`/experiences/${e.slug}`} className="card__media" tabIndex={-1} aria-hidden="true"><Img src={e.image.src} alt="" ratio={[4, 3]} /></Link>
      <div className="card__body">
        <p className="kicker">{e.category}</p>
        <h3><Link to={`/experiences/${e.slug}`}>{e.title}</Link></h3>
        <p>{e.summary}</p>
        <p className="card__meta"><Icon name="clock" size={16} /> {e.duration} · {e.price}</p>
      </div>
    </article>
  );
}

export function OfferCard({ o, sample }: { o: Offer; sample?: string }) {
  const promo = promotions.find((p) => p.id === o.promoId);
  return (
    <article className="card card--offer reveal">
      <Link to={`/offers/${o.slug}`} className="card__media" tabIndex={-1} aria-hidden="true">
        <Img src={o.image.src} alt="" ratio={[4, 3]} />
        {promo && <span className="badge badge--accent">{promo.type === 'percent' ? `${promo.value}% off` : `$${promo.value} off`}</span>}
      </Link>
      <div className="card__body">
        <p className="kicker">{o.kicker}</p>
        <h3><Link to={`/offers/${o.slug}`}>{o.title}</Link></h3>
        <p>{o.summary}</p>
        {sample && <p className="card__meta"><Icon name="tag" size={16} /> {sample}</p>}
      </div>
    </article>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="review reveal">
      <p className="review__stars" role="img" aria-label={`${r.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Icon key={i} name="star" size={16} className={i < r.rating ? 'on' : 'off'} />)}</p>
      <blockquote><p>“{r.quote}”</p></blockquote>
      <figcaption><strong>{r.name}</strong><span>{r.trip} · {r.stayed}</span></figcaption>
    </figure>
  );
}

export function ArticleCard({ a }: { a: Article }) {
  return (
    <article className="card reveal">
      <Link to={`/journal/${a.slug}`} className="card__media" tabIndex={-1} aria-hidden="true"><Img src={a.image.src} alt="" ratio={[4, 3]} /></Link>
      <div className="card__body">
        <p className="kicker">{a.category} · {a.readMinutes} min read</p>
        <h3><Link to={`/journal/${a.slug}`}>{a.title}</Link></h3>
        <p>{a.excerpt}</p>
      </div>
    </article>
  );
}

export function AttractionCard({ a }: { a: Attraction }) {
  return (
    <article className="card reveal">
      <div className="card__media"><Img src={a.image.src} alt={a.image.alt} ratio={[4, 3]} /></div>
      <div className="card__body">
        <p className="kicker">{a.type} · {a.distance}</p>
        <h3>{a.name}</h3>
        <p>{a.summary}</p>
      </div>
    </article>
  );
}
