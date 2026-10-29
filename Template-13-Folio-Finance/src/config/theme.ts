/**
 * Visual identity. Colours and font stacks are written to CSS custom properties at start-up (see lib/theme.ts),
 * so changing a value here re-skins the whole site. Fonts are loaded in src/main.tsx — install and import a
 * font package there if you change the family names.
 */
export const theme = {
  colors: {
    navy: '#0d1a2b',
    navy2: '#16273e',
    navy3: '#243a57',
    ivory: '#f7f2e8',
    ivory2: '#fbf8f1',
    stone: '#ebe6db',
    stone2: '#d9d3c5',
    ink: '#18212e',
    muted: '#566173',
    bronze: '#a8703f',
    bronzeDark: '#7d4e26',
    bronzeLight: '#d2a574',
    positive: '#2f6b57',
    danger: '#a3322b',
  },
  fonts: {
    heading: "'Newsreader Variable', 'Iowan Old Style', Georgia, serif",
    body: "'Hanken Grotesk Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  shape: { radius: '4px', radiusLg: '10px' },
};
