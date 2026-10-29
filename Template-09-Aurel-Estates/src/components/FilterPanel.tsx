import { featureLabels, priceSteps } from '../config/features';
import type { FeatureKey } from '../config/types';
import { formatPriceShort } from '../lib/format';
import { sortOptions, type Filters, type SortKey } from '../lib/filters';

interface Props {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  onReset: () => void;
  types: string[];
  areas: string[];
  features: FeatureKey[];
  idPrefix: string;
  activeCount: number;
  showSort?: boolean;
}

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export function FilterPanel({ filters: f, onChange, onReset, types, areas, features, idPrefix, activeCount, showSort }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  return (
    <form className="filters" role="search" aria-label="Filter properties" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor={id('q')}>Search</label>
        <input id={id('q')} type="search" value={f.q} placeholder="Name, area, keyword…" onChange={(e) => onChange({ q: e.target.value })} />
      </div>

      {showSort && (
        <div className="field">
          <label htmlFor={id('sort')}>Sort by</label>
          <select id={id('sort')} value={f.sort} onChange={(e) => onChange({ sort: e.target.value as SortKey })}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <fieldset>
        <legend>Property type</legend>
        {types.map((t) => (
          <label key={t} className="check">
            <input type="checkbox" checked={f.types.includes(t)} onChange={() => onChange({ types: toggle(f.types, t) })} />
            <span>{t}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Neighborhood</legend>
        {areas.map((a) => (
          <label key={a} className="check">
            <input type="checkbox" checked={f.areas.includes(a)} onChange={() => onChange({ areas: toggle(f.areas, a) })} />
            <span>{a}</span>
          </label>
        ))}
      </fieldset>

      <div className="field-row">
        <div className="field">
          <label htmlFor={id('min')}>Min price</label>
          <select id={id('min')} value={f.minPrice ?? ''} onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : null })}>
            <option value="">No min</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {formatPriceShort(p)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={id('max')}>Max price</label>
          <select id={id('max')} value={f.maxPrice ?? ''} onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : null })}>
            <option value="">No max</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {formatPriceShort(p)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={id('beds')}>Bedrooms</label>
          <select id={id('beds')} value={f.beds} onChange={(e) => onChange({ beds: Number(e.target.value) })}>
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? 'Any' : `${n}+`}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={id('baths')}>Bathrooms</label>
          <select id={id('baths')} value={f.baths} onChange={(e) => onChange({ baths: Number(e.target.value) })}>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? 'Any' : `${n}+`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend>Features</legend>
        <div className="check-grid">
          {features.map((k) => (
            <label key={k} className="check">
              <input type="checkbox" checked={f.features.includes(k)} onChange={() => onChange({ features: toggle(f.features, k) })} />
              <span>{featureLabels[k]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="check check--switch">
        <input type="checkbox" checked={f.availableOnly} onChange={(e) => onChange({ availableOnly: e.target.checked })} />
        <span>Hide homes under offer</span>
      </label>

      <button type="button" className="btn btn--ghost filters__reset" onClick={onReset} disabled={activeCount === 0}>
        Reset all filters{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>
    </form>
  );
}
