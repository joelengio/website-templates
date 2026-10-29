import { Link, useParams } from 'react-router-dom';
import { getCourse, getInstructor, learning, site } from '../../config';
import { courseProgress } from '../../lib/progress';
import { shortDate } from '../../lib/format';
import { useLearner } from '../../hooks/useLearner';
import { useSeo } from '../../hooks/useSeo';
import { Button, LinkButton } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { LogoMark } from '../../components/Logo';
import NotFound from '../NotFound';

export default function Certificate() {
  const { slug = '' } = useParams();
  const course = getCourse(slug);
  const { state } = useLearner();
  useSeo({ title: course ? `Certificate preview · ${course.title}` : 'Certificate', path: `/learn/${slug}/certificate`, noindex: true });
  if (!course) return <NotFound />;
  const p = courseProgress(course, state);
  const e = state.enrollments[slug];
  const instructor = getInstructor(course.instructorId);

  if (!e || !p.complete) {
    return (
      <div className="container dashboard">
        <h1 data-page-heading tabIndex={-1}>Certificate preview locked</h1>
        <p className="muted">The certificate preview unlocks when all {p.totalLessons} lessons are complete and all {p.totalQuizzes} quizzes are passed. You are at {p.percent}%.</p>
        <LinkButton to={`/learn/${slug}`} arrow>Back to course</LinkButton>
      </div>
    );
  }
  return (
    <div className="container dashboard">
      <div className="certificate-tools no-print">
        <Link to="/learn/completed" className="text-link"><Icon name="arrow-left" size={16} /> Completed courses</Link>
        <h1 data-page-heading tabIndex={-1} className="h3">Certificate preview</h1>
        <Button onClick={() => window.print()}><Icon name="print" size={18} /> Print preview</Button>
      </div>
      <p className="fine no-print">{learning.certificate.note}</p>
      <section className="certificate" aria-label="Demonstration certificate">
        <div className="certificate__stamp" role="note">{learning.certificate.stamp}</div>
        <LogoMark size={56} />
        <p className="certificate__brand">{site.name}</p>
        <p className="certificate__kicker">Certificate of course completion</p>
        <p className="certificate__name">{learning.learner.name}</p>
        <p>has completed all lessons and assessments in the demonstration course</p>
        <h2 className="certificate__course">{course.title}</h2>
        <p className="certificate__meta">
          Completed {e.completedAt ? shortDate(e.completedAt) : ''} · Instructor: {instructor?.name} (fictional)
        </p>
        <p className="certificate__legal">Demonstration only. Not accredited, not recognised by any third party and not a qualification. Issued by a fictional brand.</p>
      </section>
    </div>
  );
}
