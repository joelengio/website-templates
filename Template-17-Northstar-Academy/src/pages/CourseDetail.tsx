import { Link, useParams } from 'react-router-dom';
import { coursesByInstructor, courses, getCategory, getCourse, getInstructor, learning } from '../config';
import { lessonMinutes } from '../lib/progress';
import { priceLabel } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { BookmarkButton } from '../components/BookmarkButton';
import { CourseCard } from '../components/CourseCard';
import { CourseCover } from '../components/CourseCover';
import { EnrollButton } from '../components/EnrollButton';
import { Icon } from '../components/Icon';
import { ModuleList } from '../components/ModuleList';
import { Portrait } from '../components/Portrait';
import { Section, Rating } from '../components/ui';
import NotFound from './NotFound';

export default function CourseDetail() {
  const { slug = '' } = useParams();
  const course = getCourse(slug);
  useSeo({ title: course?.title, description: course?.tagline, path: `/courses/${slug}`, noindex: !course });
  if (!course) return <NotFound />;

  const category = getCategory(course.categoryId)!;
  const instructor = getInstructor(course.instructorId)!;
  const demoLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const sample = course.modules[0].lessons.slice(0, 2);
  const related = courses
    .filter((c) => c.slug !== course.slug && (c.categoryId === course.categoryId || c.instructorId === course.instructorId))
    .concat(courses.filter((c) => c.slug !== course.slug && c.categoryId !== course.categoryId))
    .slice(0, 3);

  return (
    <>
      <section className="course-hero">
        <div className="container course-hero__grid">
          <div className="course-hero__copy">
            <nav aria-label="Breadcrumb" className="crumbs">
              <ol>
                <li><Link to="/courses">Courses</Link></li>
                <li><Link to={`/courses?category=${category.id}`}>{category.name}</Link></li>
              </ol>
            </nav>
            <h1 data-page-heading tabIndex={-1}>{course.title}</h1>
            <p className="course-hero__lead">{course.description}</p>
            <ul className="facts" aria-label="Course facts">
              <li><Icon name="user" size={16} /> <Link to={`/instructors/${instructor.slug}`}>{instructor.name}</Link></li>
              <li><span className={`level level--${course.difficulty.toLowerCase()}`}>{course.difficulty}</span></li>
              <li><Icon name="clock" size={16} /> {course.hours} hours</li>
              <li><Icon name="book" size={16} /> {course.catalogLessons} lessons (full course)</li>
              <li><Rating value={course.rating} count={course.ratingCount} /></li>
            </ul>
            <p className="fine">Rating and review count are fictional demonstration data.</p>
          </div>
          <aside className="enroll-card" aria-label="Enrollment">
            <CourseCover motif={category.motif} palette={course.palette} seed={course.slug} label={`Illustration for ${course.title}`} className="enroll-card__cover" />
            <div className="enroll-card__body">
              <p className={`price price--lg${course.price === 0 ? ' price--free' : ''}`}>{priceLabel(course.price)}</p>
              {course.price > 0 && <p className="fine">Illustrative price — no payment is taken in this demo.</p>}
              <EnrollButton course={course} className="btn--block" />
              <BookmarkButton kind="course" slug={course.slug} title={course.title} withLabel />
              <ul className="enroll-card__list">
                <li><Icon name="check" size={16} /> {demoLessons} playable sample lessons + {course.modules.length} quizzes</li>
                <li><Icon name="check" size={16} /> {lessonMinutes(course)} minutes of demo reading</li>
                <li><Icon name="check" size={16} /> Quizzes pass at {learning.defaultPassMark}%</li>
                <li><Icon name="check" size={16} /> Certificate preview (not accredited)</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <Section>
        <div className="detail-grid">
          <div className="detail-main">
            <h2 className="h3">What you will learn</h2>
            <ul className="objectives">
              {course.objectives.map((o) => <li key={o}><Icon name="check" size={18} /> {o}</li>)}
            </ul>

            <h2 className="h3" id="curriculum">Curriculum</h2>
            <p className="muted">The full course has {course.catalogLessons} lessons. This demonstration edition includes {demoLessons} lessons and {course.modules.length} module quizzes you can actually take.</p>
            <ModuleList course={course} />

            <h2 className="h3">Sample lessons</h2>
            <ul className="sample-lessons">
              {sample.map((l) => (
                <li key={l.id}>
                  <h3>{l.title}</h3>
                  <p>{l.summary}</p>
                  <p className="muted">{l.minutes} min read · Module 1</p>
                </li>
              ))}
            </ul>
            <p className="muted">Enroll (free in this demo) to open the full lesson viewer.</p>

            <h2 className="h3">Requirements</h2>
            <ul className="bullets">
              {course.requirements.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <aside className="detail-side" aria-label="Instructor">
            <h2 className="h3">Your instructor</h2>
            <div className="mini-instructor">
              <Portrait person={instructor} label={false} />
              <div>
                <h3><Link to={`/instructors/${instructor.slug}`}>{instructor.name}</Link></h3>
                <p>{instructor.title}</p>
              </div>
            </div>
            <p>{instructor.bio[0]}</p>
            <p className="fine">Fictional demonstration identity. {coursesByInstructor(instructor.slug).length} demo courses.</p>
            <ul className="bullets bullets--tight">
              {instructor.credentials.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </aside>
        </div>
      </Section>

      <Section tone="soft">
        <h2 className="section-title">Related courses</h2>
        <div className="course-grid">
          {related.map((c) => <CourseCard key={c.slug} course={c} />)}
        </div>
      </Section>
    </>
  );
}
