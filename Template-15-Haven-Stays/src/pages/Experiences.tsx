import { useSearchParams } from 'react-router-dom';
import { ExperienceCard } from '../components/Cards';
import Section, { PageHero } from '../components/Section';
import { experienceCategories, experiences } from '../config/experiences';
import { seoRoutes } from '../config/seo';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { plural } from '../lib/format';

export default function Experiences() {
  useSeo({ ...seoRoutes['/experiences'], path: '/experiences' });
  const [sp, setSp] = useSearchParams();
  const cat = sp.get('category') ?? 'All';
  const list = cat === 'All' ? experiences : experiences.filter((e) => e.category === cat);
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <PageHero kicker="Experiences" title="Days shaped by the place" text="Wellness, the outdoors, culinary classes, excursions and private experiences — arranged by our concierge." image={{ src: '/images/exp-sunset.webp', alt: '' }} />
      <Section tone="cream">
        <div className="chips chips--lg" role="group" aria-label="Filter experiences by category">
          {['All', ...experienceCategories].map((c) => (
            <button key={c} type="button" className={`chip${cat === c ? ' is-on' : ''}`} aria-pressed={cat === c} onClick={() => setSp(c === 'All' ? {} : { category: c }, { replace: true })}>{c}</button>
          ))}
        </div>
        <p role="status" className="results-line">{plural(list.length, 'experience')}{cat !== 'All' ? ` in ${cat}` : ''}</p>
        {list.length ? <div className="grid grid--3">{list.map((e) => <ExperienceCard key={e.slug} e={e} />)}</div> : <div className="empty"><h3>No experiences in this category</h3></div>}
      </Section>
    </div>
  );
}
