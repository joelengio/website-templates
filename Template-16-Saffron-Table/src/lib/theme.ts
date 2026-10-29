import type { ThemeConfig } from '../config/theme';

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Writes theme colours/fonts to CSS custom properties: --c-espresso, --font-display, etc. */
export function applyTheme(theme: ThemeConfig, root: HTMLElement = document.documentElement): void {
  for (const [name, value] of Object.entries(theme.colors)) root.style.setProperty(`--c-${kebab(name)}`, value);
  for (const [name, value] of Object.entries(theme.fonts)) root.style.setProperty(`--font-${kebab(name)}`, value);
}
