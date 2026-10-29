import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, courses } from '../config';
import { defaultFilters, filterCourses, filtersFromParams, filtersToParams, hasActiveFilters, sortOptions, type CourseFilters } from '../lib/filters';
import { useSeo } from '../hooks/useSeo';
import { Button } from '../components/Button';
import { CourseCard } from '../components/CourseCard';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { EmptyState, PageHero, Section } from '../components/ui';

const levels = ['Beginner', 'Intermediate', 'Advanced'] as const;

function Filters({ f, set, idPrefix }: { f: CourseFilters; set: (patch: Partial<CourseFilters>) => void; idPrefix: string }) {
  return (
    <div className="filters">
      <fieldset>
        <legend>Category</legend>
        <div className="chips">
          <button type="button" className={`chip-btn${!f.category ? ' is-on' : ''}`} aria-pressed={!f.category} onClick={() => set({ category: '' })}>All</button>
          {categories.map((c) => (
            <button key={c.id} type="button" className={`chip-btn${f.category === c.id ? ' is-on' : ''}`} aria-pressed={f.category === c.id} onClick={() => set({ category: f.category === c.id ? '' : c.id })}>
              {c.name}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="filters__row">
        <div className="field">
          <label htmlFor={`${idPrefix}-level`}>Difficulty</label>
          <select id={`${idPrefix}-level`} value={f.difficulty} onChange={(e) => set({ difficulty: e.target.value as CourseFilters['difficulty'] })}>
            <option value="">Any level</option>
            {levels.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-price`}>Price</label>
          <select id={`${idPrefix}-price`} value={f.price} onChange={(e) => set({ price: e.target.value as CourseFilters['price'] })}>
            <option value="all">Free and paid</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-sort`}>Sort by</label>
          <select id={`${idPrefix}-sort`} value={f.sort} onChange={(e) => set({ sort: e.target.value as CourseFilters['sort'] })}>
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const f = filtersFromParams(params);
  const [q, setQ] = useState(f.q);
  const [drawer, setDrawer] = useState(false);
  useSeo({ title: 'Courses', description: 'Search and filter Northstar Academy’s demonstration course catalogue by category, difficulty, price and rating.', path: '/courses' });

  // Keep the search box in sync when the URL changes elsewhere (header links, back button) —
  // but never overwrite what the user is typing with a value this component pushed itself.
  const pushed = useRef(f.q);
  useEffect(() => {
    if (f.q !== pushed.current) {
      pushed.current = f.q;
      setQ(f.q);
    }
  }, [f.q]);

  // Always write the whole filter state (including the current search text) so updates can never overwrite each other.
  const set = (patch: Partial<CourseFilters>) => {
    pushed.current = q;
    setParams(filtersToParams({ ...f, q, ...patch }), { replace: true });
  };
  const live = filterCourses(courses, { ...f, q });
  const reset = () => {
    pushed.current = '';
    setQ('');
    setParams(filtersToParams(defaultFilters), { replace: true });
  };
  const active = hasActiveFilters({ ...f, q });
  const activeCount = [f.category, f.difficulty, f.price !== 'all' ? 'p' : ''].filter(Boolean).length;

  return (
    <>
      <PageHero eyebrow="Course catalogue" title="Find the course that moves you forward" intro={`${courses.length} demonstration courses across ${categories.length} categories. Ratings and prices are fictional sample data.`} />
      <Section className="catalogue">
        <div className="catalogue__bar">
          <form role="search" aria-label="Search courses" className="searchbox" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="course-q" className="sr-only">Search courses</label>
            <Icon name="search" size={20} />
            <input id="course-q" type="search" value={q} onChange={(e) => {
                const v = e.target.value;
                setQ(v);
                pushed.current = v;
                setParams(filtersToParams({ ...f, q: v }), { replace: true });
              }} placeholder="Search by title, topic or instructor" autoComplete="off" />
          </form>
          <Button variant="ghost" className="filters-open" onClick={() => setDrawer(true)} aria-haspopup="dialog">
            <Icon name="filter" size={18} /> Filters{activeCount ? ` (${activeCount})` : ''}
          </Button>
        </div>
        <div className="filters-desktop"><Filters f={f} set={set} idPrefix="d" /></div>
        <Modal open={drawer} onClose={() => setDrawer(false)} label="Filter courses" side="left" className="drawer">
          <div className="menu-panel__head">
            <h2 className="drawer__title">Filters</h2>
            <button type="button" className="icon-btn" aria-label="Close filters" onClick={() => setDrawer(false)}><Icon name="x" size={24} /></button>
          </div>
          <Filters f={f} set={set} idPrefix="m" />
          <div className="dialog__actions">
            <Button variant="ghost" onClick={reset}>Reset</Button>
            <Button onClick={() => setDrawer(false)}>Show {live.length} course{live.length === 1 ? '' : 's'}</Button>
          </div>
        </Modal>
        <div className="catalogue__status">
          <p role="status" aria-live="polite" data-testid="result-count">
            Showing <strong>{live.length}</strong> of {courses.length} courses
          </p>
          {active && <button type="button" className="text-link" onClick={reset}>Clear all filters</button>}
        </div>
        {live.length ? (
          <div className="course-grid">
            {live.map((c) => <CourseCard key={c.slug} course={c} headingLevel={2} />)}
          </div>
        ) : (
          <EmptyState title="No courses match those filters" text="Try a broader search, remove a filter or browse everything." action={<Button onClick={reset}>Reset search and filters</Button>} />
        )}
      </Section>
    </>
  );
}
