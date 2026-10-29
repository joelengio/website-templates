import { Link, useParams } from 'react-router-dom';
import { ArticleCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { Seo } from '../components/Seo';
import { Breadcrumb, CtaBand } from '../components/ui';
import { articles, getArticle, relatedArticles } from '../config';
import { formatDate } from '../lib/format';
import NotFound from './NotFound';

export default function JournalArticle() {
  const { slug } = useParams();
  const a = getArticle(slug);
  if (!a) return <NotFound />;
  const related = relatedArticles(a, 3);
  const idx = articles.findIndex((x) => x.slug === a.slug);
  const prev = articles[idx + 1];
  const next = articles[idx - 1];

  return (
    <>
      <Seo title={a.title} description={a.excerpt} image={a.image.src} type="article" />
      <article>
        <header className="article-head">
          <div className="container container--narrow">
            <Breadcrumb items={[{ label: 'Journal', to: '/journal' }, { label: a.category, to: `/journal?category=${encodeURIComponent(a.category)}` }]} />
            <p className="eyebrow">{a.category}</p>
            <h1 className="h-display">{a.title}</h1>
            <p className="lead">{a.excerpt}</p>
            <p className="article-head__meta">By {a.author} · <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readMinutes} min read</p>
          </div>
        </header>
        <div className="container article-hero"><Photo image={a.image} priority sizes="(min-width: 1100px) 1100px, 100vw" /></div>
        <div className="container container--narrow article-body">
          {a.sections.map((s, i) => (
            <section key={s.heading ?? i}>
              {s.heading && <h2>{s.heading}</h2>}
              {s.paragraphs.map((p) => (<p key={p}>{p}</p>))}
            </section>
          ))}
          <ul className="tag-list" aria-label="Tags">{a.tags.map((t) => (<li key={t}><Link to={`/journal?q=${encodeURIComponent(t)}`}>#{t}</Link></li>))}</ul>
          <nav className="article-pager" aria-label="More articles">
            {prev ? <Link to={`/journal/${prev.slug}`} rel="prev"><Icon name="arrowLeft" size={18} /><span><small>Older</small>{prev.title}</span></Link> : <span />}
            {next ? <Link to={`/journal/${next.slug}`} rel="next"><span><small>Newer</small>{next.title}</span><Icon name="arrow" size={18} /></Link> : <span />}
          </nav>
        </div>
      </article>
      <section className="section section--cream" aria-labelledby="rel-title">
        <div className="container">
          <div className="section-head"><div><p className="eyebrow">Keep reading</p><h2 className="h-display" id="rel-title">Related articles</h2></div></div>
          <ul className="grid grid--journal">{related.map((r) => (<li key={r.slug}><ArticleCard a={r} /></li>))}</ul>
        </div>
      </section>
      <CtaBand title="Ready to begin?" body="A short enquiry is the easiest way to start a conversation." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Contact the studio', to: '/contact' }} />
    </>
  );
}
