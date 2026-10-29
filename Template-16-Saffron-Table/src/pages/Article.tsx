import { Link, useParams } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { ButtonLink } from '../components/Button';
import { Img } from '../components/Img';
import { articles } from '../config/journal';
import { useSeo } from '../hooks/useSeo';
import { formatArticleDate } from '../lib/dates';
import NotFound from './NotFound';

export default function Article() {
  const { slug } = useParams();
  const a = articles.find((x) => x.slug === slug);
  useSeo({
    title: a?.title ?? 'Article not found',
    description: a?.excerpt ?? 'This article could not be found.',
    path: `/journal/${slug ?? ''}`,
    image: a ? `/images/${a.image}.jpg` : undefined,
    type: 'article',
    noindex: !a,
  });
  if (!a) return <NotFound />;
  const related = articles.filter((x) => x.slug !== a.slug && x.category === a.category).concat(articles.filter((x) => x.slug !== a.slug && x.category !== a.category)).slice(0, 3);
  return (
    <>
      <article className="article">
        <header className="article__head container container--narrow">
          <nav aria-label="Breadcrumb" className="crumbs"><Link to="/journal">Journal</Link> <span aria-hidden="true">/</span> <span>{a.category}</span></nav>
          <h1>{a.title}</h1>
          <p className="article__meta">By {a.author} · <time dateTime={a.date}>{formatArticleDate(a.date)}</time> · {a.readMinutes} min read</p>
        </header>
        <div className="container article__hero"><Img name={a.image} eager sizes="(min-width: 1100px) 1000px, 100vw" /></div>
        <div className="container container--narrow article__body">
          {a.blocks.map((b, i) =>
            b.type === 'p' ? <p key={i}>{b.text}</p> :
            b.type === 'h2' ? <h2 key={i}>{b.text}</h2> :
            b.type === 'quote' ? <blockquote key={i}><p>{b.text}</p>{b.cite && <footer>{b.cite}</footer>}</blockquote> :
            <ul key={i}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>,
          )}
          <p className="article__note">Fictional demonstration article.</p>
          <div className="article__cta"><ButtonLink to="/reserve" icon="arrow">Reserve a table</ButtonLink></div>
        </div>
      </article>
      <section className="section section--soft" aria-labelledby="related-title">
        <div className="container">
          <h2 id="related-title" className="h3">Keep reading</h2>
          <div className="article-grid">{related.map((r) => <ArticleCard key={r.slug} article={r} />)}</div>
        </div>
      </section>
    </>
  );
}
