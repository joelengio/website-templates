import { useLearner } from '../hooks/useLearner';
import { Icon } from './Icon';

export function BookmarkButton({ kind, slug, lessonId, title, withLabel }: { kind: 'course' | 'lesson'; slug: string; lessonId?: string; title: string; withLabel?: boolean }) {
  const { state, toggleCourseBookmark, toggleLessonBookmark } = useLearner();
  const on = kind === 'course' ? state.bookmarkedCourses.includes(slug) : state.bookmarkedLessons.includes(`${slug}:${lessonId}`);
  const toggle = () => (kind === 'course' ? toggleCourseBookmark(slug) : toggleLessonBookmark(slug, lessonId!));
  return (
    <button type="button" className={`bookmark${on ? ' is-on' : ''}${withLabel ? ' bookmark--label' : ''}`} aria-pressed={on} aria-label={withLabel ? undefined : `${on ? 'Remove bookmark from' : 'Bookmark'} ${title}`} onClick={toggle}>
      <Icon name={on ? 'bookmark-fill' : 'bookmark'} size={20} />
      {withLabel && <span>{on ? 'Bookmarked' : 'Bookmark'}<span className="sr-only"> {title}</span></span>}
    </button>
  );
}
