import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import { pages, sections, site } from '../config';
import { ShortlistProvider } from '../hooks/useShortlist';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ShortlistProvider>
        <App />
      </ShortlistProvider>
    </MemoryRouter>,
  );
}

describe('navigation', () => {
  it('renders every main page with a single h1', async () => {
    for (const path of ['/', '/properties', '/properties/cedar-ridge', '/about', '/services', '/journal', '/journal/how-to-read-a-floor-plan', '/contact', '/favorites', '/compare']) {
      const { unmount } = renderAt(path);
      await waitFor(() => expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1));
      unmount();
    }
  });
  it('shows the 404 page for unknown routes and unknown properties', async () => {
    renderAt('/properties/does-not-exist');
    expect(await screen.findByRole('heading', { level: 1, name: /couldn’t find/i })).toBeInTheDocument();
  });
  it('mobile menu opens, traps focus, closes on Escape and returns focus', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    await user.click(toggle);
    const dialog = screen.getByRole('dialog', { name: 'Site menu' });
    expect(within(dialog).getByRole('link', { name: 'Properties' })).toBeInTheDocument();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });
});

describe('listings', () => {
  it('filters, shows an empty state, and resets', async () => {
    const user = userEvent.setup();
    renderAt('/properties');
    const total = await screen.findAllByRole('article');
    expect(total.length).toBeGreaterThanOrEqual(12);
    const sidebar = screen.getByRole('complementary', { name: 'Filters' });
    await user.click(within(sidebar).getByRole('checkbox', { name: 'Villa' }));
    await user.selectOptions(within(sidebar).getByLabelText('Max price'), '1000000');
    expect(await screen.findByText(/No properties match/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset all filters' }));
    expect((await screen.findAllByRole('article')).length).toBe(total.length);
  });
  it('searches by keyword and sorts', async () => {
    const user = userEvent.setup();
    renderAt('/properties');
    const sidebar = await screen.findByRole('complementary', { name: 'Filters' });
    await user.type(within(sidebar).getByLabelText('Search'), 'lodge');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Birchwood Lodge' })).toBeInTheDocument();
  });
  it('sorts by price ascending', async () => {
    const user = userEvent.setup();
    renderAt('/properties');
    await user.selectOptions(await screen.findByLabelText('Sort by', { selector: '#sort-select' }), 'price-asc');
    const first = screen.getAllByRole('article')[0];
    expect(within(first).getByText('$785,000')).toBeInTheDocument();
  });
  it('opens the mobile filter drawer as a dialog', async () => {
    const user = userEvent.setup();
    renderAt('/properties');
    await user.click(await screen.findByRole('button', { name: /^Filters/ }));
    const dialog = screen.getByRole('dialog', { name: 'Filter properties' });
    await user.click(within(dialog).getByRole('checkbox', { name: 'Cottage' }));
    await user.click(within(dialog).getByRole('button', { name: /Show \d+ properties/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });
});

describe('saved searches', () => {
  it('saves a combined filter, restores it after a reset and a reload, and can delete it', async () => {
    localStorage.clear();
    const user = userEvent.setup();
    const first = renderAt('/properties');
    const sidebar = await screen.findByRole('complementary', { name: 'Filters' });
    expect(screen.getByRole('button', { name: /Save this search/ })).toBeDisabled();
    await user.click(within(sidebar).getByRole('checkbox', { name: 'Cottage' }));
    await user.click(screen.getByRole('button', { name: /Save this search/ }));
    const nameBox = screen.getByLabelText('Name for this search');
    await user.clear(nameBox);
    await user.type(nameBox, 'Cottages for me');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('button', { name: 'Cottages for me' })).toBeInTheDocument();
    const cottageCount = screen.getAllByRole('article').length;
    await user.click(screen.getByRole('button', { name: /Save this search/ }));
    expect(screen.getByText(/already saved as “Cottages for me”/)).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: /Remove filter: Cottage/ })[0]);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(cottageCount);
    first.unmount();
    renderAt('/properties');
    await user.click(await screen.findByRole('button', { name: 'Cottages for me' }));
    expect(screen.getAllByRole('article')).toHaveLength(cottageCount);
    await user.click(screen.getByRole('button', { name: 'Delete saved search: Cottages for me' }));
    expect(screen.queryByRole('button', { name: 'Cottages for me' })).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(`${site.storagePrefix}:savedSearches`)!)).toEqual([]);
  });
});

