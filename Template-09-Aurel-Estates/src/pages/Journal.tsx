import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { articles } from '../config/content';
import { pages } from '../config/layout';
import { formatDate } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { ArticleCard } from '../components/ArticleCard';
import { LinkButton } from '../components/Button';
import { PageHero } from '../components/Section';
import NotFound from './NotFound';

export function JournalIndex() {
  useSeo({ title: 'Journal & Guides', description: 'Buying and selling guides, neighborhood notes and design ideas from the Aurel Estates journal (fictional demo content).', path: '/journal' });
  const categories = useMemo(() => ['All', ...Array.from(new Set(articles.map((a) => a.category)))], []);
  const [cat, setCat] = useState('All');
  const list = articles.filter((a) => cat === 'All' || a.category === cat);
  return (
    <>
      <PageHero eyebrow="Journal" title="Guides & notes" lead="Practical advice on buying, selling and living well — written for the fictional Aurel Estates demo." />
      <section className="section section--flush">
        <div className="container">
          <div className="chips" role="group" aria-label="Filter articles by category">
            {categories.map((c) => (
              <button key={c} type="button" className={`chip${cat === c ? ' is-active' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            Showing {list.length} {list.length === 1 ? 'article' : 'articles'}
          </p>
          <h2 className="sr-only">All articles</h2>
          <ul className="article-grid article-grid--wide">
            {list.map((a) => (
              <li key={a.slug}>
                <ArticleCard slug={a.slug} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export function JournalArticle() {
  const { slug } = useParams();
  const a = articles.find((x) => x.slug === slug);
  useSeo({ title: a?.title, description: a?.excerpt, path: a ? `/journal/${a.slug}` : undefined, image: a?.image.src });
  if (!a) return <NotFound />;
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 2);
  return (
    <article>
      <header className="page-hero">
        <div className="container container--narrow">
          <p className="breadcrumb">
            <Link to="/journal">Journal</Link> / {a.category}
          </p>
          <h1 tabIndex={-1} data-page-heading>
            {a.title}
          </h1>
          <p className="lead">{a.excerpt}</p>
          <p className="article-meta">
            {formatDate(a.date)} · {a.readMinutes} min read
          </p>
        </div>
      </header>
      <div className="container container--narrow">
        <img className="article-hero" src={a.image.src} alt={a.image.alt} width={1200} height={800} />
        <div className="prose">
          {a.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="muted">This guide is fictional demo content and general information only; it is not professional advice.</p>
        </div>
      </div>
      <section className="section section--tint">
        <div className="container">
          <h2 className="h3">Keep reading</h2>
          <ul className="article-grid">
            {more.map((m) => (
              <li key={m.slug}>
                <ArticleCard slug={m.slug} />
              </li>
            ))}
          </ul>
          {pages.contact && (
            <p className="section-link">
              <LinkButton to="/contact" variant="ghost">
                Talk to an advisor
              </LinkButton>
            </p>
          )}
        </div>
      </section>
    </article>
  );
}
