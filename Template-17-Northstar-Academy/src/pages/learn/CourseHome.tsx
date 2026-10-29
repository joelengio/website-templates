import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCategory, getCourse, getInstructor } from '../../config';
import { courseProgress, resumeStep, stepTo } from '../../lib/progress';
import { shortDate } from '../../lib/format';
import { useLearner } from '../../hooks/useLearner';
import { useSeo } from '../../hooks/useSeo';
import { BookmarkButton } from '../../components/BookmarkButton';
import { Button, LinkButton } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { CourseCover } from '../../components/CourseCover';
import { EnrollButton } from '../../components/EnrollButton';
import { Icon } from '../../components/Icon';
import { ModuleList } from '../../components/ModuleList';
import { ProgressBar, ProgressRing } from '../../components/ui';
import NotFound from '../NotFound';

export default function CourseHome() {
  const { slug = '' } = useParams();
  const course = getCourse(slug);
  const { state, unenroll } = useLearner();
  const [leave, setLeave] = useState(false);
  useSeo({ title: course ? `${course.title} (demo learning)` : 'Course not found', path: `/learn/${slug}`, noindex: true });
  if (!course) return <NotFound />;
  const enrollment = state.enrollments[course.slug];
  const p = courseProgress(course, state);
  const step = resumeStep(course, state);
  const category = getCategory(course.categoryId)!;
  const instructor = getInstructor(course.instructorId)!;

  if (!enrollment) {
    return (
      <div className="container dashboard">
        <header className="dashboard__head">
          <div>
            <p className="eyebrow">Not enrolled</p>
            <h1 data-page-heading tabIndex={-1}>{course.title}</h1>
            <p className="muted">Enroll in this demonstration course to open its lessons and quizzes.</p>
          </div>
          <EnrollButton course={course} />
        </header>
        <ModuleList course={course} />
        <p><Link to={`/courses/${course.slug}`} className="text-link">View public course page <Icon name="arrow" size={16} /></Link></p>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <nav aria-label="Breadcrumb" className="crumbs"><ol><li><Link to="/learn">Dashboard</Link></li><li>{course.title}</li></ol></nav>
      <header className="coursehome">
        <CourseCover motif={category.motif} palette={course.palette} seed={course.slug} label={`Illustration for ${course.title}`} className="coursehome__cover" />
        <div className="coursehome__main">
          <h1 data-page-heading tabIndex={-1}>{course.title}</h1>
          <p className="muted">with {instructor.name} · {course.difficulty} · enrolled {shortDate(enrollment.enrolledAt)}</p>
          <ProgressBar percent={p.percent} label={`${course.title} progress`} tone={p.complete ? 'teal' : 'cobalt'} />
          <p className="muted">{p.doneLessons}/{p.totalLessons} lessons · {p.passedQuizzes}/{p.totalQuizzes} quizzes passed</p>
          <div className="coursehome__actions">
            {step ? (
              <LinkButton to={stepTo(course.slug, step)} arrow>{p.doneSteps ? 'Continue learning' : 'Start learning'}</LinkButton>
            ) : (
              <LinkButton to={`/learn/${course.slug}/certificate`} arrow>View certificate preview</LinkButton>
            )}
            <BookmarkButton kind="course" slug={course.slug} title={course.title} withLabel />
            <Button variant="ghost" onClick={() => setLeave(true)} aria-haspopup="dialog">Leave course</Button>
          </div>
        </div>
        <ProgressRing percent={p.percent} size={110} />
      </header>
      {p.complete ? (
        <p className="success-banner" role="status"><Icon name="trophy" size={20} /> Course complete — every lesson finished and every quiz passed. <Link to={`/learn/${course.slug}/certificate`}>Preview your certificate (demonstration, not accredited)</Link>.</p>
      ) : (
        <p className="muted">A course is complete only when all {p.totalLessons} lessons are marked complete <em>and</em> all {p.totalQuizzes} quizzes are passed.</p>
      )}
      <h2 className="h3">Course outline</h2>
      <ModuleList course={course} state={state} linkBase={`/learn/${course.slug}`} />
      <ConfirmDialog open={leave} title="Leave this course?" confirmLabel="Leave course" danger onClose={() => setLeave(false)} onConfirm={() => { unenroll(course.slug); setLeave(false); }}>
        <p>Your lesson progress and quiz scores for “{course.title}” will be removed from this browser. You can enroll again at any time.</p>
      </ConfirmDialog>
    </div>
  );
}
