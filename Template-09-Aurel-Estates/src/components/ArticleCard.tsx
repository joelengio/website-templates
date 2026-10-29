import { Link } from 'react-router-dom';
import { articles } from '../config/content';
import { formatDate } from '../lib/format';

export function ArticleCard({ slug }: { slug: string }) {
  const a = articles.find((x) => x.slug === slug);
  if (!a) return null;
  return (
    <article className="article-card">
      <Link to={`/journal/${a.slug}`} className="article-card__media" tabIndex={-1} aria-hidden="true">
        <img src={a.image.thumb ?? a.image.src} alt="" width={640} height={440} loading="lazy" />
      </Link>
      <p className="article-card__meta">
        {a.category} · {a.readMinutes} min read
      </p>
      <h3>
        <Link to={`/journal/${a.slug}`}>{a.title}</Link>
      </h3>
      <p>{a.excerpt}</p>
      <p className="article-card__date">{formatDate(a.date)}</p>
    </article>
  );
}
