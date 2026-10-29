/** Colour palette and typography. Values are written to CSS custom properties at start-up (see src/lib/theme.ts). */
export const theme = {
  colors: {
    '--c-cream': '#f6f0e4',
    '--c-limestone': '#e9dfcd',
    '--c-sand': '#d8c9ae',
    '--c-olive': '#4a5233',
    '--c-olive-deep': '#2f3623',
    '--c-charcoal': '#23221f',
    '--c-ink-soft': '#4a4740',
    '--c-terracotta': '#a9532f',
    '--c-terracotta-ink': '#8a3d1d',
    '--c-bronze': '#8a6733',
    '--c-white': '#fffdf8',
  },
  fonts: {
    display: "'Fraunces Variable', 'Iowan Old Style', Georgia, serif",
    body: "'Manrope Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  radius: '2px',
};
