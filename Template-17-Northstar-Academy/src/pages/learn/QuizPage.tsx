import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getCourse } from '../../config';
import { courseProgress, courseSteps, passMarkFor, quizKey, stepId, stepTo } from '../../lib/progress';
import { resultMessage, scoreQuiz, type QuizResult } from '../../lib/quiz';
import { learning } from '../../config/learning';
import { useLearner } from '../../hooks/useLearner';
import { useSeo } from '../../hooks/useSeo';
import { Button, LinkButton } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { LessonShell } from '../../components/LessonShell';
import NotFound from '../NotFound';

type Phase = 'intro' | 'taking' | 'result';

export default function QuizPage() {
  const { slug = '', quizId = '' } = useParams();
  const course = getCourse(slug);
  const mod = course?.modules.find((m) => m.quiz.id === quizId);
  const quiz = mod?.quiz;
  const { state, submitQuiz, visit } = useLearner();
  const record = state.quizzes[quizKey(slug, quizId)];
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const headRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const errRef = useRef<HTMLDivElement>(null);
  useSeo({ title: quiz && course ? `${quiz.title} · ${course.title}` : 'Quiz', path: `/learn/${slug}/quiz/${quizId}`, noindex: true });
  const enrolled = !!state.enrollments[slug];

  useEffect(() => {
    if (course && quiz && enrolled) visit(slug, `quiz:${quizId}`);
  }, [course, quiz, enrolled, slug, quizId, visit]);
  useEffect(() => {
    setPhase('intro');
    setAnswers({});
    setResult(null);
    setMissing([]);
    window.scrollTo(0, 0);
    headRef.current?.focus({ preventScroll: true });
  }, [quizId]);

  if (!course || !quiz || !mod) return <NotFound />;
  if (!enrolled) return <Navigate to={`/learn/${slug}`} replace />;

  const passMark = passMarkFor(quiz);
  const steps = courseSteps(course);
  const idx = steps.findIndex((s) => stepId(s) === `quiz:${quizId}`);
  const next = steps[idx + 1];
  const prev = steps[idx - 1];
  const lessonsDone = mod.lessons.filter((l) => state.enrollments[slug].lessonsDone.includes(l.id)).length;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const unanswered = quiz.questions.filter((q) => answers[q.id] === undefined).map((q) => q.id);
    setMissing(unanswered);
    if (unanswered.length) {
      setTimeout(() => errRef.current?.focus(), 0);
      return;
    }
    const r = scoreQuiz(quiz, answers);
    submitQuiz(slug, quizId, answers);
    setResult(r);
    setPhase('result');
    setTimeout(() => resultRef.current?.focus(), 0);
  };
  const start = () => {
    setAnswers({});
    setResult(null);
    setMissing([]);
    setPhase('taking');
    setTimeout(() => document.querySelector<HTMLElement>('.quiz fieldset input')?.focus(), 0);
  };
  const progressAfter = courseProgress(course, state);

  return (
    <LessonShell course={course} current={`quiz:${quizId}`}>
      <article className="reading quiz">
        <p className="reading__crumb">{mod.title} · Module quiz</p>
        <h1 ref={headRef} tabIndex={-1} data-page-heading>{quiz.title}</h1>

        {phase === 'intro' && (
          <>
            <ul className="quiz-facts" aria-label="Quiz details">
              <li><strong>{quiz.questions.length}</strong> multiple-choice questions</li>
              <li>Pass mark <strong>{passMark}%</strong></li>
              <li>Unlimited retries</li>
            </ul>
            {lessonsDone < mod.lessons.length && (
              <p className="callout callout--warn" role="note">You have completed {lessonsDone} of {mod.lessons.length} lessons in this module. You can take the quiz now, but the module only counts as finished when its lessons and quiz are complete.</p>
            )}
            {record ? (
              <div className={`quiz-record${record.passed ? ' is-pass' : ''}`}>
                <p><strong>{record.passed ? 'Passed' : 'Not yet passed'}</strong> · Best score {record.best}% · Latest {record.last}% · {record.attempts} attempt{record.attempts === 1 ? '' : 's'}</p>
              </div>
            ) : (
              <p className="muted">You have not attempted this quiz yet.</p>
            )}
            <div className="quiz-actions">
              <Button onClick={start}>{record ? 'Retake quiz' : 'Start quiz'}</Button>
              {record?.passed && next && <LinkButton variant="ghost" to={stepTo(slug, next)} arrow>Continue course</LinkButton>}
              {prev && <LinkButton variant="ghost" to={stepTo(slug, prev)}>Back to lesson</LinkButton>}
            </div>
          </>
        )}

        {phase === 'taking' && (
          <form className="quiz-form" onSubmit={submit} noValidate>
            {missing.length > 0 && (
              <div className="form__alert" role="alert" tabIndex={-1} ref={errRef}>
                Please answer every question. Unanswered: {missing.map((id) => `question ${quiz.questions.findIndex((q) => q.id === id) + 1}`).join(', ')}.
              </div>
            )}
            {quiz.questions.map((q, qi) => (
              <fieldset key={q.id} className={`question${missing.includes(q.id) ? ' has-error' : ''}`}>
                <legend><span className="question__n">Question {qi + 1} of {quiz.questions.length}</span>{q.prompt}</legend>
                {q.options.map((opt, oi) => {
                  const id = `${q.id}-o${oi}`;
                  return (
                    <label key={id} htmlFor={id} className={`option${answers[q.id] === oi ? ' is-selected' : ''}`}>
                      <input id={id} type="radio" name={q.id} value={oi} checked={answers[q.id] === oi} onChange={() => { setAnswers((a) => ({ ...a, [q.id]: oi })); setMissing((m) => m.filter((x) => x !== q.id)); }} />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </fieldset>
            ))}
            <div className="quiz-actions">
              <Button type="submit">Submit answers</Button>
              <Button variant="ghost" onClick={() => setPhase('intro')}>Cancel</Button>
            </div>
          </form>
        )}

        {phase === 'result' && result && (
          <div className="quiz-result">
            {(() => {
              const msg = resultMessage(result);
              return (
                <div className={`result result--${msg.tone}`}>
                  <div className="result__score" aria-hidden="true">{result.percent}%</div>
                  <div>
                    <h2 ref={resultRef} tabIndex={-1} className="h3">{msg.title}: {result.correct} of {result.total} correct</h2>
                    <p>{msg.text}</p>
                    {progressAfter.complete && <p><strong>Course complete!</strong> <Link to={`/learn/${slug}/certificate`}>Preview your certificate</Link></p>}
                  </div>
                </div>
              );
            })()}
            {learning.revealAnswers && (
              <ol className="review">
                {quiz.questions.map((q, qi) => {
                  const d = result.details[qi];
                  return (
                    <li key={q.id} className={d.correct ? 'is-right' : 'is-wrong'}>
                      <p className="review__q"><Icon name={d.correct ? 'check' : 'x'} size={16} /> <strong>{d.correct ? 'Correct' : 'Incorrect'}.</strong> {q.prompt}</p>
                      <p>Your answer: {d.chosen === null ? 'none' : q.options[d.chosen]}</p>
                      {!d.correct && <p>Correct answer: <strong>{q.options[q.correct]}</strong></p>}
                      <p className="muted">{q.explanation}</p>
                    </li>
                  );
                })}
              </ol>
            )}
            <div className="quiz-actions">
              {!result.passed && <Button onClick={start}>Try again</Button>}
              {result.passed && next && <LinkButton to={stepTo(slug, next)} arrow>Continue course</LinkButton>}
              {result.passed && !next && <LinkButton to={`/learn/${slug}`} arrow>Back to course</LinkButton>}
              {result.passed && <Button variant="ghost" onClick={start}>Retake for practice</Button>}
              <LinkButton variant="ghost" to={`/learn/${slug}`}>Course home</LinkButton>
            </div>
          </div>
        )}
      </article>
    </LessonShell>
  );
}
