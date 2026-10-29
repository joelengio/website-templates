import { useMemo, useState } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { PageHero } from '../components/Section';
import { articles, journalContent } from '../config/journal';
import { useSeo } from '../hooks/useSeo';
import { pageSeo } from '../lib/seo';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Journal() {
  useSeo({ ...pageSeo('/journal'), path: '/journal' });
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const tokens = norm(q).split(/\s+/).filter(Boolean);
    return [...articles]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((a) => cat === 'All' || a.category === cat)
      .filter((a) => {
        if (!tokens.length) return true;
        const hay = norm([a.title, a.excerpt, a.category, a.author, ...a.blocks.map((b) => ('text' in b ? b.text : b.items.join(' ')))].join(' '));
        return tokens.every((t) => hay.includes(t));
      });
  }, [cat, q]);
  const [first, ...rest] = results;
  return (
    <>
      <PageHero {...journalContent} image="chopping" />
      <section className="section section--dark">
        <div className="container">
          <div className="journal-controls">
            <div className="chips" role="group" aria-label="Filter articles by category">
              {['All', ...journalContent.categories].map((c) => (
                <button key={c} type="button" className={`chip${cat === c ? ' is-on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
            <div className="search">
              <Icon name="search" size={18} />
              <label htmlFor="journal-search" className="visually-hidden">Search articles</label>
              <input id="journal-search" type="search" placeholder="Search articles" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
            </div>
          </div>
          <p className="results-count" role="status" aria-live="polite">{results.length === 0 ? 'No articles found.' : `${results.length} ${results.length === 1 ? 'article' : 'articles'}`}</p>
          {results.length === 0 ? (
            <div className="empty empty--large">
              <h2>No articles match</h2>
              <p>Try a different search term or category.</p>
              <Button onClick={() => { setQ(''); setCat('All'); }}>Reset filters</Button>
            </div>
          ) : (
            <>
              {first && <ArticleCard article={first} featured />}
              <div className="article-grid">{rest.map((a) => <ArticleCard key={a.slug} article={a} />)}</div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
