import { describe, expect, it } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { cartStore, ordersStore, wishlistStore } from '../state/stores';
import { addItem } from '../state/actions';
import { getProductBySlug } from '../lib/catalog';

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
const variantId = (slug: string, label: string) => getProductBySlug(slug)!.variants.find((v) => v.label === label)!.id;
const pid = (slug: string) => getProductBySlug(slug)!.id;

describe('product page', () => {
  it('changing variants updates price, image, stock message and add-to-bag availability', async () => {
    const user = userEvent.setup();
    renderAt('/products/stoneware-vase');
    await screen.findByRole('heading', { level: 1, name: 'Hand-Glazed Stoneware Vase' });
    const main = () => within(screen.getByRole('group', { name: /images/ })).getAllByRole('img')[0];
    expect(main()).toHaveAttribute('alt', 'Hand-Glazed Stoneware Vase in Chalk');
    expect(screen.getAllByText('$98').length).toBeGreaterThan(0);
    await user.click(screen.getByRole('radio', { name: /Size Large/ }));
    expect(screen.getAllByText('$138').length).toBeGreaterThan(0);
    await user.click(screen.getByRole('radio', { name: /Color Clay/ }));
    expect(main()).toHaveAttribute('alt', 'Hand-Glazed Stoneware Vase in Clay');
    expect(screen.getByText(/In stock \(demonstration inventory\)/)).toBeInTheDocument();
  });

  it('shows low stock, limits quantity to stock and adds the right variant to the bag', async () => {
    const user = userEvent.setup();
    renderAt('/products/merino-crew');
    await screen.findByRole('heading', { level: 1, name: 'Merino Crewneck' });
    await user.click(screen.getByRole('radio', { name: /Color Charcoal/ }));
    await user.click(screen.getByRole('radio', { name: /Size XL/ }));
    expect(screen.getByText(/Only 2 left \(demonstration inventory\)/)).toBeInTheDocument();
    const inc = screen.getByRole('button', { name: /Increase quantity/ });
    await user.click(inc); await user.click(inc);
    expect(screen.getByRole('textbox', { name: /Quantity/ })).toHaveValue('2');
    expect(inc).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Add to bag' }));
    const dialog = await screen.findByRole('dialog', { name: /Bag/ });
    expect(within(dialog).getByText('Charcoal / XL')).toBeInTheDocument();
    expect(cartStore.get().lines).toEqual([{ productId: pid('merino-crew'), variantId: variantId('merino-crew', 'Charcoal / XL'), qty: 2 }]);
    // announced for screen readers
    expect(screen.getAllByRole('status').some((n) => /Added 2/.test(n.textContent ?? ''))).toBe(true);
    // adding again is refused: the stock limit is reached
    await user.click(within(dialog).getByRole('button', { name: 'Close bag' }));
    await user.click(screen.getByRole('button', { name: 'Add to bag' }));
    expect(cartStore.get().lines[0].qty).toBe(2);
  });

  it('prevents adding a sold-out variant', async () => {
    const user = userEvent.setup();
    renderAt('/products/slim-cardholder');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('radio', { name: /Color Sand/ }));
    expect(screen.getByText(/Sold out \(demonstration inventory\)/)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Sold out' });
    expect(btn).toBeDisabled();
    expect(cartStore.get().lines).toEqual([]);
  });

  it('shows fully sold-out and coming-soon products without a way to buy', async () => {
    const first = renderAt('/products/bud-vase');
    expect(await screen.findByRole('button', { name: 'Sold out' })).toBeDisabled();
    first.unmount();
    renderAt('/products/weekender-duffel');
    expect(await screen.findByRole('button', { name: 'Coming soon' })).toBeDisabled();
  });

  it('opens the fullscreen viewer and navigates with the keyboard', async () => {
    const user = userEvent.setup();
    renderAt('/products/atelier-tote');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('button', { name: /full screen/ }));
    const dialog = screen.getByRole('dialog', { name: 'Product image viewer' });
    expect(within(dialog).getByText('Image 1 of 4')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(within(dialog).getByText('Image 2 of 4')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(within(dialog).getByText('Image 4 of 4')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Product image viewer' })).toBeNull();
  });

  it('records recently viewed products and shows them on the next product page', async () => {
    const first = renderAt('/products/linen-shirt');
    await screen.findByRole('heading', { level: 1, name: 'Washed Linen Shirt' });
    first.unmount();
    renderAt('/products/merino-crew');
    expect(await screen.findByRole('heading', { name: 'Recently viewed' })).toBeInTheDocument();
  });

  it('shows the custom 404 for unknown products', async () => {
    renderAt('/products/does-not-exist');
    expect(await screen.findByRole('heading', { name: /couldn’t find that page/ })).toBeInTheDocument();
  });
});

describe('bag', () => {
  it('shows the empty state', async () => {
    renderAt('/cart');
    expect(await screen.findByRole('heading', { name: 'Your bag is empty', level: 2 })).toBeInTheDocument();
  });

  it('updates quantities, applies coupons and keeps totals consistent', async () => {
    const user = userEvent.setup();
    addItem(pid('atelier-tote'), variantId('atelier-tote', 'Cognac'), 1);
    addItem(pid('slim-cardholder'), variantId('slim-cardholder', 'Ink'), 1);
    renderAt('/cart');
    await screen.findByRole('heading', { name: /Bag \(2\)/ });
    const summary = screen.getByRole('complementary', { name: 'Order summary' });
    expect(within(summary).getByText('$353.00')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Increase quantity — Slim Leather Cardholder/ }));
    expect(within(summary).getByText('$421.00')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Promo code'), 'bogus');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect((await screen.findAllByText(/“BOGUS” is not a valid promo code/)).length).toBeGreaterThan(0);
    await user.clear(screen.getByLabelText('Promo code'));
    await user.type(screen.getByLabelText('Promo code'), 'welcome10');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(await screen.findByText(/applied/)).toBeInTheDocument();
    expect(within(summary).getByText('−$42.10')).toBeInTheDocument();
    expect(within(summary).getByText('Free')).toBeInTheDocument();
    // total = 421.00 − 42.10 + 6% tax on 378.90 (22.73)
    expect(within(summary).getByText('$401.63')).toBeInTheDocument();
  });

  it('removes lines and clears the bag with confirmation', async () => {
    const user = userEvent.setup();
    addItem(pid('atelier-tote'), variantId('atelier-tote', 'Cognac'), 1);
    addItem(pid('soy-candle'), variantId('soy-candle', 'Fig'), 1);
    renderAt('/cart');
    await screen.findByRole('heading', { name: /Bag \(2\)/ });
    await user.click(screen.getByRole('button', { name: /Remove Soy Wax Candle, Fig from bag/ }));
    expect(cartStore.get().lines).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Clear bag' }));
    await user.click(screen.getByRole('button', { name: 'Yes, clear bag' }));
    expect(cartStore.get().lines).toEqual([]);
    expect(await screen.findByRole('heading', { name: 'Your bag is empty', level: 2 })).toBeInTheDocument();
  });

  it('clamps a typed excessive quantity to stock', async () => {
    const user = userEvent.setup();
    addItem(pid('atelier-tote'), variantId('atelier-tote', 'Ink'), 1);
    renderAt('/cart');
    const input = await screen.findByRole('textbox', { name: /Quantity — Atelier Leather Tote, Ink/ });
    await user.clear(input); await user.type(input, '99'); await user.tab();
    expect(cartStore.get().lines[0].qty).toBe(3);
  });

  it('flags and blocks checkout for lines that became unavailable', async () => {
    window.localStorage.setItem('meridian-store:cart:v1', JSON.stringify({ lines: [{ productId: pid('slim-cardholder'), variantId: variantId('slim-cardholder', 'Sand'), qty: 1 }] }));
    cartStore.reload();
    renderAt('/cart');
    expect(await screen.findByText(/Sold out — remove this item/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Checkout/ })).toBeDisabled();
  });

  it('opens the slide-out bag from the header and closes it with Escape', async () => {
    const user = userEvent.setup();
    addItem(pid('atelier-tote'), variantId('atelier-tote', 'Cognac'), 1);
    renderAt('/');
    const trigger = await screen.findByRole('button', { name: /Bag, 1 item/ });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: /Bag/ })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('wishlist', () => {
  it('adds from a product card, persists, and moves to the bag', async () => {
    const user = userEvent.setup();
    renderAt('/shop?q=MER-CARD');
    await user.click(await screen.findByRole('button', { name: 'Add Slim Leather Cardholder to wishlist' }));
    expect(wishlistStore.get().ids).toEqual([pid('slim-cardholder')]);
    expect(JSON.parse(window.localStorage.getItem('meridian-store:wishlist:v1')!).ids).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Remove Slim Leather Cardholder from wishlist' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('lists saved products and supports moving them to the bag', async () => {
    const user = userEvent.setup();
    wishlistStore.set({ ids: [pid('soy-candle')] });
    renderAt('/wishlist');
    await screen.findByRole('heading', { name: /Wishlist \(1\)/ });
    await user.selectOptions(screen.getByLabelText('Choose option'), 'Cedar');
    await user.click(screen.getByRole('button', { name: 'Move to bag' }));
    expect(cartStore.get().lines[0].variantId).toBe(variantId('soy-candle', 'Cedar'));
    expect(wishlistStore.get().ids).toEqual([]);
  });
  it('shows an empty state', async () => {
    renderAt('/wishlist');
    expect(await screen.findByRole('heading', { name: 'Your wishlist is empty' })).toBeInTheDocument();
  });
});

describe('shop filters', () => {
  it('filters from deep links, shows chips and resets', async () => {
    const user = userEvent.setup();
    renderAt('/shop?category=beauty&sort=price-asc');
    await screen.findByRole('heading', { name: 'Shop all products', level: 1 });
    expect(await screen.findByText('7 products')).toBeInTheDocument();
    const chips = screen.getByRole('list', { name: 'Active filters' });
    expect(within(chips).getByRole('button', { name: 'Remove filter: Beauty & Fragrance' })).toBeInTheDocument();
    await user.click(within(chips).getAllByRole('button', { name: 'Reset all' })[0]);
    expect(await screen.findByText('33 products')).toBeInTheDocument();
  });
  it('searches and shows a helpful empty state', async () => {
    const user = userEvent.setup();
    renderAt('/shop');
    await user.type(await screen.findByLabelText('Search products'), 'zzzz');
    expect(await screen.findByText('0 products')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'No products match your filters' })).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Reset filters' })[0]);
    expect(await screen.findByText('33 products')).toBeInTheDocument();
  });
  it('sorts by price', async () => {
    renderAt('/shop?sort=price-desc');
    const grid = await screen.findAllByRole('heading', { level: 3 });
    expect(grid[0]).toHaveTextContent('Travertine Side Table');
  });
  it('applies the in-stock and price filters together', async () => {
    const user = userEvent.setup();
    renderAt('/shop');
    await screen.findByText('33 products');
    const aside = screen.getByRole('complementary', { name: 'Filters' });
    await user.click(within(aside).getByRole('checkbox', { name: /In stock only/ }));
    await user.click(within(aside).getByRole('button', { name: 'Under $50' }));
    await waitFor(() => expect(screen.getByText(/products?$/, { selector: '.results-count' }).textContent).toMatch(/^\d+ products?$/));
    const count = Number(screen.getByText(/products?$/, { selector: '.results-count' }).textContent!.split(' ')[0]);
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(33);
  });
});

