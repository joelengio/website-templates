import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCourse } from '../config';
import { emptyState, type LearnerState, type QuizRecord } from '../lib/progress';
import * as L from '../lib/learner';

interface LearnerApi {
  state: LearnerState;
  /** False when localStorage could not be written (private mode etc.). */
  persisted: boolean;
  enroll: (slug: string) => void;
  unenroll: (slug: string) => void;
  setLesson: (slug: string, lessonId: string, done: boolean) => void;
  visit: (slug: string, key: string) => void;
  submitQuiz: (slug: string, quizId: string, answers: Record<string, number>) => QuizRecord | undefined;
  toggleCourseBookmark: (slug: string) => void;
  toggleLessonBookmark: (slug: string, lessonId: string) => void;
  loadSample: () => void;
  reset: () => void;
}

const Ctx = createContext<LearnerApi | null>(null);

export function LearnerProvider({ children, initial }: { children: ReactNode; initial?: LearnerState }) {
  const [state, setState] = useState<LearnerState>(() => initial ?? L.loadState());
  const [persisted, setPersisted] = useState(true);

  useEffect(() => {
    setPersisted(L.saveState(state));
  }, [state]);

  // Keep several tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === L.STORAGE_KEY) setState(L.loadState());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const apply = useCallback((fn: (s: LearnerState) => LearnerState) => setState((s) => fn(s)), []);

  const api = useMemo<LearnerApi>(
    () => ({
      state,
      persisted,
      enroll: (slug) => apply((s) => L.enroll(s, slug)),
      unenroll: (slug) => apply((s) => L.unenroll(s, slug)),
      setLesson: (slug, id, done) => {
        const course = getCourse(slug);
        if (course) apply((s) => L.setLesson(s, course, id, done));
      },
      visit: (slug, key) => apply((s) => L.visit(s, slug, key)),
      submitQuiz: (slug, quizId, answers) => {
        const course = getCourse(slug);
        if (!course) return undefined;
        const out = L.submitQuiz(state, course, quizId, answers);
        setState(out.state);
        return out.record;
      },
      toggleCourseBookmark: (slug) => apply((s) => L.toggleCourseBookmark(s, slug)),
      toggleLessonBookmark: (slug, id) => apply((s) => L.toggleLessonBookmark(s, slug, id)),
      loadSample: () => setState(L.sampleState()),
      reset: () => {
        L.clearState();
        setState(emptyState());
      },
    }),
    [state, persisted, apply],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useLearner(): LearnerApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLearner must be used inside <LearnerProvider>');
  return v;
}