describe('favorites and compare', () => {
  it('persists favorites in localStorage and lists them', async () => {
    const user = userEvent.setup();
    const { unmount } = renderAt('/properties');
    await user.click((await screen.findAllByRole('button', { name: /Save Cedar Ridge Residence/ }))[0]);
    expect(JSON.parse(localStorage.getItem(`${site.storagePrefix}:favorites`)!)).toEqual(['cedar-ridge']);
    unmount();
    renderAt('/favorites');
    expect(await screen.findByRole('heading', { name: 'Cedar Ridge Residence' })).toBeInTheDocument();
  });
  it('limits comparison to three properties', async () => {
    const user = userEvent.setup();
    renderAt('/properties');
    const boxes = await screen.findAllByRole('checkbox', { name: /^Compare / });
    for (const b of boxes.slice(0, 4)) await user.click(b);
    expect(boxes.filter((b) => (b as HTMLInputElement).checked)).toHaveLength(3);
    expect(screen.getByText(/compare up to 3 properties/i)).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Compare now' }));
    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
  });
});

describe('property detail', () => {
  it('has an interactive gallery with a keyboard-operable lightbox', async () => {
    const user = userEvent.setup();
    renderAt('/properties/cedar-ridge');
    expect(await screen.findByText('Photo 1 of 5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next photo' }));
    expect(screen.getByText('Photo 2 of 5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /full screen/ }));
    const dialog = screen.getByRole('dialog');
    await user.keyboard('{ArrowRight}');
    expect(within(dialog).getByText(/3 \/ 5/)).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('inquiry form', () => {
  it('pre-selects the property, validates, and never fakes a success in demo mode', async () => {
    const user = userEvent.setup();
    renderAt('/properties/villa-solenne');
    const form = await screen.findByRole('form', { name: 'Inquiry form' });
    expect(within(form).getByLabelText('Property')).toHaveValue('villa-solenne');
    expect(within(form).getByText(/Demo form/)).toBeInTheDocument();
    await user.click(within(form).getByRole('button', { name: /Validate inquiry/ }));
    expect(await within(form).findByText('Please enter your full name.')).toBeInTheDocument();
    expect(within(form).getByLabelText('Full name *')).toHaveFocus();
    await user.type(within(form).getByLabelText('Full name *'), 'Ada Lovelace');
    await user.type(within(form).getByLabelText('Email *'), 'ada@example.com');
    await user.type(within(form).getByLabelText('Message *'), 'Please arrange a viewing.');
    await user.click(within(form).getByRole('checkbox'));
    await user.click(within(form).getByRole('button', { name: /Validate inquiry/ }));
    expect(await screen.findByText(/Demo only — nothing was sent/)).toBeInTheDocument();
    expect(screen.queryByText(/Inquiry sent/)).not.toBeInTheDocument();
  });
  it('pre-selects the property from the contact page query string', async () => {
    renderAt('/contact?property=larkspur-pavilion');
    expect(await screen.findByLabelText('Property')).toHaveValue('larkspur-pavilion');
  });
});

describe('customization switches', () => {
  const original = JSON.parse(JSON.stringify({ pages, home: sections.home }));
  afterEach(() => {
    Object.assign(pages, original.pages);
    sections.home.splice(0, sections.home.length, ...original.home);
  });
  it('hides and reorders home sections from config', async () => {
    const stats = sections.home.findIndex((s) => s.id === 'stats');
    sections.home[stats].enabled = false;
    const [cta] = sections.home.splice(sections.home.findIndex((s) => s.id === 'cta'), 1);
    sections.home.splice(1, 0, cta);
    renderAt('/');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByLabelText('Agency at a glance')).not.toBeInTheDocument();
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings[0]).toBe('Let’s find the right house.');
  });
  it('removes a disabled page from navigation and routing', async () => {
    pages.journal = false;
    renderAt('/journal');
    expect(await screen.findByRole('heading', { level: 1, name: /couldn’t find/i })).toBeInTheDocument();
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).queryByRole('link', { name: 'Journal' })).not.toBeInTheDocument();
  });
  it('survives a home config with the hero hidden (still has an h1)', async () => {
    sections.home.find((s) => s.id === 'hero')!.enabled = false;
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
