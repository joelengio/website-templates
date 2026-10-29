import { Link } from 'react-router-dom';
import type { Course } from '../config/types';
import { getCategory, getInstructor } from '../config';
import { courseProgress } from '../lib/progress';
import { priceLabel } from '../lib/format';
import { useLearner } from '../hooks/useLearner';
import { BookmarkButton } from './BookmarkButton';
import { CourseCover } from './CourseCover';
import { Icon } from './Icon';
import { ProgressBar, Rating } from './ui';

export function CourseCard({ course, variant = 'default', headingLevel = 3 }: { course: Course; variant?: 'default' | 'feature' | 'row'; headingLevel?: 2 | 3 }) {
  const { state } = useLearner();
  const category = getCategory(course.categoryId);
  const instructor = getInstructor(course.instructorId);
  const enrolled = course.slug in state.enrollments;
  const progress = enrolled ? courseProgress(course, state) : undefined;
  const H = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <article className={`course-card course-card--${variant}`}>
      <Link to={`/courses/${course.slug}`} className="course-card__media" tabIndex={-1} aria-hidden="true">
        <CourseCover motif={category?.motif ?? 'skills'} palette={course.palette} seed={course.slug} />
        <span className="course-card__chip">{category?.name}</span>
      </Link>
      <div className="course-card__body">
        <div className="course-card__top">
          <span className={`level level--${course.difficulty.toLowerCase()}`}>{course.difficulty}</span>
          <BookmarkButton kind="course" slug={course.slug} title={course.title} />
        </div>
        <H className="course-card__title">
          <Link to={`/courses/${course.slug}`}>{course.title}</Link>
        </H>
        <p className={variant === 'feature' ? 'course-card__desc' : 'course-card__tag'}>{variant === 'feature' ? course.description : course.tagline}</p>
        <p className="course-card__by">with {instructor?.name}</p>
        <ul className="meta" aria-label="Course details">
          <li><Icon name="clock" size={15} /> {course.hours} h</li>
          <li><Icon name="book" size={15} /> {course.catalogLessons} lessons</li>
          <li><Rating value={course.rating} count={course.ratingCount} compact /></li>
        </ul>
        {progress ? (
          <div className="course-card__progress">
            <ProgressBar percent={progress.percent} label={`${course.title} progress`} tone={progress.complete ? 'teal' : 'cobalt'} />
            <Link to={`/learn/${course.slug}`} className="text-link">
              {progress.complete ? 'Review course' : progress.doneSteps ? 'Continue' : 'Start learning'} <Icon name="arrow" size={16} />
            </Link>
          </div>
        ) : (
          <div className="course-card__foot">
            <span className={`price${course.price === 0 ? ' price--free' : ''}`}>{priceLabel(course.price)}</span>
            <Link to={`/courses/${course.slug}`} className="text-link">
              View course <Icon name="arrow" size={16} />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
