import { Link, useParams } from 'react-router-dom';
import { featureLabels } from '../config/features';
import { properties } from '../config/properties';
import { formatArea, formatDate, formatPrice } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { CompareToggle, FavoriteButton } from '../components/FavoriteButton';
import { Gallery } from '../components/Gallery';
import { Icon } from '../components/Icon';
import { InquiryForm } from '../components/InquiryForm';
import { PropertyCard } from '../components/PropertyCard';
import NotFound from './NotFound';

export default function PropertyDetail() {
  const { slug } = useParams();
  const p = properties.find((x) => x.slug === slug);
  useSeo({
    title: p ? `${p.title} — ${p.neighborhood}` : undefined,
    description: p ? `${p.tagline} ${p.bedrooms} bedrooms, ${p.bathrooms} bathrooms, ${formatArea(p.areaSqm)}. Fictional demo listing.` : undefined,
    path: p ? `/properties/${p.slug}` : undefined,
    image: p?.images[0].src,
  });
  if (!p) return <NotFound />;

  const similar = properties
    .filter((x) => x.id !== p.id)
    .map((x) => ({ x, score: (x.neighborhood === p.neighborhood ? 2 : 0) + (x.type === p.type ? 2 : 0) - Math.abs(x.price - p.price) / 5_000_000 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.x);

  const facts: [string, string][] = [
    ['Property type', p.type],
    ['Bedrooms', String(p.bedrooms)],
    ['Bathrooms', String(p.bathrooms)],
    ['Interior area', formatArea(p.areaSqm)],
    ['Plot size', p.lotSqm ? formatArea(p.lotSqm) : 'Shared grounds'],
    ['Year built', String(p.yearBuilt)],
    ['Parking spaces', String(p.parking)],
    ['Listed', formatDate(p.listedAt)],
  ];

  return (
    <article className="property-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> / <Link to="/properties">Properties</Link> / <span aria-current="page">{p.title}</span>
        </nav>

        <header className="property-head">
          <div>
            <p className="property-head__loc">
              <Icon name="pin" size={16} /> {p.neighborhood}, {p.region}
            </p>
            <h1 tabIndex={-1} data-page-heading>
              {p.title}
            </h1>
            <p className="lead">{p.tagline}</p>
          </div>
          <div className="property-head__price">
            <p className="property-head__amount">{formatPrice(p.price)}</p>
            {p.status === 'under-offer' && <p className="tag tag--status tag--static">Under offer</p>}
            <div className="property-head__actions">
              <FavoriteButton id={p.id} title={p.title} variant="text" />
              <CompareToggle id={p.id} title={p.title} variant="button" />
            </div>
          </div>
        </header>

        <Gallery images={p.images} title={p.title} />

        <div className="property-layout">
          <div className="property-main">
            <ul className="key-specs" aria-label="Key facts">
              <li>
                <Icon name="bed" /> <strong>{p.bedrooms}</strong> Bedrooms
              </li>
              <li>
                <Icon name="bath" /> <strong>{p.bathrooms}</strong> Bathrooms
              </li>
              <li>
                <Icon name="area" /> <strong>{formatArea(p.areaSqm)}</strong> Interior
              </li>
            </ul>

            <section aria-labelledby="about-home">
              <h2 id="about-home">About this home</h2>
              {p.description.map((t) => (
                <p key={t}>{t}</p>
              ))}
              <ul className="ticks">
                {p.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check" size={18} /> {h}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="facts">
              <h2 id="facts">Property details</h2>
              <dl className="facts">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="features">
              <h2 id="features">Features</h2>
              <ul className="feature-tags">
                {p.features.map((k) => (
                  <li key={k}>{featureLabels[k]}</li>
                ))}
              </ul>
            </section>

            <p className="muted">Fictional demo listing. Prices, measurements and descriptions are invented for template demonstration only.</p>
          </div>

          <aside className="property-aside" id="inquire" aria-labelledby="inquire-title">
            <h2 id="inquire-title" className="h3">
              Inquire about this home
            </h2>
            <InquiryForm propertyId={p.id} />
          </aside>
        </div>

        <section className="similar" aria-labelledby="similar-title">
          <h2 id="similar-title">You may also like</h2>
          <div className="card-grid">
            {similar.map((s) => (
              <PropertyCard key={s.id} property={s} />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
