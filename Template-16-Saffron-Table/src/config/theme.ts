/** Colours and fonts. Applied to CSS custom properties at startup (see lib/theme.ts). */
export interface ThemeConfig {
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

export const theme: ThemeConfig = {
  colors: {
    espresso: '#16100c',
    espressoSoft: '#211812',
    roast: '#2e2219',
    cream: '#f4ead8',
    creamDeep: '#e8dabe',
    ink: '#1d140d',
    saffron: '#d1a247',
    saffronDeep: '#8a5a10',
    olive: '#7a8250',
    oliveDeep: '#4d5530',
    terracotta: '#c0623f',
    terracottaDeep: '#9a4527',
    mutedOnDark: '#bdac96',
    mutedOnLight: '#5a493a',
  },
  fonts: {
    /** Names must match fonts imported in src/main.tsx (via @fontsource). */
    display: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif",
    body: "'Inter Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
};
