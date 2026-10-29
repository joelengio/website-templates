import { Link, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Breadcrumb, Img, Intensity, LinkButton } from '../components/ui';
import { getProgram, programs } from '../config/programs';
import { trainers } from '../config/trainers';
import { classes, dayNames } from '../config/classes';
import { ctas } from '../config/navigation';
import { formatTime } from '../lib/format';
import { ProgramCard } from '../components/Cards';
import NotFound from './NotFound';

export default function ProgramDetail() {
  const { slug = '' } = useParams();
  const program = getProgram(slug);
  if (!program) return <NotFound what="program" />;
  const team = trainers.filter((t) => program.trainerSlugs.includes(t.slug));
  const sessions = classes.filter((c) => c.programSlug === program.slug).sort((a, b) => a.day - b.day || a.start.localeCompare(b.start));
  const others = programs.filter((p) => p.slug !== program.slug && p.category === program.category).concat(programs.filter((p) => p.slug !== program.slug && p.category !== program.category)).slice(0, 3);

  return (
    <>
      <Seo title={program.name} description={program.summary} image={program.image.src} />
      <section className="detail-hero">
        <Img image={program.image} eager className="detail-hero-img" />
        <div className="detail-hero-shade" aria-hidden="true" />
        <div className="container detail-hero-inner">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Programs', to: '/programs' }, { label: program.name }]} />
          <p className="eyebrow">{program.category}</p>
          <h1 className="h-mega">{program.name}</h1>
          <p className="lead">{program.summary}</p>
        </div>
      </section>
      <section className="section">
        <div className="container detail-grid">
          <div className="detail-main">
            {program.description.map((t) => <p key={t} className="lead lead--body">{t}</p>)}
            <h2 className="h-sub">Highlights</h2>
            <ul className="tick-list">{program.highlights.map((h) => <li key={h}><Icon name="check" size={18} />{h}</li>)}</ul>
            <h2 className="h-sub">What to expect</h2>
            <ol className="step-list">{program.expect.map((h) => <li key={h}>{h}</li>)}</ol>
            <h2 className="h-sub">What to bring</h2>
            <ul className="tick-list">{program.bring.map((h) => <li key={h}><Icon name="check" size={18} />{h}</li>)}</ul>

            <h2 className="h-sub">Trainers</h2>
            <ul className="mini-trainers">
              {team.map((t) => (
                <li key={t.slug}>
                  <Link to={`/trainers/${t.slug}`}>
                    <Img image={t.image} />
                    <span><b>{t.name}</b><small>{t.role}</small></span>
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="h-sub">Weekly sessions</h2>
            {sessions.length ? (
              <ul className="session-list">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <span>{dayNames[s.day]} · {formatTime(s.start)}</span>
                    <span>{s.title}</span>
                    <Link to={`/schedule?day=${s.day}&class=${s.id}`}>View & book <Icon name="arrow" size={14} /></Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="note">{program.bookingNote ?? 'No group sessions are scheduled for this program right now.'}</p>
            )}
          </div>
          <aside className="detail-side" aria-label="Program facts">
            <dl className="facts">
              <div><dt>Duration</dt><dd>{program.duration} minutes</dd></div>
              <div><dt>Experience</dt><dd>{program.level}</dd></div>
              <div><dt>Intensity</dt><dd><Intensity level={program.intensity} /></dd></div>
              <div><dt>Category</dt><dd>{program.category}</dd></div>
            </dl>
            {program.bookingNote && <p className="note">{program.bookingNote}</p>}
            <LinkButton to={sessions.length ? ctas.schedule.to : ctas.trainerInquiry.to}>{sessions.length ? 'Book a demo class' : 'Enquire about training'}</LinkButton>
            <p className="fine-print">Booking is a demonstration. Nothing is sent to a real club.</p>
          </aside>
        </div>
      </section>
      <section className="section section--charcoal">
        <div className="container">
          <h2 className="h-display">More programs</h2>
          <div className="grid grid--cards">{others.map((p) => <ProgramCard key={p.slug} program={p} />)}</div>
        </div>
      </section>
    </>
  );
}
