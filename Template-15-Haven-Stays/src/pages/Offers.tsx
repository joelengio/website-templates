import { OfferCard } from '../components/Cards';
import Section, { PageHero } from '../components/Section';
import { offers } from '../config/offers';
import { seoRoutes } from '../config/seo';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { offerSample } from '../lib/offers';

export default function Offers() {
  useSeo({ ...seoRoutes['/offers'], path: '/offers' });
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <PageHero kicker="Offers & packages" title="Reasons to stay a little longer" text="Eligibility, discounts and example prices are calculated live by the same pricing engine as the booking demo." image={{ src: '/images/offer-couples.webp', alt: '' }} />
      <Section tone="cream">
        <div className="grid grid--3">{offers.map((o) => <OfferCard key={o.slug} o={o} sample={offerSample(o)} />)}</div>
      </Section>
    </div>
  );
}
