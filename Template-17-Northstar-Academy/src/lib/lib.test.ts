import { describe, expect, it } from 'vitest';
import { courses, getCourse, paths, plans, annualSavingPercent } from '../config';
import type { Quiz } from '../config/types';
import { courseProgress, emptyState, pathProgress, quizKey, resumeStep, stepId, courseSteps } from './progress';
import { resultMessage, scoreQuiz } from './quiz';
import * as L from './learner';
import { defaultFilters, filterCourses, filtersFromParams, filtersToParams, matchesQuery, searchArticles } from './filters';
import { validateContact } from './validation';
import { visibleSections } from './sections';
import { themeVariables } from './theme';
import { articles } from '../config';

const course = getCourse('web-foundations')!; // 3 modules x 3 lessons + 3 quizzes = 12 steps
const allLessons = course.modules.flatMap((m) => m.lessons);
const perfect = (quizId: string) => Object.fromEntries(course.modules.find((m) => m.quiz.id === quizId)!.quiz.questions.map((q) => [q.id, q.correct]));

const mkQuiz = (n: number, passMark?: number): Quiz => ({
  id: 'q', title: 'q', passMark,
  questions: Array.from({ length: n }, (_, i) => ({ id: `q${i}`, prompt: 'p', options: ['a', 'b', 'c', 'd'], correct: 1, explanation: 'e' })),
});

describe('quiz scoring', () => {
  it('scores all correct, all wrong and partial', () => {
    const q = mkQuiz(4);
    expect(scoreQuiz(q, { q0: 1, q1: 1, q2: 1, q3: 1 })).toMatchObject({ correct: 4, percent: 100, passed: true });
    expect(scoreQuiz(q, { q0: 0, q1: 0, q2: 0, q3: 0 })).toMatchObject({ correct: 0, percent: 0, passed: false });
    expect(scoreQuiz(q, { q0: 1, q1: 1, q2: 0, q3: 0 })).toMatchObject({ correct: 2, percent: 50, passed: false });
  });
  it('passes exactly at the pass mark and fails just below', () => {
    expect(scoreQuiz(mkQuiz(10, 70), Object.fromEntries(Array.from({ length: 7 }, (_, i) => [`q${i}`, 1]))).passed).toBe(true);
    expect(scoreQuiz(mkQuiz(10, 70), Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`q${i}`, 1]))).passed).toBe(false);
  });
  it('does not let rounding push a failing score over the mark', () => {
    // 2/3 = 66.67% rounds to 67 but must fail a 67% mark
    const r = scoreQuiz(mkQuiz(3, 67), { q0: 1, q1: 1 });
    expect(r.percent).toBe(67);
    expect(r.passed).toBe(false);
  });
  it('treats unanswered, out-of-range and fractional answers as incorrect', () => {
    const r = scoreQuiz(mkQuiz(3), { q0: 1, q1: 9, q2: 1.5 });
    expect(r.correct).toBe(1);
    expect(r.unanswered).toEqual(['q1', 'q2']);
  });
  it('uses the default pass mark when none is set and supports 0 and 100 marks', () => {
    expect(scoreQuiz(mkQuiz(2), { q0: 1, q1: 1 }).passMark).toBe(70);
    expect(scoreQuiz(mkQuiz(2, 100), { q0: 1 }).passed).toBe(false);
    expect(scoreQuiz(mkQuiz(2, 0), {}).passed).toBe(true);
  });
  it('an empty quiz can never be passed', () => {
    expect(scoreQuiz(mkQuiz(0, 0), {})).toMatchObject({ total: 0, percent: 0, passed: false });
  });
  it('gives sensible feedback tiers', () => {
    expect(resultMessage(scoreQuiz(mkQuiz(2), { q0: 1, q1: 1 })).title).toBe('Perfect score');
    expect(resultMessage(scoreQuiz(mkQuiz(10), Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`q${i}`, 1])))).tone).toBe('near');
    expect(resultMessage(scoreQuiz(mkQuiz(10), {})).tone).toBe('retry');
  });
});

