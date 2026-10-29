import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import { weddings } from '../config';

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

describe('routing and navigation', () => {
  it('renders the home page with a single h1 and primary navigation', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/Celebrations composed with intention/);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const label of ['Weddings', 'Services', 'Packages', 'Destinations', 'About', 'Journal', 'Contact']) expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument();
  });
  it('marks the active route with aria-current', async () => {
    renderAt('/packages');
    await screen.findByRole('heading', { level: 1, name: /Planning packages/ });
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).getByRole('link', { name: 'Packages' })).toHaveAttribute('aria-current', 'page');
  });
  it('shows the custom 404 for unknown routes and unknown slugs', async () => {
    const { unmount } = renderAt('/nope');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/wandered off/);
    unmount();
    renderAt('/weddings/not-real');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/wandered off/);
  });
  it('sets page titles', async () => {
    renderAt('/about');
    await screen.findByRole('heading', { level: 1 });
    await waitFor(() => expect(document.title).toBe('About the Studio — EVERAFTER'));
  });
});

describe('portfolio filtering', () => {
  it('filters by location, style and event type, with an empty state', async () => {
    const user = userEvent.setup();
    renderAt('/weddings');
    await screen.findByRole('heading', { level: 1, name: /Weddings & celebrations/ });
    const count = () => document.querySelectorAll('.wcard').length;
    expect(count()).toBe(weddings.length);
    await user.selectOptions(screen.getByLabelText('Location'), 'Italy');
    expect(count()).toBe(weddings.filter((w) => w.region === 'Italy').length);
    await user.selectOptions(screen.getByLabelText('Wedding style'), 'Coastal Elegance');
    expect(count()).toBe(1);
    await user.selectOptions(screen.getByLabelText('Event type'), 'Elopement');
    expect(count()).toBe(0);
    expect(screen.getByText('No celebrations match those filters')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]);
    expect(count()).toBe(weddings.length);
  });
});

describe('contact form', () => {
  it('validates, then previews without claiming delivery', async () => {
    const user = userEvent.setup();
    renderAt('/contact');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('button', { name: 'Preview message' }));
    expect(screen.getAllByText(/Please enter your name/).length).toBeGreaterThan(0);
    await user.type(screen.getByLabelText('Your name'), 'Sam Lee');
    await user.type(screen.getByLabelText('Email address'), 'sam@example.com');
    await user.selectOptions(screen.getByLabelText('What is this about?'), 'Wedding planning');
    await user.type(screen.getByLabelText('Your message'), 'Planning a summer wedding.');
    await user.click(screen.getByRole('checkbox', { name: /I understand this is a demonstration/ }));
    await user.click(screen.getByRole('button', { name: 'Preview message' }));
    expect(await screen.findByRole('heading', { name: /nothing was sent/i })).toBeInTheDocument();
    expect(screen.getByText(/not delivered to any planner/i)).toBeInTheDocument();
  });
});

describe('questionnaire flow', () => {
  it('walks a wedding enquiry from start to the demo completion screen', async () => {
    const user = userEvent.setup();
    renderAt('/plan');
    await screen.findByRole('heading', { name: 'What are we celebrating?' });
    expect(screen.getByText(/Step 1 of 9/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getAllByText('Please choose the type of event.').length).toBeGreaterThan(0);
    await user.click(screen.getByRole('radio', { name: /^Wedding/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('radio', { name: /Not decided yet/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('radio', { name: /Lake Como/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.type(screen.getByLabelText('Estimated number of guests'), '90');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('checkbox', { name: /Romantic garden/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('checkbox', { name: /Full planning/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Skip' }));
    expect(screen.getByLabelText(/Your partner’s name/)).toBeInTheDocument();
    await user.type(screen.getByLabelText('Your name'), 'Alex Rowe');
    await user.type(screen.getByLabelText('Email address'), 'alex@example.com');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Review your enquiry' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Complete preview' }));
    expect(screen.getByText(/confirm that you understand/)).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /I understand this enquiry is a demonstration/ }));
    await user.click(screen.getByRole('button', { name: 'Complete preview' }));
    expect(await screen.findByRole('heading', { name: /nothing was sent/i })).toBeInTheDocument();
    expect(screen.getByText(/not delivered to any planner/i)).toBeInTheDocument();
  });
  it('can go back and keeps answers', async () => {
    const user = userEvent.setup();
    renderAt('/plan');
    await user.click(await screen.findByRole('radio', { name: /Private celebration/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('radio', { name: /Private celebration/ })).toBeChecked();
  });
});
