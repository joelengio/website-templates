import { courses } from '../config';
import { passMarkFor, quizKey, type LearnerState } from '../lib/progress';

/** Quiz results: one horizontal bar per attempted quiz, with its pass mark drawn as a tick. Includes a text table alternative. */
export function QuizScoreChart({ state }: { state: LearnerState }) {
  const rows = courses.flatMap((c) =>
    c.modules.flatMap((m) => {
      const r = state.quizzes[quizKey(c.slug, m.quiz.id)];
      return r ? [{ key: `${c.slug}:${m.quiz.id}`, course: c.title, quiz: m.quiz.title, best: r.best, last: r.last, pass: passMarkFor(m.quiz), passed: r.passed, attempts: r.attempts }] : [];
    }),
  );
  if (!rows.length) return <p className="muted">No quizzes attempted yet. Finish a module to take its quiz.</p>;
  return (
    <div className="chart">
      <ul className="bars" aria-label="Best quiz scores">
        {rows.map((r) => (
          <li key={r.key}>
            <div className="bars__label">
              <span>{r.quiz}</span>
              <small>{r.course}</small>
            </div>
            <div className="bars__track" aria-hidden="true">
              <span className={`bars__fill${r.passed ? ' is-pass' : ' is-fail'}`} style={{ width: `${r.best}%` }} />
              <span className="bars__mark" style={{ left: `${r.pass}%` }} />
            </div>
            <div className="bars__value"><strong>{r.best}%</strong><small>{r.passed ? 'Passed' : `Pass ${r.pass}%`}</small></div>
          </li>
        ))}
      </ul>
      <div className="sr-only"><table>
        <caption>Quiz results</caption>
        <thead><tr><th scope="col">Quiz</th><th scope="col">Best</th><th scope="col">Latest</th><th scope="col">Attempts</th><th scope="col">Status</th></tr></thead>
        <tbody>
          {rows.map((r) => <tr key={r.key}><th scope="row">{r.course}: {r.quiz}</th><td>{r.best}%</td><td>{r.last}%</td><td>{r.attempts}</td><td>{r.passed ? 'Passed' : 'Not passed'}</td></tr>)}
        </tbody>
      </table></div>
    </div>
  );
}

/** Minutes of learning per day for the last 7 days. */
export function ActivityChart({ state, goalPerDay, today = new Date() }: { state: LearnerState; goalPerDay: number; today?: Date }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() - (6 - i) * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    return { key, label: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }), minutes: state.activity.find((a) => a.date === key)?.minutes ?? 0 };
  });
  const max = Math.max(goalPerDay, ...days.map((d) => d.minutes), 10);
  const total = days.reduce((a, d) => a + d.minutes, 0);
  return (
    <figure className="chart chart--activity">
      <div className="columns" role="img" aria-label={`Learning minutes over the last 7 days: ${days.map((d) => `${d.label} ${d.minutes}`).join(', ')}. Total ${total} minutes.`}>
        {days.map((d) => (
          <div key={d.key} className="columns__col">
            <span className="columns__val" aria-hidden="true">{d.minutes || ''}</span>
            <span className="columns__bar" style={{ height: `${Math.max(d.minutes ? 6 : 2, (d.minutes / max) * 100)}%` }} data-active={d.minutes > 0} />
            <span className="columns__lbl" aria-hidden="true">{d.label}</span>
          </div>
        ))}
        <span className="columns__goal" style={{ bottom: `calc(${(goalPerDay / max) * 100}% * .72 + 22px)` }} aria-hidden="true"><i>daily goal</i></span>
      </div>
      <figcaption>{total} minutes in the last 7 days · daily goal ≈ {goalPerDay} min</figcaption>
    </figure>
  );
}
