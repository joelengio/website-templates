import { Link, useParams } from 'react-router-dom';
import { booking } from '../config/booking';
import { DoctorCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';
import { Breadcrumbs, Img, LinkButton, SectionHeader } from '../components/ui';
import { doctorsOfSpecialty, servicesOfSpecialty, specialtyBySlug } from '../lib/catalog';
import { formatDuration, formatPrice } from '../lib/format';
import NotFound from './NotFound';

export default function SpecialtyDetail() {
  const { slug = '' } = useParams();
  const s = specialtyBySlug(slug);
  if (!s) return <NotFound what="specialty" />;
  const docs = doctorsOfSpecialty(s.id);
  const svcs = servicesOfSpecialty(s.id);
  return (
    <>
      <Seo title={`${s.name} — specialty`} description={`${s.summary} Demonstration services and fictional doctors for ${s.name} at CLARITY HEALTH.`} image={`/images/${s.image}.webp`} />
      <div className="container"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Specialties', to: '/specialties' }, { label: s.name }]} /></div>
      <header className="detail-hero">
        <div className="container detail-grid">
          <div>
            <p className="eyebrow">{s.category}</p>
            <h1><Icon name={s.icon} size={34} /> {s.name}</h1>
            <p className="lead">{s.summary}</p>
            {s.description.map((p) => <p key={p}>{p}</p>)}
            <div className="btn-row">
              <LinkButton to={`/book?specialty=${s.id}`} size="lg" icon="calendar">Book {s.name} (demo)</LinkButton>
              <LinkButton to="/specialties" variant="secondary" size="lg" icon="arrow-left">All specialties</LinkButton>
            </div>
          </div>
          <Img name={s.image} eager className="rounded-img" sizes="(min-width: 900px) 40vw, 90vw" />
        </div>
      </header>

      <section className="section-tight" aria-labelledby="topics-title">
        <div className="container">
          <h2 id="topics-title" className="h3">General topics this team covers</h2>
          <p className="muted">Educational summary for the demonstration — not a list of conditions treated.</p>
          <ul className="tag-list">{s.commonTopics.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>

      <section className="section tint" aria-labelledby="svc-title">
        <div className="container">
          <SectionHeader title="Demonstration services" id="svc-title" lead="Available to book in the demo for this specialty." />
          {svcs.length ? (
            <ul className="row-list">
              {svcs.map((x) => (
                <li key={x.id}>
                  <div>
                    <h3><Link to={`/services/${x.slug}`}>{x.name}</Link></h3>
                    <p>{x.summary}</p>
                  </div>
                  <div className="row-meta">
                    <span><Icon name="clock" size={16} /> {formatDuration(x.durationMinutes)}</span>
                    {booking.pricing.show && <span className="price">{formatPrice(x.price)}</span>}
                    <LinkButton to={`/book?specialty=${s.id}&service=${x.id}`} size="sm" variant="secondary" icon="calendar">Book</LinkButton>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p>No services configured for this specialty yet.</p>}
        </div>
      </section>

      <section className="section" aria-labelledby="doc-title">
        <div className="container">
          <SectionHeader title={`${s.name} doctors`} id="doc-title" lead="Fictional demonstration profiles." />
          {docs.length ? <div className="grid grid-4">{docs.map((d) => <DoctorCard key={d.id} d={d} />)}</div> : <p>No doctors configured for this specialty yet.</p>}
        </div>
      </section>
    </>
  );
}
