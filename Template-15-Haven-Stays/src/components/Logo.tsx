import { Link } from 'react-router-dom';
import { site } from '../config/site';

export default function Logo({ inverted = false }: { inverted?: boolean }) {
  const { brand } = site;
  return (
    <Link to="/" className={`logo${inverted ? ' logo--inv' : ''}`} aria-label={`${brand.shortName} — home`}>
      {brand.showMark && (
        <svg className="logo__mark" viewBox="0 0 64 64" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
          <path d="M14 46V28a18 18 0 0 1 36 0v18" />
          <path d="M24 46V32a8 8 0 0 1 16 0v14" />
          <path d="M10 46h44" />
        </svg>
      )}
      <span className="logo__text">{brand.logoText}</span>
    </Link>
  );
}
