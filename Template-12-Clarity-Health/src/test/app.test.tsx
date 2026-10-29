import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { booking as cfg } from '../config/booking';
import { site } from '../config/site';
import { doctors } from '../config/doctors';
import { specialties } from '../config/specialties';
import { services } from '../config/services';
import { getBookings, resetBookingsCache } from '../lib/bookings';
import { applyTheme } from '../lib/theme';
import { theme } from '../config/theme';

const renderAt = (path: string) =>
  render(
    <div id="root">
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </div>
  );

beforeEach(() => {
  window.localStorage.clear();
  resetBookingsCache();
});

async function pickFirstAvailableDay(user: ReturnType<typeof userEvent.setup>) {
  for (let i = 0; i < 4; i++) {
    const day = (await screen.findAllByRole('button', { name: /, available$/ }))[0];
    if (day) {
      await user.click(day);
      return;
    }
    await user.click(screen.getByRole('button', { name: 'Next month' }));
  }
  throw new Error('no available day found');
}

describe('routes', () => {
  const paths = [
    '/', '/specialties', '/specialties/cardiology', '/doctors', '/doctors/dr-amara-okafor', '/services', '/services/resting-ecg', '/book', '/appointments',
    '/about', '/patient-information', '/journal', '/journal/sun-safety-basics', '/contact', '/demo-notice'
  ];
  it.each(paths)('renders %s with exactly one h1', async (p) => {
    renderAt(p);
    expect(await screen.findAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
  it('shows a helpful 404 for unknown routes and unknown slugs', async () => {
    renderAt('/nope');
    expect(await screen.findByRole('heading', { level: 1, name: /couldn’t find that page/i })).toBeInTheDocument();
  });
  it.each(['/doctors/unknown', '/specialties/unknown', '/services/unknown', '/journal/unknown'])('shows a 404 for %s', async (p) => {
    renderAt(p);
    expect(await screen.findByRole('heading', { level: 1, name: /couldn’t find that/i })).toBeInTheDocument();
  });
  it('always shows the demo and emergency notices', async () => {
    renderAt('/');
    expect((await screen.findAllByText(/in an emergency/i)).length).toBeGreaterThan(0);
    expect(screen.getByText(/CLARITY HEALTH is fictional/i)).toBeInTheDocument();
  });
});

describe('filters', () => {
  it('filters specialties by search text and category', async () => {
    const user = userEvent.setup();
    renderAt('/specialties');
    expect(await screen.findByText(`${specialties.length} specialties shown`)).toBeInTheDocument();
    await user.type(screen.getByLabelText('Search specialties'), 'heart');
    expect(await screen.findByText('1 specialty shown')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cardiology' })).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Search specialties'));
    await user.selectOptions(screen.getByLabelText('Category'), 'Rehabilitation');
    expect(await screen.findByText('1 specialty shown')).toBeInTheDocument();
  });
  it('shows an empty state with a way back', async () => {
    const user = userEvent.setup();
    renderAt('/specialties');
    await user.type(await screen.findByLabelText('Search specialties'), 'zzzzqq');
    expect(await screen.findByText('No specialties match your search')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: /clear/i })[0]);
    expect(await screen.findByText(`${specialties.length} specialties shown`)).toBeInTheDocument();
  });
  it('filters doctors by specialty, language and availability', async () => {
    const user = userEvent.setup();
    renderAt('/doctors');
    await screen.findByText(`${doctors.length} doctors shown`);
    await user.selectOptions(screen.getByLabelText('Specialty'), 'dermatology');
    expect(await screen.findByText('2 doctors shown')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Accepting new patients'));
    expect(await screen.findByText('1 doctor shown')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Specialty'), 'all');
    await user.selectOptions(screen.getByLabelText('Language'), 'Japanese');
    expect(await screen.findByText('1 doctor shown')).toBeInTheDocument(); // Tanaka is not accepting; Nakamura is
    expect(screen.getByRole('link', { name: 'Dr. Tobias Nakamura' })).toBeInTheDocument();
    await user.click(screen.getByLabelText('Accepting new patients'));
    await user.selectOptions(screen.getByLabelText('Available on'), '6');
    expect(await screen.findByText(/doctors? shown/)).toBeInTheDocument();
  });
  it('filters services by category chip and search', async () => {
    const user = userEvent.setup();
    renderAt('/services');
    await screen.findByText(`${services.length} services shown`);
    await user.click(screen.getByRole('button', { name: 'Diagnostic services' }));
    const n = services.filter((s) => s.category === 'diagnostic').length;
    expect(await screen.findByText(`${n} services shown`)).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: 'Search services' }), 'ultrasound');
    expect(await screen.findByText(/^\d+ services? shown$/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Musculoskeletal ultrasound' })).toBeInTheDocument();
  });
  it('searches journal articles', async () => {
    const user = userEvent.setup();
    renderAt('/journal');
    await user.type(await screen.findByRole('searchbox', { name: 'Search articles' }), 'sunscreen');
    expect(await screen.findByText('1 article shown')).toBeInTheDocument();
  });
});

describe('booking flow (UI)', () => {
  it('completes a booking, persists it, then reschedules and cancels it', async () => {
    const user = userEvent.setup();
    renderAt('/book');
    await screen.findByRole('heading', { name: /Step 1 of 6/ });
    // Continue without choosing → error
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/choose a specialty/i);

    await user.click(screen.getByLabelText(/General Medicine/));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(await screen.findByLabelText(/No preference/));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(await screen.findByLabelText(/Initial consultation/));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await screen.findByRole('heading', { name: /date and time/i });
    await pickFirstAvailableDay(user);
    const slot = (await screen.findAllByRole('radio', { name: /AM|PM/ })).find((r) => !(r as HTMLInputElement).disabled)!;
    await user.click(slot);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    // contact validation
    await screen.findByRole('heading', { name: /contact details/i });
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByText(/Please enter your name/)).toBeInTheDocument();
    expect(screen.getByText(/valid e-mail|enter an e-mail/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Full name/), 'Alex Morgan');
    await user.type(screen.getByLabelText(/E-mail address/), 'alex@example.com');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByText(/confirm that you understand/i)).toBeInTheDocument();
    await user.click(screen.getByLabelText(/I understand this is a demonstration/));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    // review + confirm
    await screen.findByRole('heading', { name: /Review and confirm/ });
    expect(screen.getAllByText('Alex Morgan').length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: 'Confirm demo appointment' }));
    expect(await screen.findByRole('heading', { level: 1, name: /Demo appointment saved/ })).toBeInTheDocument();
    expect(screen.getByText(/No real clinic has been contacted/)).toBeInTheDocument();

    const saved = getBookings();
    expect(saved).toHaveLength(1);
    expect(window.localStorage.getItem(cfg.storageKey)).toContain('alex@example.com');
    expect(window.localStorage.getItem(cfg.storageKey)).not.toMatch(/symptom|diagnos|insurance/i);
  });

  it('prefills from a doctor + service shortcut and skips to the date step', async () => {
    renderAt('/book?specialty=cardiology&doctor=mateo-lindqvist&service=ecg');
    expect(await screen.findByRole('heading', { name: /date and time/i })).toBeInTheDocument();
    expect(screen.getAllByText('Dr. Mateo Lindqvist').length).toBeGreaterThan(0);
  });

  it('ignores an incompatible shortcut', async () => {
    renderAt('/book?specialty=cardiology&service=dermatology-consultation');
    expect(await screen.findByRole('heading', { name: /Step 3 of 6/ })).toBeInTheDocument();
  });

  it('manages saved appointments: reschedule and cancel with an accessible dialog', async () => {
    const user = userEvent.setup();
    const { addBooking } = await import('../lib/bookings');
    const { toISODate } = await import('../lib/format');
    const { getSlots } = await import('../lib/availability');
    const { eligibleDoctors, serviceById } = await import('../lib/catalog');
    const pool = eligibleDoctors('general-medicine', serviceById('initial-consultation')!);
    let date = '';
    let time = '';
    for (let n = cfg.leadDays + 1; n < 30 && !date; n++) {
      const d = new Date();
      d.setDate(d.getDate() + n);
      const s = getSlots({ iso: toISODate(d), durationMinutes: 45, pool, bookings: [] }).find((x) => x.available);
      if (s) { date = toISODate(d); time = s.time; }
    }
    const rec = addBooking({
      specialtyId: 'general-medicine', doctorId: pool[0].id, doctorPreference: 'any', serviceId: 'initial-consultation', mode: 'in-person', date, time,
      durationMinutes: 45, price: 120, contact: { name: 'Sam Lee', email: 'sam@example.com', phone: '' }
    });
    renderAt('/appointments');
    expect((await screen.findAllByText(rec.reference, { exact: false })).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Reschedule/ })).toHaveAttribute('href', `/book?reschedule=${rec.id}`);

    const cancelBtn = screen.getByRole('button', { name: /Cancel/ });
    await user.click(cancelBtn);
    const dialog = await screen.findByRole('dialog', { name: 'Cancel this demo appointment?' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByRole('button', { name: 'Keep appointment' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(cancelBtn).toHaveFocus();
    expect(getBookings()[0].status).toBe('confirmed');

    await user.click(cancelBtn);
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Cancel appointment' }));
    expect(getBookings()[0].status).toBe('cancelled');
    expect(await screen.findByText(/was cancelled/)).toBeInTheDocument();
    expect(screen.getByText('Cancelled', { selector: '.status' })).toBeInTheDocument();
  });

  it('shows a friendly message for an unknown reschedule link', async () => {
    renderAt('/book?reschedule=missing');
    expect(await screen.findByRole('heading', { name: /couldn’t find that demo appointment/ })).toBeInTheDocument();
  });

  it('shows an empty state when there are no appointments', async () => {
    renderAt('/appointments');
    expect(await screen.findByText('No demo appointments yet')).toBeInTheDocument();
  });
});

