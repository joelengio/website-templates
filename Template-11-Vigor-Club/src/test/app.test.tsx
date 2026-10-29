import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { bookingSettings } from '../config/booking';
import { programs } from '../config/programs';
import { trainers } from '../config/trainers';
import { articles } from '../config/journal';
import { plans } from '../config/membership';
import { money } from '../lib/format';
import { filterArticles } from '../lib/filters';

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
const h1 = async () => (await screen.findByRole('heading', { level: 1 })).textContent ?? '';

beforeEach(() => {
  // Monday 26 Oct 2026, 08:00 local — fakes Date only so timers/promises keep working.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 26, 8, 0, 0));
});
afterEach(() => vi.useRealTimers());

describe('routes', () => {
  const routes: [string, RegExp][] = [
    ['/', /train with/i], ['/programs', /train your/i], ['/schedule', /pick a day/i], ['/trainers', /behind/i],
    ['/membership', /choose how you/i], ['/facilities', /built for/i], ['/about', /built around coaching/i],
    ['/journal', /notes from/i], ['/contact', /talk/i], ['/demo-notice', /demo notice/i]
  ];
  it.each(routes)('renders %s with exactly one h1', async (path, re) => {
    renderAt(path);
    expect(await h1()).toMatch(re);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
  it.each(programs.map((p) => p.slug))('renders program page %s', async (slug) => {
    renderAt(`/programs/${slug}`);
    expect(await h1()).toBe(programs.find((p) => p.slug === slug)!.name);
  });
  it.each(trainers.map((t) => t.slug))('renders trainer page %s', async (slug) => {
    renderAt(`/trainers/${slug}`);
    expect(await h1()).toBe(trainers.find((t) => t.slug === slug)!.name);
    expect(screen.getByText('Fictional')).toBeInTheDocument();
  });
  it.each(articles.map((a) => a.slug))('renders article %s', async (slug) => {
    renderAt(`/journal/${slug}`);
    expect(await h1()).toBe(articles.find((a) => a.slug === slug)!.title);
    expect(screen.getByRole('heading', { name: /related reading/i })).toBeInTheDocument();
  });
  it.each(['/nope', '/programs/missing', '/trainers/missing', '/journal/missing'])('shows a helpful 404 for %s', async (path) => {
    renderAt(path);
    expect(await screen.findByText(/error 404/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument();
  });
  it('marks the active route in the navigation', async () => {
    renderAt('/membership');
    await h1();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Membership' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Programs' })).not.toHaveAttribute('aria-current');
  });
});

describe('programs', () => {
  it('searches, filters and shows empty state', async () => {
    const user = userEvent.setup();
    renderAt('/programs');
    await h1();
    expect(screen.getByRole('status', { name: '' })).toBeDefined();
    expect(screen.getByText(/^8 programs/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Combat' }));
    expect(screen.getByText(/^1 program/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Boxing Fitness', level: 3 })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'All' }));
    await user.type(screen.getByRole('searchbox', { name: /search programs/i }), 'mobility');
    expect(screen.getByText(/^1 program/)).toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox', { name: /search programs/i }));
    await user.type(screen.getByRole('searchbox', { name: /search programs/i }), 'zzzzqq');
    expect(screen.getByText('No programs match')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /clear all filters/i }));
    expect(screen.getByText(/^8 programs/)).toBeInTheDocument();
  });
  it('filters by experience level and trainer', async () => {
    const user = userEvent.setup();
    renderAt('/programs');
    await h1();
    await user.selectOptions(screen.getByLabelText('Experience'), 'Advanced');
    expect(screen.getByText(/^1 program/)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Experience'), 'All');
    await user.selectOptions(screen.getByLabelText('Trainer'), 'priya-raman');
    expect(screen.getByText(/^2 programs/)).toBeInTheDocument();
  });
});

describe('schedule & booking (demonstration)', () => {
  beforeEach(() => window.localStorage.clear());

  const openFirstBookable = async (user: ReturnType<typeof userEvent.setup>) => {
    await h1();
    await user.click(screen.getByRole('button', { name: /next week/i }));
    const list = await screen.findByRole('list', { name: /classes on/i });
    const target = within(list).getAllByRole('button', { name: /^Book — / })[0];
    await user.click(target);
    return screen.findByRole('dialog');
  };

  it('discloses that booking is a demonstration', async () => {
    renderAt('/schedule');
    await h1();
    expect(screen.getByLabelText('Demonstration notice')).toHaveTextContent(/nothing is sent to the club/i);
  });

  it('selects days, applies filters and shows empty states', async () => {
    const user = userEvent.setup();
    renderAt('/schedule');
    await h1();
    expect(screen.getByRole('heading', { level: 2, name: /Monday, October 26/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Tuesday Oct 27/ }));
    expect(screen.getByRole('heading', { level: 2, name: /Tuesday, October 27/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Mobility' }));
    expect(screen.getByText('No classes match these filters')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    await user.selectOptions(screen.getByLabelText('Trainer'), 'tessa-whitlock');
    expect(within(screen.getByRole('list', { name: /classes on/i })).getAllByRole('listitem')).toHaveLength(2);
  });

  it('disables past days and previous week at the start', async () => {
    const user = userEvent.setup();
    renderAt('/schedule');
    await h1();
    expect(screen.getByRole('button', { name: /previous week/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /next week/i }));
    expect(screen.getByRole('button', { name: /previous week/i })).toBeEnabled();
  });

  it('validates the booking form, confirms, persists, prevents duplicates and cancels', async () => {
    const user = userEvent.setup();
    renderAt('/schedule');
    const dialog = await openFirstBookable(user);
    expect(within(dialog).getByText('Demo booking')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /confirm demo reservation/i }));
    expect(within(dialog).getAllByRole('alert').length).toBeGreaterThanOrEqual(2);
    await user.type(within(dialog).getByLabelText(/full name/i), 'Riley Morgan');
    await user.type(within(dialog).getByLabelText(/email/i), 'riley@example.com');
    await user.click(within(dialog).getByRole('button', { name: /confirm demo reservation/i }));
    expect(await within(dialog).findByText('Demo reservation saved')).toBeInTheDocument();
    expect(within(dialog).getByText(/nothing is sent to the club/i)).toBeInTheDocument();
    const stored = JSON.parse(window.localStorage.getItem(bookingSettings.storageKey)!);
    expect(stored).toHaveLength(1);
    await user.click(within(dialog).getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // appears in My reservations and the class row now offers Manage (no second booking possible)
    const panel = screen.getByRole('region', { name: /my demo reservations/i });
    expect(within(panel).getByText(/Ref VC-/)).toBeInTheDocument();
    const manage = screen.getAllByRole('button', { name: /^Manage — / });
    expect(manage).toHaveLength(1);
    await user.click(manage[0]);
    const d2 = await screen.findByRole('dialog');
    expect(within(d2).getByText(/you are booked in/i)).toBeInTheDocument();
    expect(within(d2).queryByRole('button', { name: /confirm demo reservation/i })).not.toBeInTheDocument();
    await user.click(within(d2).getByRole('button', { name: /cancel reservation/i }));
    expect(await within(d2).findByText('Reservation cancelled')).toBeInTheDocument();
    await user.click(within(d2).getByRole('button', { name: 'Close' }));
    expect(JSON.parse(window.localStorage.getItem(bookingSettings.storageKey)!)).toEqual([]);
    expect(screen.getByText(/no reservations yet/i)).toBeInTheDocument();
  });

  it('restores saved reservations after a reload and cancels from the panel with confirmation', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(bookingSettings.storageKey, JSON.stringify([{ ref: 'VC-ABC123', classId: 'tue-1800-bar', date: '2026-10-27', name: 'A B', email: 'a@b.co', createdAt: '2026-10-26T08:00:00Z' }]));
    renderAt('/schedule');
    await h1();
    const panel = screen.getByRole('region', { name: /my demo reservations/i });
    expect(within(panel).getByText('VC-ABC123', { exact: false })).toBeInTheDocument();
    await user.click(within(panel).getByRole('button', { name: /cancel/i }));
    const dlg = await screen.findByRole('dialog', { name: /cancel this reservation/i });
    await user.click(within(dlg).getByRole('button', { name: /keep reservation/i }));
    expect(JSON.parse(window.localStorage.getItem(bookingSettings.storageKey)!)).toHaveLength(1);
    await user.click(within(panel).getByRole('button', { name: /cancel/i }));
    await user.click(await screen.findByRole('button', { name: /yes, cancel it/i }));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(bookingSettings.storageKey)!)).toEqual([]));
  });

  it('closes the modal with Escape and keeps focus inside while open', async () => {
    const user = userEvent.setup();
    renderAt('/schedule');
    const dialog = await openFirstBookable(user);
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows a closed state for classes that have already started', async () => {
    renderAt('/schedule');
    await h1();
    // 08:00 Monday: 06:30 class is closed
    expect(screen.getAllByText('Closed').length).toBeGreaterThan(0);
  });
});

describe('membership', () => {
  it('toggles monthly / annual pricing and updates every plan', async () => {
    const user = userEvent.setup();
    renderAt('/membership');
    await h1();
    const billing = within(screen.getByRole('radiogroup', { name: /billing period/i }));
    const monthly = billing.getByRole('radio', { name: /^Monthly/ });
    expect(monthly).toBeChecked();
    for (const p of plans) expect(screen.getByRole('article', { name: p.name })).toHaveTextContent(money(p.monthly));
    await user.click(billing.getByRole('radio', { name: /^Annual/ }));
    for (const p of plans) {
      const card = screen.getByRole('article', { name: p.name });
      expect(card).toHaveTextContent(money(p.annualMonthly));
      expect(card).toHaveTextContent(/billed yearly/i);
    }
  });
  it('renders an accessible comparison table covering every plan', async () => {
    renderAt('/membership');
    await h1();
    const table = screen.getByRole('table');
    for (const p of plans) expect(within(table).getByRole('columnheader', { name: new RegExp(p.name) })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'Guest passes' })).toBeInTheDocument();
  });
  it('runs the validated demo signup flow without implying payment', async () => {
    const user = userEvent.setup();
    renderAt('/membership?plan=elite');
    await h1();
    expect(screen.getByRole('radio', { name: /Elite/ })).toBeChecked();
    await user.click(screen.getByRole('button', { name: /review enquiry/i }));
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(3);
    await user.type(screen.getByLabelText(/full name/i), 'Sam Lee');
    await user.type(screen.getByLabelText(/^email/i), 'sam@example.com');
    await user.type(screen.getByLabelText(/preferred start date/i), '2026-11-02');
    await user.click(screen.getByRole('button', { name: /review enquiry/i }));
    expect(await screen.findByRole('heading', { name: /review your details/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /submit demo enquiry/i }));
    expect(screen.getAllByRole('alert')[0]).toHaveTextContent(/understand this is a demonstration/i);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /submit demo enquiry/i }));
    expect(await screen.findByRole('heading', { name: /demo enquiry recorded/i })).toBeInTheDocument();
    expect(screen.getByText(/not sent/i)).toBeInTheDocument();
    expect(screen.getByText(/no membership was created or activated/i)).toBeInTheDocument();
    expect(screen.queryByText(/payment (received|successful|processed)/i)).not.toBeInTheDocument();
  });
  it('exposes FAQs', async () => {
    renderAt('/membership');
    await h1();
    expect(screen.getAllByText(/Is this a real membership/i).length).toBeGreaterThan(0);
  });
});

