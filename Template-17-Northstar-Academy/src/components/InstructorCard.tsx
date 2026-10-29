import { Link } from 'react-router-dom';
import type { Instructor } from '../config/types';
import { coursesByInstructor } from '../config';
import { Portrait } from './Portrait';

export function InstructorCard({ instructor, headingLevel = 3 }: { instructor: Instructor; headingLevel?: 2 | 3 }) {
  const n = coursesByInstructor(instructor.slug).length;
  const H = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <article className="instructor-card">
      <Link to={`/instructors/${instructor.slug}`} className="instructor-card__media" tabIndex={-1} aria-hidden="true">
        <Portrait person={instructor} label={false} />
      </Link>
      <H className="instructor-card__name">
        <Link to={`/instructors/${instructor.slug}`}>{instructor.name}</Link>
      </H>
      <p className="instructor-card__title">{instructor.title}</p>
      <p className="instructor-card__spec">{instructor.specialization}</p>
      <p className="instructor-card__count">{n} demo course{n === 1 ? '' : 's'}</p>
    </article>
  );
}
