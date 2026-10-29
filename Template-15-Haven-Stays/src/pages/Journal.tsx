import { useMemo, useState } from 'react';
import { ArticleCard } from '../components/Cards';
import Section, { PageHero } from '../components/Section';
import { articles } from '../config/content';
import { seoRoutes } from '../config/seo';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { plural } from '../lib/format';

export default function Journal() {
  useSeo({ ...seoRoutes['/journal'], path: '/journal' });
  const cats = useMemo(() => ['All', ...Array.from(new Set(articles.map((a) => a.category)))], []);
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? articles : articles.filter((a) => a.category === cat);
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <PageHero kicker="Journal" title="Stories from Haven" text="Notes on dining, wellness, design and the coast." />
      <Section tone="cream">
        <div className="chips chips--lg" role="group" aria-label="Filter articles by category">
          {cats.map((c) => <button key={c} type="button" className={`chip${cat === c ? ' is-on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <p role="status" className="results-line">{plural(list.length, 'article')}</p>
        <div className="grid grid--3">{list.map((a) => <ArticleCard key={a.slug} a={a} />)}</div>
      </Section>
    </div>
  );
}
