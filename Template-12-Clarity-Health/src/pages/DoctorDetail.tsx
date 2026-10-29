import { Link, useParams } from 'react-router-dom';
import { booking } from '../config/booking';
import { site } from '../config/site';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';
import { Breadcrumbs, Img, LinkButton, Notice, SectionHeader } from '../components/ui';
import { doctorBySlug, servicesForDoctor, sharedModes, specialtyById } from '../lib/catalog';
import { formatDuration, formatPrice } from '../lib/format';
import NotFound from './NotFound';

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DoctorDetail() {
  const { slug = '' } = useParams();
  const d = doctorBySlug(slug);
  if (!d) return <NotFound what="doctor" />;
  const spec = specialtyById(d.specialtyId);
  const svcs = servicesForDoctor(d);
  return (
    <>
      <Seo title={`${d.name} — ${spec?.name ?? 'Doctor'} (fictional profile)`} description={`${d.name}, ${d.title}: a fictional demonstration profile. ${d.summary}`} image={`/images/${d.image}.webp`} />
      <div className="container"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Doctors', to: '/doctors' }, { label: d.name }]} /></div>
      <header className="detail-hero">
        <div className="container detail-grid doctor-hero">
          <Img name={d.image} eager className="rounded-img portrait-img" sizes="(min-width: 900px) 30vw, 70vw" />
          <div>
            <p className="eyebrow">{spec?.name}</p>
            <h1>{d.name}</h1>
            <p className="lead">{d.title}</p>
            <Notice title="Fictional demonstration profile">{site.notices.doctor}</Notice>
            <dl className="facts">
              <div><dt>Languages</dt><dd>{d.languages.join(', ')}</dd></div>
              <div><dt>Experience</dt><dd>{d.yearsExperience} years (fictional)</dd></div>
              <div><dt>Clinic days</dt><dd>{d.workingDays.map((x) => DAY[x].slice(0, 3)).join(', ')}</dd></div>
              <div><dt>New patients</dt><dd>{d.acceptingNewPatients ? 'Accepting new patients' : 'Existing patients only'}</dd></div>
              <div><dt>Consultation types</dt><dd>{d.modes.map((m) => booking.modeLabels[m]).join(' · ')}</dd></div>
            </dl>
            <div className="btn-row">
              {d.acceptingNewPatients ? (
                <LinkButton to={`/book?specialty=${d.specialtyId}&doctor=${d.id}`} size="lg" icon="calendar">Book with {d.name} (demo)</LinkButton>
              ) : (
                <LinkButton to={`/book?specialty=${d.specialtyId}`} size="lg" icon="calendar">Book another {spec?.name} doctor (demo)</LinkButton>
              )}
              <LinkButton to="/doctors" variant="secondary" size="lg" icon="arrow-left">All doctors</LinkButton>
            </div>
          </div>
        </div>
      </header>

      <section className="section-tight">
        <div className="container two-col">
          <div>
            <h2 className="h3">Biography</h2>
            {d.bio.map((p) => <p key={p}>{p}</p>)}
            <h2 className="h3">Clinical interests (fictional)</h2>
            <ul className="tag-list">{d.interests.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div>
            <h2 className="h3">Demonstration qualifications</h2>
            <ul className="check-list">{d.qualifications.map((q) => <li key={q}><Icon name="book" size={18} /> {q}</li>)}</ul>
            <p className="muted small">All qualifications, institutions and memberships are invented for this demo.</p>
          </div>
        </div>
      </section>

      <section className="section tint" aria-labelledby="svc-title">
        <div className="container">
          <SectionHeader title="Services in the booking demo" id="svc-title" lead={`Services ${d.name} can deliver, with the consultation formats they share.`} />
          <ul className="row-list">
            {svcs.map((s) => (
              <li key={s.id}>
                <div>
                  <h3><Link to={`/services/${s.slug}`}>{s.name}</Link></h3>
                  <p>{sharedModes(d, s).map((m) => booking.modeLabels[m]).join(' · ')}</p>
                </div>
                <div className="row-meta">
                  <span><Icon name="clock" size={16} /> {formatDuration(s.durationMinutes)}</span>
                  {booking.pricing.show && <span className="price">{formatPrice(s.price)}</span>}
                  <LinkButton to={`/book?specialty=${d.specialtyId}&doctor=${d.id}&service=${s.id}`} size="sm" variant="secondary" icon="calendar">Book</LinkButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
