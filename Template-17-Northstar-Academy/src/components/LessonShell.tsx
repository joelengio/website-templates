import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Course } from '../config/types';
import { courseProgress } from '../lib/progress';
import { useLearner } from '../hooks/useLearner';
import { Button } from './Button';
import { Icon } from './Icon';
import { LogoMark } from './Logo';
import { SkipLink, RouteEffects } from './Layout';
import { ModuleList } from './ModuleList';
import { Modal } from './Modal';
import { ProgressBar } from './ui';

/** Immersive learning shell: slim top bar, course outline sidebar (drawer on mobile) and the reading column. */
export function LessonShell({ course, current, children }: { course: Course; current: string; children: ReactNode }) {
  const { state } = useLearner();
  const [outline, setOutline] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOutline(false), [pathname]);
  const p = courseProgress(course, state);
  const base = `/learn/${course.slug}`;
  return (
    <div className="lesson-shell">
      <SkipLink />
      <header className="lesson-top">
        <Link to="/" className="lesson-top__logo" aria-label="Northstar Academy home"><LogoMark size={32} /></Link>
        <Link to={base} className="lesson-top__back"><Icon name="arrow-left" size={16} /> <span>Course home</span></Link>
        <p className="lesson-top__title">{course.title}</p>
        <div className="lesson-top__progress">
          <ProgressBar percent={p.percent} label={`${course.title} progress`} tone={p.complete ? 'teal' : 'cobalt'} />
        </div>
        <Button variant="ghost" className="lesson-top__outline btn--sm" onClick={() => setOutline(true)} aria-haspopup="dialog">
          <Icon name="list" size={18} /> Outline
        </Button>
      </header>
      <div className="lesson-body">
        <aside className="lesson-side" aria-label="Course outline">
          <p className="lesson-side__title">Course outline</p>
          <ModuleList course={course} state={state} current={current} linkBase={base} />
        </aside>
        <main id="main" tabIndex={-1} className="lesson-main">
          {children}
        </main>
      </div>
      <Modal open={outline} onClose={() => setOutline(false)} label="Course outline" side="left" className="drawer">
        <div className="menu-panel__head">
          <h2 className="drawer__title">Course outline</h2>
          <button type="button" className="icon-btn" aria-label="Close outline" onClick={() => setOutline(false)}><Icon name="x" size={24} /></button>
        </div>
        <ModuleList course={course} state={state} current={current} linkBase={base} />
      </Modal>
      <RouteEffects />
    </div>
  );
}
