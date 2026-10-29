import { useState } from 'react';
import { Link } from 'react-router-dom';
import { courses, getCourse, learning } from '../../config';
import { courseProgress, resumeStep, stepTo } from '../../lib/progress';
import { useLearner } from '../../hooks/useLearner';
import { useSeo } from '../../hooks/useSeo';
import { Button, LinkButton } from '../../components/Button';
import { ActivityChart, QuizScoreChart } from '../../components/Charts';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { CourseCard } from '../../components/CourseCard';
import { CourseCover } from '../../components/CourseCover';
import { Icon } from '../../components/Icon';
import { DemoNotice, ProgressBar, ProgressRing } from '../../components/ui';
import { getCategory } from '../../config';
import type { Course } from '../../config/types';

export function useEnrolled() {
  const { state } = useLearner();
  const list = Object.keys(state.enrollments).map((slug) => getCourse(slug)).filter((c): c is Course => !!c);
  return list.map((course) => ({ course, progress: courseProgress(course, state), enrollment: state.enrollments[course.slug] }));
}

export default function Dashboard() {
  useSeo({ title: 'Learning dashboard (demo)', path: '/learn', noindex: true, description: 'Local demonstration learning dashboard.' });
  const { state, loadSample, reset, persisted } = useLearner();
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState('');
  const enrolled = useEnrolled();
  const active = enrolled.filter((e) => !e.progress.complete);
  const done = enrolled.filter((e) => e.progress.complete);
  const resumeCandidate = [...active].sort((a, b) => (b.enrollment.lastAt ?? b.enrollment.enrolledAt).localeCompare(a.enrollment.lastAt ?? a.enrollment.enrolledAt))[0];
  const step = resumeCandidate ? resumeStep(resumeCandidate.course, state) : undefined;
  const totalLessons = enrolled.reduce((a, e) => a + e.progress.doneLessons, 0);
  const quizzes = Object.values(state.quizzes);
  const passed = quizzes.filter((q) => q.passed).length;
  const avgBest = quizzes.length ? Math.round(quizzes.reduce((a, q) => a + q.best, 0) / quizzes.length) : null;
  const weekMinutes = state.activity.filter((a) => a.date >= new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10)).reduce((a, x) => a + x.minutes, 0);
  const goalPct = Math.min(100, Math.round((weekMinutes / learning.weeklyGoalMinutes) * 100));
  const suggestions = courses.filter((c) => !(c.slug in state.enrollments)).slice(0, 3);

  return (
    <div className="container dashboard">
      <header className="dashboard__head">
        <div>
          <p className="eyebrow">Sample learner dashboard</p>
          <h1 data-page-heading tabIndex={-1}>Welcome back, {learning.learner.name.split(' ')[0]}</h1>
          <p className="muted">Goal: {learning.learner.goal}. <span className="fine">(Demo learner — there is no real account.)</span></p>
        </div>
        <div className="dashboard__actions">
          <Button variant="ghost" onClick={() => { loadSample(); setNotice('Sample progress loaded.'); }}><Icon name="sparkle" size={16} /> Load sample progress</Button>
          <Button variant="ghost" onClick={() => setConfirm(true)} aria-haspopup="dialog"><Icon name="reset" size={16} /> Reset demo progress</Button>
        </div>
      </header>
      <p className="sr-only" role="status" aria-live="polite">{notice}</p>
      {!persisted && <p className="form__alert" role="alert">Browser storage is unavailable, so progress will be lost when you close this tab.</p>}
      <DemoNotice />

      {enrolled.length === 0 ? (
        <div className="empty empty--wide">
          <Icon name="book" size={28} />
          <h2>You have not enrolled in anything yet</h2>
          <p>Browse the catalogue and enroll in a free demo course, or load sample progress to explore a populated dashboard.</p>
          <div className="hero__actions">
            <LinkButton to="/courses?price=free" arrow>Browse free courses</LinkButton>
            <Button variant="ghost" onClick={() => { loadSample(); setNotice('Sample progress loaded.'); }}>Load sample progress</Button>
          </div>
        </div>
      ) : (
        <>
          <ul className="stats" aria-label="Learning summary">
            <li><strong>{enrolled.length}</strong><span>Enrolled courses</span></li>
            <li><strong>{done.length}</strong><span>Completed</span></li>
            <li><strong>{totalLessons}</strong><span>Lessons completed</span></li>
            <li><strong>{passed}</strong><span>Quizzes passed</span></li>
            <li><strong>{avgBest === null ? '—' : `${avgBest}%`}</strong><span>Average best quiz score</span></li>
          </ul>

          <div className="dash-grid">
            <section className="panel panel--continue" aria-labelledby="continue-h">
              <h2 id="continue-h" className="h4">Continue learning</h2>
              {resumeCandidate && step ? (
                <div className="continue">
                  <CourseCover motif={getCategory(resumeCandidate.course.categoryId)!.motif} palette={resumeCandidate.course.palette} seed={resumeCandidate.course.slug} className="continue__cover" />
                  <div className="continue__body">
                    <h3>{resumeCandidate.course.title}</h3>
                    <p className="muted">Next up: {step.kind === 'lesson' ? step.lesson.title : `Quiz — ${step.quiz.title}`}</p>
                    <ProgressBar percent={resumeCandidate.progress.percent} label={`${resumeCandidate.course.title} progress`} />
                    <LinkButton to={stepTo(resumeCandidate.course.slug, step)} arrow>Continue</LinkButton>
                  </div>
                </div>
              ) : (
                <p className="muted">All enrolled courses are complete. Pick your next course below.</p>
              )}
            </section>
            <section className="panel" aria-labelledby="goal-h">
              <h2 id="goal-h" className="h4">Weekly goal</h2>
              <div className="goal">
                <ProgressRing percent={goalPct} size={96} />
                <p><strong>{weekMinutes}</strong> of {learning.weeklyGoalMinutes} minutes this week</p>
              </div>
            </section>
          </div>

          <section aria-labelledby="enrolled-h" className="dash-section">
            <h2 id="enrolled-h" className="h3">Your courses</h2>
            <ul className="enrolled-list">
              {enrolled.map(({ course, progress }) => {
                const s = resumeStep(course, state);
                return (
                  <li key={course.slug} className="enrolled">
                    <div className="enrolled__main">
                      <h3><Link to={`/learn/${course.slug}`}>{course.title}</Link></h3>
                      <p className="muted">{progress.doneLessons}/{progress.totalLessons} lessons · {progress.passedQuizzes}/{progress.totalQuizzes} quizzes passed</p>
                      <ProgressBar percent={progress.percent} label={`${course.title} progress`} tone={progress.complete ? 'teal' : 'cobalt'} />
                    </div>
                    <div className="enrolled__cta">
                      {progress.complete ? <span className="chip chip--done"><Icon name="check" size={14} /> Complete</span> : null}
                      <Link className="btn btn--ghost btn--sm" to={s ? stepTo(course.slug, s) : `/learn/${course.slug}`}>
                        {progress.complete ? 'Review' : progress.doneSteps ? 'Continue' : 'Start'}<span className="sr-only"> {course.title}</span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="dash-grid dash-grid--charts">
            <section className="panel" aria-labelledby="quiz-h">
              <h2 id="quiz-h" className="h4">Quiz scores</h2>
              <QuizScoreChart state={state} />
            </section>
            <section className="panel" aria-labelledby="act-h">
              <h2 id="act-h" className="h4">Last 7 days</h2>
              <ActivityChart state={state} goalPerDay={Math.round(learning.weeklyGoalMinutes / 7)} />
            </section>
          </div>
        </>
      )}

      {suggestions.length > 0 && (
        <section aria-labelledby="sugg-h" className="dash-section">
          <h2 id="sugg-h" className="h3">Browse and enroll</h2>
          <div className="course-grid">{suggestions.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
        </section>
      )}

      <ConfirmDialog
        open={confirm}
        title="Reset demo progress?"
        confirmLabel="Reset everything"
        danger
        onClose={() => setConfirm(false)}
        onConfirm={() => { reset(); setConfirm(false); setNotice('Demo progress reset.'); }}
      >
        <p>This removes every enrollment, completed lesson, quiz score and bookmark stored in this browser. It cannot be undone.</p>
      </ConfirmDialog>
    </div>
  );
}

