/**
 * ─── THEME ─────────────────────────────────────────────────────────────────
 * Colours and typography are applied at runtime as CSS variables (see src/lib/theme.ts)
 * so a rebrand needs only this file. Font families must be installed/imported in
 * src/main.tsx (see CUSTOMIZATION_GUIDE.md → "Changing fonts").
 */
export const theme = {
  colors: {
    ivory: '#F8F3E8',
    cream: '#F1E9D8',
    sand: '#E3D4B8',
    sage: '#A3B093',
    olive: '#5F6847',
    forest: '#3C4430',
    gold: '#B8964F',
    /** Darker gold used for small text on light backgrounds (WCAG AA contrast). */
    goldInk: '#7E5F1F',
    wood: '#8A6A4B',
    ink: '#2B2E24',
    muted: '#6A6A5A',
    line: 'rgba(60, 68, 48, 0.16)'
  },
  fonts: {
    display: "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif",
    body: "'Jost', system-ui, -apple-system, 'Segoe UI', sans-serif"
  },
  radius: { sm: '4px', md: '10px', arch: '999px' }
};

export type ThemeConfig = typeof theme;
