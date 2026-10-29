import { Link } from 'react-router-dom';
import type { Property } from '../config/types';
import { formatArea, formatPrice } from '../lib/format';
import { CompareToggle, FavoriteButton } from './FavoriteButton';
import { Icon } from './Icon';

export function PropertyCard({ property: p, priority = false }: { property: Property; priority?: boolean }) {
  const img = p.images[0];
  return (
    <article className="property-card">
      <div className="property-card__media">
        <Link to={`/properties/${p.slug}`} tabIndex={-1} aria-hidden="true">
          <img src={img.thumb ?? img.src} alt="" width={640} height={440} loading={priority ? 'eager' : 'lazy'} decoding="async" />
        </Link>
        {p.status === 'under-offer' && <span className="tag tag--status">Under offer</span>}
        {p.featured && p.status === 'available' && <span className="tag">Featured</span>}
        <FavoriteButton id={p.id} title={p.title} />
      </div>
      <div className="property-card__body">
        <p className="property-card__loc">
          <Icon name="pin" size={14} /> {p.neighborhood}, {p.region}
        </p>
        <h3>
          <Link to={`/properties/${p.slug}`}>{p.title}</Link>
        </h3>
        <p className="property-card__price">{formatPrice(p.price)}</p>
        <ul className="specs" aria-label="Key details">
          <li>
            <Icon name="bed" size={16} /> {p.bedrooms} <span className="sr-only">bedrooms</span>
            <span aria-hidden="true">bd</span>
          </li>
          <li>
            <Icon name="bath" size={16} /> {p.bathrooms} <span className="sr-only">bathrooms</span>
            <span aria-hidden="true">ba</span>
          </li>
          <li>
            <Icon name="area" size={16} /> {formatArea(p.areaSqm)}
          </li>
        </ul>
        <div className="property-card__foot">
          <span className="property-card__type">{p.type}</span>
          <CompareToggle id={p.id} title={p.title} />
        </div>
      </div>
    </article>
  );
}
