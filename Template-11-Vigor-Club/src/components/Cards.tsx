import { Link } from 'react-router-dom';
import type { Article, Facility, Program, Trainer } from '../config/types';
import { formatArticleDate } from '../lib/format';
import { Icon } from './Icon';
import { Img, Intensity } from './ui';
import { trainers } from '../config/trainers';

export function ProgramCard({ program, index }: { program: Program; index?: number }) {
  return (
    <article className="program-card">
      <div className="program-card-link">
        <div className="program-card-media">
          <Img image={program.image} sizes="(min-width: 900px) 33vw, 100vw" />
          {index !== undefined && <span className="card-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
          <span className="chip chip--float">{program.category}</span>
        </div>
        <div className="program-card-body">
          <h3 className="h-card"><Link to={`/programs/${program.slug}`} className="card-link">{program.name}</Link></h3>
          <p>{program.summary}</p>
          <dl className="meta-row">
            <div><dt>Duration</dt><dd>{program.duration} min</dd></div>
            <div><dt>Level</dt><dd>{program.level}</dd></div>
            <div><dt>Intensity</dt><dd><Intensity level={program.intensity} /></dd></div>
          </dl>
          <span className="card-more" aria-hidden="true">View program <Icon name="arrow" size={16} /></span>
        </div>
      </div>
    </article>
  );
}

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <article className="trainer-card">
      <div className="trainer-media">
        <Img image={trainer.image} sizes="(min-width: 900px) 25vw, 50vw" />
      </div>
      <div className="trainer-body">
        <h3 className="h-card"><Link to={`/trainers/${trainer.slug}`} className="card-link">{trainer.name}</Link></h3>
        <p className="trainer-role">{trainer.role}</p>
        <p className="trainer-years">{trainer.yearsExperience} yrs experience</p>
      </div>
    </article>
  );
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`article-card ${featured ? 'is-featured' : ''}`}>
      <div className="article-link">
        <div className="article-media"><Img image={article.image} sizes="(min-width: 900px) 33vw, 100vw" /></div>
        <div className="article-body">
          <p className="article-meta"><span className="chip">{article.category}</span> <span><time dateTime={article.date}>{formatArticleDate(article.date)}</time> · {article.readMinutes} min read</span></p>
          <h3 className="h-card"><Link to={`/journal/${article.slug}`} className="card-link">{article.title}</Link></h3>
          <p>{article.excerpt}</p>
          <span className="card-more" aria-hidden="true">Read article <Icon name="arrow" size={16} /></span>
        </div>
      </div>
    </article>
  );
}

export function FacilityCard({ facility, index }: { facility: Facility; index: number }) {
  return (
    <article className={`facility-card facility-card--${index % 3}`}>
      <Img image={facility.image} sizes="(min-width: 900px) 40vw, 100vw" />
      <div className="facility-card-body">
        <p className="eyebrow">{facility.area}</p>
        <h3 className="h-card">{facility.name}</h3>
        <p>{facility.summary}</p>
      </div>
    </article>
  );
}

export const trainerNames = (slugs: string[]) => slugs.map((s) => trainers.find((t) => t.slug === s)?.name).filter(Boolean) as string[];
