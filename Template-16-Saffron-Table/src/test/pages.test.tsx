import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ContactForm } from '../components/Forms';
import Menus from '../pages/Menus';
import Gallery from '../pages/Gallery';
import Journal from '../pages/Journal';

const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Menus page', () => {
  it('filters by category tab, search, dietary chip and shows an empty state', async () => {
    const user = userEvent.setup();
    wrap(<Menus />);
    expect(screen.getByText(/40 items/)).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Desserts' }));
    expect(screen.getByText(/5 items/)).toBeInTheDocument();
    expect(screen.queryByText('Chilli Prawn Spaghetti')).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'All' }));
    await user.type(screen.getByRole('searchbox', { name: /search the menu/i }), 'paella');
    expect(screen.getAllByRole('heading', { level: 3, name: /Seafood Paella/ }).length).toBeGreaterThan(0);
    await user.clear(screen.getByRole('searchbox'));
    await user.click(screen.getByRole('button', { name: /^Vegan/ }));
    expect(screen.getByRole('button', { name: /^Vegan/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('Dark Chocolate Ganache Cake')).not.toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'zzzz');
    expect(screen.getByText(/Nothing matches that search/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /clear all filters/i }));
    expect(screen.getByText(/40 items/)).toBeInTheDocument();
  });
  it('shows the allergy warning and unavailable dishes', () => {
    wrap(<Menus />);
    expect(screen.getByRole('complementary', { name: /allergies/i })).toHaveTextContent(/confirm ingredients/i);
    const art = screen.getByRole('article', { name: /Catch of the Day/ });
    expect(within(art).getByText(/Sold out today/)).toBeInTheDocument();
    expect(within(art).getByRole('button', { name: /add to demo order: catch of the day/i })).toBeDisabled();
  });
});

describe('Contact form', () => {
  it('shows validation errors and a non-misleading demo success state', async () => {
    const user = userEvent.setup();
    wrap(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /send demo message/i }));
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/please enter your name/i).length).toBeGreaterThan(0);
    await user.type(screen.getByLabelText(/your name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
    await user.selectOptions(screen.getByLabelText(/topic/i), 'Feedback');
    await user.type(screen.getByLabelText(/message/i), 'Thank you for a wonderful evening.');
    await user.click(screen.getByRole('button', { name: /send demo message/i }));
    expect(await screen.findByText(/not sent/i)).toBeInTheDocument();
  });
});

describe('Gallery & Journal', () => {
  it('opens the lightbox and navigates with the keyboard', async () => {
    const user = userEvent.setup();
    wrap(<Gallery />);
    await user.click(screen.getAllByRole('button', { name: /open photo/i })[0]);
    const dlg = screen.getByRole('dialog');
    expect(dlg).toHaveAccessibleName(/1 of 24/);
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('dialog')).toHaveAccessibleName(/2 of 24/);
    await user.keyboard('{End}');
    expect(screen.getByRole('dialog')).toHaveAccessibleName(/24 of 24/);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('filters journal by search and category', async () => {
    const user = userEvent.setup();
    wrap(<Journal />);
    await user.type(screen.getByRole('searchbox'), 'saffron');
    expect(screen.getByText(/Why we cook with saffron/)).toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.click(screen.getByRole('button', { name: 'Chef Stories' }));
    expect(screen.getByText('2 articles')).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'qqqq');
    expect(screen.getByText(/No articles found/)).toBeInTheDocument();
  });
});
