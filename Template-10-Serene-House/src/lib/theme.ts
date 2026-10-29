import { theme } from '../config/theme';

/** Writes the colours/fonts from src/config/theme.ts to CSS custom properties. */
export function applyTheme(root: HTMLElement = document.documentElement) {
  const c = theme.colors;
  const vars: Record<string, string> = {
    '--c-ivory': c.ivory,
    '--c-cream': c.cream,
    '--c-sand': c.sand,
    '--c-sage': c.sage,
    '--c-olive': c.olive,
    '--c-forest': c.forest,
    '--c-gold': c.gold,
    '--c-gold-ink': c.goldInk,
    '--c-wood': c.wood,
    '--c-ink': c.ink,
    '--c-muted': c.muted,
    '--c-line': c.line,
    '--font-display': theme.fonts.display,
    '--font-body': theme.fonts.body,
    '--r-sm': theme.radius.sm,
    '--r-md': theme.radius.md
  };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
