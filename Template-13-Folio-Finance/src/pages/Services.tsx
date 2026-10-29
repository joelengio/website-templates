import { useSearchParams } from 'react-router-dom';
import { serviceCategories, services } from '../config/services';
import { ServiceCard } from '../components/Cards';
import { Button } from '../components/Button';
import { ConsultCTA } from '../components/ConsultCTA';
import { Icon } from '../components/Icon';
import { PageHero, Section } from '../components/Section';
import { useSeo } from '../hooks/useSeo';
import { filterServices } from '../lib/search';

export default function Services() {
  useSeo({ title: 'Services', description: 'Eight advisory, accounting and planning services — financial planning, business advisory, tax planning, wealth planning, cash flow, corporate finance and startup support.', path: '/services' });
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const q = params.get('q') ?? '';
  const list = filterServices(services, { category, q });

  const update = (next: { category?: string; q?: string }) =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        const c = next.category ?? prev.get('category') ?? 'all';
        const query = next.q ?? prev.get('q') ?? '';
        if (c !== 'all') p.set('category', c);
        else p.delete('category');
        if (query) p.set('q', query);
        else p.delete('q');
        return p;
      },
      { replace: true },
    );

  return (
    <>
      <PageHero eyebrow="Services" title="Advice for people, businesses and everything in between." lead="Filter by what you need. Every service has a clear scope, deliverables and a demonstration starting price." />
      <Section tone="ivory" srTitle="Service list">
        <div className="filters">
          <div className="chip-row" role="group" aria-label="Filter services by category">
            {[{ id: 'all', label: 'All services' }, ...serviceCategories].map((c) => (
              <button key={c.id} type="button" className={`chip${category === c.id ? ' is-active' : ''}`} aria-pressed={category === c.id} onClick={() => update({ category: c.id })}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="search">
            <label htmlFor="svc-search" className="sr-only">
              Search services
            </label>
            <Icon name="search" size={18} />
            <input id="svc-search" type="search" placeholder="Search services…" value={q} onChange={(e) => update({ q: e.target.value })} />
          </div>
        </div>
        <p className="results-count" role="status" aria-live="polite">
          {list.length === 0 ? 'No services match.' : `Showing ${list.length} of ${services.length} services`}
        </p>
        {list.length ? (
          <div className="grid grid--3">
            {list.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <Icon name="search" size={28} />
            <h2>No services found</h2>
            <p>Try a different category or search term.</p>
            <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
              Clear filters
            </Button>
          </div>
        )}
      </Section>
      <ConsultCTA />
    </>
  );
}
