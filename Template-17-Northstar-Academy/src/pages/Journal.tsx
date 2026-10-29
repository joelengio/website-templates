import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { articleCategories, articles } from '../config';
import { searchArticles } from '../lib/filters';
import { shortDate } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { ArticleCard } from '../components/ArticleCard';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { EmptyState, PageHero, Section } from '../components/ui';
import NotFound from './NotFound';

export function JournalIndex() {
  useSeo({ title: 'Journal', description: 'Articles and resources on study habits, careers and workplace skills from the Northstar Academy demonstration journal.', path: '/journal' });
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? '';
  const [q, setQ] = useState(params.get('q') ?? '');
  const list = searchArticles(articles, q, category);
  const setCat = (c: string) => {
    const p = new URLSearchParams(params);
    if (c) p.set('category', c);
    else p.delete('category');
    setParams(p, { replace: true });
  };
  const reset = () => { setQ(''); setParams(new URLSearchParams(), { replace: true }); };
  return (
    <>
      <PageHero eyebrow="Journal & resources" title="Ideas for better learning" intro="Short, practical articles. All authors and articles are fictional demonstration content." />
      <Section>
        <div className="catalogue__bar">
          <form role="search" aria-label="Search articles" className="searchbox" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="journal-q" className="sr-only">Search articles</label>
            <Icon name="search" size={20} />
            <input id="journal-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" autoComplete="off" />
          </form>
        </div>
        <div className="chips" role="group" aria-label="Filter by category">
          <button type="button" className={`chip-btn${!category ? ' is-on' : ''}`} aria-pressed={!category} onClick={() => setCat('')}>All</button>
          {articleCategories.map((c) => (
            <button key={c} type="button" className={`chip-btn${category === c ? ' is-on' : ''}`} aria-pressed={category === c} onClick={() => setCat(category === c ? '' : c)}>{c}</button>
          ))}
        </div>
        <div className="catalogue__status"><p role="status" aria-live="polite">Showing <strong>{list.length}</strong> of {articles.length} articles</p></div>
        {list.length ? (
          <div className="article-grid">{list.map((a) => <ArticleCard key={a.slug} article={a} headingLevel={2} />)}</div>
        ) : (
          <EmptyState title="No articles found" text="Try a different search or category." action={<Button onClick={reset}>Reset</Button>} />
        )}
      </Section>
    </>
  );
}

export function JournalArticle() {
  const { slug = '' } = useParams();
  const a = articles.find((x) => x.slug === slug);
  useSeo({ title: a?.title, description: a?.excerpt, path: `/journal/${slug}`, noindex: !a });
  if (!a) return <NotFound />;
  const related = articles.filter((x) => x.slug !== a.slug).sort((x, y) => Number(y.category === a.category) - Number(x.category === a.category)).slice(0, 3);
  return (
    <>
      <PageHero eyebrow={a.category} title={a.title} intro={a.excerpt}>
        <p className="fine">{a.author} (fictional) · <time dateTime={a.date}>{shortDate(a.date)}</time> · {a.readMinutes} min read</p>
      </PageHero>
      <Section>
        <article className="prose">
          {a.body.map((p) => <p key={p}>{p}</p>)}
          <p className="fine">Demonstration article. Replace with your own content in src/config/content.ts.</p>
          <p><Link to="/journal" className="text-link"><Icon name="arrow-left" size={16} /> Back to the journal</Link></p>
        </article>
      </Section>
      <Section tone="soft">
        <h2 className="section-title">Related reading</h2>
        <div className="article-grid">{related.map((r) => <ArticleCard key={r.slug} article={r} />)}</div>
      </Section>
    </>
  );
}
