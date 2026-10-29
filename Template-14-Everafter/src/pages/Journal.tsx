import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArticleCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { CtaBand, EmptyState, PageHero } from '../components/ui';
import { articles, journalCategories } from '../config';

export default function Journal() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? '';
  const q = params.get('q') ?? '';
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (v) n.set(k, v);
    else n.delete(k);
    setParams(n, { replace: true });
  };
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return articles
      .filter((a) => !category || a.category === category)
      .filter((a) => !term || [a.title, a.excerpt, a.category, a.tags.join(' '), a.sections.map((s) => `${s.heading ?? ''} ${s.paragraphs.join(' ')}`).join(' ')].join(' ').toLowerCase().includes(term))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [q, category]);
  const showFeature = !q && !category;

  return (
    <>
      <Seo title="The Journal" description="Wedding planning advice, design inspiration, destination guides and real weddings from the EVERAFTER studio journal." />
      <PageHero eyebrow="The journal" title="Notes on planning and design" lead="Practical advice, seasonal inspiration and stories from our fictional weddings." />
      <section className="section section--tight" aria-label="Journal articles">
        <div className="container">
          <div className="journal-tools">
            <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="j-search" className="sr-only">Search the journal</label>
              <Icon name="search" size={18} />
              <input id="j-search" type="search" placeholder="Search articles" value={q} onChange={(e) => set('q', e.target.value)} autoComplete="off" />
              {q && <button type="button" className="search__clear" onClick={() => set('q', '')} aria-label="Clear search"><Icon name="close" size={16} /></button>}
            </form>
            <div className="pillbar" role="group" aria-label="Article category">
              <button type="button" aria-pressed={!category} onClick={() => set('category', '')}>All</button>
              {journalCategories.map((c) => (<button type="button" key={c} aria-pressed={category === c} onClick={() => set('category', c)}>{c}</button>))}
            </div>
          </div>
          <p className="filters__count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'article' : 'articles'}{q && ` matching “${q}”`}{category && ` in ${category}`}</p>
          {results.length ? (
            <ul className="grid grid--journal grid--journal-all">
              {results.map((a, i) => (<Reveal as="li" key={a.slug} delay={(i % 3) * 70} className={showFeature && i === 0 ? 'is-feature' : ''}><ArticleCard a={a} level="h2" feature={showFeature && i === 0} /></Reveal>))}
            </ul>
          ) : (
            <EmptyState title="No articles found" text="Try a different word, or browse all categories." action={<button type="button" className="btn btn--primary" onClick={() => setParams({}, { replace: true })}><span>Show all articles</span></button>} />
          )}
        </div>
      </section>
      <CtaBand title="Read enough? Let’s talk." body="Book a consultation and bring your questions." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Contact the studio', to: '/contact' }} />
    </>
  );
}
