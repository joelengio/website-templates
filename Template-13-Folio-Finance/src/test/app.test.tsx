import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import { homeSections } from '../config/layout';
import { plans } from '../config/plans';
import { site } from '../config/site';
import { services } from '../config/services';
import { calculators } from '../config/calculators';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('routing and shell', () => {
  it('renders the home page with hero, navigation and footer', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: /Money decisions/ })).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const label of ['Services', 'Pricing', 'Tools', 'Team', 'Insights', 'Contact']) expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toHaveTextContent(site.owner.name);
  });

  it('shows a 404 page for unknown routes and unknown slugs', async () => {
    renderAt('/does-not-exist');
    expect(await screen.findByRole('heading', { name: /could not be found/i })).toBeInTheDocument();
  });
  it('shows 404 for an unknown service, team member, article and industry', async () => {
    for (const p of ['/services/nope', '/team/nope', '/insights/nope', '/industries/nope']) {
      const { unmount } = renderAt(p);
      expect(await screen.findByRole('heading', { name: /could not be found/i })).toBeInTheDocument();
      unmount();
    }
  });
  it('opens and closes the mobile menu with the keyboard', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const toggle = await screen.findByRole('button', { name: /open menu/i });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: /site menu/i })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /site menu/i })).not.toBeInTheDocument();
  });
  it('marks the current route in the navigation', async () => {
    renderAt('/pricing');
    await screen.findByRole('heading', { level: 1, name: /Engagement plans/ });
    const link = within(screen.getByRole('navigation', { name: 'Primary' })).getByRole('link', { name: 'Pricing' });
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});

