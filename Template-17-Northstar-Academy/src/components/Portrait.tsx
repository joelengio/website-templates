import type { Instructor } from '../config/types';

/** Original illustrated instructor portrait (demonstration identity — not a photograph of a real person). */
export function Portrait({ person, className = '', label }: { person: Instructor; className?: string; label?: boolean }) {
  const p = person.portrait;
  const hair = p.hair;
  const dark = 'rgba(15,30,61,.85)';
  const hairBack =
    p.hairStyle === 'long' ? <path d="M54 92c0-42 22-64 46-64s46 22 46 64v70c0 6-8 10-14 4-6-8-12-10-32-10s-26 2-32 10c-6 6-14 2-14-4z" fill={hair} /> :
    p.hairStyle === 'waves' ? <path d="M58 98c-6-46 18-70 42-70s48 24 42 70c-4 24-10 36-14 36H72c-4 0-10-12-14-36z" fill={hair} /> :
    p.hairStyle === 'curly' ? (
      <g fill={hair}>
        {[[62,66],[78,44],[100,36],[122,44],[138,66],[142,92],[58,92],[70,114],[130,114]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="19" />)}
      </g>
    ) : null;
  const hairFront =
    p.hairStyle === 'short' ? <path d="M68 84c-4-34 14-52 32-52s36 18 32 52c-8-14-18-20-32-20s-24 6-32 20z" fill={hair} /> :
    p.hairStyle === 'bun' ? (<g fill={hair}><circle cx="100" cy="26" r="17" /><path d="M66 86c-4-36 14-54 34-54s38 18 34 54c-8-16-20-24-34-24s-26 8-34 24z" /></g>) :
    p.hairStyle === 'long' || p.hairStyle === 'waves' ? <path d="M66 90c0-30 14-48 34-48s34 18 34 48c-10-18-20-26-34-26s-24 8-34 26z" fill={hair} /> :
    p.hairStyle === 'curly' ? <path d="M70 80c6-18 18-26 30-26s24 8 30 26c-10-8-18-10-30-10s-20 2-30 10z" fill={hair} /> :
    null;

  return (
    <svg className={`portrait ${className}`} viewBox="0 0 200 200" role="img" aria-label={label === false ? undefined : `Illustrated portrait of ${person.name} (demonstration)`} aria-hidden={label === false ? true : undefined} focusable="false">
      <rect width="200" height="200" fill={p.bg} />
      <circle cx="160" cy="40" r="46" fill="#fff" opacity=".45" />
      {hairBack}
      <path d="M26 200c0-36 28-56 74-56s74 20 74 56z" fill={p.top} />
      <path d="M84 144l16 18 16-18" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="4" strokeLinejoin="round" />
      <rect x="88" y="112" width="24" height="36" rx="10" fill={p.skin} />
      <rect x="88" y="128" width="24" height="12" fill="rgba(0,0,0,.08)" />
      <ellipse cx="100" cy="86" rx="34" ry="40" fill={p.skin} />
      <ellipse cx="66" cy="90" rx="5" ry="9" fill={p.skin} />
      <ellipse cx="134" cy="90" rx="5" ry="9" fill={p.skin} />
      {hairFront}
      {p.hairStyle === 'bald' && <path d="M68 70c6-24 20-30 32-30s26 6 32 30c-10-8-20-10-32-10s-22 2-32 10z" fill={p.skin} opacity=".0" />}
      {p.beard && <path d="M68 96c2 24 14 36 32 36s30-12 32-36c-6 8-12 12-18 12H86c-6 0-12-4-18-12z" fill={hair} opacity=".92" />}
      <circle cx="86" cy="86" r="3.4" fill={dark} />
      <circle cx="114" cy="86" r="3.4" fill={dark} />
      <path d="M88 108c6 6 18 6 24 0" fill="none" stroke={p.beard ? '#fff' : dark} strokeWidth="3.4" strokeLinecap="round" opacity={p.beard ? 0.9 : 0.8} />
      {p.glasses && (
        <g fill="rgba(255,255,255,.18)" stroke={dark} strokeWidth="3">
          <rect x="68" y="76" width="26" height="20" rx="8" />
          <rect x="106" y="76" width="26" height="20" rx="8" />
          <path d="M94 85h12" fill="none" />
        </g>
      )}
    </svg>
  );
}
