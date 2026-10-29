import type { IconName } from '../config/types';

/** Compact 24×24 outline icon set (stroke 1.6). Decorative by default; pass `label` to expose to assistive tech. */
const paths: Record<IconName, string> = {
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.6 5.4-2 5.2-5.2 2 2-5.2 5.2-2Z',
  building: 'M5 21V5l7-2 7 2v16M3 21h18M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4',
  ledger: 'M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v16a2 2 0 0 0 2 2M9 8h6M9 12h6M9 16h3',
  percent: 'M18 6 6 18M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  vault: 'M4 5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 13v2m8-2v2M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-3v0',
  wave: 'M3 9c2.5-3 4.5-3 7 0s4.5 3 7 0l4 0M3 16c2.5-3 4.5-3 7 0s4.5 3 7 0l4 0',
  columns: 'M3 9 12 4l9 5H3Zm2 0v9m4-9v9m6-9v9m4-9v9M3 20h18',
  spark: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18',
  rocket: 'M14 4c3 0 6-.5 6-.5S19.5 7 19.5 10c0 3-2.5 5.5-5.5 7l-3-3c1.500-3 3.500-5.500 7-7M10 14l-4 1 1-4 3-1m-5 8c0-1.500 1-2.500 2-2.500s1.500 1 1 2.500c-.5 1.500-3 1.500-3 0Z',
  store: 'M4 9l1-5h14l1 5M4 9a2.500 2.500 0 0 0 5 0 2.500 2.500 0 0 0 5 0 2.500 2.500 0 0 0 5 0 2.500 2.500 0 0 0 1 0M5 11v9h14v-9M10 20v-5h4v5',
  briefcase: 'M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm5 0V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M3 13h18',
  cart: 'M3 4h2l2 11h11l2-8H6.500M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  cpu: 'M7 7h10v10H7V7Zm3 3h4v4h-4v-4ZM9 3v4m6-4v4M9 17v4m6-4v4M3 9h4m-4 6h4m10-6h4m-4 6h4',
  home: 'M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6',
  tower: 'M7 21V8l5-5 5 5v13M3 21h18M10 11h4M10 15h4',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  check: 'm5 12.500 4.500 4.500L19 7.500',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  calendar: 'M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 5h15M8 3v4m8-4v4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.500V12l3 2',
  phone: 'M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z',
  mail: 'M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 1 8 6 8-6',
  pin: 'M12 21s7-6.200 7-11.500a7 7 0 1 0-14 0C5 14.800 12 21 12 21Zm0-8.500a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5Z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5',
  chevron: 'm9 6 6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  shield: 'M12 3 5 6v6c0 4.500 3 8 7 9 4-1 7-4.500 7-9V6l-7-3Zm-3 9 2.500 2.500L15.500 10',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-9v5m0-8.500v0',
  book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm0 13a3 3 0 0 1 3-3h11M9 8h6',
  users: 'M9 11a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M16 4.500a3.500 3.500 0 0 1 0 6M18 14a6 6 0 0 1 3 6',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-3v0',
  chart: 'M4 20V4M4 20h16M8 16v-4m4 4V8m4 8v-6',
  calc: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 4h8M8 12h1m3 0h1m3 0h1M8 16h1m3 0h1m3 0h1',
  linkedin: 'M5 9v10M5 5.500v0M10 19V9m0 4a4 4 0 0 1 8 0v6',
  x: 'M5 5l14 14M19 5 5 19',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm5.500-11v0',
  trash: 'M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3',
  reset: 'M4 12a8 8 0 1 0 3-6.200M4 4v5h5',
  quote: 'M9 7H5v5h3a3 3 0 0 1-3 3m13-8h-4v5h3a3 3 0 0 1-3 3',
  alert: 'M12 4 2.500 20h19L12 4Zm0 6v4.500m0 2.500v0',
  file: 'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5M9 13h6M9 17h6',
};

interface Props {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
}

export function Icon({ name, size = 20, label, className }: Props) {
  return (
    <svg
      className={`icon ${className ?? ''}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
