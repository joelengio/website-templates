import { useSearchParams } from 'react-router-dom';
import { booking } from '../config/booking';
import { serviceCategories, services } from '../config/services';
import { specialties } from '../config/specialties';
import { ServiceCard } from '../components/Cards';
import { Seo } from '../components/Seo';
import { Button, EmptyState, Notice, PageHero } from '../components/ui';
import { matchesQuery } from '../lib/search';
import { specialtyById } from '../lib/catalog';
import { site } from '../config/site';

export default function Services() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';
  const specialty = params.get('specialty') ?? 'all';

  const set = (key: string, value: string) => {
    // Functional update: always builds on the latest URL, never on a render-time snapshot that a just-clicked "Clear filters" has not replaced yet.
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== 'all') next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  };
  const clear = () => setParams({}, { replace: true });

  const results = services.filter(
    (s) =>
      (category === 'all' || s.category === category) &&
      (specialty === 'all' || s.specialtyIds.includes(specialty)) &&
      matchesQuery(q, s.name, s.summary, s.specialtyIds.map((id) => specialtyById(id)?.name), serviceCategories.find((c) => c.id === s.category)?.label)
  );
  const filtered = q !== '' || category !== 'all' || specialty !== 'all';

  return (
    <>
      <Seo title="Services" description={`Browse the ${site.brand.name} demonstration services catalog: consultations, diagnostics, preventive care, specialist treatments and wellness screenings, with durations and demo prices.`} />
      <PageHero eyebrow="Medical services" title="A complete services catalog" lead="Filter by category or specialty, or search by name. Durations are shown for every service.">
        {booking.pricing.show && <Notice title="Demo prices">Prices are invented placeholders and can be hidden in <code>src/config/booking.ts</code>. {site.notices.medical}</Notice>}
      </PageHero>
      <section className="section-tight">
        <div className="container">
          <div className="chip-filter" role="group" aria-label="Service categories">
            <button type="button" className={`chip ${category === 'all' ? 'is-active' : ''}`} aria-pressed={category === 'all'} onClick={() => set('category', 'all')}>All services</button>
            {serviceCategories.map((c) => (
              <button key={c.id} type="button" className={`chip ${category === c.id ? 'is-active' : ''}`} aria-pressed={category === c.id} onClick={() => set('category', c.id)}>{c.label}</button>
            ))}
          </div>
          <form className="filter-bar" role="search" aria-label="Search services" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-field grow">
              <label htmlFor="svc-q">Search services</label>
              <input id="svc-q" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="e.g. ECG, check-up, screening" autoComplete="off" />
            </div>
            <div className="filter-field">
              <label htmlFor="svc-spec">Specialty</label>
              <select id="svc-spec" value={specialty} onChange={(e) => set('specialty', e.target.value)}>
                <option value="all">All specialties</option>
                {specialties.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {filtered && <Button variant="ghost" onClick={clear}>Clear filters</Button>}
          </form>
          <p className="result-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'service' : 'services'} shown</p>
          <h2 className="sr-only">Service results</h2>
          {results.length ? (
            <div className="grid grid-3">{results.map((s) => <ServiceCard key={s.id} s={s} />)}</div>
          ) : (
            <EmptyState title="No services match your search" action={<Button variant="secondary" onClick={clear}>Clear all filters</Button>}>
              Try another keyword or remove a filter.
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
