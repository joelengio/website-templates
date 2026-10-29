import { useParams } from 'react-router-dom';
import { LinkButton } from '../components/Button';
import { ExperienceCard } from '../components/Cards';
import Icon from '../components/Icon';
import Img from '../components/Img';
import Section, { Breadcrumb } from '../components/Section';
import { experiences } from '../config/experiences';
import { useSeo } from '../hooks/useSeo';
import NotFound from './NotFound';

export default function ExperienceDetail() {
  const { slug } = useParams();
  const e = experiences.find((x) => x.slug === slug);
  useSeo({ title: e?.title ?? 'Not found', description: e?.summary ?? '', path: `/experiences/${slug}`, image: e?.image.src, noindex: !e });
  if (!e) return <NotFound />;
  const more = experiences.filter((x) => x.slug !== e.slug && x.category === e.category).concat(experiences.filter((x) => x.category !== e.category)).slice(0, 3);
  return (
    <Section tone="cream">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Experiences', to: '/experiences' }, { label: e.title }]} />
      <div className="detail-head">
        <div>
          <p className="kicker">{e.category}{e.level ? ` · ${e.level}` : ''}</p>
          <h1 className="display">{e.title}</h1>
          <p className="lead">{e.summary}</p>
          <p>{e.description}</p>
          <dl className="spec">
            <div><dt>Duration</dt><dd>{e.duration}</dd></div>
            <div><dt>Price</dt><dd>{e.price}</dd></div>
            <div><dt>Schedule</dt><dd>{e.schedule}</dd></div>
          </dl>
          <h2 className="h3">Included</h2>
          <ul className="highlights">{e.includes.map((i) => <li key={i}><Icon name="check" size={18} /> {i}</li>)}</ul>
          <div className="form__actions">
            <LinkButton to={`/contact?topic=Experiences&venue=${encodeURIComponent(e.title)}#enquiry`} arrow>Enquire about this experience</LinkButton>
            <LinkButton to="/booking" variant="secondary">Reserve a stay</LinkButton>
          </div>
          <p className="note">Experiences are requested through our concierge; this template does not take payments.</p>
        </div>
        <div className="photo-stack">
          <Img src={e.image.src} alt={e.image.alt} priority ratio={[4, 3]} />
          {e.gallery.map((g) => <Img key={g.src} src={g.src} alt={g.alt} ratio={[16, 9]} />)}
        </div>
      </div>
      <h2 className="display display--sm">More to discover</h2>
      <div className="grid grid--3">{more.map((x) => <ExperienceCard key={x.slug} e={x} />)}</div>
    </Section>
  );
}
