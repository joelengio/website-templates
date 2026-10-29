import { useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import Img from '../components/Img';
import OfferChecker from '../components/OfferChecker';
import Section, { Breadcrumb } from '../components/Section';
import { promotions } from '../config/booking';
import { offers } from '../config/offers';
import { useSeo } from '../hooks/useSeo';
import NotFound from './NotFound';

export default function OfferDetail() {
  const { slug } = useParams();
  const o = offers.find((x) => x.slug === slug);
  useSeo({ title: o?.title ?? 'Not found', description: o?.summary ?? '', path: `/offers/${slug}`, image: o?.image.src, noindex: !o });
  if (!o) return <NotFound />;
  const promo = promotions.find((p) => p.id === o.promoId);
  return (
    <Section tone="cream">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Offers', to: '/offers' }, { label: o.title }]} />
      <div className="detail-head">
        <div>
          <p className="kicker">{o.kicker}</p>
          <h1 className="display">{o.title}</h1>
          <p className="lead">{o.summary}</p>
          <p>{o.description}</p>
          {promo?.code && <p className="code-line">Offer code: <strong className="code">{promo.code}</strong></p>}
          <h2 className="h3">What’s included</h2>
          <ul className="highlights">{o.inclusions.map((i) => <li key={i}><Icon name="check" size={18} /> {i}</li>)}</ul>
          <h2 className="h3">Conditions</h2>
          <ul className="plain">{o.conditions.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
        <Img src={o.image.src} alt={o.image.alt} priority ratio={[4, 3]} className="detail-head__img" />
      </div>
      <OfferChecker offer={o} />
    </Section>
  );
}
