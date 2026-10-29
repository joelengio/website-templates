/**
 * Design tokens. Every value is written to a CSS custom property on <html> at start-up (src/lib/theme.ts),
 * so changing a colour or font here re-themes the whole site.
 */
export const theme = {
  colors: {
    /** Page backgrounds */
    ivory: '#fbf9f4',
    white: '#ffffff',
    mist: '#eef4f8',
    mistDeep: '#dfeaf1',
    /** Navy scale */
    navy: '#0e2a47',
    navySoft: '#1d3f63',
    /** Teal accents (tealInk is the accessible text/link shade on light backgrounds) */
    teal: '#2f8a91',
    tealInk: '#1b6a72',
    tealSoft: '#d6ebec',
    sand: '#f1e9db',
    coral: '#c8604a',
    ink: '#14243a',
    muted: '#4d5f73',
    line: '#d9e2ea',
    /** Borders of form controls (needs 3:1 contrast against the page background). */
    fieldBorder: '#6f8499',
    success: '#1f7a4d',
    danger: '#a63a2a'
  },
  fonts: {
    display: "'Fraunces Variable', 'Iowan Old Style', Georgia, serif",
    body: "'DM Sans Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  },
  radius: { sm: '12px', md: '20px', lg: '32px' }
};
