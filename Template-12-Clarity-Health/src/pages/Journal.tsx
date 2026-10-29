import { useSearchParams } from 'react-router-dom';
import { articleCategories, articles } from '../config/articles';
import { site } from '../config/site';
import { ArticleCard } from '../components/Cards';
import { Seo } from '../components/Seo';
import { Button, EmptyState, Notice, PageHero } from '../components/ui';
import { matchesQuery } from '../lib/search';

export default function Journal() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const clear = () => setParams({}, { replace: true });
  const results = [...articles]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter((a) => (category === 'all' || a.category === category) && matchesQuery(q, a.title, a.excerpt, a.category, a.sections.map((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]).flat()));
  return (
    <>
      <Seo title="Health journal" description="General, plain-language health information articles written for the CLARITY HEALTH demonstration. Educational only — not medical advice." />
      <PageHero eyebrow="Journal" title="Health insights, in plain language" lead="General educational articles written for this template. Search by keyword or browse by category.">
        <Notice title="Educational content only">{site.notices.articles}</Notice>
      </PageHero>
      <section className="section-tight">
        <div className="container">
          <div className="chip-filter" role="group" aria-label="Article categories">
            <button type="button" className={`chip ${category === 'all' ? 'is-active' : ''}`} aria-pressed={category === 'all'} onClick={() => set('category', 'all')}>All</button>
            {articleCategories.filter((c) => articles.some((a) => a.category === c)).map((c) => (
              <button key={c} type="button" className={`chip ${category === c ? 'is-active' : ''}`} aria-pressed={category === c} onClick={() => set('category', c)}>{c}</button>
            ))}
          </div>
          <form className="filter-bar" role="search" aria-label="Search articles" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-field grow">
              <label htmlFor="art-q">Search articles</label>
              <input id="art-q" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="e.g. sleep, sun, screening" autoComplete="off" />
            </div>
            {(q || category !== 'all') && <Button variant="ghost" onClick={clear}>Clear filters</Button>}
          </form>
          <p className="result-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'article' : 'articles'} shown</p>
          {results.length ? (
            <div className="grid grid-3">{results.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
          ) : (
            <EmptyState title="No articles match your search" action={<Button variant="secondary" onClick={clear}>Clear filters</Button>}>
              Try another keyword, or browse all categories.
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
