import { Link } from 'react-router-dom';
import { pages } from '../config/layout';
import { properties } from '../config/properties';
import { useShortlist } from '../hooks/useShortlist';
import { Icon } from './Icon';

export function CompareTray() {
  const { compare, toggleCompare, clearCompare } = useShortlist();
  if (!compare.length || !pages.properties) return null;
  const items = compare.map((id) => properties.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <aside className="compare-tray" aria-label="Comparison tray">
      <div className="container compare-tray__inner">
        <p className="compare-tray__count">
          <strong>{items.length}</strong> of 3 selected
        </p>
        <ul className="compare-tray__items">
          {items.map((p) => (
            <li key={p.id}>
              <img src={p.images[0].thumb ?? p.images[0].src} alt="" width={40} height={40} />
              <span>{p.title}</span>
              <button type="button" aria-label={`Remove ${p.title} from comparison`} onClick={() => toggleCompare(p.id)}>
                <Icon name="close" size={14} />
              </button>
            </li>
          ))}
        </ul>
        <div className="compare-tray__actions">
          <button type="button" className="link-btn" onClick={clearCompare}>
            Clear
          </button>
          {items.length >= 2 ? (
            <Link className="btn btn--brass btn--sm" to="/compare">
              Compare now
            </Link>
          ) : (
            <span className="compare-tray__hint">Add one more to compare</span>
          )}
        </div>
      </div>
    </aside>
  );
}
