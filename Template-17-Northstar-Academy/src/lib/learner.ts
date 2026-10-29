import type { Course } from '../config/types';
import { courses as allCourses } from '../config';
import { learning } from '../config/learning';
import { site } from '../config/site';
import { courseProgress, emptyState, quizKey, scoreQuiz, type LearnerState, type QuizRecord } from './progress';

export const STORAGE_KEY = `${site.storagePrefix}:learner:v1`;

const byslug = (list: Course[]) => new Map(list.map((c) => [c.slug, c]));

/** Marks / clears `completedAt` so it always reflects whether the course is genuinely complete. */
function syncCompletion(state: LearnerState, course: Course, now: string): LearnerState {
  const e = state.enrollments[course.slug];
  if (!e) return state;
  const complete = courseProgress(course, state).complete;
  if (complete && !e.completedAt) return { ...state, enrollments: { ...state.enrollments, [course.slug]: { ...e, completedAt: now } } };
  if (!complete && e.completedAt) {
    const { completedAt: _drop, ...rest } = e;
    return { ...state, enrollments: { ...state.enrollments, [course.slug]: rest } };
  }
  return state;
}

function logActivity(state: LearnerState, minutes: number, now: string): LearnerState {
  const date = now.slice(0, 10);
  const activity = [...state.activity];
  const i = activity.findIndex((a) => a.date === date);
  if (i >= 0) activity[i] = { date, minutes: activity[i].minutes + minutes };
  else activity.push({ date, minutes });
  return { ...state, activity: activity.slice(-60) };
}

export function enroll(state: LearnerState, slug: string, now = new Date().toISOString()): LearnerState {
  if (state.enrollments[slug]) return state;
  return { ...state, enrollments: { ...state.enrollments, [slug]: { enrolledAt: now, lessonsDone: [] } } };
}

export function unenroll(state: LearnerState, slug: string): LearnerState {
  if (!state.enrollments[slug]) return state;
  const enrollments = { ...state.enrollments };
  delete enrollments[slug];
  const quizzes = Object.fromEntries(Object.entries(state.quizzes).filter(([k]) => !k.startsWith(`${slug}:`)));
  return { ...state, enrollments, quizzes };
}

export function setLesson(state: LearnerState, course: Course, lessonId: string, done: boolean, now = new Date().toISOString()): LearnerState {
  const e = state.enrollments[course.slug];
  const lesson = course.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  if (!e || !lesson) return state;
  const has = e.lessonsDone.includes(lessonId);
  if (done === has) return state;
  const lessonsDone = done ? [...e.lessonsDone, lessonId] : e.lessonsDone.filter((id) => id !== lessonId);
  let next: LearnerState = { ...state, enrollments: { ...state.enrollments, [course.slug]: { ...e, lessonsDone, lastAt: now } } };
  if (done) next = logActivity(next, lesson.minutes, now);
  return syncCompletion(next, course, now);
}

export function visit(state: LearnerState, slug: string, key: string): LearnerState {
  const e = state.enrollments[slug];
  if (!e || e.last === key) return state;
  return { ...state, enrollments: { ...state.enrollments, [slug]: { ...e, last: key, lastAt: new Date().toISOString() } } };
}

