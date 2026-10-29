import { Link } from 'react-router-dom';
import { booking } from '../config/booking';
import { site } from '../config/site';
import type { Article, Doctor, Facility, Service, Specialty } from '../config/types';
import { doctorsOfSpecialty, servicesOfSpecialty, specialtyById } from '../lib/catalog';
import { formatDate, formatDuration, formatPrice } from '../lib/format';
import { Icon } from './Icon';
import { Img } from './ui';

export function SpecialtyCard({ s }: { s: Specialty }) {
  const nDoc = doctorsOfSpecialty(s.id).length;
  const nSvc = servicesOfSpecialty(s.id).length;
  return (
    <article className="card specialty-card">
      <Link to={`/specialties/${s.slug}`} className="card-media" tabIndex={-1} aria-hidden="true">
        <Img name={s.image} sizes="(min-width: 1000px) 25vw, (min-width: 600px) 45vw, 90vw" />
      </Link>
      <div className="card-body">
        <span className="chip-icon"><Icon name={s.icon} size={22} /></span>
        <p className="card-kicker">{s.category}</p>
        <h3><Link to={`/specialties/${s.slug}`} className="stretched">{s.name}</Link></h3>
        <p>{s.summary}</p>
        <p className="card-meta">{nDoc} {nDoc === 1 ? 'doctor' : 'doctors'} · {nSvc} {nSvc === 1 ? 'service' : 'services'}</p>
      </div>
    </article>
  );
}

export function DoctorCard({ d }: { d: Doctor }) {
  const spec = specialtyById(d.specialtyId);
  return (
    <article className="card doctor-card">
      <Link to={`/doctors/${d.slug}`} className="card-media portrait" tabIndex={-1} aria-hidden="true">
        <Img name={d.image} sizes="(min-width: 1000px) 25vw, (min-width: 600px) 45vw, 90vw" />
        <span className="badge badge-demo">Fictional profile</span>
      </Link>
      <div className="card-body">
        <p className="card-kicker">{spec?.name}</p>
        <h3><Link to={`/doctors/${d.slug}`} className="stretched">{d.name}</Link></h3>
        <p className="card-sub">{d.title}</p>
        <ul className="meta-list">
          <li><Icon name="globe" size={16} /> {d.languages.join(', ')}</li>
          <li><Icon name="clock" size={16} /> {d.yearsExperience} years (fictional)</li>
          <li className={d.acceptingNewPatients ? 'ok' : 'warn'}>
            <Icon name={d.acceptingNewPatients ? 'check' : 'info'} size={16} /> {d.acceptingNewPatients ? 'Accepting new patients' : 'Existing patients only'}
          </li>
        </ul>
      </div>
    </article>
  );
}

export function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="card service-card">
      <div className="card-body">
        <p className="card-kicker">{s.specialtyIds.map((id) => specialtyById(id)?.name).filter(Boolean).join(' · ')}</p>
        <h3><Link to={`/services/${s.slug}`} className="stretched">{s.name}</Link></h3>
        <p>{s.summary}</p>
        <div className="service-foot">
          <span><Icon name="clock" size={16} /> {formatDuration(s.durationMinutes)}</span>
          {booking.pricing.show && <span className="price">{formatPrice(s.price)} <small>{booking.pricing.label.toLowerCase()}</small></span>}
        </div>
      </div>
    </article>
  );
}

export function ArticleCard({ a }: { a: Article }) {
  return (
    <article className="card article-card">
      <Link to={`/journal/${a.slug}`} className="card-media wide" tabIndex={-1} aria-hidden="true">
        <Img name={a.image} sizes="(min-width: 1000px) 30vw, (min-width: 600px) 45vw, 90vw" />
      </Link>
      <div className="card-body">
        <p className="card-kicker">{a.category} · {a.readMinutes} min read</p>
        <h3><Link to={`/journal/${a.slug}`} className="stretched">{a.title}</Link></h3>
        <p>{a.excerpt}</p>
        <p className="card-meta"><time dateTime={a.date}>{formatDate(a.date, { month: 'long', day: 'numeric', year: 'numeric' })}</time></p>
      </div>
    </article>
  );
}

export function FacilityCard({ f }: { f: Facility }) {
  return (
    <article className="card facility-card">
      <div className="card-media wide"><Img name={f.image} sizes="(min-width: 1000px) 30vw, (min-width: 600px) 45vw, 90vw" /></div>
      <div className="card-body">
        <h3>{f.name}</h3>
        <p>{f.description}</p>
        <p className="card-meta">{site.brand.shortName} · illustrative image</p>
      </div>
    </article>
  );
}
