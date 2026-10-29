import { theme } from '../config/theme';

/** Writes the colours/fonts from src/config/theme.ts to CSS custom properties. */
export function applyTheme(root: HTMLElement = document.documentElement) {
  const c = theme.colors;
  const vars: Record<string, string> = {
    '--c-ink': c.ink,
    '--c-charcoal': c.charcoal,
    '--c-graphite': c.graphite,
    '--c-steel': c.steel,
    '--c-bone': c.bone,
    '--c-mist': c.mist,
    '--c-slate': c.slate,
    '--c-lime': c.lime,
    '--c-lime-ink': c.limeInk,
    '--c-lime-deep': c.limeDeep,
    '--c-line': c.line,
    '--c-line-light': c.lineLight,
    '--c-danger': c.danger,
    '--c-danger-light': c.dangerLight,
    '--font-display': theme.fonts.display,
    '--font-body': theme.fonts.body,
    '--r-sm': theme.radius.sm,
    '--r-md': theme.radius.md
  };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
