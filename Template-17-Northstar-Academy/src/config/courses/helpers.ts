import type { Course, Difficulty, Lesson, Module, Question, Quiz } from '../types';

/**
 * Compact authoring helpers. A lesson is a tuple:
 *   [title, minutes, summary, bodyParagraphs[], keyPoints[], practicePrompt]
 * A question is a tuple:
 *   [prompt, [optionA, optionB, optionC, optionD], correctIndex, explanation]
 * Module/lesson/quiz/question ids are generated from position, so authors never maintain ids by hand.
 */
export type LessonTuple = [title: string, minutes: number, summary: string, body: string[], keyPoints: string[], practice: string];
export type QuestionTuple = [prompt: string, options: string[], correct: number, explanation: string];

export interface ModuleInput {
  title: string;
  summary: string;
  lessons: LessonTuple[];
  quiz: { title: string; passMark?: number; questions: QuestionTuple[] };
}

export interface CourseInput extends Omit<Course, 'modules'> {
  modules: ModuleInput[];
  /** Optional demonstration clip attached to the first lesson. */
  clip?: Lesson['media'];
}

export function buildCourse(input: CourseInput): Course {
  const { modules, clip, ...rest } = input;
  return {
    ...rest,
    modules: modules.map((m, mi): Module => {
      const mid = `m${mi + 1}`;
      const lessons = m.lessons.map(([title, minutes, summary, body, keyPoints, practice], li): Lesson => ({
        id: `${mid}-l${li + 1}`,
        title,
        minutes,
        summary,
        body,
        keyPoints,
        practice,
        ...(mi === 0 && li === 0 && clip ? { media: clip } : {}),
      }));
      const quiz: Quiz = {
        id: `${mid}-quiz`,
        title: m.quiz.title,
        ...(m.quiz.passMark !== undefined ? { passMark: m.quiz.passMark } : {}),
        questions: m.quiz.questions.map(([prompt, options, correct, explanation], qi): Question => ({
          id: `${mid}-q${qi + 1}`,
          prompt,
          options,
          correct,
          explanation,
        })),
      };
      return { id: mid, title: m.title, summary: m.summary, lessons, quiz };
    }),
  };
}

export const level = (d: Difficulty) => d;
