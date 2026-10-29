import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { rooms } from '../config/rooms';
import { addDays } from '../lib/dates';
import { reservationStore } from '../lib/reservations';
import { today } from '../lib/stay';
import Booking from './Booking';
import Contact from './Contact';
import Rooms from './Rooms';

const renderAt = (url: string, ui: React.ReactNode, path = '*') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes><Route path={path} element={ui} /></Routes>
    </MemoryRouter>,
  );
const t = today();
const inn = addDays(t, 40);
const out = addDays(t, 43);

describe('Rooms page (integration)', () => {
  it('lists every room and updates the count when filtering by category', async () => {
    const user = userEvent.setup();
    renderAt('/rooms', <Rooms />);
    expect(screen.getAllByRole('article')).toHaveLength(rooms.length);
    await user.click(screen.getByRole('button', { name: 'Family' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 3, name: 'Family Residence' })).toBeInTheDocument();
  });
  it('shows an empty state and clears it', async () => {
    const user = userEvent.setup();
    renderAt('/rooms?q=zzzz', <Rooms />);
    expect(screen.getByText('No rooms match those filters')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Clear all filters' })[0]);
    expect(screen.getAllByRole('article')).toHaveLength(rooms.length);
  });
  it('shows simulated availability badges when dates are in the URL', () => {
    renderAt(`/rooms?in=${inn}&out=${out}&adults=2&children=0`, <Rooms />);
    const badges = screen.getAllByText(/\(simulated\)|Does not fit/);
    expect(badges.length).toBeGreaterThanOrEqual(rooms.length);
  });
});

describe('Booking page (integration)', () => {
  it('shows validation errors for a zero-night URL and does not list rooms', () => {
    renderAt(`/booking?in=${inn}&out=${inn}&adults=2&children=0`, <Booking />);
    expect(screen.getAllByText(/at least one night/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/available for/)).toBeNull();
  });
  it('walks the full flow and persists the reservation', async () => {
    const user = userEvent.setup();
    reservationStore.clear();
    // find a stay where the garden king is open in the simulation
    renderAt(`/booking?in=${inn}&out=${out}&adults=2&children=0&room=owners-suite`, <Booking />);
    const heading = await screen.findByRole('heading', { name: 'Choose your room & rate' });
    expect(heading).toBeInTheDocument();
    const list = screen.getByText(/available for 3 nights/);
    expect(list).toBeInTheDocument();
    const selects = screen.getAllByRole('button', { name: /^Select / });
    expect(selects.length).toBeGreaterThan(0);
    await user.click(selects[0]);
    await user.type(await screen.findByLabelText('First name'), 'Ada');
    await user.type(screen.getByLabelText('Last name'), 'Lovelace');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Phone'), '+44 20 7946 0000');
    await user.click(screen.getByRole('button', { name: 'Review reservation' }));
    expect(await screen.findByRole('heading', { name: 'Review your reservation' })).toBeInTheDocument();
    const confirm = screen.getByRole('button', { name: 'Confirm demonstration booking' });
    expect(confirm).toBeDisabled();
    await user.click(screen.getByRole('checkbox'));
    expect(confirm).toBeEnabled();
    await user.click(confirm);
    expect(reservationStore.list()).toHaveLength(1);
    expect(reservationStore.list()[0]).toMatchObject({ checkIn: inn, checkOut: out, status: 'confirmed' });
    reservationStore.clear();
  });
  it('validates guest details before review', async () => {
    const user = userEvent.setup();
    renderAt(`/booking?in=${inn}&out=${out}&adults=2&children=0`, <Booking />);
    await user.click((await screen.findAllByRole('button', { name: /^Select / }))[0]);
    await user.click(await screen.findByRole('button', { name: 'Review reservation' }));
    expect(screen.getByLabelText('First name')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Review your reservation' })).toBeNull();
  });
  it('moves unsuitable rooms into a disclosure for over-capacity parties', () => {
    renderAt(`/booking?in=${inn}&out=${out}&adults=2&children=2`, <Booking />);
    const more = screen.getByText(/not suitable for your party/);
    expect(more).toBeInTheDocument();
    const details = more.closest('details')!;
    expect(within(details).getByText(/Garden King Room/)).toBeInTheDocument();
  });
  it('reports an invalid promo code', async () => {
    const user = userEvent.setup();
    renderAt(`/booking?in=${inn}&out=${out}&adults=2&children=0&promo=NOPE`, <Booking />);
    expect(await screen.findByText(/not a valid code/)).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Promo code'));
  });
});

describe('Contact form (integration)', () => {
  it('validates and then shows a demonstration-only confirmation', async () => {
    const user = userEvent.setup();
    renderAt('/contact', <Contact />);
    await user.click(screen.getByRole('button', { name: /Send enquiry/ }));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Choose a topic.')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Your name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.selectOptions(screen.getByLabelText('Topic'), 'Dining');
    await user.type(screen.getByLabelText('Message'), 'A table for two, please.');
    await user.click(screen.getByRole('button', { name: /Send enquiry/ }));
    expect(screen.getByText(/not sent or stored anywhere/)).toBeInTheDocument();
  });
});
