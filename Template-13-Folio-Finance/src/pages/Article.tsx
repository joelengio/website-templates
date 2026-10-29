import { Link, useParams } from 'react-router-dom';
import { articles } from '../config/articles';
import { insightsPage } from '../config/content';
import { ArticleCard } from '../components/Cards';
import { ConsultCTA } from '../components/ConsultCTA';
import { Img } from '../components/Img';
import { Breadcrumb, Section } from '../components/Section';
import { Notice } from '../components/DemoNotice';
import { useSeo } from '../hooks/useSeo';
import { formatLongDate, readingMinutes } from '../lib/format';
import { relatedArticles } from '../lib/search';
import { images } from '../config/images';
import NotFound from './NotFound';

export default function Article() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  useSeo({ title: article?.title, description: article?.excerpt, path: `/insights/${slug}`, image: article ? images[article.image]?.src : undefined });
  if (!article) return <NotFound />;
  const related = relatedArticles(articles, article, 3);
  const minutes = readingMinutes(article.body.map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : '')).join(' '));
  return (
    <>
      <article>
        <header className="article-hero">
          <div className="container article-hero__inner">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights' }, { label: article.title }]} />
            <p className="article-hero__meta"><Link to={`/insights?category=${encodeURIComponent(article.category)}`} className="chip chip--static">{article.category}</Link></p>
            <h1>{article.title}</h1>
            <p className="article-hero__excerpt">{article.excerpt}</p>
            <p className="article-hero__by">By {article.author} (fictional author) · <time dateTime={article.date}>{formatLongDate(article.date)}</time> (illustrative date) · {minutes} min read</p>
          </div>
          <div className="container article-hero__image"><Img image={article.image} priority sizes="(max-width: 1100px) 100vw, 1000px" /></div>
        </header>
        <div className="container article-body">
          <div className="prose">
            {article.body.map((b, i) => {
              if (b.type === 'p') return <p key={i}>{b.text}</p>;
              if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
              if (b.type === 'ul') return <ul key={i}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
              return <aside key={i} className="callout"><strong>{b.title}</strong><p>{b.text}</p></aside>;
            })}
            <ul className="tag-list" aria-label="Topics">{article.tags.map((t) => <li key={t}><Link to={`/insights?q=${encodeURIComponent(t)}`}>#{t}</Link></li>)}</ul>
            <Notice title="Not advice">{insightsPage.disclaimer}</Notice>
          </div>
        </div>
      </article>
      <Section eyebrow="Keep reading" title="Related articles" tone="stone">
        <div className="grid grid--3">{related.map((a) => <ArticleCard key={a.slug} article={a} />)}</div>
        <p className="back-link"><Link to="/insights">← Back to all insights</Link></p>
      </Section>
      <ConsultCTA />
    </>
  );
}
