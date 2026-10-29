import { useShortlist } from '../hooks/useShortlist';
import { Icon } from './Icon';

export function FavoriteButton({ id, title, variant = 'icon' }: { id: string; title: string; variant?: 'icon' | 'text' }) {
  const { isFavorite, toggleFavorite } = useShortlist();
  const on = isFavorite(id);
  return (
    <button
      type="button"
      className={`fav-btn fav-btn--${variant}${on ? ' is-on' : ''}`}
      aria-pressed={on}
      aria-label={variant === 'icon' ? `${on ? 'Remove' : 'Save'} ${title} ${on ? 'from' : 'to'} favorites` : undefined}
      onClick={() => toggleFavorite(id)}
    >
      <Icon name="heart" filled={on} />
      {variant === 'text' && <span>{on ? 'Saved' : 'Save home'}</span>}
    </button>
  );
}

export function CompareToggle({ id, title, variant = 'check' }: { id: string; title: string; variant?: 'check' | 'button' }) {
  const { isCompared, toggleCompare, compare } = useShortlist();
  const on = isCompared(id);
  const full = !on && compare.length >= 3;
  if (variant === 'button') {
    return (
      <button type="button" className={`btn btn--ghost btn--sm compare-btn${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => toggleCompare(id)}>
        <Icon name="compare" size={16} /> {on ? 'In comparison' : 'Compare'}
      </button>
    );
  }
  return (
    <label className={`compare-check${on ? ' is-on' : ''}${full ? ' is-full' : ''}`}>
      <input type="checkbox" checked={on} onChange={() => toggleCompare(id)} aria-label={`Compare ${title}`} aria-describedby={full ? `compare-full-${id}` : undefined} />
      <span>Compare</span>
      {full && (
        <span id={`compare-full-${id}`} className="sr-only">
          Comparison is full (3 properties). Remove one to add this home.
        </span>
      )}
    </label>
  );
}
