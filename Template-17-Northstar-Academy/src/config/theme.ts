/** Design tokens. Each key becomes a CSS custom property (`--c-<key>` colours, `--font-<key>` fonts). */
export const theme = {
  colors: {
    bg: '#fbf9f5', // warm white
    surface: '#ffffff',
    soft: '#f1eee8', // soft grey-beige
    line: '#e3dfd6',
    ink: '#0f1e3d', // deep ink blue
    muted: '#4d5870',
    cobalt: '#2748e8',
    'cobalt-deep': '#1a34b8',
    teal: '#0e9f94',
    'teal-deep': '#0a6f68',
    coral: '#ff6b57',
    sun: '#f5b942',
  },
  fonts: {
    display: "'Fraunces Variable', Georgia, 'Times New Roman', serif",
    body: "'Inter Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  radius: { sm: '8px', md: '14px', lg: '24px' },
} as const;
