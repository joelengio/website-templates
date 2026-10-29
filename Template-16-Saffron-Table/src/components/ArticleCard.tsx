import { Link } from 'react-router-dom';
import type { Article } from '../config/types';
import { formatArticleDate } from '../lib/dates';
import { Img } from './Img';

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`article-card${featured ? ' article-card--featured' : ''}`}>
      <Link to={`/journal/${article.slug}`} className="article-card__img" tabIndex={-1} aria-hidden="true">
        <Img name={article.image} sizes={featured ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 33vw, 100vw'} />
      </Link>
      <div className="article-card__body">
        <p className="article-card__meta">
          <span>{article.category}</span> · <time dateTime={article.date}>{formatArticleDate(article.date)}</time> · {article.readMinutes} min read
        </p>
        <h3 className="article-card__title">
          <Link to={`/journal/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
      </div>
    </article>
  );
}
