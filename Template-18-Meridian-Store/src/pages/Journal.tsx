import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { articles, journalCategories } from '../config/journal';
import { getProductBySlug } from '../lib/catalog';
import { ProductGrid } from '../components/ProductCard';
import { Seo } from '../components/Seo';
import { Breadcrumbs, EmptyState, PageHeader, SafeImg, SectionHeading } from '../components/ui';
import NotFound from './NotFound';
import type { Product } from '../config/types';

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' });

export function JournalIndex() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return articles.filter((a) => (cat === 'All' || a.category === cat) && (!t || `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(t)));
  }, [q, cat]);
  return (
    <>
      <Seo title="Journal" description="Product stories, styling guides and care notes from the MERIDIAN STORE journal." path="/journal" />
      <PageHeader eyebrow="The Journal" title="Stories and styling" text="Guides to choosing, styling and caring for the things in the store. Fictional demonstration content.">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Journal' }]} />
      </PageHeader>
      <div className="container section-tight">
        <div className="journal-tools">
          <div className="chips" role="group" aria-label="Filter by category">
            {['All', ...journalCategories].map((c) => <button key={c} type="button" className={`chip-btn${cat === c ? ' is-on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="field"><label htmlFor="journal-q" className="sr-only">Search articles</label><input id="journal-q" type="search" placeholder="Search the journal" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        </div>
        <p className="results-count" role="status" aria-live="polite">{list.length} {list.length === 1 ? 'article' : 'articles'}</p>
        {list.length ? (
          <ul className="article-grid is-index">
            {list.map((a) => (
              <li key={a.slug}>
                <Link to={`/journal/${a.slug}`} className="article-card">
                  <SafeImg src={a.image} alt={a.alt} width={1200} height={800} />
                  <span className="article-meta">{a.category} · {a.readMinutes} min read</span>
                  <strong>{a.title}</strong>
                  <span className="article-excerpt">{a.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <EmptyState icon="search" title="No articles found" text="Try a different search term or category." actions={<button type="button" className="btn" onClick={() => { setQ(''); setCat('All'); }}>Show all articles</button>} />}
      </div>
    </>
  );
}

export function JournalArticle() {
  const { slug } = useParams();
  const a = articles.find((x) => x.slug === slug);
  if (!a) return <NotFound />;
  const related = articles.filter((x) => x.slug !== a.slug).sort((x, y) => Number(y.category === a.category) - Number(x.category === a.category)).slice(0, 3);
  return (
    <>
      <Seo title={a.title} description={a.excerpt} path={`/journal/${a.slug}`} image={a.image} type="article" />
      <article>
        <header className="article-header container narrow">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Journal', to: '/journal' }, { label: a.title }]} />
          <p className="eyebrow">{a.category} · {a.readMinutes} min read</p>
          <h1>{a.title}</h1>
          <p className="lede">{a.excerpt}</p>
          <p className="muted">By {a.author} · <time dateTime={a.date}>{fmt(a.date)}</time></p>
        </header>
        <div className="container article-hero"><SafeImg src={a.image} alt={a.alt} width={1200} height={800} eager /></div>
        <div className="container narrow prose">
          {a.body.map((b, i) => {
            if (b.type === 'p') return <p key={i}>{b.text}</p>;
            if (b.type === 'h2') return <h2 key={i} className="h3">{b.text}</h2>;
            if (b.type === 'quote') return <blockquote key={i}><p>{b.text}</p>{b.cite && <cite>{b.cite}</cite>}</blockquote>;
            const items = b.slugs.map((s) => getProductBySlug(s)).filter((p): p is Product => Boolean(p));
            return items.length ? <aside key={i} className="shop-story" aria-label={b.title}><h2 className="h4">{b.title}</h2><ProductGrid products={items} /></aside> : null;
          })}
        </div>
      </article>
      <section className="section container" aria-labelledby="more-title">
        <SectionHeading id="more-title" eyebrow="Keep reading" title="Related stories" />
        <ul className="article-grid">
          {related.map((r) => (
            <li key={r.slug}><Link to={`/journal/${r.slug}`} className="article-card"><SafeImg src={r.image} alt={r.alt} width={1200} height={800} /><span className="article-meta">{r.category} · {r.readMinutes} min read</span><strong>{r.title}</strong></Link></li>
          ))}
        </ul>
      </section>
    </>
  );
}
