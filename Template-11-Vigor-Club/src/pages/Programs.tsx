import { useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Button, EmptyState, PageHero, Reveal } from '../components/ui';
import { ProgramCard } from '../components/Cards';
import { programCategories, programs } from '../config/programs';
import { trainers } from '../config/trainers';
import { filterPrograms } from '../lib/filters';
import type { Level } from '../config/types';

const levels: Level[] = ['All levels', 'Beginner-friendly', 'Intermediate', 'Advanced'];

export default function Programs() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'All';
  const level = params.get('level') ?? 'All';
  const trainer = params.get('trainer') ?? 'All';
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v || v === 'All') next.delete(k); else next.set(k, v);
    setParams(next, { replace: true });
  };
  const name = (slug: string) => trainers.find((t) => t.slug === slug)?.name ?? slug;
  const list = filterPrograms(programs, { q, category, level, trainer }, name);
  const active = q || category !== 'All' || level !== 'All' || trainer !== 'All';

  return (
    <>
      <Seo title="Training Programs" description="Eight coached training programs: strength, functional, HIIT, boxing fitness, mobility, personal training, group conditioning and performance." />
      <PageHero eyebrow="Programs" title={<>Train your <span className="accent">way.</span></>} intro="Search and filter eight coached programs by focus, experience level and trainer." />
      <section className="section section--tight">
        <div className="container">
          <div className="filter-bar" role="search" aria-label="Search and filter programs">
            <div className="search-box">
              <Icon name="search" size={18} />
              <label htmlFor="program-search" className="sr-only">Search programs</label>
              <input id="program-search" type="search" placeholder="Search programs, trainers, focus…" value={q} onChange={(e) => set('q', e.target.value)} />
            </div>
            <div className="select-row">
              <label>
                <span>Experience</span>
                <select value={level} onChange={(e) => set('level', e.target.value)}>
                  <option value="All">All levels</option>
                  {levels.slice(1).map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
              <label>
                <span>Trainer</span>
                <select value={trainer} onChange={(e) => set('trainer', e.target.value)}>
                  <option value="All">Any trainer</option>
                  {trainers.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
                </select>
              </label>
            </div>
          </div>
          <div className="chip-row" role="group" aria-label="Filter by category">
            {['All', ...programCategories].map((c) => (
              <button key={c} type="button" className={`chip-btn ${category === c ? 'is-active' : ''}`} aria-pressed={category === c} onClick={() => set('category', c)}>{c}</button>
            ))}
          </div>
          <p className="result-count" role="status" aria-live="polite">{list.length} {list.length === 1 ? 'program' : 'programs'}{active ? ' match your filters' : ''}</p>
          {list.length ? (
            <>
            <h2 className="sr-only">Program list</h2>
            <div className="grid grid--cards">
              {list.map((p, i) => <Reveal key={p.slug}><ProgramCard program={p} index={i} /></Reveal>)}
            </div>
            </>
          ) : (
            <EmptyState title="No programs match" text="Try a different search term or clear your filters to see all programs." action={<Button variant="ghost" onClick={() => setParams({}, { replace: true })}>Clear all filters</Button>} />
          )}
        </div>
      </section>
    </>
  );
}
