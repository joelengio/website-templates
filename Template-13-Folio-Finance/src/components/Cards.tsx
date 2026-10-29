import { Link } from 'react-router-dom';
import type { Article, Industry, Service, ServicePricing, TeamMember } from '../config/types';
import { formatCurrency, formatShortDate, readingMinutes } from '../lib/format';
import { Icon } from './Icon';
import { Img } from './Img';

export function describePricing(p: ServicePricing): string {
  if (p.model === 'quote' || p.from === undefined) return 'Quoted per engagement';
  const verb = p.model === 'hourly' ? 'From' : 'From';
  return `${verb} ${formatCurrency(p.from)} ${p.unit ?? ''}`.trim();
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card service-card">
      <span className="service-card__icon">
        <Icon name={service.icon} size={26} />
      </span>
      <h3 className="card__title">
        <Link to={`/services/${service.slug}`} className="card__link">
          {service.name}
        </Link>
      </h3>
      <p>{service.summary}</p>
      <p className="service-card__price">{describePricing(service.pricing)}</p>
      <span className="card__more" aria-hidden="true">
        Explore service <Icon name="arrow" size={15} />
      </span>
    </article>
  );
}

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <article className="card industry-card">
      <div className="industry-card__media">
        <Img image={industry.image} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
      </div>
      <div className="industry-card__body">
        <span className="industry-card__icon">
          <Icon name={industry.icon} size={20} />
        </span>
        <h3 className="card__title">
          <Link to={`/industries/${industry.slug}`} className="card__link">
            {industry.name}
          </Link>
        </h3>
        <p>{industry.summary}</p>
      </div>
    </article>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="card team-card">
      <div className="team-card__photo">
        <Img image={member.image} sizes="(max-width: 700px) 90vw, 320px" />
      </div>
      <div className="team-card__body">
        <h3 className="card__title">
          <Link to={`/team/${member.slug}`} className="card__link">
            {member.name}
          </Link>
        </h3>
        <p className="team-card__role">{member.role}</p>
        <p className="team-card__spec">{member.specialization}</p>
        <p className="tag-demo">Fictional person</p>
      </div>
    </article>
  );
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const minutes = readingMinutes(article.body.map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : '')).join(' '));
  return (
    <article className={`card article-card${featured ? ' article-card--featured' : ''}`}>
      <div className="article-card__media">
        <Img image={article.image} sizes={featured ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 700px) 100vw, 33vw'} />
      </div>
      <div className="article-card__body">
        <p className="article-card__meta">
          <span className="chip chip--static">{article.category}</span>
          <time dateTime={article.date}>{formatShortDate(article.date)}</time> · {minutes} min read
        </p>
        <h3 className="card__title">
          <Link to={`/insights/${article.slug}`} className="card__link">
            {article.title}
          </Link>
        </h3>
        <p>{article.excerpt}</p>
      </div>
    </article>
  );
}
