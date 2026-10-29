import { useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { site } from '../config/site';
import { Button, EmptyState, PageHero, Reveal } from '../components/ui';
import { Icon } from '../components/Icon';
import { ArticleCard } from '../components/Cards';
import { articles, journalCategories, journalDisclaimer } from '../config/journal';
import { filterArticles } from '../lib/filters';

export default function Journal() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'All';
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v || v === 'All') next.delete(k); else next.set(k, v);
    setParams(next, { replace: true });
  };
  const list = filterArticles(articles, q, category);
  const [lead, ...rest] = list;
  return (
    <>
      <Seo title="Journal" description={`Practical, balanced training articles from the ${site.brand.name} coaching team: technique, planning, recovery and club life.`} />
      <PageHero eyebrow="Journal" title={<>Notes from <span className="accent">the floor.</span></>} intro="Coach-written articles on technique, planning and recovery." >
        <p className="note note--inline">{journalDisclaimer}</p>
      </PageHero>
      <section className="section section--tight">
        <div className="container">
          <div className="filter-bar" role="search" aria-label="Search the journal">
            <div className="search-box">
              <Icon name="search" size={18} />
              <label htmlFor="journal-search" className="sr-only">Search articles</label>
              <input id="journal-search" type="search" placeholder="Search articles, tags, authors…" value={q} onChange={(e) => set('q', e.target.value)} />
            </div>
          </div>
          <div className="chip-row" role="group" aria-label="Filter by category">
            {['All', ...journalCategories].map((c) => <button key={c} type="button" className={`chip-btn ${category === c ? 'is-active' : ''}`} aria-pressed={category === c} onClick={() => set('category', c)}>{c}</button>)}
          </div>
          <p className="result-count" role="status" aria-live="polite">{list.length} {list.length === 1 ? 'article' : 'articles'}</p>
          {list.length ? (
            <>
            <h2 className="sr-only">All articles</h2>
            <div className="article-grid">
              {lead && <Reveal><ArticleCard article={lead} featured /></Reveal>}
              {rest.map((a) => <Reveal key={a.slug}><ArticleCard article={a} /></Reveal>)}
            </div>
            </>
          ) : (
            <EmptyState title="No articles found" text="Try another search term or category." action={<Button variant="ghost" onClick={() => setParams({}, { replace: true })}>Clear search</Button>} />
          )}
        </div>
      </section>
    </>
  );
}
