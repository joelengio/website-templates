import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { treatments, treatmentCategories } from '../config/treatments';
import { site } from '../config/site';
import { Seo } from '../components/Seo';
import { TreatmentCard } from '../components/Cards';
import { Button, EmptyState, SectionHeading } from '../components/ui';
import { Icon } from '../components/Icon';

export default function Treatments() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const q = params.get('q') ?? '';

  const update = (next: Record<string, string>) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v && v !== 'all' ? p.set(k, v) : p.delete(k)));
    setParams(p, { replace: true });
  };

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return treatments.filter((t) => {
      if (category !== 'all' && t.category !== category) return false;
      if (!term) return true;
      return [t.name, t.summary, t.tags.join(' '), ...t.benefits].join(' ').toLowerCase().includes(term);
    });
  }, [category, q]);

  return (
    <>
      <Seo title={site.pages.treatments.title} description={site.pages.treatments.description} />
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" eyebrow="Treatment menu" title="Treatments for every kind of tired" text="Massage, facials, body rituals and wellness therapies — each tailored to you on the day." />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Filter treatments by category">
              {[{ id: 'all', name: 'All' }, ...treatmentCategories].map((c) => (
                <button key={c.id} type="button" className={`chip ${category === c.id ? 'is-active' : ''}`} aria-pressed={category === c.id} onClick={() => update({ category: c.id })}>
                  {c.name}
                </button>
              ))}
            </div>
            <div className="search">
              <label htmlFor="treatment-search" className="sr-only">Search treatments</label>
              <Icon name="search" size={18} />
              <input id="treatment-search" type="search" placeholder="Search treatments…" value={q} onChange={(e) => update({ q: e.target.value })} autoComplete="off" />
            </div>
          </div>
          <p className="result-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'treatment' : 'treatments'} shown</p>
          {results.length ? (
            <><h2 className="sr-only">Treatment list</h2><div className="grid grid-3">{results.map((t) => <TreatmentCard key={t.slug} t={t} />)}</div></>
          ) : (
            <EmptyState title="No treatments found" text="Try a different search term or clear the filters to see the full menu." action={<Button variant="outline" onClick={() => setParams({}, { replace: true })}>Clear filters</Button>} />
          )}
        </div>
      </section>
    </>
  );
}
