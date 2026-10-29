import { useMemo, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { categories } from '../config/collections';
import type { Product } from '../config/types';
import { activeFilterCount, colorFilterValues, emptyFilters, filterProducts, filtersFromParams, filtersToParams, sortOptions, type Filters, type SortKey } from '../lib/catalog';
import { currencyDigits, formatMoney, toMinor } from '../lib/money';
import { Icon } from './Icon';
import { ProductGrid } from './ProductCard';
import { EmptyState } from './ui';
import { useDialog } from './useDialog';

const PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: 'Under $50', max: 50 }, { label: '$50 – $150', min: 50, max: 150 }, { label: '$150 – $300', min: 150, max: 300 }, { label: '$300 and over', min: 300 }
];

function PriceInputs({ filters, apply, idPrefix }: { filters: Filters; apply: (patch: Partial<Filters>) => void; idPrefix: string }) {
  const [min, setMin] = useState<string | null>(null);
  const [max, setMax] = useState<string | null>(null);
  const minShown = min ?? (filters.minMinor !== undefined ? String(filters.minMinor / 10 ** currencyDigits()) : '');
  const maxShown = max ?? (filters.maxMinor !== undefined ? String(filters.maxMinor / 10 ** currencyDigits()) : '');
  const parse = (v: string) => (v.trim() === '' || Number.isNaN(Number(v)) || Number(v) < 0 ? undefined : toMinor(Number(v)));
  const commit = () => {
    let lo = parse(minShown), hi = parse(maxShown);
    if (lo !== undefined && hi !== undefined && lo > hi) [lo, hi] = [hi, lo];
    setMin(null); setMax(null);
    apply({ minMinor: lo, maxMinor: hi });
  };
  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } };
  return (
    <>
      <div className="price-inputs">
        <div className="field"><label htmlFor={`${idPrefix}-min`}>Minimum ($)</label><input id={`${idPrefix}-min`} type="number" inputMode="decimal" min="0" step="1" value={minShown} onChange={(e) => setMin(e.target.value)} onBlur={commit} onKeyDown={onKey} placeholder="0" /></div>
        <div className="field"><label htmlFor={`${idPrefix}-max`}>Maximum ($)</label><input id={`${idPrefix}-max`} type="number" inputMode="decimal" min="0" step="1" value={maxShown} onChange={(e) => setMax(e.target.value)} onBlur={commit} onKeyDown={onKey} placeholder="Any" /></div>
      </div>
      <div className="preset-row">
        {PRESETS.map((p) => (
          <button key={p.label} type="button" className="chip-btn" onClick={() => apply({ minMinor: p.min !== undefined ? toMinor(p.min) : undefined, maxMinor: p.max !== undefined ? toMinor(p.max) : undefined })} aria-pressed={filters.minMinor === (p.min !== undefined ? toMinor(p.min) : undefined) && filters.maxMinor === (p.max !== undefined ? toMinor(p.max) : undefined)}>{p.label}</button>
        ))}
      </div>
    </>
  );
}

