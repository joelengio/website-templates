import type { Quiz } from '../config/types';
import { learning } from '../config/learning';

export interface QuizResult {
  correct: number;
  total: number;
  /** Whole-number percentage, 0–100. */
  percent: number;
  passMark: number;
  passed: boolean;
  /** Per-question outcome in quiz order. */
  details: { id: string; chosen: number | null; correct: boolean }[];
  /** Question ids that were left unanswered (counted as incorrect). */
  unanswered: string[];
}

/**
 * Scores a quiz. Unanswered, out-of-range or non-integer answers count as incorrect.
 * A quiz with no questions can never be passed (0%), so an empty quiz cannot silently complete a course.
 * Passing requires percent >= passMark; the percentage is rounded to a whole number, but pass/fail is decided on the exact ratio
 * so that 66.7% can never be rounded up past a 67% mark.
 */
export function scoreQuiz(quiz: Quiz, answers: Record<string, number | undefined>): QuizResult {
  const total = quiz.questions.length;
  const passMark = quiz.passMark ?? learning.defaultPassMark;
  const details = quiz.questions.map((q) => {
    const chosen = answers[q.id];
    const valid = typeof chosen === 'number' && Number.isInteger(chosen) && chosen >= 0 && chosen < q.options.length;
    return { id: q.id, chosen: valid ? (chosen as number) : null, correct: valid && chosen === q.correct };
  });
  const correct = details.filter((d) => d.correct).length;
  const exact = total === 0 ? 0 : (correct / total) * 100;
  return {
    correct,
    total,
    percent: Math.round(exact),
    passMark,
    passed: total > 0 && exact >= passMark,
    details,
    unanswered: details.filter((d) => d.chosen === null).map((d) => d.id),
  };
}

export function resultMessage(r: QuizResult): { tone: 'pass' | 'near' | 'retry'; title: string; text: string } {
  if (r.passed) {
    return r.percent === 100
      ? { tone: 'pass', title: 'Perfect score', text: 'Every answer correct — nicely done.' }
      : { tone: 'pass', title: 'You passed', text: `You scored ${r.percent}% (pass mark ${r.passMark}%). Review the explanations to firm up the rest.` };
  }
  if (r.percent >= r.passMark - 20) {
    return { tone: 'near', title: 'Almost there', text: `You scored ${r.percent}%. You need ${r.passMark}% to pass — review the explanations and try again.` };
  }
  return { tone: 'retry', title: 'Keep going', text: `You scored ${r.percent}%. Revisit the lessons, then retry — you can try as many times as you like.` };
}
