import { Link } from 'react-router-dom';
import { LinkButton } from '../components/Button';
import Img from '../components/Img';
import Section, { PageHero } from '../components/Section';
import { venues } from '../config/dining';
import { seoRoutes } from '../config/seo';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';

export default function Dining() {
  useSeo({ ...seoRoutes['/dining'], path: '/dining' });
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <PageHero kicker="Dining" title="Restaurants & bars" text="Cooked over olive wood, picked from the kitchen garden and landed at the cove." image={{ src: '/images/dining-terrace.webp', alt: '' }} />
      <Section tone="cream">
        <div className="stack">
          {venues.map((v, i) => (
            <article key={v.slug} className={`venue reveal${i % 2 ? ' venue--flip' : ''}`}>
              <Link to={`/dining/${v.slug}`} className="venue__media" tabIndex={-1} aria-hidden="true"><Img src={v.images[0].src} alt="" ratio={[3, 2]} /></Link>
              <div className="venue__body">
                <p className="kicker">{v.kind}</p>
                <h2 className="display display--sm"><Link to={`/dining/${v.slug}`}>{v.name}</Link></h2>
                <p className="lead">{v.tagline}</p>
                <p>{v.description}</p>
                <ul className="hours">{v.hours.map((h) => <li key={h.label}><span>{h.label}</span> {h.time}</li>)}</ul>
                <div className="form__actions"><LinkButton to={`/dining/${v.slug}`} arrow>Menu & details</LinkButton></div>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
