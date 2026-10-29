import { site } from '../config/site';

/** Typographic logo. The brand name, descriptor and mark come from src/config/site.ts. */
export function Logo({ className = '' }: { className?: string }) {
  if (site.brand.logoMode === 'image') {
    return (
      <span className={`logo logo--image ${className}`}>
        <img src={site.brand.logo} alt={site.brand.name} height="40" />
      </span>
    );
  }
  return (
    <span className={`logo ${className}`}>
      <svg className="logo__mark" width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <path d="M8 34V19a12 12 0 0 1 24 0v15" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M13 34V20a7 7 0 0 1 14 0v14" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M20 14.5c1.7 1.8 2.6 3.1 2.6 4.4a2.6 2.6 0 0 1-5.2 0c0-1.3.9-2.6 2.6-4.4Z" fill="currentColor" />
        <path d="M5 34h30" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="logo__text">
        <span className="logo__name">{site.brand.name}</span>
        <span className="logo__sub">{site.brand.descriptor}</span>
      </span>
    </span>
  );
}
