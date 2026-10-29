import { Link, useParams } from 'react-router-dom';
import { getTreatment, treatmentCategories, treatments } from '../config/treatments';
import { ctas } from '../config/navigation';
import { formatDuration, formatPrice } from '../lib/format';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { TreatmentCard } from '../components/Cards';
import { Img, LinkButton, TextLink } from '../components/ui';
import NotFound from './NotFound';

export default function TreatmentDetail() {
  const { slug = '' } = useParams();
  const t = getTreatment(slug);
  if (!t) return <NotFound what="treatment" />;
  const cat = treatmentCategories.find((c) => c.id === t.category);
  const related = treatments.filter((x) => x.category === t.category && x.slug !== t.slug).slice(0, 3);
  return (
    <>
      <Seo title={t.name} description={t.summary} image={t.image.src} />
      <section className="section section--tight">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/treatments">Treatments</Link> <span aria-hidden="true">/</span> <Link to={`/treatments?category=${t.category}`}>{cat?.name}</Link> <span aria-hidden="true">/</span> <span aria-current="page">{t.name}</span>
          </nav>
          <div className="detail-grid">
            <div className="detail-media"><Img image={t.image} eager sizes="(min-width: 900px) 50vw, 100vw" /></div>
            <div>
              <p className="eyebrow">{cat?.name}</p>
              <h1 className="h-display">{t.name}</h1>
              <p className="lead">{t.summary}</p>
              <table className="price-table">
                <caption className="sr-only">Durations and prices for {t.name}</caption>
                <thead><tr><th scope="col">Duration</th><th scope="col">Price per guest</th><th scope="col"><span className="sr-only">Book</span></th></tr></thead>
                <tbody>
                  {t.options.map((o) => (
                    <tr key={o.minutes}>
                      <td><Icon name="clock" size={16} /> {formatDuration(o.minutes)}</td>
                      <td>{formatPrice(o.price)}</td>
                      <td><Link className="text-link" to={`/booking?treatment=${t.slug}&option=${o.minutes}`}>Book<span className="sr-only"> {formatDuration(o.minutes)}</span></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <LinkButton to={`/booking?treatment=${t.slug}`}>{ctas.bookTreatment}</LinkButton>
              <p className="fine">Booking is a demonstration — no payment is taken and nothing is sent to a business.</p>
            </div>
          </div>
          <div className="detail-body">
            <div>{t.description.map((p) => <p key={p} className="body-lg">{p}</p>)}
              <h2 className="h-sub">Suitable for</h2><p>{t.suitableFor}</p>
              {t.notes && <p>{t.notes}</p>}
            </div>
            <div className="detail-lists">
              <h2 className="h-sub">Benefits</h2>
              <ul className="ticks">{t.benefits.map((b) => <li key={b}><Icon name="check" size={18} />{b}</li>)}</ul>
              <h2 className="h-sub">Included</h2>
              <ul className="ticks">{t.includes.map((b) => <li key={b}><Icon name="check" size={18} />{b}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section section--cream">
          <div className="container">
            <div className="section-head-row"><h2 className="h-display">You may also like</h2><TextLink to="/treatments">All treatments</TextLink></div>
            <div className="grid grid-3">{related.map((r) => <TreatmentCard key={r.slug} t={r} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
