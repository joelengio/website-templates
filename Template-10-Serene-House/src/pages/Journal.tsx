import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { articles, journalCategories, journalNotice } from '../config/journal';
import { site } from '../config/site';
import { Seo } from '../components/Seo';
import { ArticleCard } from '../components/Cards';
import { Button, DemoNotice, EmptyState, SectionHeading } from '../components/ui';
import { Icon } from '../components/Icon';

export default function Journal() {
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
    return articles.filter((a) => (category === 'all' || a.category === category) && (!term || `${a.title} ${a.excerpt} ${a.category} ${a.author}`.toLowerCase().includes(term)));
  }, [category, q]);
  return (
    <>
      <Seo title={site.pages.journal.title} description={site.pages.journal.description} />
      <section className="page-hero"><div className="container"><SectionHeading as="h1" eyebrow="The Journal" title="Notes on slower living" text="Reading on rest, skin, breath and the small rituals that make days kinder." /></div></section>
      <section className="section section--tight">
        <div className="container">
          <DemoNotice>{journalNotice}</DemoNotice>
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Filter articles by category">
              {['all', ...journalCategories].map((c) => (
                <button key={c} type="button" className={`chip ${category === c ? 'is-active' : ''}`} aria-pressed={category === c} onClick={() => update({ category: c })}>{c === 'all' ? 'All' : c}</button>
              ))}
            </div>
            <div className="search">
              <label htmlFor="journal-search" className="sr-only">Search articles</label>
              <Icon name="search" size={18} />
              <input id="journal-search" type="search" placeholder="Search articles…" value={q} onChange={(e) => update({ q: e.target.value })} autoComplete="off" />
            </div>
          </div>
          <p className="result-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'article' : 'articles'} shown</p>
          {results.length ? <><h2 className="sr-only">Articles</h2><div className="grid grid-3">{results.map((a) => <ArticleCard key={a.slug} a={a} />)}</div></> : <EmptyState title="No articles found" text="Try another keyword or category." action={<Button variant="outline" onClick={() => setParams({}, { replace: true })}>Clear filters</Button>} />}
        </div>
      </section>
    </>
  );
}
