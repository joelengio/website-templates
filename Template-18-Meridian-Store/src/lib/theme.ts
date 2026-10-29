import { theme } from '../config/theme';

/** Writes the design tokens from src/config/theme.ts to CSS custom properties on <html>. */
export function applyTheme(): void {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(theme.colors)) root.style.setProperty(`--c-${name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, value);
  root.style.setProperty('--font-display', theme.fonts.display);
  root.style.setProperty('--font-body', theme.fonts.body);
}
