import { theme } from '../config/theme';

/** Writes the theme config to CSS custom properties on <html>. */
export function applyTheme(root: HTMLElement = document.documentElement): void {
  const { colors, fonts, shape } = theme;
  const set = (name: string, value: string) => root.style.setProperty(name, value);
  set('--c-forest', colors.forest);
  set('--c-forest-deep', colors.forestDeep);
  set('--c-forest-soft', colors.forestSoft);
  set('--c-ivory', colors.ivory);
  set('--c-ivory-deep', colors.ivoryDeep);
  set('--c-paper', colors.paper);
  set('--c-brass', colors.brass);
  set('--c-brass-deep', colors.brassDeep);
  set('--c-ink', colors.ink);
  set('--c-muted', colors.muted);
  set('--c-line', colors.line);
  set('--c-danger', colors.danger);
  set('--c-success', colors.success);
  set('--font-display', fonts.display);
  set('--font-body', fonts.body);
  set('--radius', shape.radius);
  set('--radius-lg', shape.radiusLarge);
  set('--max-w', shape.maxWidth);
}