function FilterPanel({ filters, apply, products, hideCategories, idPrefix }: { filters: Filters; apply: (patch: Partial<Filters>) => void; products: Product[]; hideCategories?: boolean; idPrefix: string }) {
  const colors = useMemo(() => colorFilterValues(products), [products]);
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const catCounts = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.category === c.id).length])), [products]);
  return (
    <div className="filter-panel">
      {!hideCategories && (
        <fieldset>
          <legend>Category</legend>
          {categories.filter((c) => catCounts[c.id] > 0).map((c) => (
            <label key={c.id} className="check"><input type="checkbox" checked={filters.categories.includes(c.id)} onChange={() => apply({ categories: toggle(filters.categories, c.id) })} /><span>{c.name}</span><em>{catCounts[c.id]}</em></label>
          ))}
        </fieldset>
      )}
      <fieldset>
        <legend>Price</legend>
        <PriceInputs filters={filters} apply={apply} idPrefix={idPrefix} />
      </fieldset>
      <fieldset>
        <legend>Availability</legend>
        <label className="check"><input type="checkbox" checked={filters.inStock} onChange={() => apply({ inStock: !filters.inStock })} /><span>In stock only</span></label>
        <label className="check"><input type="checkbox" checked={filters.onSale} onChange={() => apply({ onSale: !filters.onSale })} /><span>On sale</span></label>
        <label className="check"><input type="checkbox" checked={filters.isNew} onChange={() => apply({ isNew: !filters.isNew })} /><span>New arrivals</span></label>
      </fieldset>
      {colors.length > 0 && (
        <fieldset>
          <legend>Colour</legend>
          <div className="color-filter">
            {colors.map((c) => (
              <label key={c.value} className="color-chip" title={c.value}>
                <input type="checkbox" checked={filters.colors.includes(c.value)} onChange={() => apply({ colors: toggle(filters.colors, c.value) })} />
                <span className="swatch" style={{ background: c.swatch }} /><span className="color-name">{c.value}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

/** Search, filter, sort and results grid. Filter state lives in the URL query string so every view is a shareable deep link. */
export function ProductBrowser({ products, hideCategories, emptyHint }: { products: Product[]; hideCategories?: boolean; emptyHint?: string }) {
  const [params, setParams] = useSearchParams();
  // Filter state is held locally so controlled inputs respond instantly, and mirrored to the URL (deep links, back/forward).
  const paramString = params.toString();
  const [filters, setFilters] = useState(() => filtersFromParams(params));
  const [synced, setSynced] = useState(paramString);
  const [written, setWritten] = useState<string[]>([paramString]);
  if (paramString !== synced) {
    setSynced(paramString);
    // URL changes we wrote ourselves are echoes; anything else (deep link, back/forward, header search) replaces the local state
    if (!written.includes(paramString)) { setFilters(filtersFromParams(params)); setWritten([paramString]); }
  }
  const commit = (next: Filters) => { const sp = filtersToParams(next); setFilters(next); setWritten((w) => [...w.slice(-9), sp.toString()]); setParams(sp, { replace: true }); };
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useDialog(drawer, () => setDrawer(false), drawerRef);

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const apply = (patch: Partial<Filters>) => commit({ ...filters, ...patch });
  const reset = () => commit({ ...emptyFilters(), sort: filters.sort });
  const count = activeFilterCount(filters) - (hideCategories ? filters.categories.length : 0);

  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (filters.q.trim()) chips.push({ key: 'q', label: `Search: ${filters.q.trim()}`, remove: () => apply({ q: '' }) });
  if (!hideCategories) filters.categories.forEach((c) => chips.push({ key: `c-${c}`, label: categories.find((x) => x.id === c)?.name ?? c, remove: () => apply({ categories: filters.categories.filter((x) => x !== c) }) }));
  if (filters.minMinor !== undefined || filters.maxMinor !== undefined) chips.push({ key: 'price', label: `Price: ${filters.minMinor !== undefined ? formatMoney(filters.minMinor, { compact: true }) : '$0'} – ${filters.maxMinor !== undefined ? formatMoney(filters.maxMinor, { compact: true }) : 'any'}`, remove: () => apply({ minMinor: undefined, maxMinor: undefined }) });
  if (filters.inStock) chips.push({ key: 'stock', label: 'In stock', remove: () => apply({ inStock: false }) });
  if (filters.onSale) chips.push({ key: 'sale', label: 'On sale', remove: () => apply({ onSale: false }) });
  if (filters.isNew) chips.push({ key: 'new', label: 'New arrivals', remove: () => apply({ isNew: false }) });
  filters.colors.forEach((c) => chips.push({ key: `col-${c}`, label: `Colour: ${c}`, remove: () => apply({ colors: filters.colors.filter((x) => x !== c) }) }));

  return (
    <div className="browser container">
      <aside className="filters-aside" aria-label="Filters">
        <h2 className="h4">Filters</h2>
        <FilterPanel filters={filters} apply={apply} products={products} hideCategories={hideCategories} idPrefix="side" />
        {count > 0 && <button type="button" className="text-btn" onClick={reset}>Reset all filters</button>}
      </aside>

      <section className="browser-main" aria-label="Products">
        <div className="toolbar">
          <div className="field search-field">
            <label htmlFor="browser-q" className="sr-only">Search products</label>
            <Icon name="search" size={18} />
            <input id="browser-q" type="search" placeholder="Search products" value={filters.q} onChange={(e) => apply({ q: e.target.value })} />
          </div>
          <button type="button" className="btn btn-outline btn-sm filter-open" onClick={() => setDrawer(true)} aria-haspopup="dialog"><Icon name="filter" size={18} /> Filters{count > 0 ? ` (${count})` : ''}</button>
          <div className="field sort-field">
            <label htmlFor="browser-sort">Sort by</label>
            <select id="browser-sort" value={filters.sort} onChange={(e) => apply({ sort: e.target.value as SortKey })}>
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="results-bar">
          <p className="results-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'product' : 'products'}</p>
          {chips.length > 0 && (
            <ul className="chips" aria-label="Active filters">
              {chips.map((c) => <li key={c.key}><button type="button" className="chip" onClick={c.remove} aria-label={`Remove filter: ${c.label}`}>{c.label}<Icon name="close" size={14} /></button></li>)}
              <li><button type="button" className="text-btn" onClick={reset}>Reset all</button></li>
            </ul>
          )}
        </div>

        {results.length > 0 ? <ProductGrid products={results} priorityCount={4} /> : (
          <EmptyState icon="search" title="No products match your filters" text={filters.q.trim() ? `We couldn’t find anything for “${filters.q.trim()}” with these filters. Try fewer filters or a different word.` : (emptyHint ?? 'Try removing a filter or widening the price range.')}
            actions={<><button type="button" className="btn" onClick={reset}>Reset filters</button><Link to="/collections" className="btn btn-outline">Browse collections</Link></>} />
        )}
      </section>

      {drawer && (
        <div className="drawer-root" onMouseDown={(e) => { if (e.target === e.currentTarget) setDrawer(false); }}>
          <div ref={drawerRef} className="drawer drawer-left" role="dialog" aria-modal="true" aria-labelledby="filter-drawer-title" tabIndex={-1}>
            <div className="drawer-head">
              <h2 id="filter-drawer-title" className="h3">Filters</h2>
              <button type="button" className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close filters" data-autofocus><Icon name="close" /></button>
            </div>
            <div className="drawer-body"><FilterPanel filters={filters} apply={apply} products={products} hideCategories={hideCategories} idPrefix="drawer" /></div>
            <div className="drawer-foot drawer-actions">
              <button type="button" className="btn btn-outline" onClick={reset} disabled={count === 0}>Reset</button>
              <button type="button" className="btn" onClick={() => setDrawer(false)}>Show {results.length} {results.length === 1 ? 'product' : 'products'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
