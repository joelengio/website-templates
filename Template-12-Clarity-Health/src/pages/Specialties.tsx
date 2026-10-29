import { useSearchParams } from 'react-router-dom';
import { specialties, specialtyCategories } from '../config/specialties';
import { SpecialtyCard } from '../components/Cards';
import { Seo } from '../components/Seo';
import { Button, EmptyState, PageHero } from '../components/ui';
import { doctorsOfSpecialty, servicesOfSpecialty } from '../lib/catalog';
import { matchesQuery } from '../lib/search';

export default function Specialties() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = specialties.filter(
    (s) =>
      (category === 'all' || s.category === category) &&
      matchesQuery(q, s.name, s.summary, s.category, s.keywords, s.commonTopics, servicesOfSpecialty(s.id).map((x) => x.name), doctorsOfSpecialty(s.id).map((d) => d.name))
  );
  const filtered = q !== '' || category !== 'all';

  return (
    <>
      <Seo title="Specialties" description="Explore the eight demonstration specialties at CLARITY HEALTH — from general medicine and cardiology to dentistry, physiotherapy and women’s health." />
      <PageHero eyebrow="Specialties" title="Eight specialties, one joined-up clinic" lead="Search or filter the demonstration specialties. Each has its own services, fictional doctors and a booking shortcut." />
      <section className="section-tight">
        <div className="container">
          <form className="filter-bar" role="search" aria-label="Search and filter specialties" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-field grow">
              <label htmlFor="spec-q">Search specialties</label>
              <input id="spec-q" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="e.g. heart, skin, children" autoComplete="off" />
            </div>
            <div className="filter-field">
              <label htmlFor="spec-cat">Category</label>
              <select id="spec-cat" value={category} onChange={(e) => set('category', e.target.value)}>
                <option value="all">All categories</option>
                {specialtyCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {filtered && <Button variant="ghost" onClick={() => setParams({}, { replace: true })}>Clear filters</Button>}
          </form>
          <p className="result-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'specialty' : 'specialties'} shown</p>
          {results.length ? (
            <div className="grid grid-4">{results.map((s) => <SpecialtyCard key={s.id} s={s} />)}</div>
          ) : (
            <EmptyState title="No specialties match your search" action={<Button variant="secondary" onClick={() => setParams({}, { replace: true })}>Clear filters</Button>}>
              Try a different word such as “heart”, “skin” or “children”, or clear the filters.
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