describe('services', () => {
  it('filters by category and search, and shows an empty state', async () => {
    const user = userEvent.setup();
    renderAt('/services');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByText(`Showing ${services.length} of ${services.length} services`)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Individuals & families' }));
    expect(screen.getByRole('button', { name: 'Individuals & families' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: 'Wealth Planning' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Corporate Finance' })).not.toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: /search services/i }), 'zzzzqq');
    expect(await screen.findByRole('heading', { name: 'No services found' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText(`Showing ${services.length} of ${services.length} services`)).toBeInTheDocument();
  });
  it('navigates from the listing to a working detail route', async () => {
    const user = userEvent.setup();
    renderAt('/services');
    await user.click(await screen.findByRole('link', { name: 'Tax Planning' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Tax Planning' })).toBeInTheDocument();
    for (const h of ['What you receive', 'Ideal client', 'Benefits', 'Our process']) expect(screen.getByRole('heading', { name: h })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /book a consultation/i }).length).toBeGreaterThan(0);
  });
  it('renders every service detail route', async () => {
    for (const s of services) {
      const { unmount } = renderAt(`/services/${s.slug}`);
      expect(await screen.findByRole('heading', { level: 1, name: s.name })).toBeInTheDocument();
      unmount();
    }
  });
});

describe('pricing', () => {
  it('toggles billing cycle and recalculates every plan', async () => {
    const user = userEvent.setup();
    renderAt('/pricing');
    const adv = await screen.findByTestId('price-advisory');
    expect(adv).toHaveTextContent('$640');
    await user.click(screen.getByRole('button', { name: /Annual/ }));
    expect(screen.getByTestId('price-advisory')).toHaveTextContent('$6,297.60');
    expect(screen.getByRole('button', { name: /Annual/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('price-foundation')).toHaveTextContent('$2,448');
    await user.click(screen.getByRole('button', { name: 'Monthly' }));
    expect(screen.getByTestId('price-advisory')).toHaveTextContent('$640');
  });
  it('adds optional add-ons into the totals', async () => {
    const user = userEvent.setup();
    renderAt('/pricing');
    await screen.findByTestId('price-advisory');
    await user.click(screen.getByRole('checkbox', { name: /Monthly bookkeeping/ }));
    expect(screen.getByTestId('price-advisory')).toHaveTextContent('$1,060');
    expect(screen.getByTestId('price-foundation')).toHaveTextContent('$660');
  });
  it('shows the demonstration notice and links plan inquiries to the contact form', async () => {
    renderAt('/pricing');
    expect(await screen.findByText(/demonstration values/i)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: 'Ask about Advisory' });
    expect(cta.getAttribute('href')).toContain('/contact?');
    expect(cta.getAttribute('href')).toContain('plan=advisory');
    expect(screen.getByRole('table', { name: /comparison of engagement plans/i })).toBeInTheDocument();
  });
});

describe('calculators', () => {
  it('compound: shows results, validates and resets', async () => {
    const user = userEvent.setup();
    renderAt('/tools');
    expect(await screen.findByTestId('compound-fv')).toHaveTextContent('$150,436.50');
    expect(screen.getByTestId('compound-contrib')).toHaveTextContent('$82,000.00');
    expect(screen.getByTestId('compound-growth')).toHaveTextContent('$68,436.50');
    const rate = screen.getByLabelText('Annual return assumption');
    await user.clear(rate);
    await user.type(rate, '0');
    expect(screen.getByTestId('compound-fv')).toHaveTextContent('$82,000.00');
    await user.clear(rate);
    await user.type(rate, '99');
    expect(screen.getByText(/cannot exceed 30%/)).toBeInTheDocument();
    expect(screen.queryByTestId('compound-fv')).not.toBeInTheDocument();
    expect(rate).toHaveAttribute('aria-invalid', 'true');
    await user.click(screen.getByRole('button', { name: /reset to defaults/i }));
    expect(screen.getByTestId('compound-fv')).toHaveTextContent('$150,436.50');
    expect(screen.getByLabelText('Annual return assumption')).toHaveValue(String(calculators.compound.defaults.annualRate));
  });
  it('loan: computes payment and shows the schedule', async () => {
    const user = userEvent.setup();
    renderAt('/tools#loan');
    expect(await screen.findByTestId('loan-payment')).toHaveTextContent('$1,688.02');
    expect(screen.getByTestId('loan-total')).toBeInTheDocument();
    const amount = screen.getByLabelText('Loan amount');
    await user.clear(amount);
    await user.type(amount, '0');
    expect(screen.getByText(/must be greater than 0/)).toBeInTheDocument();
    await user.clear(amount);
    await user.type(amount, '12000');
    const rate = screen.getByLabelText('Annual interest rate');
    await user.clear(rate);
    await user.type(rate, '0');
    const term = screen.getByLabelText('Loan term');
    await user.clear(term);
    await user.type(term, '1');
    expect(screen.getByTestId('loan-payment')).toHaveTextContent('$1,000.00');
    expect(screen.getByTestId('loan-interest')).toHaveTextContent('$0.00');
    await user.click(screen.getByRole('button', { name: /every monthly payment/i }));
    expect(screen.getByRole('table', { name: /monthly amortization schedule/i })).toBeInTheDocument();
  });
  it('break-even: computes, validates and flags impossible scenarios', async () => {
    const user = userEvent.setup();
    renderAt('/tools#break-even');
    expect(await screen.findByTestId('be-units')).toHaveTextContent('750');
    expect(screen.getByTestId('be-revenue')).toHaveTextContent('$33,750.00');
    const price = screen.getByLabelText('Selling price per unit');
    await user.clear(price);
    await user.type(price, '15');
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot break even/i);
    expect(screen.queryByTestId('be-units')).not.toBeInTheDocument();
    await user.clear(price);
    await user.type(price, 'abc');
    expect(screen.getByText(/must be a number/i)).toBeInTheDocument();
  });
  it('tabs are keyboard operable', async () => {
    const user = userEvent.setup();
    renderAt('/tools');
    const tab = await screen.findByRole('tab', { name: /savings growth/i });
    tab.focus();
    await user.keyboard('{ArrowRight}');
    expect(await screen.findByTestId('loan-payment')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /loan payment/i })).toHaveAttribute('aria-selected', 'true');
  });
  it('states disclaimers and the display-currency note', async () => {
    renderAt('/tools');
    expect(await screen.findAllByText(/not forecasts, personal recommendations or guarantees/i)).not.toHaveLength(0);
    expect(screen.getAllByText(/display currency only/i).length).toBeGreaterThan(0);
  });
});

describe('insights', () => {
  it('searches, filters, opens an article and shows related items', async () => {
    const user = userEvent.setup();
    renderAt('/insights');
    await screen.findByRole('heading', { level: 1, name: 'The journal.' });
    await user.type(screen.getByRole('searchbox', { name: /search articles/i }), 'runway');
    expect(screen.getByRole('link', { name: /founder’s guide to runway/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /one-page financial plan/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /founder’s guide to runway/i }));
    expect(await screen.findByRole('heading', { level: 1, name: /guide to runway/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Related articles' })).toBeInTheDocument();
  });
  it('shows an empty state with no results', async () => {
    const user = userEvent.setup();
    renderAt('/insights');
    await user.type(await screen.findByRole('searchbox', { name: /search articles/i }), 'qwertyuiop');
    expect(await screen.findByRole('heading', { name: 'No articles found' })).toBeInTheDocument();
  });
});

describe('contact form', () => {
  it('validates fields and never claims a message was sent without a backend', async () => {
    const user = userEvent.setup();
    renderAt('/contact');
    await user.click(await screen.findByRole('button', { name: 'Submit enquiry' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/Please fix 3 fields/);
    expect(screen.getAllByText('Enter your name.')).toHaveLength(2);
    await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await user.type(screen.getByLabelText('Your message'), 'Hello, I would like to discuss a plan.');
    await user.click(screen.getByRole('button', { name: 'Submit enquiry' }));
    expect(await screen.findByRole('heading', { name: /Not sent — this is a demonstration/ })).toBeInTheDocument();
    expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open in my email app/i }).getAttribute('href')).toMatch(/^mailto:/);
  });
  it('blocks sensitive number sequences', async () => {
    const user = userEvent.setup();
    renderAt('/contact');
    await user.type(await screen.findByLabelText('Full name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await user.type(screen.getByLabelText('Your message'), 'My account number is 123456789012 please help');
    await user.click(screen.getByRole('button', { name: 'Submit enquiry' }));
    expect(screen.getAllByText(/never share sensitive financial details/i).length).toBeGreaterThan(0);
  });
  it('prefills from a plan inquiry', async () => {
    renderAt('/contact?category=Plan%20%2F%20pricing%20question&plan=partnership&cycle=annual');
    expect(await screen.findByLabelText('Enquiry category')).toHaveValue('Plan / pricing question');
    expect(screen.getByText(/Partnership plan, annual billing/)).toBeInTheDocument();
    expect(screen.getByLabelText('Your message')).toHaveValue("I'd like to know more about the Partnership plan.");
  });
});

describe('booking flow', () => {
  it('books, persists, shows in the list and cancels via an accessible dialog', async () => {
    const user = userEvent.setup();
    renderAt('/book?service=tax-planning');
    expect(await screen.findByText(/not delivered to any firm/i)).toBeInTheDocument();
    // 1 service (pre-selected from the URL)
    expect(screen.getByRole('radio', { name: /Tax Planning/ })).toBeChecked();
    await user.click(screen.getByRole('button', { name: /continue/i }));
    // 2 type — validation first
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/choose a consultation type/i);
    await user.click(screen.getByRole('radio', { name: /Introductory call/ }));
    await user.click(screen.getByRole('button', { name: /continue/i }));
    // 3 date
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/select an available date/i);
    const grid = screen.getByRole('grid');
    const day = within(grid).getAllByRole('button').find((b) => b.getAttribute('aria-disabled') === 'false')!;
    await user.click(day);
    expect(day).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: /continue/i }));
    // 4 time
    const slot = screen.getAllByRole('radio').find((r) => !(r as HTMLInputElement).disabled)!;
    await user.click(slot);
    await user.click(screen.getByRole('button', { name: /continue/i }));
    // 5 details — validation
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText('Enter your name.')).toBeInTheDocument();
    expect(screen.getByText(/confirm you understand/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /continue/i }));
    // 6 review + confirm
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /confirm demo reservation/i }));
    const ref = await screen.findByTestId('reference');
    expect(ref.textContent).toMatch(/^FF-[A-Z0-9]{6}$/);
    expect(screen.getByRole('heading', { name: /demo reservation confirmed/i })).toBeInTheDocument();
    // persisted
    const stored = JSON.parse(window.localStorage.getItem('folio-finance:appointments')!);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ serviceSlug: 'tax-planning', typeId: 'intro', name: 'Ada Lovelace' });
    expect(screen.getAllByTestId('appointment')).toHaveLength(1);
    // cancel
    await user.click(screen.getByRole('button', { name: new RegExp(`cancel appointment ${stored[0].reference}`, 'i') }));
    const dialog = screen.getByRole('dialog', { name: /cancel this demo appointment/i });
    await user.click(within(dialog).getByRole('button', { name: /yes, cancel it/i }));
    await waitFor(() => expect(screen.queryAllByTestId('appointment')).toHaveLength(0));
    expect(JSON.parse(window.localStorage.getItem('folio-finance:appointments')!)).toEqual([]);
    expect(screen.getByRole('heading', { name: /no saved demo appointments/i })).toBeInTheDocument();
  });
  it('lets the user keep an appointment when dismissing the dialog with Escape', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      'folio-finance:appointments',
      JSON.stringify([{ id: 'x', reference: 'FF-ABC234', serviceSlug: 'tax-planning', typeId: 'intro', date: '2030-01-07', time: '10:00', duration: 30, name: 'Ada', email: 'a@b.co', phone: '', note: '', createdAt: '2026-01-01T00:00:00Z' }]),
    );
    renderAt('/book');
    await user.click(await screen.findByRole('button', { name: /cancel appointment FF-ABC234/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('appointment')).toHaveLength(1);
  });
});

