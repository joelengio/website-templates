import { ArticleCard, AttractionCard } from '../components/Cards';
import { LinkButton } from '../components/Button';
import Section, { PageHero, SectionHeader } from '../components/Section';
import { articles, attractions, destination, travelTips } from '../config/content';
import { seoRoutes } from '../config/seo';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';

export default function Explore() {
  useSeo({ ...seoRoutes['/explore'], path: '/explore' });
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <PageHero kicker={destination.kicker} title="Explore the coast" text={`${destination.text}`} image={{ src: '/images/dest-village.webp', alt: '' }} />
      <Section tone="cream">
        <SectionHeader kicker="Nearby" title="Places worth the walk, the drive or the boat" />
        <div className="grid grid--3">{attractions.map((a) => <AttractionCard key={a.slug} a={a} />)}</div>
      </Section>
      <Section tone="limestone">
        <SectionHeader kicker="Travel guide" title="Before you arrive" />
        <div className="grid grid--4">{travelTips.map((t) => <div key={t.title} className="plain-card reveal"><h3>{t.title}</h3><p>{t.text}</p></div>)}</div>
      </Section>
      <Section tone="cream">
        <SectionHeader kicker="Journal" title="Guides and stories" action={{ label: 'All articles', to: '/journal' }} />
        <div className="grid grid--3">{articles.slice(0, 3).map((a) => <ArticleCard key={a.slug} a={a} />)}</div>
        <p><LinkButton to="/contact" variant="secondary">Ask our concierge for a tailored itinerary</LinkButton></p>
      </Section>
    </div>
  );
}
