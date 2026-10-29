import { Link, useParams } from 'react-router-dom';
import { articles, getArticle, journalNotice } from '../config/journal';
import { formatLongDate } from '../lib/format';
import { Seo } from '../components/Seo';
import { ArticleCard } from '../components/Cards';
import { DemoNotice, Img, LinkButton } from '../components/ui';
import NotFound from './NotFound';

export default function JournalArticle() {
  const { slug = '' } = useParams();
  const a = getArticle(slug);
  if (!a) return <NotFound what="article" />;
  const related = articles.filter((x) => x.slug !== a.slug && x.category === a.category).concat(articles.filter((x) => x.slug !== a.slug && x.category !== a.category)).slice(0, 3);
  return (
    <>
      <Seo title={a.title} description={a.excerpt} image={a.image.src} type="article" />
      <article>
        <header className="page-hero article-head">
          <div className="container narrow">
            <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/journal">Journal</Link> <span aria-hidden="true">/</span> <Link to={`/journal?category=${a.category}`}>{a.category}</Link></nav>
            <p className="eyebrow">{a.category} · {a.readMinutes} min read</p>
            <h1 className="h-display">{a.title}</h1>
            <p className="lead">{a.excerpt}</p>
            <p className="card-date">By {a.author} · <time dateTime={a.date}>{formatLongDate(a.date)}</time></p>
          </div>
        </header>
        <div className="container article-cover"><Img image={a.image} eager sizes="(min-width: 1000px) 960px, 100vw" /></div>
        <div className="container narrow prose">
          <DemoNotice>{journalNotice}</DemoNotice>
          {a.body.map((b, i) => {
            if (b.type === 'h2') return <h2 key={i} className="h-sub">{b.text}</h2>;
            if (b.type === 'quote') return <blockquote key={i} className="pull">{b.text}</blockquote>;
            if (b.type === 'list') return <ul key={i} className="dots">{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
            return <p key={i}>{b.text}</p>;
          })}
          <div className="btn-row"><LinkButton to="/journal" variant="outline" arrow={false}>Back to the journal</LinkButton><LinkButton to="/booking">Book a visit</LinkButton></div>
        </div>
      </article>
      <section className="section section--cream">
        <div className="container"><h2 className="h-display">Keep reading</h2><div className="grid grid-3">{related.map((r) => <ArticleCard key={r.slug} a={r} />)}</div></div>
      </section>
    </>
  );
}
