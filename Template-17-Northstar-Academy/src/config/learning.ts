/** Learning engine rules and demo-learner settings. */
export const learning = {
  /** Default quiz pass mark (%), used when a quiz has no `passMark`. */
  defaultPassMark: 70,
  /** Show correct answers + explanations after a quiz attempt. */
  revealAnswers: true,
  /** Placeholder learner shown on the demo dashboard. There is no real account. */
  learner: { name: 'Sam Rivera', initials: 'SR', goal: 'Build a portfolio-ready skill set in 90 days' },
  /** Hours-per-week target displayed on the dashboard (display only). */
  weeklyGoalMinutes: 120,
  /** Course slugs enrolled by the "Load sample progress" action. */
  sampleEnrollments: [
    { slug: 'web-foundations', completeLessons: 4, passQuizzes: 1 },
    { slug: 'spreadsheet-analytics', completeLessons: 2, passQuizzes: 0 },
    { slug: 'visual-hierarchy', completeLessons: 6, passQuizzes: 2 },
  ],
  certificate: {
    stamp: 'DEMONSTRATION — NOT ACCREDITED',
    note: 'This preview certificate is part of a template demonstration. It is not issued by an accredited body and has no external recognition.',
  },
};
