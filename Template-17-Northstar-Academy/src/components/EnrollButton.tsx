import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Course } from '../config/types';
import { courseProgress } from '../lib/progress';
import { priceLabel } from '../lib/format';
import { useLearner } from '../hooks/useLearner';
import { Button } from './Button';
import { Icon } from './Icon';
import { Modal } from './Modal';

/** "Enroll" opens a confirmation dialog that explains the demo; confirming enrols locally and opens the course. */
export function EnrollButton({ course, variant = 'primary', className = '' }: { course: Course; variant?: 'primary' | 'ink' | 'teal' | 'light'; className?: string }) {
  const { state, enroll } = useLearner();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const enrolled = course.slug in state.enrollments;

  if (enrolled) {
    const p = courseProgress(course, state);
    return (
      <Link to={`/learn/${course.slug}`} className={`btn btn--${variant} ${className}`}>
        {p.complete ? 'Review course' : p.doneSteps ? 'Continue learning' : 'Start learning'} <Icon name="arrow" size={16} />
      </Link>
    );
  }
  return (
    <>
      <Button variant={variant} className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {course.price === 0 ? 'Enroll free (demo)' : 'Enroll in demo'} <Icon name="arrow" size={16} />
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} label={`Enroll in ${course.title}`} className="dialog">
        <h2 className="dialog__title">Enroll in {course.title}?</h2>
        <p>
          This is a <strong>demonstration enrollment</strong>. It is saved only in this browser. There is no account, no payment
          {course.price > 0 && <> (the listed price of {priceLabel(course.price)} is illustrative)</>} and nothing is sent to a server.
        </p>
        <div className="dialog__actions">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="primary"
            data-autofocus
            onClick={() => {
              enroll(course.slug);
              setOpen(false);
              navigate(`/learn/${course.slug}`);
            }}
          >
            Confirm demo enrollment
          </Button>
        </div>
      </Modal>
    </>
  );
}