describe('course progress', () => {
  it('starts at 0% and counts lessons and quizzes as equal steps', () => {
    let s = L.enroll(emptyState(), course.slug);
    expect(courseProgress(course, s)).toMatchObject({ percent: 0, totalSteps: 12, doneSteps: 0, complete: false });
    s = L.setLesson(s, course, 'm1-l1', true);
    expect(courseProgress(course, s)).toMatchObject({ doneLessons: 1, percent: 8 });
    s = L.setLesson(s, course, 'm1-l2', true);
    s = L.setLesson(s, course, 'm1-l3', true);
    expect(courseProgress(course, s).percent).toBe(25);
  });
  it('is not complete when every lesson is done but a quiz is not passed', () => {
    let s = L.enroll(emptyState(), course.slug);
    allLessons.forEach((l) => (s = L.setLesson(s, course, l.id, true)));
    const p = courseProgress(course, s);
    expect(p.doneLessons).toBe(9);
    expect(p.complete).toBe(false);
    expect(p.percent).toBeLessThan(100);
    expect(s.enrollments[course.slug].completedAt).toBeUndefined();
  });
  it('is not complete when quizzes are passed but a lesson is missing', () => {
    let s = L.enroll(emptyState(), course.slug);
    course.modules.forEach((m) => (s = L.submitQuiz(s, course, m.quiz.id, perfect(m.quiz.id)).state));
    expect(courseProgress(course, s).complete).toBe(false);
  });
  it('completes only when all lessons and quizzes are done, and un-completes if a lesson is unchecked', () => {
    let s = L.enroll(emptyState(), course.slug);
    allLessons.forEach((l) => (s = L.setLesson(s, course, l.id, true)));
    course.modules.forEach((m) => (s = L.submitQuiz(s, course, m.quiz.id, perfect(m.quiz.id)).state));
    expect(courseProgress(course, s)).toMatchObject({ percent: 100, complete: true, next: undefined });
    expect(s.enrollments[course.slug].completedAt).toBeTruthy();
    s = L.setLesson(s, course, 'm2-l2', false);
    expect(courseProgress(course, s).complete).toBe(false);
    expect(courseProgress(course, s).percent).toBe(92);
    expect(s.enrollments[course.slug].completedAt).toBeUndefined();
  });
  it('never shows 100% before completion and never 0% after progress', () => {
    const one = { ...course, modules: [{ ...course.modules[0], lessons: Array.from({ length: 300 }, (_, i) => ({ ...course.modules[0].lessons[0], id: `x${i}` })) }] };
    let s = L.enroll(emptyState(), one.slug);
    s = { ...s, enrollments: { [one.slug]: { ...s.enrollments[one.slug], lessonsDone: one.modules[0].lessons.slice(0, 299).map((l) => l.id).concat('x-unknown') } } };
    expect(courseProgress(one, s).percent).toBe(99);
    s = { ...s, enrollments: { [one.slug]: { ...s.enrollments[one.slug], lessonsDone: ['x0'] } } };
    expect(courseProgress(one, s).percent).toBe(1);
  });
  it('ignores unknown lesson ids and a failed retry never un-passes a quiz', () => {
    let s = L.enroll(emptyState(), course.slug);
    s = { ...s, enrollments: { [course.slug]: { ...s.enrollments[course.slug], lessonsDone: ['nope'] } } };
    expect(courseProgress(course, s).doneLessons).toBe(0);
    s = L.submitQuiz(s, course, 'm1-quiz', perfect('m1-quiz')).state;
    s = L.submitQuiz(s, course, 'm1-quiz', {}).state;
    const rec = s.quizzes[quizKey(course.slug, 'm1-quiz')];
    expect(rec).toMatchObject({ passed: true, best: 100, last: 0, attempts: 2 });
  });
  it('requires enrollment to record progress', () => {
    const s = L.setLesson(emptyState(), course, 'm1-l1', true);
    expect(s.enrollments).toEqual({});
    expect(L.submitQuiz(emptyState(), course, 'm1-quiz', perfect('m1-quiz')).record).toBeUndefined();
  });
  it('resumes at the last visited incomplete step, else the first incomplete step', () => {
    let s = L.enroll(emptyState(), course.slug);
    expect(stepId(resumeStep(course, s)!)).toBe('lesson:m1-l1');
    s = L.setLesson(s, course, 'm1-l1', true);
    expect(stepId(resumeStep(course, s)!)).toBe('lesson:m1-l2');
    s = L.visit(s, course.slug, 'lesson:m2-l1');
    expect(stepId(resumeStep(course, s)!)).toBe('lesson:m2-l1');
    s = L.setLesson(s, course, 'm2-l1', true); // visited step now complete -> fall back to first incomplete
    expect(stepId(resumeStep(course, s)!)).toBe('lesson:m1-l2');
  });
  it('orders steps lesson, lesson, lesson, quiz per module', () => {
    expect(courseSteps(course).map(stepId).slice(0, 5)).toEqual(['lesson:m1-l1', 'lesson:m1-l2', 'lesson:m1-l3', 'quiz:m1-quiz', 'lesson:m2-l1']);
  });
  it('unenrolling removes the course progress and quiz scores', () => {
    let s = L.enroll(emptyState(), course.slug);
    s = L.submitQuiz(s, course, 'm1-quiz', perfect('m1-quiz')).state;
    s = L.unenroll(s, course.slug);
    expect(s.enrollments).toEqual({});
    expect(s.quizzes).toEqual({});
  });
});

