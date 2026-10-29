import { Link } from 'react-router-dom';
import { featureLabels } from '../config/features';
import { properties } from '../config/properties';
import type { FeatureKey } from '../config/types';
import { formatArea, formatPrice } from '../lib/format';
import { useShortlist } from '../hooks/useShortlist';
import { useSeo } from '../hooks/useSeo';
import { Button, LinkButton } from '../components/Button';
import { Icon } from '../components/Icon';
import { PageHero } from '../components/Section';

export default function Compare() {
  const { compare, toggleCompare, clearCompare } = useShortlist();
  useSeo({ title: 'Compare homes', description: 'Compare up to three properties side by side.', path: '/compare' });
  const list = compare.map((id) => properties.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const allFeatures = (Object.keys(featureLabels) as FeatureKey[]).filter((k) => list.some((p) => p.features.includes(k)));

  const rows: { label: string; value: (p: (typeof list)[number]) => string }[] = [
    { label: 'Price', value: (p) => formatPrice(p.price) },
    { label: 'Type', value: (p) => p.type },
    { label: 'Location', value: (p) => `${p.neighborhood}, ${p.region}` },
    { label: 'Bedrooms', value: (p) => String(p.bedrooms) },
    { label: 'Bathrooms', value: (p) => String(p.bathrooms) },
    { label: 'Interior area', value: (p) => formatArea(p.areaSqm) },
    { label: 'Plot size', value: (p) => (p.lotSqm ? formatArea(p.lotSqm) : 'Shared grounds') },
    { label: 'Year built', value: (p) => String(p.yearBuilt) },
    { label: 'Parking', value: (p) => String(p.parking) },
    { label: 'Status', value: (p) => (p.status === 'available' ? 'Available' : 'Under offer') },
  ];

  return (
    <>
      <PageHero title="Compare homes" lead="Compare up to three properties side by side." />
      <section className="section section--flush">
        <div className="container">
          {list.length === 0 ? (
            <div className="empty-state">
              <h2 className="h3">Nothing to compare yet</h2>
              <p>Tick “Compare” on up to three properties, then return here.</p>
              <LinkButton to="/properties">Browse properties</LinkButton>
            </div>
          ) : (
            <>
              {list.length < 2 && <p className="notice">Add at least one more property to see a meaningful comparison.</p>}
              {/* Scrollable region must be keyboard-focusable (WCAG 2.1.1) */}
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
              <div className="table-wrap" tabIndex={0} role="region" aria-label="Property comparison table (scrolls horizontally on small screens)">
                <table className="compare-table">
                  <caption className="sr-only">Comparison of {list.map((p) => p.title).join(', ')}</caption>
                  <thead>
                    <tr>
                      <td />
                      {list.map((p) => (
                        <th key={p.id} scope="col">
                          <img src={p.images[0].thumb ?? p.images[0].src} alt="" width={320} height={220} />
                          <Link to={`/properties/${p.slug}`}>{p.title}</Link>
                          <button type="button" className="link-btn" onClick={() => toggleCompare(p.id)}>
                            <Icon name="close" size={14} /> Remove<span className="sr-only"> {p.title}</span>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.label}>
                        <th scope="row">{r.label}</th>
                        {list.map((p) => (
                          <td key={p.id}>{r.value(p)}</td>
                        ))}
                      </tr>
                    ))}
                    {allFeatures.map((k) => (
                      <tr key={k}>
                        <th scope="row">{featureLabels[k]}</th>
                        {list.map((p) => (
                          <td key={p.id}>
                            {p.features.includes(k) ? (
                              <>
                                <Icon name="check" size={18} />
                                <span className="sr-only">Yes</span>
                              </>
                            ) : (
                              <>
                                <span aria-hidden="true">—</span>
                                <span className="sr-only">No</span>
                              </>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                <Button variant="ghost" onClick={clearCompare}>
                  Clear comparison
                </Button>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
