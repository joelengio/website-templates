import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../config/types';
import { passMarkFor, quizKey, type LearnerState } from '../lib/progress';
import { Icon } from './Icon';

/**
 * Expandable module structure. `state` is optional: on public pages it just lists the curriculum;
 * inside the learning dashboard it adds completion marks and links.
 */
export function ModuleList({ course, state, current, linkBase, defaultOpenFirst = true }: { course: Course; state?: LearnerState; current?: string; linkBase?: string; defaultOpenFirst?: boolean }) {
  const done = new Set(state?.enrollments[course.slug]?.lessonsDone ?? []);
  const initial = new Set<string>();
  const currentModule = course.modules.find((m) => m.lessons.some((l) => `lesson:${l.id}` === current) || `quiz:${m.quiz.id}` === current);
  if (currentModule) initial.add(currentModule.id);
  else if (defaultOpenFirst && course.modules[0]) initial.add(course.modules[0].id);
  const [open, setOpen] = useState<Set<string>>(initial);
  const uid = useId();
  const currentModuleId = currentModule?.id;
  useEffect(() => {
    if (currentModuleId) setOpen((s) => (s.has(currentModuleId) ? s : new Set(s).add(currentModuleId)));
  }, [currentModuleId]);
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <ol className="modules">
      {course.modules.map((m, mi) => {
        const isOpen = open.has(m.id);
        const lessonsDone = m.lessons.filter((l) => done.has(l.id)).length;
        const record = state?.quizzes[quizKey(course.slug, m.quiz.id)];
        const panelId = `mod${uid.replace(/:/g, '')}-${m.id}`;
        return (
          <li key={m.id} className={`module${isOpen ? ' is-open' : ''}`}>
            <h3 className="module__head">
              <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(m.id)}>
                <span className="module__num">{String(mi + 1).padStart(2, '0')}</span>
                <span className="module__title">
                  {m.title}
                  <span className="module__sub">
                    {state ? `${lessonsDone}/${m.lessons.length} lessons${record?.passed ? ' · quiz passed' : ''}` : `${m.lessons.length} sample lessons + quiz`}
                  </span>
                </span>
                <Icon name="chevron" size={22} className="module__chev" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-label={m.title} hidden={!isOpen} className="module__panel">
              <p className="module__summary">{m.summary}</p>
              <ul>
                {m.lessons.map((l) => {
                  const isDone = done.has(l.id);
                  const key = `lesson:${l.id}`;
                  const inner = (
                    <>
                      <span className={`tick${isDone ? ' is-done' : ''}`} aria-hidden="true">{isDone && <Icon name="check" size={14} />}</span>
                      <span className="lesson-row__title">{l.title}</span>
                      <span className="lesson-row__time">{l.minutes} min</span>
                      {isDone && <span className="sr-only">Completed</span>}
                    </>
                  );
                  return (
                    <li key={l.id}>
                      {linkBase ? (
                        <Link to={`${linkBase}/lesson/${l.id}`} className={`lesson-row${current === key ? ' is-current' : ''}`} aria-current={current === key ? 'page' : undefined}>
                          {inner}
                        </Link>
                      ) : (
                        <div className="lesson-row">{inner}</div>
                      )}
                    </li>
                  );
                })}
                <li>
                  {(() => {
                    const key = `quiz:${m.quiz.id}`;
                    const inner = (
                      <>
                        <span className={`tick tick--quiz${record?.passed ? ' is-done' : ''}`} aria-hidden="true">{record?.passed ? <Icon name="check" size={14} /> : <Icon name="flag" size={13} />}</span>
                        <span className="lesson-row__title">Quiz: {m.quiz.title}</span>
                        <span className="lesson-row__time">{record ? `Best ${record.best}%` : `Pass ${passMarkFor(m.quiz)}%`}</span>
                        {record?.passed && <span className="sr-only">Passed</span>}
                      </>
                    );
                    return linkBase ? (
                      <Link to={`${linkBase}/quiz/${m.quiz.id}`} className={`lesson-row lesson-row--quiz${current === key ? ' is-current' : ''}`} aria-current={current === key ? 'page' : undefined}>
                        {inner}
                      </Link>
                    ) : (
                      <div className="lesson-row lesson-row--quiz">{inner}</div>
                    );
                  })()}
                </li>
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
