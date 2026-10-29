import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getCourse } from '../../config';
import { courseProgress, courseSteps, stepId, stepTo } from '../../lib/progress';
import { useLearner } from '../../hooks/useLearner';
import { useSeo } from '../../hooks/useSeo';
import { BookmarkButton } from '../../components/BookmarkButton';
import { Button, LinkButton } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { LessonShell } from '../../components/LessonShell';
import { ProgressBar } from '../../components/ui';
import NotFound from '../NotFound';

export default function LessonPage() {
  const { slug = '', lessonId = '' } = useParams();
  const course = getCourse(slug);
  const { state, setLesson, visit } = useLearner();
  const [announce, setAnnounce] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  useSeo({ title: lesson && course ? `${lesson.title} · ${course.title}` : 'Lesson', path: `/learn/${slug}/lesson/${lessonId}`, noindex: true });
  const enrolled = !!state.enrollments[slug];

  useEffect(() => {
    if (course && lesson && enrolled) visit(slug, `lesson:${lessonId}`);
  }, [course, lesson, enrolled, slug, lessonId, visit]);
  useEffect(() => {
    setAnnounce('');
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [lessonId]);

  if (!course || !lesson) return <NotFound />;
  if (!enrolled) return <Navigate to={`/learn/${slug}`} replace />;

  const mod = course.modules.find((m) => m.lessons.some((l) => l.id === lessonId))!;
  const steps = courseSteps(course);
  const idx = steps.findIndex((s) => stepId(s) === `lesson:${lessonId}`);
  const prev = steps[idx - 1];
  const next = steps[idx + 1];
  const done = state.enrollments[slug].lessonsDone.includes(lessonId);
  const p = courseProgress(course, state);
  const lessonNumber = course.modules.flatMap((m) => m.lessons).findIndex((l) => l.id === lessonId) + 1;
  const total = p.totalLessons;
  const label = (s: typeof next) => (s ? (s.kind === 'lesson' ? s.lesson.title : `Quiz: ${s.quiz.title}`) : '');

  return (
    <LessonShell course={course} current={`lesson:${lessonId}`}>
      <article className="reading">
        <p className="reading__crumb">{mod.title} · Lesson {lessonNumber} of {total} · {lesson.minutes} min</p>
        <h1 ref={headingRef} tabIndex={-1} data-page-heading>{lesson.title}</h1>
        <p className="reading__summary">{lesson.summary}</p>
        {lesson.media && (
          <figure className="reading__media">
            <video controls preload="metadata" poster={lesson.media.poster} aria-describedby="clip-desc">
              <source src={lesson.media.src} type="video/webm" />
              <track kind="captions" src={lesson.media.src.replace(/\.webm$/, '.vtt')} srcLang="en" label="English captions" default />
              Your browser does not support embedded video.
            </video>
            <figcaption id="clip-desc">{lesson.media.caption}</figcaption>
            <details>
              <summary>Transcript</summary>
              <p>{lesson.media.transcript}</p>
            </details>
          </figure>
        )}
        {lesson.body.map((para) => <p key={para}>{para}</p>)}
        <aside className="callout" aria-labelledby="kp-h">
          <h2 id="kp-h" className="h4">Key points</h2>
          <ul>{lesson.keyPoints.map((k) => <li key={k}>{k}</li>)}</ul>
        </aside>
        <aside className="practice" aria-labelledby="pr-h">
          <h2 id="pr-h" className="h4"><Icon name="sparkle" size={18} /> Try it</h2>
          <p>{lesson.practice}</p>
        </aside>

        <div className="complete-bar">
          <Button
            variant={done ? 'ghost' : 'teal'}
            aria-pressed={done}
            onClick={() => {
              setLesson(slug, lessonId, !done);
              setAnnounce(done ? 'Lesson marked as not complete.' : 'Lesson marked complete.');
            }}
          >
            <Icon name="check" size={18} /> {done ? 'Completed — mark as not complete' : 'Mark lesson complete'}
          </Button>
          <BookmarkButton kind="lesson" slug={slug} lessonId={lessonId} title={lesson.title} withLabel />
          <span className="sr-only" role="status" aria-live="polite">{announce}</span>
        </div>

        <nav className="lesson-nav" aria-label="Lesson navigation">
          {prev ? (
            <Link to={stepTo(slug, prev)} className="lesson-nav__link lesson-nav__link--prev" rel="prev">
              <small><Icon name="arrow-left" size={14} /> Previous</small>
              <span>{label(prev)}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={stepTo(slug, next)} className="lesson-nav__link lesson-nav__link--next" rel="next">
              <small>{done ? 'Next' : 'Skip to next'} <Icon name="arrow" size={14} /></small>
              <span>{label(next)}</span>
            </Link>
          ) : (
            <LinkButton to={`/learn/${slug}`}>Back to course</LinkButton>
          )}
        </nav>
        <div className="reading__progress">
          <ProgressBar percent={p.percent} label={`${course.title} progress`} tone={p.complete ? 'teal' : 'cobalt'} />
        </div>
      </article>
    </LessonShell>
  );
}
