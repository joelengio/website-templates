import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { content } from '../config';
import { featureLabels } from '../config/features';
import { properties } from '../config/properties';
import type { FeatureKey } from '../config/types';
import { activeFilterCount, defaultFilters, filterProperties, parseFilters, serializeFilters, sortOptions, type Filters, type SortKey } from '../lib/filters';
import { formatPriceShort } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { Button } from '../components/Button';
import { FilterPanel } from '../components/FilterPanel';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { PropertyCard } from '../components/PropertyCard';
import { SavedSearches } from '../components/SavedSearches';
import { PageHero } from '../components/Section';

const typeOptions = Array.from(new Set(properties.map((p) => p.type))).sort();
const areaOptions = Array.from(new Set(properties.map((p) => p.neighborhood))).sort();
const featureOptions = (Object.keys(featureLabels) as FeatureKey[]).filter((k) => properties.some((p) => p.features.includes(k)));

export default function Properties() {
  const [params, setParams] = useSearchParams();
  // Filters live in local state (instant, controlled inputs) and are mirrored to the URL for sharing/back-button.
  const [filters, setFilters] = useState<Filters>(() => parseFilters(params));
  const lastWritten = useRef(params.toString());
  const [drawer, setDrawer] = useState(false);
  useSeo({ title: 'Properties', description: content.listingsPage.lead, path: '/properties' });

  useEffect(() => {
    // URL changed from outside (hero search, browser back, shared link): adopt it.
    if (params.toString() !== lastWritten.current) {
      lastWritten.current = params.toString();
      setFilters(parseFilters(params));
    }
  }, [params]);

  const commit = useCallback(
    (next: Filters) => {
      setFilters(next);
      const qs = serializeFilters(next);
      lastWritten.current = qs.toString();
      setParams(qs, { replace: true });
    },
    [setParams],
  );
  const update = useCallback((next: Partial<Filters>) => commit({ ...filters, ...next }), [filters, commit]);
  const reset = useCallback(() => commit(defaultFilters), [commit]);

  const results = useMemo(() => filterProperties(properties, filters), [filters]);
  const count = activeFilterCount(filters);

  const chips: { label: string; remove: () => void }[] = [
    ...(filters.q.trim() ? [{ label: `“${filters.q.trim()}”`, remove: () => update({ q: '' }) }] : []),
    ...filters.types.map((t) => ({ label: t, remove: () => update({ types: filters.types.filter((x) => x !== t) }) })),
    ...filters.areas.map((a) => ({ label: a, remove: () => update({ areas: filters.areas.filter((x) => x !== a) }) })),
    ...(filters.minPrice !== null ? [{ label: `Min ${formatPriceShort(filters.minPrice)}`, remove: () => update({ minPrice: null }) }] : []),
    ...(filters.maxPrice !== null ? [{ label: `Max ${formatPriceShort(filters.maxPrice)}`, remove: () => update({ maxPrice: null }) }] : []),
    ...(filters.beds ? [{ label: `${filters.beds}+ beds`, remove: () => update({ beds: 0 }) }] : []),
    ...(filters.baths ? [{ label: `${filters.baths}+ baths`, remove: () => update({ baths: 0 }) }] : []),
    ...filters.features.map((k) => ({ label: featureLabels[k] ?? k, remove: () => update({ features: filters.features.filter((x) => x !== k) }) })),
    ...(filters.availableOnly ? [{ label: 'Excluding under offer', remove: () => update({ availableOnly: false }) }] : []),
  ];

  const panelProps = { filters, onChange: update, onReset: reset, types: typeOptions, areas: areaOptions, features: featureOptions, activeCount: count };

  return (
    <>
      <PageHero eyebrow="Portfolio" title={content.listingsPage.title} lead={content.listingsPage.lead} />
      <section className="section section--flush">
        <div className="container listing-layout">
          <aside className="listing-sidebar" aria-label="Filters">
            <FilterPanel {...panelProps} idPrefix="d" />
          </aside>

          <div className="listing-main">
            <div className="listing-toolbar">
              <Button variant="ghost" className="filter-toggle" onClick={() => setDrawer(true)} aria-haspopup="dialog">
                <Icon name="filter" size={18} /> Filters{count > 0 ? ` (${count})` : ''}
              </Button>
              <p className="listing-count" role="status" aria-live="polite" aria-atomic="true">
                {results.length} {results.length === 1 ? 'property' : 'properties'}
                {count > 0 ? ' match your filters' : ' available'}
              </p>
              <div className="field field--inline">
                <label htmlFor="sort-select">Sort by</label>
                <select id="sort-select" value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <SavedSearches filters={filters} onApply={commit} />

            {chips.length > 0 && (
              <ul className="active-chips" aria-label="Active filters">
                {chips.map((c) => (
                  <li key={c.label}>
                    <button type="button" className="chip chip--removable" onClick={c.remove} aria-label={`Remove filter: ${c.label}`}>
                      {c.label} <Icon name="close" size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {results.length > 0 ? (
              <div className="card-grid card-grid--listing">
                {results.map((p, i) => (
                  <PropertyCard key={p.id} property={p} priority={i < 3} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2 className="h3">No properties match these filters</h2>
                <p>Try widening your price range, removing a feature or searching a different neighborhood.</p>
                <Button onClick={reset}>Reset all filters</Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Modal open={drawer} onClose={() => setDrawer(false)} label="Filter properties" side="left" className="filter-drawer">
        <div className="filter-drawer__head">
          <h2 className="h3">Filters</h2>
          <button type="button" className="icon-link" aria-label="Close filters" onClick={() => setDrawer(false)}>
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="filter-drawer__body">
          <FilterPanel {...panelProps} idPrefix="m" />
        </div>
        <div className="filter-drawer__foot">
          <Button variant="primary" onClick={() => setDrawer(false)}>
            Show {results.length} {results.length === 1 ? 'property' : 'properties'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
