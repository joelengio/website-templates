import { Link, useParams } from 'react-router-dom';
import { booking } from '../config/booking';
import { serviceCategories } from '../config/services';
import { site } from '../config/site';
import { DoctorCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';
import { Breadcrumbs, Img, LinkButton, Notice, SectionHeader } from '../components/ui';
import { doctorsForService, serviceBySlug, specialtyById } from '../lib/catalog';
import { formatDuration, formatPrice } from '../lib/format';
import NotFound from './NotFound';

export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const s = serviceBySlug(slug);
  if (!s) return <NotFound what="service" />;
  const cat = serviceCategories.find((c) => c.id === s.category);
  const docs = doctorsForService(s);
  const firstSpec = s.specialtyIds[0];
  return (
    <>
      <Seo title={`${s.name} — service`} description={`${s.summary} Duration ${formatDuration(s.durationMinutes)}. Demonstration service at CLARITY HEALTH.`} />
      <div className="container"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: s.name }]} /></div>
      <header className="detail-hero">
        <div className="container detail-grid">
          <div>
            <p className="eyebrow">{cat?.label}</p>
            <h1>{s.name}</h1>
            <p className="lead">{s.summary}</p>
            <dl className="facts">
              <div><dt>Duration</dt><dd>{formatDuration(s.durationMinutes)}</dd></div>
              {booking.pricing.show && <div><dt>{booking.pricing.label}</dt><dd>{formatPrice(s.price)}</dd></div>}
              <div><dt>Format</dt><dd>{s.modes.map((m) => booking.modeLabels[m]).join(' · ')}</dd></div>
              <div><dt>Specialties</dt><dd>{s.specialtyIds.map((id) => specialtyById(id)?.name).join(', ')}</dd></div>
            </dl>
            <div className="btn-row">
              <LinkButton to={`/book?specialty=${firstSpec}&service=${s.id}`} size="lg" icon="calendar">Book this service (demo)</LinkButton>
              <LinkButton to="/services" variant="secondary" size="lg" icon="arrow-left">All services</LinkButton>
            </div>
          </div>
          <Img name={cat?.image ?? 'svc-consultation'} eager className="rounded-img" sizes="(min-width: 900px) 40vw, 90vw" />
        </div>
      </header>
      <section className="section-tight">
        <div className="container two-col">
          <div>
            <h2 className="h3">About this service</h2>
            {s.description.map((p) => <p key={p}>{p}</p>)}
            <Notice title="Demonstration service">{site.notices.medical}</Notice>
          </div>
          <div>
            <h2 className="h3">What to expect</h2>
            <ul className="check-list">{s.whatToExpect.map((w) => <li key={w}><Icon name="check" size={18} /> {w}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="section tint" aria-labelledby="doc-title">
        <div className="container">
          <SectionHeader title="Doctors who can deliver this service" id="doc-title" lead="Fictional demonstration profiles." />
          <div className="grid grid-4">{docs.map((d) => <DoctorCard key={d.id} d={d} />)}</div>
          <p className="muted small">Not sure which service you need? <Link to="/contact">Contact the clinic</Link> (demo) or read the <Link to="/patient-information#faqs">FAQs</Link>.</p>
        </div>
      </section>
    </>
  );
}
