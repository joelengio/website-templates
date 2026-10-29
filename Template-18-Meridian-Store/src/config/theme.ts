/**
 * Design tokens. Values are written to CSS custom properties at start-up (see lib/theme.ts), so changing a colour here recolours the whole store.
 * Fonts: the families below are bundled with @fontsource packages imported in src/main.tsx. To switch fonts, install another @fontsource package,
 * import it in main.tsx and update the names here.
 */
export const theme = {
  colors: {
    ivory: '#faf7f2',
    cream: '#f3ede2',
    sand: '#e7ddcc',
    stone: '#d6ccbb',
    taupe: '#8a7d6c',
    taupeDark: '#6a5e4f',
    charcoal: '#262422',
    ink: '#3a3633',
    terracotta: '#a14d33',
    terracottaDark: '#843c26',
    bronze: '#8a6a3f',
    sage: '#8c957b',
    success: '#3f6b4a',
    danger: '#a3322b'
  },
  fonts: {
    display: "'Instrument Serif', 'Times New Roman', serif",
    body: "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif"
  }
};
