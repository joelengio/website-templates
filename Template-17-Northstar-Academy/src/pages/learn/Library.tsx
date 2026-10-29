import { Link } from 'react-router-dom';
import { getCourse, learning } from '../../config';
import { courseProgress, quizKey, passMarkFor } from '../../lib/progress';
import { shortDate } from '../../lib/format';
import { useLearner } from '../../hooks/useLearner';
import { useSeo } from '../../hooks/useSeo';
import { LinkButton } from '../../components/Button';
import { BookmarkButton } from '../../components/BookmarkButton';
import { CourseCard } from '../../components/CourseCard';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/ui';
import type { Course } from '../../config/types';

export function Bookmarks() {
  useSeo({ title: 'Bookmarks (demo)', path: '/learn/bookmarks', noindex: true });
  const { state } = useLearner();
  const courseList = state.bookmarkedCourses.map((s) => getCourse(s)).filter((c): c is Course => !!c);
  const lessonList = state.bookmarkedLessons
    .map((k) => {
      const [slug, id] = k.split(':');
      const course = getCourse(slug);
      const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === id);
      return course && lesson ? { course, lesson } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <div className="container dashboard">
      <header className="dashboard__head"><div><p className="eyebrow">Saved in this browser</p><h1 data-page-heading tabIndex={-1}>Bookmarks</h1></div></header>
      {courseList.length === 0 && lessonList.length === 0 ? (
        <EmptyState title="Nothing bookmarked yet" text="Use the bookmark button on any course card or lesson to save it here." action={<LinkButton to="/courses" arrow>Browse courses</LinkButton>} />
      ) : (
        <>
          <section aria-labelledby="bc-h" className="dash-section">
            <h2 id="bc-h" className="h3">Bookmarked courses ({courseList.length})</h2>
            {courseList.length ? <div className="course-grid">{courseList.map((c) => <CourseCard key={c.slug} course={c} />)}</div> : <p className="muted">No bookmarked courses.</p>}
          </section>
          <section aria-labelledby="bl-h" className="dash-section">
            <h2 id="bl-h" className="h3">Bookmarked lessons ({lessonList.length})</h2>
            {lessonList.length ? (
              <ul className="enrolled-list">
                {lessonList.map(({ course, lesson }) => (
                  <li key={`${course.slug}:${lesson.id}`} className="enrolled">
                    <div className="enrolled__main">
                      <h3>{state.enrollments[course.slug] ? <Link to={`/learn/${course.slug}/lesson/${lesson.id}`}>{lesson.title}</Link> : lesson.title}</h3>
                      <p className="muted">{course.title} · {lesson.minutes} min{!state.enrollments[course.slug] && ' · enroll to open'}</p>
                    </div>
                    <BookmarkButton kind="lesson" slug={course.slug} lessonId={lesson.id} title={lesson.title} />
                  </li>
                ))}
              </ul>
            ) : <p className="muted">No bookmarked lessons.</p>}
          </section>
        </>
      )}
    </div>
  );
}

export function Completed() {
  useSeo({ title: 'Completed courses (demo)', path: '/learn/completed', noindex: true });
  const { state } = useLearner();
  const done = Object.keys(state.enrollments)
    .map((s) => getCourse(s))
    .filter((c): c is Course => !!c && courseProgress(c, state).complete);
  return (
    <div className="container dashboard">
      <header className="dashboard__head"><div><p className="eyebrow">Review</p><h1 data-page-heading tabIndex={-1}>Completed courses</h1></div></header>
      {done.length === 0 ? (
        <EmptyState title="No completed courses yet" text="Finish every lesson and pass every module quiz in a course to see it here." action={<LinkButton to="/learn" arrow>Back to dashboard</LinkButton>} />
      ) : (
        <ul className="completed-list">
          {done.map((c) => {
            const e = state.enrollments[c.slug];
            return (
              <li key={c.slug} className="completed">
                <div>
                  <h2 className="h3"><Link to={`/learn/${c.slug}`}>{c.title}</Link></h2>
                  <p className="muted"><Icon name="check" size={14} /> Completed {e.completedAt ? shortDate(e.completedAt) : ''} · {c.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons</p>
                  <ul className="score-list" aria-label={`Quiz scores for ${c.title}`}>
                    {c.modules.map((m) => {
                      const r = state.quizzes[quizKey(c.slug, m.quiz.id)];
                      return <li key={m.id}><span>{m.quiz.title}</span><strong>{r ? `${r.best}%` : '—'}</strong><small>pass {passMarkFor(m.quiz)}% · {r?.attempts ?? 0} attempt{r?.attempts === 1 ? '' : 's'}</small></li>;
                    })}
                  </ul>
                </div>
                <div className="completed__cta">
                  <LinkButton to={`/learn/${c.slug}`} variant="ghost" className="btn--sm">Review lessons</LinkButton>
                  <LinkButton to={`/learn/${c.slug}/certificate`} className="btn--sm" arrow>Certificate preview</LinkButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="fine">{learning.certificate.note}</p>
    </div>
  );
}
