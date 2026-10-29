import type { ConsoleMessage, Page } from '@playwright/test';

export const routes = [
  '/', '/services', '/services/financial-planning', '/services/business-advisory', '/services/accounting-bookkeeping', '/services/tax-planning',
  '/services/wealth-planning', '/services/cash-flow-advisory', '/services/corporate-finance', '/services/startup-advisory',
  '/industries', '/industries/startups', '/industries/small-medium-businesses', '/industries/professional-services', '/industries/retail-ecommerce',
  '/industries/technology', '/industries/property-businesses', '/industries/established-enterprises',
  '/about', '/team', '/team/elena-marchetti', '/team/daniel-okafor', '/team/priya-raman', '/team/harold-bright', '/team/james-whitfield', '/team/marco-silva',
  '/pricing', '/tools', '/tools#loan', '/tools#break-even', '/insights', '/insights/understanding-compound-growth', '/book', '/contact', '/disclaimer',
];

export const viewports = [360, 390, 768, 1024, 1440];

/** Collects console errors / page errors / failed requests on a page. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
  });
  return errors;
}

/** Scrolls through the page so lazy images load, then returns the list of broken images. */
export async function brokenImages(page: Page): Promise<string[]> {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => (i.loading = 'eager'));
    await Promise.all(Array.from(document.images).map((i) => (i.complete ? null : new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); }))));
  });
  return page.evaluate(() => Array.from(document.images).filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
}

export async function horizontalOverflow(page: Page): Promise<{ doc: number; offenders: string[] }> {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders: string[] = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > vw + 1 || r.left < -1) {
        // Ignore content inside intentionally scrollable regions or off-screen skip links.
        if (el.closest('.table-scroll, .chart__frame, .stepper, .tabs, [aria-hidden="true"] svg, .skip-link, .mobile-menu')) return;
        if (el.classList.contains('sr-only') || el.closest('.sr-only')) return;
        offenders.push(`${el.tagName.toLowerCase()}.${(el as HTMLElement).className?.toString().slice(0, 40)} right=${Math.round(r.right)}`);
      }
    });
    return { doc: document.documentElement.scrollWidth - vw, offenders: offenders.slice(0, 6) };
  });
}
