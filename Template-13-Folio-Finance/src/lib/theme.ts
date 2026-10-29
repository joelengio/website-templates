import { theme } from '../config/theme';

/** Writes the theme config to CSS custom properties on <html>. */
export function applyTheme(root: HTMLElement = document.documentElement): void {
  const { colors, fonts, shape } = theme;
  const set = (name: string, value: string) => root.style.setProperty(name, value);
  const kebab = (s: string) => s.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
  for (const [k, v] of Object.entries(colors)) set(`--c-${kebab(k)}`, v);
  set('--font-heading', fonts.heading);
  set('--font-body', fonts.body);
  set('--radius', shape.radius);
  set('--radius-lg', shape.radiusLg);
}
