import { Link, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Breadcrumb, DemoBadge, Img, LinkButton } from '../components/ui';
import { credentialNote, getTrainer, trainers } from '../config/trainers';
import { programs } from '../config/programs';
import { site } from '../config/site';
import { classes, dayNames } from '../config/classes';
import { formatTime } from '../lib/format';
import { TrainerCard } from '../components/Cards';
import NotFound from './NotFound';

export default function TrainerDetail() {
  const { slug = '' } = useParams();
  const t = getTrainer(slug);
  if (!t) return <NotFound what="trainer" />;
  const progs = programs.filter((p) => t.programSlugs.includes(p.slug));
  const sessions = classes.filter((c) => c.trainerSlug === t.slug).sort((a, b) => a.day - b.day || a.start.localeCompare(b.start));
  const others = trainers.filter((x) => x.slug !== t.slug).slice(0, 3);
  return (
    <>
      <Seo title={`${t.name} — ${t.role}`} description={`${t.name}, ${t.role} at ${site.brand.name} (fictional). ${t.tagline}`} image={t.image.src} />
      <section className="section trainer-hero">
        <div className="container trainer-detail">
          <div className="trainer-detail-media"><Img image={t.image} eager /></div>
          <div className="trainer-detail-copy">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Trainers', to: '/trainers' }, { label: t.name }]} />
            <p className="eyebrow">{t.role}</p>
            <h1 className="h-mega">{t.name}</h1>
            <p className="lead">{t.tagline}</p>
            {t.bio.map((p) => <p key={p}>{p}</p>)}
            <dl className="facts facts--row">
              <div><dt>Experience</dt><dd>{t.yearsExperience} years</dd></div>
              <div><dt>Programs</dt><dd>{progs.length}</dd></div>
              <div><dt>Weekly classes</dt><dd>{sessions.length}</dd></div>
            </dl>
            <LinkButton to={`/contact?topic=training&trainer=${t.slug}`}>Enquire about training with {t.name.split(' ')[0]}</LinkButton>
          </div>
        </div>
      </section>
      <section className="section section--charcoal">
        <div className="container detail-grid detail-grid--even">
          <div>
            <h2 className="h-sub">Specialties</h2>
            <ul className="chip-list">{t.specialties.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
            <h2 className="h-sub">Qualifications <DemoBadge>Fictional</DemoBadge></h2>
            <ul className="tick-list">{t.qualifications.map((q) => <li key={q}><Icon name="check" size={18} />{q}</li>)}</ul>
            <p className="note">{credentialNote}</p>
          </div>
          <div>
            <h2 className="h-sub">Programs</h2>
            <ul className="link-list">{progs.map((p) => <li key={p.slug}><Link to={`/programs/${p.slug}`}>{p.name}<Icon name="arrow" size={16} /></Link></li>)}</ul>
            <h2 className="h-sub">Teaches on</h2>
            {sessions.length ? (
              <ul className="session-list">{sessions.map((s) => (
                <li key={s.id}><span>{dayNames[s.day].slice(0, 3)} · {formatTime(s.start)}</span><span>{s.title}</span><Link to={`/schedule?day=${s.day}&class=${s.id}`}>View <Icon name="arrow" size={14} /></Link></li>
              ))}</ul>
            ) : <p className="note">Personal training sessions are arranged by enquiry.</p>}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="h-display">More coaches</h2>
          <div className="grid grid--trainers grid--three">{others.map((o) => <TrainerCard key={o.slug} trainer={o} />)}</div>
        </div>
      </section>
    </>
  );
}
