import { site } from '../config/site';

export function Logo({ inverse = false }: { inverse?: boolean }) {
  const { name, monogram, logoSrc } = site.brand;
  return (
    <span className={`logo${inverse ? ' logo--inverse' : ''}`}>
      {logoSrc ? (
        <img src={logoSrc} alt="" width={36} height={36} className="logo__img" />
      ) : (
        <svg className="logo__mark" viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" focusable="false">
          <rect x="1" y="1" width="38" height="38" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M1 29 L39 11" stroke="var(--c-bronze)" strokeWidth="1.4" />
          <text x="20" y="25" textAnchor="middle" fontFamily="var(--font-heading)" fontSize="15" fontWeight="500" fill="currentColor" letterSpacing="1">
            {monogram}
          </text>
        </svg>
      )}
      <span className="logo__text">
        <span className="logo__name">{name}</span>
      </span>
    </span>
  );
}
