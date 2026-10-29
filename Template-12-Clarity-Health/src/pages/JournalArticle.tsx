import { Link, useParams } from 'react-router-dom';
import { site } from '../config/site';
import { ArticleCard } from '../components/Cards';
import { Seo } from '../components/Seo';
import { Breadcrumbs, Img, LinkButton, Notice, SectionHeader } from '../components/ui';
import { articleBySlug, relatedArticles, specialtyById } from '../lib/catalog';
import { formatDate } from '../lib/format';
import NotFound from './NotFound';

export default function JournalArticle() {
  const { slug = '' } = useParams();
  const a = articleBySlug(slug);
  if (!a) return <NotFound what="article" />;
  const related = relatedArticles(a);
  const spec = a.relatedSpecialty ? specialtyById(a.relatedSpecialty) : undefined;
  return (
    <>
      <Seo title={a.title} description={a.excerpt} image={`/images/${a.image}.webp`} type="article" />
      <div className="container"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Journal', to: '/journal' }, { label: a.title }]} /></div>
      <article className="article">
        <header className="container narrow article-head">
          <p className="eyebrow">{a.category}</p>
          <h1>{a.title}</h1>
          <p className="lead">{a.excerpt}</p>
          <p className="muted small"><time dateTime={a.date}>{formatDate(a.date, { month: 'long', day: 'numeric', year: 'numeric' })}</time> · {a.readMinutes} min read · Written for the {site.brand.shortName} demonstration</p>
        </header>
        <div className="container narrow"><Img name={a.image} eager className="rounded-img article-hero" sizes="(min-width: 800px) 760px, 92vw" /></div>
        <div className="container narrow prose">
          <Notice title="Medical information disclaimer">{site.notices.articles} {site.notices.medical}</Notice>
          {a.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
              {s.list && <ul>{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
            </section>
          ))}
          <Notice tone="emergency" title="In an emergency">{site.notices.emergency}</Notice>
          {spec && (
            <p className="article-cta">Interested in this topic? Explore <Link to={`/specialties/${spec.slug}`}>{spec.name}</Link> in the demo, or <Link to={`/book?specialty=${spec.id}`}>try the booking demo</Link>.</p>
          )}
        </div>
      </article>
      <section className="section tint" aria-labelledby="rel-title">
        <div className="container">
          <SectionHeader title="Related articles" id="rel-title" />
          <div className="grid grid-3">{related.map((r) => <ArticleCard key={r.id} a={r} />)}</div>
          <div className="section-cta"><LinkButton to="/journal" variant="secondary" icon="arrow-left">Back to the journal</LinkButton></div>
        </div>
      </section>
    </>
  );
}
