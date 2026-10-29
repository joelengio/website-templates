import { Link, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Breadcrumb, Img } from '../components/ui';
import { ArticleCard } from '../components/Cards';
import { articles, getArticle, journalDisclaimer } from '../config/journal';
import { formatArticleDate } from '../lib/format';
import { relatedArticles } from '../lib/filters';
import NotFound from './NotFound';

export default function JournalArticle() {
  const { slug = '' } = useParams();
  const a = getArticle(slug);
  if (!a) return <NotFound what="article" />;
  const related = relatedArticles(articles, a);
  return (
    <>
      <Seo title={a.title} description={a.excerpt} image={a.image.src} type="article" />
      <article>
        <header className="article-hero">
          <div className="container narrow-wide">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Journal', to: '/journal' }, { label: a.title }]} />
            <p className="eyebrow">{a.category}</p>
            <h1 className="h-mega h-mega--article">{a.title}</h1>
            <p className="article-meta">By {a.author} · <time dateTime={a.date}>{formatArticleDate(a.date)}</time> · {a.readMinutes} min read</p>
          </div>
        </header>
        <div className="container narrow-wide"><figure className="article-figure"><Img image={a.image} eager /></figure></div>
        <div className="container prose">
          <p className="lead">{a.excerpt}</p>
          {a.body.map((s, i) => (
            <section key={i}>
              {s.heading && <h2>{s.heading}</h2>}
              {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
          <p className="note">{journalDisclaimer}</p>
          <ul className="chip-list">{a.tags.map((t) => <li key={t} className="chip">#{t}</li>)}</ul>
          <p><Link to="/journal" className="back-link">← All articles</Link></p>
        </div>
      </article>
      <section className="section section--charcoal" aria-labelledby="related-title">
        <div className="container">
          <h2 id="related-title" className="h-display">Related reading</h2>
          <div className="grid grid--cards">{related.map((r) => <ArticleCard key={r.slug} article={r} />)}</div>
        </div>
      </section>
    </>
  );
}