describe('contact form', () => {
  it('validates and never claims delivery', async () => {
    const user = userEvent.setup();
    renderAt('/contact');
    await user.click(await screen.findByRole('button', { name: 'Validate demo form' }));
    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please choose a topic.')).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Your name/), 'Alex');
    await user.type(screen.getByLabelText(/E-mail address/), 'alex@example.com');
    await user.selectOptions(screen.getByLabelText(/Topic/), 'General question');
    await user.type(screen.getByLabelText(/Message/), 'A short demo message for testing.');
    await user.click(screen.getByRole('button', { name: 'Validate demo form' }));
    expect(await screen.findByText(/your message was not sent or delivered/)).toBeInTheDocument();
    expect(screen.queryByText(/thank you|message sent|we will reply/i)).not.toBeInTheDocument();
  });
  it('switches locations with the tabs', async () => {
    const user = userEvent.setup();
    renderAt('/contact');
    await user.click(await screen.findByRole('tab', { name: new RegExp(site.locations[1].name) }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent(site.locations[1].addressLines[0]);
  });
});

describe('navigation', () => {
  it('toggles the mobile menu and marks the active route', async () => {
    const user = userEvent.setup();
    renderAt('/doctors');
    const toggle = await screen.findByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    const current = screen.getAllByRole('link', { name: 'Doctors' }).filter((l) => l.className.includes('is-active'));
    expect(current.length).toBeGreaterThan(0);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('customization propagates from src/config', () => {
  it('re-brands the site when the brand name and notices change', async () => {
    const original = { name: site.brand.name, demo: site.notices.demoBar };
    site.brand.name = 'AURORA CLINIC';
    site.notices.demoBar = 'Custom demonstration notice for tests.';
    try {
      renderAt('/');
      expect((await screen.findAllByText('AURORA CLINIC')).length).toBeGreaterThan(0);
      expect(screen.getByText(/Custom demonstration notice/)).toBeInTheDocument();
    } finally {
      site.brand.name = original.name;
      site.notices.demoBar = original.demo;
    }
  });
  it('writes theme colours to CSS variables', () => {
    const el = document.createElement('div');
    applyTheme(el);
    expect(el.style.getPropertyValue('--c-navy')).toBe(theme.colors.navy);
    expect(el.style.getPropertyValue('--font-display')).toBe(theme.fonts.display);
  });
  it('hides prices when pricing is switched off and respects section visibility', async () => {
    const { home, homeSections } = await import('../config/home');
    const prev = cfg.pricing.show;
    const hero = homeSections.find((s) => s.id === 'testimonials')!;
    cfg.pricing.show = false;
    hero.enabled = false;
    try {
      renderAt('/services');
      await screen.findByText(`${services.length} services shown`);
      expect(screen.queryByText(/demo price/i)).not.toBeInTheDocument();
    } finally {
      cfg.pricing.show = prev;
    }
    const { unmount } = renderAt('/');
    expect(screen.queryByText(home.testimonials.title)).not.toBeInTheDocument();
    hero.enabled = true;
    unmount();
    renderAt('/');
    expect(await screen.findByText(home.testimonials.title)).toBeInTheDocument();
  });
});
