import { useId } from 'react';
import type { Category } from '../config/types';

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

interface Props {
  motif: Category['motif'];
  palette: [string, string, string];
  seed: string;
  label?: string;
  className?: string;
}

/** Original, code-generated course illustration (no external image files). Decorative unless `label` is provided. */
export function CourseCover({ motif, palette, seed, label, className = '' }: Props) {
  const uid = useId().replace(/:/g, '');
  const h = hash(seed);
  const [a, b, c] = palette;
  const r = (n: number) => ((h >>> n) & 15) / 15; // 0..1 deterministic variation
  const rot = Math.round(r(1) * 24 - 12);
  const stroke = 'rgba(255,255,255,.92)';
  const soft = 'rgba(255,255,255,.28)';

  let art: JSX.Element;
  switch (motif) {
    case 'code':
      art = (
        <g transform={`rotate(${rot / 2} 200 130)`}>
          <rect x="82" y="46" width="236" height="168" rx="16" fill="rgba(7,16,40,.62)" stroke={soft} />
          <circle cx="104" cy="68" r="5" fill="#ff6b57" />
          <circle cx="122" cy="68" r="5" fill="#f5b942" />
          <circle cx="140" cy="68" r="5" fill="#25c5b6" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={104 + (i % 2) * 22} y={96 + i * 22} width={60 + ((h >>> i) % 90)} height="9" rx="4.5" fill={i % 3 === 0 ? c : stroke} opacity={i % 3 === 0 ? 1 : 0.8} />
          ))}
          <path d="M268 120l-24 28 24 28M300 120l24 28-24 28" fill="none" stroke={stroke} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" transform="translate(-40 6) scale(.9)" />
        </g>
      );
      break;
    case 'design':
      art = (
        <g transform={`rotate(${rot} 200 130)`}>
          <circle cx="160" cy="120" r="62" fill={c} opacity=".95" />
          <rect x="190" y="84" width="104" height="104" rx="18" fill="none" stroke={stroke} strokeWidth="6" />
          <path d="M228 196l46-86 46 86z" fill={a} opacity=".9" stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={i} cx={96 + (i % 6) * 14} cy={206 + Math.floor(i / 6) * 14} r="2.6" fill={soft} />
          ))}
        </g>
      );
      break;
    case 'marketing':
      art = (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={106 + i * 38} y={200 - (36 + i * 24 + (h >>> i) % 10)} width="26" height={36 + i * 24 + (h >>> i) % 10} rx="6" fill={i === 4 ? c : stroke} opacity={i === 4 ? 1 : 0.85} />
          ))}
          <path d="M96 150c40-6 80-36 120-70l26 8" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" />
          <path d="M228 66l24 8-10 22" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {[28, 48, 68].map((rad) => (
            <path key={rad} d={`M ${300} ${70 + rad / 3} a ${rad} ${rad} 0 0 1 0 ${-rad / 1.5}`} fill="none" stroke={soft} strokeWidth="5" strokeLinecap="round" />
          ))}
        </g>
      );
      break;
    case 'business':
      art = (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={96 + i * 76} y={170 - i * 34} width="64" height={50 + i * 34} rx="8" fill={i === 2 ? c : 'rgba(255,255,255,.88)'} />
              <rect x={108 + i * 76} y={182 - i * 34} width="40" height="7" rx="3.5" fill={a} opacity=".5" />
            </g>
          ))}
          <polyline points="92,150 160,118 214,126 300,62" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {[ [92,150], [160,118], [214,126], [300,62] ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="8" fill={b} stroke={stroke} strokeWidth="4" />
          ))}
        </g>
      );
      break;
    case 'data':
      art = (
        <g>
          <rect x="84" y="50" width="232" height="166" rx="14" fill="rgba(7,16,40,.5)" stroke={soft} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const bh = 30 + ((h >>> (i + 2)) % 70);
            return <rect key={i} x={104 + i * 26} y={196 - bh} width="16" height={bh} rx="4" fill={i % 2 ? stroke : c} />;
          })}
          <circle cx="278" cy="104" r="26" fill="none" stroke={soft} strokeWidth="12" />
          <path d="M278 78a26 26 0 0 1 24 36" fill="none" stroke={c} strokeWidth="12" strokeLinecap="round" />
          <path d="M104 80h92" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
      break;
    case 'ai':
      art = (
        <g>
          {[[110,90,200,60],[200,60,290,100],[110,90,160,170],[160,170,250,180],[250,180,290,100],[200,60,160,170],[200,60,250,180]].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={soft} strokeWidth="3" />
          ))}
          {[[110,90],[200,60],[290,100],[160,170],[250,180]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 1 ? 20 : 14} fill={i === 1 ? c : 'rgba(255,255,255,.9)'} stroke={a} strokeWidth="4" />
          ))}
          <path d="M318 40l5 14 14 5-14 5-5 14-5-14-14-5 14-5z" fill={stroke} />
          <path d="M84 196l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill={stroke} />
        </g>
      );
      break;
    case 'language':
      art = (
        <g>
          <path d="M92 70h150a14 14 0 0 1 14 14v62a14 14 0 0 1-14 14h-86l-30 26v-26H92a14 14 0 0 1-14-14V84a14 14 0 0 1 14-14z" fill="rgba(255,255,255,.92)" />
          <text x="116" y="128" fontFamily="Fraunces Variable, Georgia, serif" fontWeight="700" fontSize="52" fill={a}>Aa</text>
          <path d="M240 128h78a14 14 0 0 1 14 14v52a14 14 0 0 1-14 14h-10v22l-26-22h-42a14 14 0 0 1-14-14v-52a14 14 0 0 1 14-14z" fill={c} />
          <text x="258" y="180" fontFamily="Fraunces Variable, Georgia, serif" fontWeight="700" fontSize="40" fill="#fff">¡Hola!</text>
        </g>
      );
      break;
    default:
      art = (
        <g>
          {[84, 62, 40, 18].map((rad, i) => (
            <circle key={rad} cx="200" cy="130" r={rad} fill={i % 2 ? c : 'none'} stroke={stroke} strokeWidth="5" opacity={i % 2 ? 0.95 : 0.9} />
          ))}
          <path d="M200 130L296 52" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
          <path d="M276 50h24v24" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="200" cy="130" r="7" fill={a} />
        </g>
      );
  }

  return (
    <svg className={`cover ${className}`} viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#g${uid})`} />
      <circle cx={60 + r(3) * 280} cy={r(5) < 0.5 ? 10 : 250} r={90 + r(7) * 40} fill={c} opacity=".28" />
      <circle cx={330 - r(9) * 60} cy={40 + r(11) * 40} r="46" fill="#fff" opacity=".08" />
      {art}
    </svg>
  );
}
