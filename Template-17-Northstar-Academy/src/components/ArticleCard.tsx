import { Link } from 'react-router-dom';
import type { Article } from '../config/types';
import { shortDate } from '../lib/format';
import { CourseCover } from './CourseCover';
import type { Category } from '../config/types';

const motifFor: Record<string, Category['motif']> = {
  'Learning Skills': 'skills',
  Careers: 'business',
  'AI & Technology': 'ai',
  Languages: 'language',
  'Workplace Skills': 'data',
};

export function ArticleCard({ article, headingLevel = 3 }: { article: Article; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <article className="article-card">
      <Link to={`/journal/${article.slug}`} className="article-card__media" tabIndex={-1} aria-hidden="true">
        <CourseCover motif={motifFor[article.category] ?? 'skills'} palette={article.palette} seed={article.slug} />
      </Link>
      <p className="article-card__meta">
        <span>{article.category}</span> · {article.readMinutes} min read
      </p>
      <H className="article-card__title">
        <Link to={`/journal/${article.slug}`}>{article.title}</Link>
      </H>
      <p className="article-card__excerpt">{article.excerpt}</p>
      <p className="article-card__by">
        {article.author} · <time dateTime={article.date}>{shortDate(article.date)}</time>
      </p>
    </article>
  );
}
