import { theme } from '../config/theme';

/** Writes the colours/fonts from src/config/theme.ts to CSS custom properties. */
export function applyTheme(root: HTMLElement = document.documentElement) {
  const c = theme.colors;
  const vars: Record<string, string> = {
    '--c-ivory': c.ivory,
    '--c-cream': c.cream,
    '--c-champagne': c.champagne,
    '--c-champagne-deep': c.champagneDeep,
    '--c-rose': c.rose,
    '--c-rose-deep': c.roseDeep,
    '--c-sage': c.sage,
    '--c-sage-deep': c.sageDeep,
    '--c-burgundy': c.burgundy,
    '--c-burgundy-deep': c.burgundyDeep,
    '--c-ink': c.ink,
    '--c-muted': c.muted,
    '--c-line': c.line,
    '--font-display': theme.fonts.display,
    '--font-body': theme.fonts.body,
    '--r-sm': theme.radius.sm,
    '--r-arch': theme.radius.arch
  };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
