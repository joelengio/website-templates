import { Link } from 'react-router-dom';
import { site } from '../config/site';

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg className="logo__mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="11" fill="var(--c-ink)" />
      <path d="M20 6l3.3 8.7L32 18l-8.7 3.3L20 30l-3.3-8.7L8 18l8.7-3.3z" fill="var(--c-sun)" />
      <circle cx="31" cy="31" r="3.2" fill="var(--c-coral)" />
    </svg>
  );
}

export function Logo({ to = '/', light = false }: { to?: string; light?: boolean }) {
  return (
    <Link to={to} className={`logo${light ? ' logo--light' : ''}`} >
      <LogoMark />
      <span className="logo__text">
        <span className="logo__name">{site.shortName}</span>{' '}
        <span className="logo__sub">Academy</span>
        <span className="sr-only"> — home</span>
      </span>
    </Link>
  );
}
