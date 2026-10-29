import { useSearchParams } from 'react-router-dom';
import { articleCategories, articles } from '../config/articles';
import { insightsPage } from '../config/content';
import { ArticleCard } from '../components/Cards';
import { Button } from '../components/Button';
import { ConsultCTA } from '../components/ConsultCTA';
import { Icon } from '../components/Icon';
import { PageHero, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { useSeo } from '../hooks/useSeo';
import { filterArticles } from '../lib/search';

export default function Insights() {
  useSeo({ ...insightsPage.seo, path: '/insights' });
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const q = params.get('q') ?? '';
  const list = filterArticles(articles, { q, category });
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
  const h = insightsPage.hero;
  const showFeature = list.length > 1 && !q && category === 'all';
  return (
    <>
      <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} />
      <Section tone="ivory" srTitle="Articles">
        <Notice title="Educational demonstration content">{insightsPage.disclaimer}</Notice>
        <div className="filters">
          <div className="chip-row" role="group" aria-label="Filter articles by category">
            {['all', ...articleCategories].map((c) => (
              <button key={c} type="button" className={`chip${category === c ? ' is-active' : ''}`} aria-pressed={category === c} onClick={() => update({ category: c })}>
                {c === 'all' ? 'All topics' : c}
              </button>
            ))}
          </div>
          <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="article-search" className="sr-only">Search articles</label>
            <Icon name="search" size={18} />
            <input id="article-search" type="search" placeholder="Search articles…" value={q} onChange={(e) => update({ q: e.target.value })} />
          </form>
        </div>
        <p className="results-count" role="status" aria-live="polite">{list.length === 0 ? 'No articles match.' : `Showing ${list.length} of ${articles.length} articles`}</p>
        {list.length === 0 ? (
          <div className="empty">
            <Icon name="book" size={28} />
            <h2>No articles found</h2>
            <p>No articles match “{q}”{category !== 'all' ? ` in ${category}` : ''}. Try a broader search.</p>
            <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>Clear search and filters</Button>
          </div>
        ) : (
          <>
            {showFeature && <div className="feature-article"><ArticleCard article={list[0]} featured /></div>}
            <div className="grid grid--3">{(showFeature ? list.slice(1) : list).map((a) => <ArticleCard key={a.slug} article={a} />)}</div>
          </>
        )}
      </Section>
      <ConsultCTA />
    </>
  );
}
