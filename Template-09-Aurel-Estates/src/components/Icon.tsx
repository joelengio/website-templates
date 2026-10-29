import type { SVGProps } from 'react';

const paths: Record<string, string> = {
  heart: 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 5 6 5c2 0 3.4 1 4.4 2.5h.2C11.6 6 13 5 15 5c3.4 0 5.1 3.400 3.600 6.800C16.500 16.400 12 21 12 21z',
  compare: 'M7 4v16M17 4v16M3 8l4-4 4 4M13 16l4 4 4-4',
  bed: 'M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.500h.01',
  bath: 'M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM6 12V6a2 2 0 0 1 3.500-1.300M7 19l-1 2M17 19l1 2',
  area: 'M4 4h16v16H4zM4 10h6v10M14 4v6h6',
  pin: 'M12 21s7-6.100 7-11a7 7 0 1 0-14 0c0 4.900 7 11 7 11zM12 12.500a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.500-4.500',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  chevron: 'M6 9l6 6 6-6',
  left: 'M15 5l-7 7 7 7',
  right: 'M9 5l7 7-7 7',
  arrow: 'M4 12h16M14 6l6 6-6 6',
  check: 'M5 12.500l4.500 4.500L19 7',
  filter: 'M4 6h16M7 12h10M10 18h4',
  phone: 'M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  key: 'M14 10a4 4 0 1 0-3.500 4L21 14.500V17h-2v2h-2v-2h-2.500l-2-2.500',
  tag: 'M3 12V4h8l10 10-8 8L3 12zM7.500 8.500h.01',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.500 8.500L13.500 13.500 8.500 15.500 10.500 10.500z',
  sofa: 'M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M3 14a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v4H3zM6 18v2M18 18v2',
  chart: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, filled, ...rest }: { name: IconName; size?: number; filled?: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name] ?? ''} />
    </svg>
  );
}