export function submitQuiz(state: LearnerState, course: Course, quizId: string, answers: Record<string, number>, now = new Date().toISOString()): { state: LearnerState; record?: QuizRecord } {
  const quiz = course.modules.find((m) => m.quiz.id === quizId)?.quiz;
  if (!quiz || !state.enrollments[course.slug]) return { state };
  const result = scoreQuiz(quiz, answers);
  const key = quizKey(course.slug, quizId);
  const prev = state.quizzes[key];
  const record: QuizRecord = {
    attempts: (prev?.attempts ?? 0) + 1,
    best: Math.max(prev?.best ?? 0, result.percent),
    last: result.percent,
    // Once passed, a later failed retry does not un-pass the quiz.
    passed: (prev?.passed ?? false) || result.passed,
    answers,
    updatedAt: now,
  };
  const e = state.enrollments[course.slug];
  const next: LearnerState = { ...state, quizzes: { ...state.quizzes, [key]: record }, enrollments: { ...state.enrollments, [course.slug]: { ...e, lastAt: now } } };
  return { state: syncCompletion(logActivity(next, 3, now), course, now), record };
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
export const toggleCourseBookmark = (s: LearnerState, slug: string): LearnerState => ({ ...s, bookmarkedCourses: toggle(s.bookmarkedCourses, slug) });
export const toggleLessonBookmark = (s: LearnerState, slug: string, lessonId: string): LearnerState => ({ ...s, bookmarkedLessons: toggle(s.bookmarkedLessons, `${slug}:${lessonId}`) });

/** Builds demonstration progress from `learning.sampleEnrollments`. */
export function sampleState(now = new Date()): LearnerState {
  let state = emptyState();
  const lookup = byslug(allCourses);
  learning.sampleEnrollments.forEach((plan, planIndex) => {
    const course = lookup.get(plan.slug);
    if (!course) return;
    const at = new Date(now.getTime() - (planIndex + 1) * 86_400_000).toISOString();
    state = enroll(state, course.slug, at);
    const lessons = course.modules.flatMap((m) => m.lessons);
    lessons.slice(0, plan.completeLessons).forEach((l) => (state = setLesson(state, course, l.id, true, at)));
    course.modules.slice(0, plan.passQuizzes).forEach((m) => {
      const answers = Object.fromEntries(m.quiz.questions.map((q) => [q.id, q.correct]));
      state = submitQuiz(state, course, m.quiz.id, answers, at).state;
    });
  });
  if (state.bookmarkedCourses.length === 0) state = { ...state, bookmarkedCourses: ['practical-prompt-craft'] };
  return state;
}

/** Defensive loader: accepts only well-formed data about courses/lessons/quizzes that exist right now. */
export function sanitize(raw: unknown, list: Course[] = allCourses): LearnerState {
  const state = emptyState();
  if (!raw || typeof raw !== 'object') return state;
  const r = raw as Partial<Record<keyof LearnerState, unknown>>;
  const lookup = byslug(list);
  const isStr = (v: unknown): v is string => typeof v === 'string';
  const ts = (v: unknown) => (isStr(v) && !Number.isNaN(Date.parse(v)) ? v : new Date(0).toISOString());

  if (r.enrollments && typeof r.enrollments === 'object') {
    for (const [slug, val] of Object.entries(r.enrollments as Record<string, unknown>)) {
      const course = lookup.get(slug);
      if (!course || !val || typeof val !== 'object') continue;
      const v = val as Record<string, unknown>;
      const valid = new Set(course.modules.flatMap((m) => m.lessons.map((l) => l.id)));
      const lessonsDone = Array.isArray(v.lessonsDone) ? [...new Set(v.lessonsDone.filter(isStr).filter((id) => valid.has(id)))] : [];
      state.enrollments[slug] = { enrolledAt: ts(v.enrolledAt), lessonsDone, ...(isStr(v.last) ? { last: v.last } : {}), ...(isStr(v.lastAt) ? { lastAt: ts(v.lastAt) } : {}) };
    }
  }
  if (r.quizzes && typeof r.quizzes === 'object') {
    for (const [key, val] of Object.entries(r.quizzes as Record<string, unknown>)) {
      const [slug, quizId] = key.split(':');
      const course = lookup.get(slug);
      const quiz = course?.modules.find((m) => m.quiz.id === quizId)?.quiz;
      if (!course || !quiz || !state.enrollments[slug] || !val || typeof val !== 'object') continue;
      const v = val as Record<string, unknown>;
      const num = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : 0);
      const answers: Record<string, number> = {};
      if (v.answers && typeof v.answers === 'object') {
        for (const q of quiz.questions) {
          const a = (v.answers as Record<string, unknown>)[q.id];
          if (typeof a === 'number' && Number.isInteger(a)) answers[q.id] = a;
        }
      }
      // `passed` is re-derived from the stored best score rather than trusted blindly.
      const best = num(v.best);
      state.quizzes[key] = {
        attempts: Math.max(1, Math.round(typeof v.attempts === 'number' ? v.attempts : 1)),
        best,
        last: num(v.last),
        passed: best >= (quiz.passMark ?? learning.defaultPassMark) && v.passed === true,
        answers,
        updatedAt: ts(v.updatedAt),
      };
    }
  }
  const lessonKeys = new Set(list.flatMap((c) => c.modules.flatMap((m) => m.lessons.map((l) => `${c.slug}:${l.id}`))));
  state.bookmarkedCourses = Array.isArray(r.bookmarkedCourses) ? [...new Set(r.bookmarkedCourses.filter(isStr).filter((s) => lookup.has(s)))] : [];
  state.bookmarkedLessons = Array.isArray(r.bookmarkedLessons) ? [...new Set(r.bookmarkedLessons.filter(isStr).filter((s) => lessonKeys.has(s)))] : [];
  if (Array.isArray(r.activity)) {
    state.activity = r.activity
      .filter((a): a is { date: string; minutes: number } => !!a && typeof a === 'object' && isStr((a as { date: unknown }).date) && typeof (a as { minutes: unknown }).minutes === 'number')
      .map((a) => ({ date: a.date.slice(0, 10), minutes: Math.max(0, Math.round(a.minutes)) }))
      .slice(-60);
  }
  // Recompute completion stamps from real progress.
  for (const slug of Object.keys(state.enrollments)) {
    const course = lookup.get(slug)!;
    const prev = (r.enrollments as Record<string, { completedAt?: unknown }>)[slug]?.completedAt;
    const complete = courseProgress(course, state).complete;
    if (complete) state.enrollments[slug].completedAt = ts(prev);
  }
  return state;
}

export function loadState(): LearnerState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : emptyState();
  } catch {
    return emptyState();
  }
}

export function saveState(state: LearnerState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}