describe('contact', () => {
  it('validates, then discloses that nothing is delivered', async () => {
    const user = userEvent.setup();
    renderAt('/contact?topic=membership');
    await h1();
    await user.click(screen.getByRole('button', { name: /validate message/i }));
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(3);
    await user.type(screen.getByLabelText(/your name/i), 'Sam');
    await user.type(screen.getByLabelText(/^email/i), 'sam@example.com');
    await user.type(screen.getByLabelText(/^message/i), 'I would like to know more about the Club plan.');
    expect(screen.getByLabelText(/what is it about/i)).toHaveValue('membership');
    await user.click(screen.getByRole('button', { name: /validate message/i }));
    expect(await screen.findByRole('heading', { name: 'Message not sent' })).toBeInTheDocument();
    expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument();
  });
  it('shows business info and opening hours', async () => {
    renderAt('/contact');
    await h1();
    expect(screen.getByText('Opening hours')).toBeInTheDocument();
    expect(screen.getByText(/fictional demonstration address/i)).toBeInTheDocument();
  });
});

describe('journal', () => {
  it('searches and filters articles with empty state', async () => {
    const user = userEvent.setup();
    renderAt('/journal');
    await h1();
    await user.click(screen.getByRole('button', { name: 'Recovery' }));
    expect(screen.getByText(/^1 article/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'All' }));
    await user.type(screen.getByRole('searchbox'), 'kettlebell');
    expect(screen.getByText(new RegExp(`^${filterArticles(articles, 'kettlebell', 'All').length} articles?`))).toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'qqqqzz');
    expect(screen.getByText('No articles found')).toBeInTheDocument();
  });
});

