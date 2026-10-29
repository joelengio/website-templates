import { theme } from '../config/theme';

/** Writes the colours/fonts from src/config/theme.ts to CSS custom properties. */
export function applyTheme(root: HTMLElement = document.documentElement) {
  const c = theme.colors;
  const vars: Record<string, string> = {
    '--c-ivory': c.ivory,
    '--c-white': c.white,
    '--c-mist': c.mist,
    '--c-mist-deep': c.mistDeep,
    '--c-navy': c.navy,
    '--c-navy-soft': c.navySoft,
    '--c-teal': c.teal,
    '--c-teal-ink': c.tealInk,
    '--c-teal-soft': c.tealSoft,
    '--c-sand': c.sand,
    '--c-coral': c.coral,
    '--c-ink': c.ink,
    '--c-muted': c.muted,
    '--c-line': c.line,
    '--c-field': c.fieldBorder,
    '--c-success': c.success,
    '--c-danger': c.danger,
    '--font-display': theme.fonts.display,
    '--font-body': theme.fonts.body,
    '--r-sm': theme.radius.sm,
    '--r-md': theme.radius.md,
    '--r-lg': theme.radius.lg
  };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
