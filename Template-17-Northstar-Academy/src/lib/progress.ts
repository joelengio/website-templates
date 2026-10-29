import type { Course, Lesson, Module, Quiz } from '../config/types';
import { learning } from '../config/learning';
import { scoreQuiz } from './quiz';

/** Result of a graded quiz attempt, as stored per learner. */
export interface QuizRecord {
  attempts: number;
  /** Best percentage achieved (0–100). */
  best: number;
  /** Percentage of the latest attempt. */
  last: number;
  passed: boolean;
  /** Answers of the latest attempt: question id → chosen option index. */
  answers: Record<string, number>;
  updatedAt: string;
}

export interface CourseEnrollment {
  enrolledAt: string;
  /** Last lesson or quiz opened ("lesson:m1-l2" or "quiz:m1-quiz"). */
  last?: string;
  /** ISO time of the most recent learning activity in this course. */
  lastAt?: string;
  completedAt?: string;
  lessonsDone: string[];
}

export interface LearnerState {
  version: 1;
  enrollments: Record<string, CourseEnrollment>;
  /** Keyed `${courseSlug}:${quizId}`. */
  quizzes: Record<string, QuizRecord>;
  bookmarkedCourses: string[];
  /** Entries `${courseSlug}:${lessonId}`. */
  bookmarkedLessons: string[];
  activity: { date: string; minutes: number }[];
}

export const emptyState = (): LearnerState => ({
  version: 1,
  enrollments: {},
  quizzes: {},
  bookmarkedCourses: [],
  bookmarkedLessons: [],
  activity: [],
});

export const quizKey = (courseSlug: string, quizId: string) => `${courseSlug}:${quizId}`;
export const passMarkFor = (quiz: Quiz) => quiz.passMark ?? learning.defaultPassMark;

export type StepRef = { kind: 'lesson'; module: Module; lesson: Lesson } | { kind: 'quiz'; module: Module; quiz: Quiz };

/** The ordered list of required steps in a course: each module's lessons, then its quiz. */
export function courseSteps(course: Course): StepRef[] {
  return course.modules.flatMap((module): StepRef[] => [
    ...module.lessons.map((lesson): StepRef => ({ kind: 'lesson', module, lesson })),
    { kind: 'quiz', module, quiz: module.quiz },
  ]);
}

export const stepId = (s: StepRef) => (s.kind === 'lesson' ? `lesson:${s.lesson.id}` : `quiz:${s.quiz.id}`);
export const stepTo = (slug: string, s: StepRef) =>
  s.kind === 'lesson' ? `/learn/${slug}/lesson/${s.lesson.id}` : `/learn/${slug}/quiz/${s.quiz.id}`;

export interface CourseProgress {
  totalLessons: number;
  doneLessons: number;
  totalQuizzes: number;
  passedQuizzes: number;
  totalSteps: number;
  doneSteps: number;
  /** Whole-number percentage 0–100. 100 only when every lesson is complete AND every quiz is passed. */
  percent: number;
  complete: boolean;
  /** First incomplete step in curriculum order; undefined when finished. */
  next?: StepRef;
}

/** Pure progress calculation. Unknown lesson ids stored in state are ignored. */
export function courseProgress(course: Course, state: LearnerState): CourseProgress {
  const enrollment = state.enrollments[course.slug];
  const done = new Set(enrollment?.lessonsDone ?? []);
  const steps = courseSteps(course);
  let doneLessons = 0;
  let passedQuizzes = 0;
  let next: StepRef | undefined;
  for (const step of steps) {
    const ok =
      step.kind === 'lesson'
        ? done.has(step.lesson.id)
        : state.quizzes[quizKey(course.slug, step.quiz.id)]?.passed === true;
    if (ok) {
      if (step.kind === 'lesson') doneLessons += 1;
      else passedQuizzes += 1;
    } else if (!next) next = step;
  }
  const totalLessons = steps.filter((s) => s.kind === 'lesson').length;
  const totalQuizzes = steps.length - totalLessons;
  const totalSteps = steps.length;
  const doneSteps = doneLessons + passedQuizzes;
  const complete = totalSteps > 0 && doneSteps === totalSteps;
  // Never round up to 100 unless truly complete, and never show 0 once something is done.
  let percent = totalSteps === 0 ? 0 : Math.round((doneSteps / totalSteps) * 100);
  if (!complete && percent === 100) percent = 99;
  if (doneSteps > 0 && percent === 0) percent = 1;
  return { totalLessons, doneLessons, totalQuizzes, passedQuizzes, totalSteps, doneSteps, percent, complete, next };
}

export function isEnrolled(state: LearnerState, slug: string) {
  return slug in state.enrollments;
}

/**
 * Where "Continue learning" goes: the last-opened step if it is still incomplete, otherwise the first incomplete step.
 * Returns undefined once the course is complete.
 */
export function resumeStep(course: Course, state: LearnerState): StepRef | undefined {
  const progress = courseProgress(course, state);
  if (progress.complete) return undefined;
  const last = state.enrollments[course.slug]?.last;
  if (last) {
    const done = new Set(state.enrollments[course.slug]?.lessonsDone ?? []);
    const step = courseSteps(course).find((s) => stepId(s) === last);
    if (step) {
      const finished = step.kind === 'lesson' ? done.has(step.lesson.id) : state.quizzes[quizKey(course.slug, step.quiz.id)]?.passed === true;
      if (!finished) return step;
    }
  }
  return progress.next;
}

export interface PathProgress {
  totalCourses: number;
  completedCourses: number;
  percent: number;
  /** Mean of course percentages, so partial progress counts. */
  next?: Course;
  hours: number;
}

export function pathProgress(courses: Course[], state: LearnerState): PathProgress {
  const progresses = courses.map((c) => courseProgress(c, state));
  const completedCourses = progresses.filter((p) => p.complete).length;
  const mean = progresses.length ? progresses.reduce((a, p) => a + p.percent, 0) / progresses.length : 0;
  let percent = Math.round(mean);
  if (completedCourses < courses.length && percent === 100) percent = 99;
  const nextIndex = progresses.findIndex((p) => !p.complete);
  return {
    totalCourses: courses.length,
    completedCourses,
    percent,
    next: nextIndex >= 0 ? courses[nextIndex] : undefined,
    hours: courses.reduce((a, c) => a + c.hours, 0),
  };
}

export const lessonMinutes = (course: Course) => course.modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.minutes, 0), 0);

export { scoreQuiz };
