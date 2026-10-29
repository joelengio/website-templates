import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { resetBookingsCache } from '../lib/bookings';
import { treatments } from '../config/treatments';
import { site } from '../config/site';

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

beforeEach(() => { window.localStorage.clear(); resetBookingsCache(); });

describe('routing & SEO', () => {
  it('renders the home page with a single h1 and page title', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/quiet house/i);
    await waitFor(() => expect(document.title).toBe(site.seo.defaultTitle));
  });
  it('sets page-specific title and canonical for treatment detail', async () => {
    renderAt('/treatments/hot-stone-ritual');
    expect(await screen.findByRole('heading', { level: 1, name: 'Hot Stone Ritual' })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('Hot Stone Ritual | SERENE HOUSE'));
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', expect.stringContaining('/treatments/hot-stone-ritual'));
    expect(document.head.querySelector('meta[property="og:title"]')).toBeTruthy();
  });
  it('shows a 404 for unknown routes and unknown treatments', async () => {
    renderAt('/nope');
    expect(await screen.findByText(/wandered off/i)).toBeInTheDocument();
  });
  it('shows not-found for an unknown treatment slug', async () => {
    renderAt('/treatments/does-not-exist');
    expect(await screen.findByText(/couldn.t find that treatment/i)).toBeInTheDocument();
  });
});

describe('navigation', () => {
  it('marks the active route and toggles the mobile menu', async () => {
    const user = userEvent.setup();
    renderAt('/packages');
    await screen.findByRole('heading', { level: 1 });
    const desktop = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(desktop).getByRole('link', { name: 'Packages' })).toHaveClass('is-active');
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('treatments filtering and search', () => {
  it('filters by category and by search term, with an empty state', async () => {
    const user = userEvent.setup();
    renderAt('/treatments');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('status')).toHaveTextContent(`${treatments.length} treatments shown`);
    await user.click(screen.getByRole('button', { name: 'Facials' }));
    const facialCount = treatments.filter((t) => t.category === 'facial').length;
    expect(screen.getByText(`${facialCount} treatments shown`)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'All' }));
    await user.type(screen.getByRole('searchbox', { name: /search treatments/i }), 'hot stone');
    expect(screen.getByText('1 treatment shown')).toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'zzzzqq');
    expect(screen.getByText('No treatments found')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(screen.getByText(`${treatments.length} treatments shown`)).toBeInTheDocument();
  });
});

describe('gallery lightbox', () => {
  it('opens, navigates with the keyboard and closes with Escape', async () => {
    const user = userEvent.setup();
    renderAt('/gallery');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getAllByRole('button', { name: /open image/i })[0]);
    const dialog = screen.getByRole('dialog', { name: /image viewer/i });
    expect(within(dialog).getByText(/1 \/ 12/)).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(within(dialog).getByText(/2 \/ 12/)).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(within(dialog).getByText(/12 \/ 12/)).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('journal', () => {
  it('searches articles and opens an article', async () => {
    const user = userEvent.setup();
    renderAt('/journal');
    await screen.findByRole('heading', { level: 1 });
    await user.type(screen.getByRole('searchbox'), 'breathwork');
    expect(screen.getByText('1 article shown')).toBeInTheDocument();
    renderAt('/journal/the-art-of-slow-mornings');
    expect(await screen.findByRole('heading', { level: 1, name: /slow mornings/i })).toBeInTheDocument();
  });
});

describe('contact form (demo)', () => {
  it('shows validation errors and never claims delivery', async () => {
    const user = userEvent.setup();
    renderAt('/contact');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('button', { name: /validate message/i }));
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(4);
    await user.type(screen.getByLabelText(/your name/i), 'Ann Lee');
    await user.type(screen.getByLabelText(/^email/i), 'ann@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Hello');
    await user.type(screen.getByLabelText(/message/i), 'I would like to ask about gift cards.');
    await user.click(screen.getByRole('button', { name: /validate message/i }));
    expect(await screen.findByText(/message not sent/i)).toBeInTheDocument();
    expect(screen.queryByText(/has been sent/i)).toBeNull();
    expect(screen.getByRole('link', { name: /open in email app/i })).toHaveAttribute('href', expect.stringMatching(/^mailto:/));
  });
});

describe('booking flow (demo)', () => {
  it('requires a service, completes all steps, saves locally, then cancels from My Bookings', async () => {
    const user = userEvent.setup();
    renderAt('/booking');
    await screen.findByText(/choose your treatment or package/i);
    expect(screen.getAllByText(/NOT sent to any real business/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/choose a treatment or package/i);

    await user.click(screen.getByRole('radio', { name: /Signature Serene Massage/ }));
    await user.selectOptions(screen.getByLabelText(/number of guests/i), '2');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // therapist
    await screen.findByRole('heading', { name: /therapist preference/i });
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // date & time: continue blocked until chosen
    await screen.findByRole('heading', { name: /pick a date and time/i });
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/select a date/i);
    const day = screen.getAllByRole('button', { pressed: false }).find((b) => /^\w+day, \w+ \d+$/.test(b.getAttribute('aria-label') ?? '') && !(b as HTMLButtonElement).disabled)!;
    await user.click(day);
    const slot = screen.getAllByRole('button').find((b) => /^\d+:\d\d (AM|PM)$/.test(b.getAttribute('aria-label') ?? '') && !(b as HTMLButtonElement).disabled)!;
    await user.click(slot);
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // details validation
    await screen.findByRole('heading', { name: /your details/i });
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
    await user.type(screen.getByLabelText(/full name/i), 'Jamie Rivera');
    await user.type(screen.getByLabelText(/^email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    await user.clear(screen.getByLabelText(/^email/i));
    await user.type(screen.getByLabelText(/^email/i), 'jamie@example.com');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // review: consent required
    await screen.findByRole('heading', { name: /review your booking/i });
    expect(screen.getAllByText('$290').length).toBeGreaterThan(0); // 2 guests × $145
    await user.click(screen.getByRole('button', { name: /confirm demo booking/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/tick the box/i);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /confirm demo booking/i }));

    expect(await screen.findByText(/demo booking confirmed/i)).toBeInTheDocument();
    const saved = JSON.parse(window.localStorage.getItem('serene-house-demo-bookings-v1')!);
    expect(saved).toHaveLength(1);
    expect(saved[0].guests).toBe(2);
    expect(saved[0].customer.email).toBe('jamie@example.com');

    await user.click(screen.getByRole('link', { name: /view my bookings/i }));
    expect(await screen.findByText('Jamie Rivera', { exact: false })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /cancel booking/i }));
    await user.click(screen.getByRole('button', { name: /yes, cancel it/i }));
    expect(JSON.parse(window.localStorage.getItem('serene-house-demo-bookings-v1')!)[0].status).toBe('cancelled');
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('preselects a service from the URL and skips to therapist step', async () => {
    renderAt('/booking?package=couples-harmony');
    expect(await screen.findByRole('heading', { name: /therapist preference/i })).toBeInTheDocument();
    expect(screen.getAllByText('Couples Harmony').length).toBeGreaterThan(0);
  });

  it('shows an empty state with no bookings', async () => {
    renderAt('/booking/manage');
    expect(await screen.findByText(/no demo bookings yet/i)).toBeInTheDocument();
  });
});
