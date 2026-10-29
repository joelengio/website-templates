import { useMemo, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { AllergyNotice, MenuItemCard } from '../components/Menu';
import { PageHero } from '../components/Section';
import { allergenLabels, dietaryLabels, featuredMenuSections, menuCategories, menuItems, menuPageContent } from '../config/menu';
import { features } from '../config/features';
import { useSeo } from '../hooks/useSeo';
import { countActiveFilters, defaultFilters, filterMenu, groupByCategory, type MenuFilters } from '../lib/menu';
import { pageSeo } from '../lib/seo';
import { Link } from 'react-router-dom';

export default function Menus() {
  useSeo({ ...pageSeo('/menus'), path: '/menus' });
  const [f, setF] = useState<MenuFilters>(defaultFilters);
  const [showAllergens, setShowAllergens] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => filterMenu(menuItems, f), [f]);
  const grouped = useMemo(() => groupByCategory(results, menuCategories), [results]);
  const active = countActiveFilters(f);
  const filtered = active > 0;
  const toggle = (key: 'dietary' | 'avoidAllergens', id: string) =>
    setF((p) => ({ ...p, [key]: p[key].includes(id) ? p[key].filter((x) => x !== id) : [...p[key], id] }));

  const featured = menuPageContent.showFeaturedSections && !filtered ? featuredMenuSections : [];

  return (
    <>
      <PageHero eyebrow={menuPageContent.eyebrow} title={menuPageContent.title} lead={menuPageContent.lead} image="steak-fries" />
      <section className="section section--dark menu-page">
        <div className="container">
          <AllergyNotice />

          <div className="menu-controls">
            <div role="tablist" aria-label="Menu categories" className="tablist">
              {[{ id: 'all', label: 'All' }, ...menuCategories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={f.category === c.id}
                  aria-controls="menu-results"
                  tabIndex={f.category === c.id ? 0 : -1}
                  className={`tab${f.category === c.id ? ' is-active' : ''}`}
                  onClick={() => setF((p) => ({ ...p, category: c.id }))}
                  onKeyDown={(e) => {
                    const ids = ['all', ...menuCategories.map((m) => m.id)];
                    const i = ids.indexOf(f.category);
                    let n = -1;
                    if (e.key === 'ArrowRight') n = (i + 1) % ids.length;
                    if (e.key === 'ArrowLeft') n = (i - 1 + ids.length) % ids.length;
                    if (e.key === 'Home') n = 0;
                    if (e.key === 'End') n = ids.length - 1;
                    if (n >= 0) {
                      e.preventDefault();
                      setF((p) => ({ ...p, category: ids[n] }));
                      requestAnimationFrame(() => document.getElementById(`tab-${ids[n]}`)?.focus());
                    }
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="menu-filters">
              <div className="search">
                <Icon name="search" size={18} />
                <label htmlFor="menu-search" className="visually-hidden">Search the menu</label>
                <input id="menu-search" type="search" placeholder={menuPageContent.searchPlaceholder} value={f.query} onChange={(e) => setF((p) => ({ ...p, query: e.target.value }))} autoComplete="off" />
              </div>
              <fieldset className="chips">
                <legend>Dietary</legend>
                {dietaryLabels.filter((d) => d.filterable).map((d) => (
                  <button key={d.id} type="button" className={`chip${f.dietary.includes(d.id) ? ' is-on' : ''}`} aria-pressed={f.dietary.includes(d.id)} onClick={() => toggle('dietary', d.id)} title={d.description}>
                    {f.dietary.includes(d.id) && <Icon name="check" size={14} />}
                    {d.label}
                  </button>
                ))}
              </fieldset>
              <div className="menu-filters__row">
                <button type="button" className="link-btn" aria-expanded={showAllergens} aria-controls="allergen-filters" onClick={() => setShowAllergens((v) => !v)}>
                  {showAllergens ? 'Hide' : 'Show'} allergen filters
                </button>
                <label className="check check--inline">
                  <input type="checkbox" checked={f.hideUnavailable} onChange={(e) => setF((p) => ({ ...p, hideUnavailable: e.target.checked }))} />
                  <span>Hide unavailable</span>
                </label>
                {filtered && <Button variant="text" size="sm" onClick={() => setF(defaultFilters)}>Clear filters ({active})</Button>}
              </div>
              {showAllergens && (
                <fieldset className="chips" id="allergen-filters">
                  <legend>Hide dishes listing these allergens</legend>
                  {allergenLabels.map((a) => (
                    <button key={a.id} type="button" className={`chip chip--allergen${f.avoidAllergens.includes(a.id) ? ' is-on' : ''}`} aria-pressed={f.avoidAllergens.includes(a.id)} onClick={() => toggle('avoidAllergens', a.id)}>
                      {a.label}
                    </button>
                  ))}
                  <p className="field__hint">Allergen data is illustrative. A dish that doesn’t list an allergen may still contain it. Always confirm with the restaurant.</p>
                </fieldset>
              )}
            </div>
          </div>

          <p className="results-count" role="status" aria-live="polite">
            {results.length === 0 ? 'No dishes match your filters.' : `${results.length} ${results.length === 1 ? 'item' : 'items'}${filtered ? ' match your filters' : ''}`}
          </p>

          <div id="menu-results" ref={resultsRef} role="tabpanel" aria-labelledby={`tab-${f.category}`} tabIndex={-1}>
            {featured.map((s) => (
              <section key={s.id} className="menu-featured" aria-labelledby={`feat-${s.id}`}>
                <h2 id={`feat-${s.id}`} className="menu-group__title">{s.title}</h2>
                <p className="menu-group__intro">{s.intro}</p>
                <div className="dish-grid">
                  {s.itemIds.map((id) => menuItems.find((i) => i.id === id)).filter((i) => !!i).map((i) => <MenuItemCard key={i!.id} item={i!} />)}
                </div>
              </section>
            ))}
            {grouped.map(({ category, items }) => (
              <section key={category.id} className="menu-group" aria-labelledby={`cat-${category.id}`}>
                <h2 id={`cat-${category.id}`} className="menu-group__title">{category.label}</h2>
                <p className="menu-group__intro">{category.intro}</p>
                <div className="dish-grid">
                  {items.map((i) => <MenuItemCard key={i.id} item={i} />)}
                </div>
              </section>
            ))}
            {results.length === 0 && (
              <div className="empty empty--large">
                <Icon name="dish" size={40} />
                <h2>Nothing matches that search</h2>
                <p>Try removing a dietary filter, or searching for an ingredient such as “saffron” or “mushroom”.</p>
                <Button onClick={() => setF(defaultFilters)}>Clear all filters</Button>
              </div>
            )}
          </div>

          <div className="menu-cta">
            <p>Ready to dine? Choose a date and time.</p>
            <div className="menu-cta__actions">
              <Link className="btn btn--primary btn--md" to="/reserve"><span>Reserve a table</span></Link>
              {features.orderBuilder && <Link className="btn btn--ghost btn--md" to="/order"><span>Open demo order builder</span></Link>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
