import { Link, useParams } from 'react-router-dom';
import { coursesByInstructor, getInstructor, instructors } from '../config';
import { useSeo } from '../hooks/useSeo';
import { CourseCard } from '../components/CourseCard';
import { InstructorCard } from '../components/InstructorCard';
import { Portrait } from '../components/Portrait';
import { PageHero, Section } from '../components/ui';
import NotFound from './NotFound';

export function InstructorsIndex() {
  useSeo({ title: 'Instructors', description: 'Meet the fictional demonstration instructors at Northstar Academy.', path: '/instructors' });
  return (
    <>
      <PageHero eyebrow="Instructors" title="Teachers who have done the work" intro="Every identity, biography and credential on this page is fictional demonstration data. Portraits are original illustrations." />
      <Section>
        <ul className="instructor-grid">
          {instructors.map((i) => (
            <li key={i.slug}><InstructorCard instructor={i} headingLevel={2} /></li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export function InstructorDetail() {
  const { slug = '' } = useParams();
  const i = getInstructor(slug);
  useSeo({ title: i?.name, description: i ? `${i.name} — ${i.specialization}. Fictional demonstration instructor.` : undefined, path: `/instructors/${slug}`, noindex: !i });
  if (!i) return <NotFound />;
  const list = coursesByInstructor(i.slug);
  return (
    <>
      <section className="page-hero instructor-hero">
        <div className="container instructor-hero__grid">
          <Portrait person={i} className="instructor-hero__portrait" />
          <div>
            <nav aria-label="Breadcrumb" className="crumbs"><ol><li><Link to="/instructors">Instructors</Link></li></ol></nav>
            <h1 data-page-heading tabIndex={-1}>{i.name}</h1>
            <p className="page-hero__intro">{i.title} · {i.specialization}</p>
            <p className="fine">Demonstration identity — not a real person. {i.location}. {i.years} years of (fictional) experience.</p>
          </div>
        </div>
      </section>
      <Section>
        <div className="detail-grid">
          <div className="detail-main">
            <h2 className="h3">Biography</h2>
            {i.bio.map((p) => <p key={p}>{p}</p>)}
            <h2 className="h3">Credentials (demonstration data)</h2>
            <ul className="bullets">{i.credentials.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
          <aside className="detail-side">
            <h2 className="h3">Specialization</h2>
            <p>{i.specialization}</p>
          </aside>
        </div>
      </Section>
      <Section tone="soft">
        <h2 className="section-title">Courses by {i.name}</h2>
        <div className="course-grid">{list.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
      </Section>
    </>
  );
}