describe('learning paths', () => {
  it('references real courses only', () => {
    paths.forEach((p) => p.courseSlugs.forEach((slug) => expect(getCourse(slug), `${p.slug}:${slug}`).toBeTruthy()));
  });
  it('computes path progress from course progress', () => {
    const p = paths[0];
    const list = p.courseSlugs.map((s) => getCourse(s)!);
    let s = emptyState();
    expect(pathProgress(list, s)).toMatchObject({ percent: 0, completedCourses: 0, totalCourses: 3 });
    expect(pathProgress(list, s).next?.slug).toBe(list[0].slug);
    // complete the first course
    const c = list[0];
    s = L.enroll(s, c.slug);
    c.modules.forEach((m) => {
      m.lessons.forEach((l) => (s = L.setLesson(s, c, l.id, true)));
      s = L.submitQuiz(s, c, m.quiz.id, Object.fromEntries(m.quiz.questions.map((q) => [q.id, q.correct]))).state;
    });
    const pp = pathProgress(list, s);
    expect(pp.completedCourses).toBe(1);
    expect(pp.percent).toBe(33);
    expect(pp.next?.slug).toBe(list[1].slug);
  });
  it('handles an empty path', () => {
    expect(pathProgress([], emptyState())).toMatchObject({ percent: 0, totalCourses: 0 });
  });
});

describe('persistence', () => {
  it('round-trips through localStorage', () => {
    let s = L.enroll(emptyState(), course.slug);
    s = L.setLesson(s, course, 'm1-l1', true);
    s = L.toggleCourseBookmark(s, course.slug);
    s = L.toggleLessonBookmark(s, course.slug, 'm1-l1');
    expect(L.saveState(s)).toBe(true);
    const back = L.loadState();
    expect(back.enrollments[course.slug].lessonsDone).toEqual(['m1-l1']);
    expect(back.bookmarkedCourses).toEqual([course.slug]);
    expect(back.bookmarkedLessons).toEqual([`${course.slug}:m1-l1`]);
  });
  it('recovers from corrupt data and strips unknown courses, lessons and quizzes', () => {
    window.localStorage.setItem(L.STORAGE_KEY, '{not json');
    expect(L.loadState()).toEqual(emptyState());
    const dirty = {
      enrollments: { ghost: { enrolledAt: 'x', lessonsDone: ['a'] }, [course.slug]: { enrolledAt: '2026-01-01T00:00:00Z', lessonsDone: ['m1-l1', 'zzz', 'm1-l1'] } },
      quizzes: { [`${course.slug}:m1-quiz`]: { attempts: 2, best: 140, last: -5, passed: true, answers: { 'm1-q1': 1, bogus: 3 } }, 'ghost:q': { best: 100 } },
      bookmarkedCourses: ['ghost', course.slug, 7], bookmarkedLessons: [`${course.slug}:nope`, `${course.slug}:m1-l2`],
    };
    const s = L.sanitize(dirty);
    expect(Object.keys(s.enrollments)).toEqual([course.slug]);
    expect(s.enrollments[course.slug].lessonsDone).toEqual(['m1-l1']);
    expect(s.quizzes[`${course.slug}:m1-quiz`]).toMatchObject({ best: 100, last: 0, answers: { 'm1-q1': 1 } });
    expect(Object.keys(s.quizzes)).toHaveLength(1);
    expect(s.bookmarkedCourses).toEqual([course.slug]);
    expect(s.bookmarkedLessons).toEqual([`${course.slug}:m1-l2`]);
  });
  it('does not trust a stored "passed" flag that contradicts the best score', () => {
    const s = L.sanitize({ enrollments: { [course.slug]: { enrolledAt: '2026-01-01T00:00:00Z', lessonsDone: [] } }, quizzes: { [`${course.slug}:m1-quiz`]: { best: 20, passed: true, attempts: 1 } } });
    expect(s.quizzes[`${course.slug}:m1-quiz`].passed).toBe(false);
  });
  it('reset clears storage', () => {
    L.saveState(L.enroll(emptyState(), course.slug));
    L.clearState();
    expect(window.localStorage.getItem(L.STORAGE_KEY)).toBeNull();
  });
  it('sample progress is consistent: in-progress courses plus one completed course with a certificate', () => {
    const s = L.sampleState();
    expect(Object.keys(s.enrollments).length).toBeGreaterThanOrEqual(3);
    const ps = Object.keys(s.enrollments).map((slug) => courseProgress(getCourse(slug)!, s));
    ps.forEach((p) => expect(p.percent).toBeGreaterThan(0));
    expect(ps.filter((p) => p.complete)).toHaveLength(1);
    expect(ps.filter((p) => !p.complete).length).toBeGreaterThanOrEqual(2);
    expect(s.enrollments['visual-hierarchy'].completedAt).toBeTruthy();
  });
});