describe('facilities gallery lightbox', () => {
  it('opens, navigates with the keyboard, traps focus and restores it', async () => {
    const user = userEvent.setup();
    renderAt('/facilities');
    await h1();
    const first = screen.getAllByRole('button', { name: /open image/i })[0];
    first.focus();
    await user.keyboard('{Enter}');
    const dlg = await screen.findByRole('dialog', { name: /image viewer/i });
    expect(dlg).toHaveTextContent('1 / 10');
    await user.keyboard('{ArrowRight}');
    expect(dlg).toHaveTextContent('2 / 10');
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(dlg).toHaveTextContent('10 / 10');
    await user.tab();
    expect(dlg.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(first).toHaveFocus();
  });
  it('filters the gallery by area', async () => {
    const user = userEvent.setup();
    renderAt('/facilities');
    await h1();
    await user.click(screen.getByRole('button', { name: 'Recovery' }));
    expect(screen.getAllByRole('button', { name: /open image/i })).toHaveLength(2);
  });
});

describe('mobile menu & layout', () => {
  it('opens, closes with Escape and has a skip link', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await h1();
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main');
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });
  it('credits the template owner in the footer', async () => {
    renderAt('/');
    await h1();
    expect(within(screen.getByRole('contentinfo')).getByText(/Website template by OneStop Infinite/)).toBeInTheDocument();
  });
  it('contains the demonstration disclaimer in the footer', async () => {
    renderAt('/');
    await h1();
    expect(within(screen.getByRole('contentinfo')).getByText(/fictional business/i)).toBeInTheDocument();
  });
  it('lets home day tabs switch the timetable preview', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await h1();
    await user.click(screen.getByRole('button', { name: 'Sun' }));
    expect(screen.getByRole('list', { name: 'Classes on Sunday' })).toBeInTheDocument();
    await act(async () => {});
  });
});
