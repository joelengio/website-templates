import { theme } from '../config/theme';

/** Writes theme tokens as CSS custom properties on <html>. */
export function themeVariables(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(theme.colors)) vars[`--c-${k}`] = v;
  for (const [k, v] of Object.entries(theme.fonts)) vars[`--font-${k}`] = v;
  for (const [k, v] of Object.entries(theme.radius)) vars[`--r-${k}`] = v;
  return vars;
}

export function applyTheme(el: HTMLElement = document.documentElement) {
  for (const [k, v] of Object.entries(themeVariables())) el.style.setProperty(k, v);
}