describe('course search, filters and sorting', () => {
  it('searches across title, tags, category and instructor, ignoring case and accents', () => {
    expect(filterCourses(courses, { ...defaultFilters, q: 'PYTHON' }).map((c) => c.slug)).toContain('python-first-programs');
    expect(filterCourses(courses, { ...defaultFilters, q: 'sofia' }).length).toBe(2);
    expect(matchesQuery(getCourse('spanish-conversations')!, 'espanol')).toBe(false);
    expect(filterCourses(courses, { ...defaultFilters, q: 'sql analysts' }).map((c) => c.slug)).toEqual(['sql-for-analysts']);
    expect(filterCourses(courses, { ...defaultFilters, q: 'zzzzzz' })).toEqual([]);
  });
  it('combines filters with AND logic', () => {
    const r = filterCourses(courses, { ...defaultFilters, category: 'data', difficulty: 'Beginner', price: 'free' });
    expect(r.map((c) => c.slug)).toEqual(['spreadsheet-analytics']);
    expect(filterCourses(courses, { ...defaultFilters, price: 'free' }).every((c) => c.price === 0)).toBe(true);
    expect(filterCourses(courses, { ...defaultFilters, price: 'paid' }).every((c) => c.price > 0)).toBe(true);
  });
  it('sorts', () => {
    const price = filterCourses(courses, { ...defaultFilters, sort: 'price-asc' }).map((c) => c.price);
    expect(price).toEqual([...price].sort((a, b) => a - b));
    const desc = filterCourses(courses, { ...defaultFilters, sort: 'price-desc' }).map((c) => c.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
    const rating = filterCourses(courses, { ...defaultFilters, sort: 'rating' });
    expect(rating[0].rating).toBe(Math.max(...courses.map((c) => c.rating)));
    expect(filterCourses(courses, { ...defaultFilters, sort: 'title' })[0].title.localeCompare(filterCourses(courses, { ...defaultFilters, sort: 'title' })[1].title)).toBeLessThan(0);
  });
  it('round-trips filters through URL params and ignores junk', () => {
    const f = { ...defaultFilters, q: 'sql', category: 'data', difficulty: 'Intermediate' as const, price: 'paid' as const, sort: 'rating' as const };
    expect(filtersFromParams(filtersToParams(f))).toEqual(f);
    expect(filtersFromParams(new URLSearchParams('level=Expert&price=cheap&sort=wat'))).toEqual(defaultFilters);
  });
  it('searches and filters articles', () => {
    expect(searchArticles(articles, 'quizzes', '').length).toBeGreaterThan(0);
    expect(searchArticles(articles, '', 'Careers').every((a) => a.category === 'Careers')).toBe(true);
    expect(searchArticles(articles, 'nonexistentterm', '')).toEqual([]);
  });
});

describe('pricing', () => {
  it('annual pricing is never higher than monthly and savings are whole percentages', () => {
    plans.forEach((p) => {
      expect(p.annualMonthly).toBeLessThanOrEqual(p.monthly);
      expect(Number.isInteger(annualSavingPercent(p))).toBe(true);
    });
    expect(annualSavingPercent(plans.find((p) => p.id === 'learner')!)).toBe(21);
    expect(annualSavingPercent(plans[0])).toBe(0);
  });
});

describe('forms, sections, theme', () => {
  it('validates the contact form', () => {
    const ok = { name: 'Sam', email: 'sam@example.com', topic: 'Courses', message: 'Hello there, friend', consent: true };
    expect(validateContact(ok)).toEqual({});
    expect(Object.keys(validateContact({ name: '', email: 'bad', topic: '', message: 'x', consent: false })).sort()).toEqual(['consent', 'email', 'message', 'name', 'topic']);
    expect(validateContact({ ...ok, email: 'a@b' }).email).toBeTruthy();
  });
  it('hides and reorders home sections from config', () => {
    const list = [{ id: 'cta' as const, visible: true }, { id: 'hero' as const, visible: false }, { id: 'plans' as const, visible: true }];
    expect(visibleSections(list)).toEqual(['cta', 'plans']);
  });
  it('exposes theme tokens as CSS variables', () => {
    const v = themeVariables();
    expect(v['--c-cobalt']).toBe('#2748e8');
    expect(v['--font-display']).toContain('Fraunces');
  });
});
