/**
 * THEME CONFIG — colours, typography and shape. Applied as CSS custom properties at startup
 * (see src/lib/theme.ts), so no CSS edits are needed. Defaults mirror src/styles/base.css.
 */
export const theme = {
  colors: {
    forest: '#1f3a2e', // primary deep green
    forestDeep: '#13261d', // footer, hero overlays
    forestSoft: '#2d5240', // hover states
    ivory: '#f7f3ea', // page background
    ivoryDeep: '#ece5d4', // alternate sections
    paper: '#fffdf8', // cards
    brass: '#b08d57', // accent
    brassDeep: '#7a5c2e', // accent text on light (AA contrast)
    ink: '#1b211d', // body text
    muted: '#566058', // secondary text
    line: '#d9d1bd', // hairlines
    danger: '#a4332a',
    success: '#2d6a45',
  },
  fonts: {
    /** Names must match an installed @fontsource package imported in src/main.tsx. */
    display: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif",
    body: "'Inter Variable', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  shape: {
    radius: '2px',
    radiusLarge: '4px',
    maxWidth: '1280px',
  },
};

export type ThemeConfig = typeof theme;
