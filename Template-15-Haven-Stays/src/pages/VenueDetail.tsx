import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LinkButton } from '../components/Button';
import Icon from '../components/Icon';
import Img from '../components/Img';
import Lightbox from '../components/Lightbox';
import Section, { Breadcrumb } from '../components/Section';
import { venues } from '../config/dining';
import { useSeo } from '../hooks/useSeo';
import { money } from '../lib/format';
import NotFound from './NotFound';

export default function VenueDetail() {
  const { slug } = useParams();
  const v = venues.find((x) => x.slug === slug);
  const [lb, setLb] = useState<number | null>(null);
  useSeo({ title: v?.name ?? 'Not found', description: v?.description ?? '', path: `/dining/${slug}`, image: v?.images[0].src, noindex: !v });
  if (!v) return <NotFound />;
  return (
    <Section tone="cream">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Dining', to: '/dining' }, { label: v.name }]} />
      <div className="detail-head">
        <div>
          <p className="kicker">{v.kind}</p>
          <h1 className="display">{v.name}</h1>
          <p className="lead">{v.tagline}</p>
          <p>{v.story}</p>
          <ul className="highlights">{v.highlights.map((h) => <li key={h}><Icon name="check" size={18} /> {h}</li>)}</ul>
          <h2 className="h3">Opening hours</h2>
          <ul className="hours">{v.hours.map((h) => <li key={h.label}><span>{h.label}</span> {h.time}</li>)}</ul>
          <p className="muted">Dress code: {v.dress}</p>
          <div className="form__actions">
            <LinkButton to={`/contact?topic=Dining&venue=${encodeURIComponent(v.name)}#enquiry`} arrow>Enquire or reserve a table</LinkButton>
          </div>
        </div>
        <div className="photo-grid">
          {v.images.map((im, i) => (
            <button key={im.src} type="button" className="photo-grid__item" onClick={() => setLb(i)} aria-label={`Open photo ${i + 1} of ${v.images.length}: ${im.alt}`}>
              <Img src={im.src} alt="" ratio={[3, 2]} />
            </button>
          ))}
        </div>
      </div>
      <h2 className="display display--sm">Sample menu</h2>
      <p className="muted">Illustrative menu and prices (V = vegetarian, VG = vegan). Menus change with the season.</p>
      <div className="menu">
        {v.menu.map((s) => (
          <section key={s.title} className="menu__section" aria-labelledby={`m-${s.title.replace(/\W/g, '')}`}>
            <h3 id={`m-${s.title.replace(/\W/g, '')}`}>{s.title}</h3>
            <ul>
              {s.items.map((it) => (
                <li key={it.name}>
                  <div><strong>{it.name}</strong>{it.tags?.map((t) => <span key={t} className="tag">{t}</span>)}<p>{it.description}</p></div>
                  <span className="menu__price">{money(it.price)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Lightbox images={v.images} index={lb} onIndex={setLb} label={`${v.name} photos`} />
    </Section>
  );
}
