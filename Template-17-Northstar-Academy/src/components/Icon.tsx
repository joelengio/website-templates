const paths: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 4.2 12.6l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z',
  arrow: 'M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5z',
  'arrow-left': 'M19 11H7.8l4.6-4.6L11 5l-7 7 7 7 1.4-1.4L7.8 13H19z',
  check: 'M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L21 7.5l-1.4-1.4z',
  x: 'M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z',
  menu: 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm-1 2v6l4.5 2.7.8-1.3-3.8-2.3V7z',
  book: 'M5 4h11a3 3 0 0 1 3 3v13H7a2 2 0 0 1-2-2zm2 2v10.2c.3-.1.6-.2 1-.2h9V7a1 1 0 0 0-1-1z',
  star: 'm12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z',
  bookmark: 'M6 3h12v18l-6-4.5L6 21zm2 2v12.1l4-3 4 3V5z',
  'bookmark-fill': 'M6 3h12v18l-6-4.5L6 21z',
  play: 'M8 5v14l11-7z',
  trophy: 'M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3zm-1 4v1a2 2 0 0 0 1 1.7V7zm12 0h-1v2.7A2 2 0 0 0 18 8z',
  layers: 'm12 3 10 5-10 5L2 8zm-7.4 8.3L12 15l7.4-3.7 1.6.8-9 4.5-9-4.5zm0 4L12 19l7.4-3.7 1.6.8-9 4.5-9-4.5z',
  user: 'M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.4 0 8 2 8 5v1H4v-1c0-3 3.6-5 8-5z',
  chat: 'M4 4h16v12H8l-4 4zm2 2v8.2L7.2 13H18V6z',
  mail: 'M3 5h18v14H3zm2 2v.5l7 4.5 7-4.5V7zm14 3-7 4.5L5 10v7h14z',
  pin: 'M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  phone: 'M6.6 3h3l1.4 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.4v3A2.6 2.6 0 0 1 18.4 20 15.4 15.4 0 0 1 4 5.6 2.6 2.6 0 0 1 6.6 3z',
  print: 'M7 3h10v4h2a2 2 0 0 1 2 2v7h-4v5H7v-5H3V9a2 2 0 0 1 2-2h2zm2 2v2h6V5zm0 10v4h6v-4z',
  reset: 'M12 5a7 7 0 1 1-6.6 9.3l1.9-.6A5 5 0 1 0 8 8.4L10 10H4V4l2.2 2.2A7 7 0 0 1 12 5z',
  shield: 'M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5zm0 2.1 6 2.3V11c0 3.9-2.5 7.3-6 8.8-3.5-1.5-6-4.9-6-8.8V6.4z',
  list: 'M4 6h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8z',
  chevron: 'M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z',
  filter: 'M3 5h18v2l-7 7v6l-4-2v-4L3 7z',
  sparkle: 'm12 2 2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z',
  flag: 'M5 3h2v18H5zm4 1h10l-2 4 2 4H9z',
  external: 'M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14zM5 5h6v2H7v10h10v-4h2v6H5z',
};

export function Icon({ name, size = 20, className = '' }: { name: keyof typeof paths | string; size?: number; className?: string }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={paths[name] ?? paths.sparkle} />
    </svg>
  );
}
