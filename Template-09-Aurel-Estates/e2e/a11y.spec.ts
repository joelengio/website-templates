import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/properties', '/properties/cedar-ridge', '/about', '/services', '/journal', '/journal/coastal-vs-hills', '/contact', '/compare', '/favorites', '/properties?type=Villa&sort=price-desc', '/does-not-exist'];

for (const r of routes) {
  test(`axe: no WCAG A/AA violations on ${r}`, async ({ page }) => {
    await page.goto(r);
    await page.locator('h1').first().waitFor();
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}.js .reveal{opacity:1!important;transform:none!important}' });
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
    expect(res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
}
