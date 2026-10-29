import type { SVGProps } from 'react';

const paths: Record<string, string> = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  chevron: 'M9 6l6 6-6 6',
  'chevron-left': 'M15 6l-6 6 6 6',
  close: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A15 15 0 014 5a1 1 0 011-1z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pin: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  users: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM17 11a3 3 0 100-6M21 19v-1a4 4 0 00-3-3.9',
  calendar: 'M5 5h14v15H5zM5 10h14M9 3v4M15 3v4',
  flame: 'M12 3c1 3 4 4.5 4 8.5A4 4 0 018 12c0-1.5.7-2.5 1.5-3.5C10.5 7.2 11.5 5.5 12 3zM12 21a5 5 0 005-5H7a5 5 0 005 5z',
  leaf: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19c2-5 5-8 9-10',
  wine: 'M7 3h10l-1 6a4 4 0 01-8 0L7 3zM12 13v8M8 21h8',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  bag: 'M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 016 0v2',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5v.5',
  warning: 'M12 4l9 16H3L12 4zM12 10v4M12 17v.5',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
  print: 'M7 9V4h10v5M7 17H5v-6h14v6h-2M7 14h10v6H7z',
  instagram: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.5 6.5v.01',
  facebook: 'M14 8h3V4h-3a4 4 0 00-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z',
  pinterest: 'M12 3a9 9 0 100 18 9 9 0 000-18zM10.5 18l1.5-7M9 10.500c.4-1.600 1.700-2.300 3-2.300 1.800 0 2.800 1.100 2.800 2.600 0 1.900-1.200 3.200-2.700 3.200-.8 0-1.300-.5-1.300-.5',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5H5V6h5',
  dish: 'M3 16h18M5 16a7 7 0 0114 0M12 9V7M10 7h4',
};

export type IconName = keyof typeof paths;

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  label?: string;
}

export function Icon({ name, size = 20, label, ...rest }: Props) {
  return (
    <svg
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
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
