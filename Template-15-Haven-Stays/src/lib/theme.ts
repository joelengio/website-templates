import { theme } from '../config/theme';

/** Writes the configured palette and fonts to CSS custom properties. */
export function applyTheme() {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(theme.colors)) root.style.setProperty(k, v);
  root.style.setProperty('--font-display', theme.fonts.display);
  root.style.setProperty('--font-body', theme.fonts.body);
  root.style.setProperty('--radius', theme.radius);
}
