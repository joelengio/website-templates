import { Link } from 'react-router-dom';
import { site } from '../config/site';

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="var(--c-saffron)" strokeWidth="1.2" />
      <path d="M20 8c1.2 4.800 5.500 6.400 5.500 11.200A5.500 5.500 0 0114.500 20c0-2.100 1-3.500 2.100-4.800C18.200 13.400 19.300 11.200 20 8z" fill="var(--c-saffron)" />
      <path d="M12 29h16" stroke="var(--c-cream)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onClick}>
      <LogoMark />
      <span className="logo__text">
        <span className="logo__name">{site.brand.name}</span>
        <span className="logo__tag">Fire · Spice · Table</span>
        <span className="visually-hidden"> home</span>
      </span>
    </Link>
  );
}
