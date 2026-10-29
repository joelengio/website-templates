import { site } from '../config/site';

/** Wordmark built from site.brand so renaming the business updates every logo instance. */
export function Logo({ light = false }: { light?: boolean }) {
  const [first, ...rest] = site.brand.name.split(' ');
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <rect width="40" height="40" rx="9" fill="var(--c-lime)" />
        <path d="M8 10h8l4 14 4-14h8L24 31h-8z" fill="var(--c-lime-ink)" />
      </svg>
      <span className="logo-word">
        <b>{first}</b>
        {rest.length > 0 && <i>{rest.join(' ')}</i>}
      </span>
    </span>
  );
}
