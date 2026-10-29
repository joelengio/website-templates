import { Link, useNavigate } from 'react-router-dom';
import { getCourse, paths } from '../config';
import { courseProgress, pathProgress, stepTo } from '../lib/progress';
import { priceLabel } from '../lib/format';
import { useLearner } from '../hooks/useLearner';
import { useSeo } from '../hooks/useSeo';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { PageHero, ProgressBar, ProgressRing, Section } from '../components/ui';

export default function Paths() {
  useSeo({ title: 'Learning paths', description: 'Themed learning journeys that combine multiple Northstar Academy demonstration courses.', path: '/paths' });
  const { state, enroll } = useLearner();
  const navigate = useNavigate();

  return (
    <>
      <PageHero eyebrow="Learning paths" title="Courses, in the right order" intro="Each path links three courses into a journey with a clear outcome. Progress is calculated from your demo course progress." />
      <Section>
        <div className="paths">
          {paths.map((p) => {
            const list = p.courseSlugs.map((s) => getCourse(s)).filter((c): c is NonNullable<typeof c> => !!c);
            const prog = pathProgress(list, state);
            const started = list.some((c) => c.slug in state.enrollments);
            const start = () => {
              const target = prog.next;
              if (!target) {
                navigate(`/learn/${list[0].slug}`);
                return;
              }
              enroll(target.slug);
              const cp = courseProgress(target, { ...state, enrollments: { ...state.enrollments, [target.slug]: state.enrollments[target.slug] ?? { enrolledAt: '', lessonsDone: [] } } });
              navigate(cp.next ? stepTo(target.slug, cp.next) : `/learn/${target.slug}`);
            };
            return (
              <article key={p.slug} id={p.slug} className="path">
                <div className="path__intro">
                  <p className="path__meta">{p.difficulty} · {list.length} courses · {prog.hours} hours</p>
                  <h2>{p.title}</h2>
                  <p className="path__tag">{p.tagline}</p>
                  <p>{p.description}</p>
                  <h3 className="h4">Expected skills</h3>
                  <ul className="tags">{p.skills.map((s) => <li key={s}>{s}</li>)}</ul>
                  <p className="path__outcome"><Icon name="flag" size={16} /> {p.outcome}</p>
                </div>
                <div className="path__body">
                  <div className="path__progress">
                    <ProgressRing percent={prog.percent} size={72} />
                    <div>
                      <strong>{prog.completedCourses} of {prog.totalCourses} courses complete</strong>
                      <span className="muted">Path progress is the average of its course progress (local demo)</span>
                    </div>
                  </div>
                  <ol className="sequence">
                    {list.map((c, i) => {
                      const cp = courseProgress(c, state);
                      return (
                        <li key={c.slug}>
                          <span className={`sequence__n${cp.complete ? ' is-done' : ''}`} aria-hidden="true">{cp.complete ? <Icon name="check" size={16} /> : i + 1}</span>
                          <div>
                            <h3><Link to={`/courses/${c.slug}`}>{c.title}</Link></h3>
                            <p className="muted">{c.hours} h · {c.difficulty} · {priceLabel(c.price)}</p>
                            {c.slug in state.enrollments && <ProgressBar percent={cp.percent} label={`${c.title} progress`} tone={cp.complete ? 'teal' : 'cobalt'} />}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                  <Button onClick={start}>
                    {prog.completedCourses === prog.totalCourses ? 'Review path' : started ? 'Continue learning' : 'Start learning'} <Icon name="arrow" size={16} />
                  </Button>
                  {!started && <p className="fine">Starts a free demo enrollment in “{list[0].title}”. No payment or account.</p>}
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
