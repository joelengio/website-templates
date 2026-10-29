import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { homeSections } from '../config/home';
import { site } from '../config/site';
import { theme } from '../config/theme';
import { commerce } from '../config/commerce';
import { productInputs } from '../config/products';
import { rebuildCatalog, getProductBySlug } from '../lib/catalog';
import { applyTheme } from '../lib/theme';
import { computeTotals, priceLines } from '../lib/pricing';
import { addItem } from '../state/actions';

const snapshot = { sections: homeSections.map((s) => ({ ...s })), name: site.brand.name, wordmark: site.brand.wordmark, phone: site.contact.phone, terracotta: theme.colors.terracotta };
const anySite = site as unknown as { brand: Record<string, string>; contact: Record<string, string>; announcement: Record<string, unknown> };
afterEach(() => {
  homeSections.splice(0, homeSections.length, ...snapshot.sections);
  anySite.brand.name = snapshot.name; anySite.brand.wordmark = snapshot.wordmark; anySite.contact.phone = snapshot.phone;
  theme.colors.terracotta = snapshot.terracotta;
});

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

describe('customisation propagates from src/config', () => {
  it('hides and reorders homepage sections', async () => {
    homeSections.find((s) => s.id === 'newsletter')!.enabled = false;
    homeSections.find((s) => s.id === 'testimonials')!.enabled = false;
    const [hero] = homeSections.splice(0, 1);
    homeSections.push(hero); // move hero to the end
    renderAt('/');
    await screen.findByRole('heading', { name: 'Find your focus' });
    expect(screen.queryByText('Notes from the studio')).toBeNull();
    expect(screen.queryByText('What customers say')).toBeNull();
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings[0]).toHaveTextContent('Objects for a quieter home');
    const first = document.querySelector('main')!.firstElementChild!;
    expect(first.getAttribute('aria-labelledby')).not.toBe('hero-title');
  });
  it('rebrands header, footer and announcement from site config', async () => {
    anySite.brand.name = 'LOTUS ROOM'; anySite.brand.wordmark = 'LOTUS'; anySite.contact.phone = '+1 (555) 010-9999';
    renderAt('/about');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getAllByText('LOTUS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('+1 (555) 010-9999').length).toBeGreaterThan(0);
    expect(screen.getByText(/LOTUS ROOM — a fictional demonstration business/)).toBeInTheDocument();
    expect(screen.getByText(/Free standard shipping on US orders over \$150/)).toBeInTheDocument();
  });
  it('credits the template publisher separately from the demo business', async () => {
    renderAt('/');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByText(/Template by OneStop Infinite/)).toBeInTheDocument();
  });
  it('a newly added product appears in the shop and can be bought', async () => {
    const original = productInputs[0];
    const user = userEvent.setup();
    productInputs.push({ ...original, id: 'MER-9999', slug: 'test-added-product', name: 'Test Added Product', sku: 'MER-TEST', price: 19.99, compareAtPrice: undefined, variants: original.variants.map((v) => ({ ...v, stock: 7 })) });
    rebuildCatalog();
    try {
      renderAt('/products/test-added-product');
      expect(await screen.findByRole('heading', { level: 1, name: 'Test Added Product' })).toBeInTheDocument();
      expect(screen.getAllByText('$19.99').length).toBeGreaterThan(0);
      await user.click(screen.getByRole('button', { name: 'Add to bag' }));
      expect(await screen.findByRole('dialog', { name: /Bag/ })).toBeInTheDocument();
    } finally { productInputs.pop(); rebuildCatalog(); }
    expect(getProductBySlug('test-added-product')).toBeUndefined();
  });
  it('changing a price changes every calculation (no hardcoded totals)', () => {
    const tote = productInputs.find((p) => p.slug === 'atelier-tote')!;
    const prev = tote.price;
    tote.price = 300; rebuildCatalog();
    try {
      const p = getProductBySlug('atelier-tote')!;
      addItem(p.id, p.variants[0].id, 1);
      const lines = priceLines([{ productId: p.id, variantId: p.variants[0].id, qty: 1 }]);
      expect(computeTotals({ lines }).subtotalMinor).toBe(30000);
    } finally { tote.price = prev; rebuildCatalog(); }
  });
  it('changing shipping and tax rules changes totals', () => {
    const zone = commerce.shipping.zones[0].methods[0];
    const prev = { price: zone.price, rate: commerce.tax.rates[0].ratePct };
    zone.price = 11; commerce.tax.rates[0].ratePct = 10;
    try {
      const t = computeTotals({ lines: [{ key: 'a', productId: 'a', variantId: 'a', qty: 1, unitMinor: 5000, lineMinor: 5000, maxQty: 5 }] });
      expect(t.shippingMinor).toBe(1100);
      expect(t.taxMinor).toBe(500);
    } finally { zone.price = prev.price; commerce.tax.rates[0].ratePct = prev.rate; }
  });
  it('applies theme colours as CSS variables', () => {
    theme.colors.terracotta = '#123456';
    applyTheme();
    expect(document.documentElement.style.getPropertyValue('--c-terracotta')).toBe('#123456');
    expect(document.documentElement.style.getPropertyValue('--font-display')).toContain('Instrument Serif');
  });
});