describe('customization propagates from config', () => {
  const original = { name: site.brand.name, monthly: plans[0].monthly, sections: homeSections.map((s) => ({ ...s })), email: site.contact.email, currency: { ...site.currency } };
  afterEach(() => {
    site.brand.name = original.name;
    plans[0].monthly = original.monthly;
    site.contact.email = original.email;
    homeSections.splice(0, homeSections.length, ...original.sections.map((s) => ({ ...s })));
  });
  it('brand name and contact details flow into header, footer and contact page', async () => {
    site.brand.name = 'Northwind Advisory';
    site.contact.email = 'team@northwind.test';
    renderAt('/contact');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getAllByText('Northwind Advisory').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole('link', { name: 'team@northwind.test' }).length).toBeGreaterThanOrEqual(2);
  });
  it('plan pricing is driven by configuration', async () => {
    plans[0].monthly = 300;
    renderAt('/pricing');
    expect(await screen.findByTestId('price-foundation')).toHaveTextContent('$300');
  });
  it('home section visibility and ordering are configurable', async () => {
    const stats = homeSections.find((s) => s.id === 'stats')!;
    stats.enabled = false;
    const { container, unmount } = renderAt('/');
    await screen.findByRole('heading', { level: 1 });
    expect(container.querySelector('.stats')).toBeNull();
    unmount();
    stats.enabled = true;
    const i = homeSections.findIndex((s) => s.id === 'cta');
    const [cta] = homeSections.splice(i, 1);
    homeSections.unshift(cta);
    const second = renderAt('/');
    await screen.findByRole('heading', { level: 2, name: /Ready for a conversation/ });
    expect(second.container.querySelector('main')!.firstElementChild!.classList.contains('cta-band')).toBe(true);
  });
});
