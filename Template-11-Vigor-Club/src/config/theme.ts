/**
 * ─── THEME ─────────────────────────────────────────────────────────────────
 * Colours and typography are applied at runtime as CSS variables (see src/lib/theme.ts)
 * so a rebrand needs only this file. Font families must be imported in src/main.tsx
 * (see CUSTOMIZATION_GUIDE.md → "Changing fonts").
 */
export const theme = {
  colors: {
    /** Page background (darkest). */
    ink: '#0C0D0E',
    /** Alternate dark section background. */
    charcoal: '#121416',
    /** Card / panel surface. */
    graphite: '#1A1D20',
    /** Raised surface, inputs. */
    steel: '#252A2F',
    /** Light-section background and primary text on dark. */
    bone: '#F1EDE4',
    /** Secondary text on dark (AA on all dark surfaces). */
    mist: '#A9AEB4',
    /** Secondary text on light sections. */
    slate: '#4B5057',
    /** Primary accent. */
    lime: '#C8FF2E',
    /** Text colour used ON the accent. */
    limeInk: '#0C0D0E',
    /** Accent for small text on light sections (AA). */
    limeDeep: '#4D6A00',
    /** Hairlines on dark / light. */
    line: 'rgba(241, 237, 228, 0.14)',
    lineLight: 'rgba(12, 13, 14, 0.18)',
    danger: '#FF8A7A',
    dangerLight: '#B3261E'
  },
  fonts: {
    display: "'Big Shoulders Display', 'Arial Narrow', Impact, sans-serif",
    body: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif"
  },
  radius: { sm: '4px', md: '10px' }
};

export type ThemeConfig = typeof theme;