describe('collections, journal and static pages', () => {
  it('renders a collection with related collections', async () => {
    renderAt('/collections/leather-atelier');
    expect(await screen.findByRole('heading', { level: 1, name: 'The Leather Atelier' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Related collections' })).toBeInTheDocument();
  });
  it('lists at least six collections', async () => {
    renderAt('/collections');
    await screen.findByRole('heading', { level: 1, name: 'Collections' });
    expect(screen.getAllByRole('link', { name: /products/ }).length).toBeGreaterThanOrEqual(6);
  });
  it('filters journal articles by category and search', async () => {
    const user = userEvent.setup();
    renderAt('/journal');
    await screen.findByRole('heading', { level: 1, name: 'Stories and styling' });
    await user.click(screen.getByRole('button', { name: 'Craft' }));
    expect(screen.getByText('2 articles')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Search articles'), 'zzzz');
    expect(screen.getByRole('heading', { name: 'No articles found' })).toBeInTheDocument();
  });
  it('renders an article with shoppable products', async () => {
    renderAt('/journal/carrying-less-better');
    expect(await screen.findByRole('heading', { level: 1, name: 'Carrying less, better' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'The carry edit' })).toBeInTheDocument();
  });
  it('renders FAQ, contact, about, demo info and legal pages', async () => {
    for (const [path, name] of [['/faq', /Help & frequently asked questions/], ['/contact', 'Contact us'], ['/about', 'A store built on restraint'], ['/demo', 'How this demo works'], ['/legal/privacy', 'Privacy & local storage']] as const) {
      const { unmount } = renderAt(path);
      expect(await screen.findByRole('heading', { level: 1, name })).toBeInTheDocument();
      unmount();
    }
  });
  it('validates the contact form and confirms honestly', async () => {
    const user = userEvent.setup();
    renderAt('/contact');
    await user.click(await screen.findByRole('button', { name: 'Send message (demo)' }));
    expect(screen.getByText('Enter your name (at least 2 characters).')).toBeInTheDocument();
    expect(screen.getByLabelText('Your name')).toHaveAttribute('aria-invalid', 'true');
    await user.type(screen.getByLabelText('Your name'), 'Alex Sample');
    await user.type(screen.getByLabelText('Email'), 'alex@example.com');
    await user.selectOptions(screen.getByLabelText('Topic'), 'Product question');
    await user.type(screen.getByLabelText('Message'), 'Is the tote available in more colours?');
    await user.click(screen.getByRole('button', { name: 'Send message (demo)' }));
    expect(await screen.findByText(/not sent or stored/)).toBeInTheDocument();
  });
  it('validates the newsletter demo form', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const email = await screen.findByPlaceholderText('Your email address');
    await user.type(email, 'nope');
    await user.click(screen.getByRole('button', { name: 'Subscribe (demo)' }));
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    await user.clear(email); await user.type(email, 'a@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe (demo)' }));
    expect(await screen.findByText(/nothing was saved or sent/)).toBeInTheDocument();
  });
  it('shows the 404 page for unknown routes', async () => {
    renderAt('/no/such/page');
    expect(await screen.findByRole('heading', { name: /couldn’t find that page/ })).toBeInTheDocument();
  });
});

describe('demonstration checkout', () => {
  const fill = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('Email'), 'alex@example.com');
    await user.type(screen.getByLabelText('First name'), 'Alex');
    await user.type(screen.getByLabelText('Last name'), 'Sample');
    await user.type(screen.getByLabelText('Address'), '12 Sample Street');
    await user.type(screen.getByLabelText('City'), 'Portland');
    await user.type(screen.getByLabelText('State'), 'TX');
    await user.type(screen.getByLabelText('Postal code'), '97205');
  };

  it('is blocked with an empty bag', async () => {
    renderAt('/checkout');
    expect(await screen.findByRole('heading', { name: 'Your bag is empty' })).toBeInTheDocument();
    expect(screen.getByText(/DEMONSTRATION checkout/)).toBeInTheDocument();
  });

  it('walks the full flow, validates, and saves a demo order without taking payment', async () => {
    const user = userEvent.setup();
    addItem(pid('atelier-tote'), variantId('atelier-tote', 'Cognac'), 1);
    addItem(pid('slim-cardholder'), variantId('slim-cardholder', 'Ink'), 2);
    renderAt('/checkout');
    await screen.findByRole('heading', { name: 'Review your bag' });
    expect(screen.getByText(/No payment is requested|DEMONSTRATION checkout/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue to details' }));

    // validation
    await user.click(screen.getByRole('button', { name: 'Continue to delivery' }));
    expect((await screen.findAllByText('Enter an email address.')).length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    await user.type(screen.getByLabelText('Address'), '4242 4242 4242 4242');
    await user.click(screen.getByRole('button', { name: 'Continue to delivery' }));
    expect(screen.getAllByText(/looks like a card number/).length).toBeGreaterThan(0);
    await user.clear(screen.getByLabelText('Address'));

    await fill(user);
    await user.type(screen.getByLabelText('Postal code'), 'x');
    await user.click(screen.getByRole('button', { name: 'Continue to delivery' }));
    expect(screen.getAllByText(/5-digit ZIP/).length).toBeGreaterThan(0);
    await user.clear(screen.getByLabelText('Postal code')); await user.type(screen.getByLabelText('Postal code'), '97205');
    await user.click(screen.getByRole('button', { name: 'Continue to delivery' }));

    // delivery
    await screen.findByRole('heading', { name: 'Choose a delivery method' });
    await user.click(screen.getByRole('radio', { name: /Express delivery/ }));
    const summary = screen.getByRole('complementary', { name: 'Order summary' });
    expect(within(summary).getByText('$22.00')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue to review' }));

    // review: must acknowledge
    await screen.findByRole('heading', { name: /Review and confirm your DEMO order/ });
    expect(screen.queryByLabelText(/card number/i)).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Confirm DEMO order' }));
    expect(screen.getByText(/tick the box/)).toBeInTheDocument();
    expect(ordersStore.get().orders).toHaveLength(0);
    await user.click(screen.getByRole('checkbox', { name: /I understand this is a demonstration/ }));
    await user.click(screen.getByRole('button', { name: 'Confirm DEMO order' }));

    // confirmation
    expect(await screen.findByRole('heading', { name: 'Your DEMO order summary' })).toBeInTheDocument();
    expect(screen.getByText(/No order was placed, no payment was taken/)).toBeInTheDocument();
    const [order] = ordersStore.get().orders;
    expect(order.reference).toMatch(/^MER-DEMO-\d{6}-[A-Z2-9]{4}$/);
    // 285 + 2×68 = 421.00; shipping express 22.00; tax 6% of 421.00 = 25.26
    expect(order.totals).toMatchObject({ subtotalMinor: 42100, shippingMinor: 2200, taxMinor: 2526, totalMinor: 42100 + 2200 + 2526 });
    expect(cartStore.get().lines).toEqual([]);
    expect(JSON.stringify(order)).not.toMatch(/cvv|password|card ?number|expiry/i);
  });

  it('lists past demo orders and opens them', async () => {
    const user = userEvent.setup();
    addItem(pid('soy-candle'), variantId('soy-candle', 'Fig'), 1);
    renderAt('/checkout');
    await user.click(await screen.findByRole('button', { name: 'Continue to details' }));
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Continue to delivery' }));
    await user.click(await screen.findByRole('button', { name: 'Continue to review' }));
    await user.click(await screen.findByRole('checkbox', { name: /I understand/ }));
    await user.click(screen.getByRole('button', { name: 'Confirm DEMO order' }));
    const first = { unmount: () => undefined };
    await screen.findByRole('heading', { name: 'Your DEMO order summary' });
    const { reference } = ordersStore.get().orders[0];
    first.unmount();
    renderAt('/orders');
    const link = await screen.findByRole('link', { name: new RegExp(reference) });
    await user.click(link);
    expect(await screen.findByRole('heading', { name: `Demo order ${reference}` })).toBeInTheDocument();
  });

  it('blocks confirmation if stock changed after the bag was built', async () => {
    const user = userEvent.setup();
    addItem(pid('atelier-tote'), variantId('atelier-tote', 'Ink'), 3);
    renderAt('/checkout');
    await user.click(await screen.findByRole('button', { name: 'Continue to details' }));
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Continue to delivery' }));
    await user.click(await screen.findByRole('button', { name: 'Continue to review' }));
    await user.click(await screen.findByRole('checkbox', { name: /I understand/ }));
    // simulate stock change/tampering
    window.localStorage.setItem('meridian-store:cart:v1', JSON.stringify({ lines: [{ productId: pid('atelier-tote'), variantId: variantId('atelier-tote', 'Ink'), qty: 3 }] }));
    const v = getProductBySlug('atelier-tote')!.variants.find((x) => x.label === 'Ink')!;
    const original = v.stock; v.stock = 1;
    try {
      await user.click(screen.getByRole('button', { name: 'Confirm DEMO order' }));
      expect(await screen.findByText(/no longer available in the requested quantity/)).toBeInTheDocument();
      expect(ordersStore.get().orders).toHaveLength(0);
    } finally { v.stock = original; }
  });

  it('shows an order-not-found state for unknown references and an empty history', async () => {
    const first = renderAt('/orders/MER-DEMO-000000-ZZZZ');
    expect(await screen.findByRole('heading', { name: /can’t find that demo order/ })).toBeInTheDocument();
    first.unmount();
    renderAt('/orders');
    expect(await screen.findByRole('heading', { name: 'No demo orders yet' })).toBeInTheDocument();
  });

  it('can reset all demo data', async () => {
    const user = userEvent.setup();
    addItem(pid('soy-candle'), variantId('soy-candle', 'Fig'), 1);
    wishlistStore.set({ ids: [pid('soy-candle')] });
    renderAt('/demo');
    await user.click(await screen.findByRole('button', { name: 'Reset demo data' }));
    await user.click(screen.getByRole('button', { name: 'Yes, reset everything' }));
    expect(cartStore.get().lines).toEqual([]);
    expect(wishlistStore.get().ids).toEqual([]);
  });
});
