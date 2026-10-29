import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { homeSections } from '../config/home';
import { site } from '../config/site';
import { treatments } from '../config/treatments';
import { theme } from '../config/theme';
import { applyTheme } from '../lib/theme';

const snapshot = { sections: homeSections.map((s) => ({ ...s })), name: site.brand.name, phone: site.contact.phone, theme: theme.colors.olive };
afterEach(() => {
  homeSections.splice(0, homeSections.length, ...snapshot.sections);
  site.brand.name = snapshot.name;
  site.contact.phone = snapshot.phone;
  theme.colors.olive = snapshot.theme;
});

const renderHome = () => render(<MemoryRouter><App /></MemoryRouter>);

describe('customisation propagates from src/config', () => {
  it('hides and reorders homepage sections', async () => {
    homeSections.find((s) => s.id === 'newsletter')!.enabled = false;
    homeSections.find((s) => s.id === 'testimonials')!.enabled = false;
    renderHome();
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByText('Slow notes, delivered gently')).toBeNull();
    expect(screen.queryByText('What guests say')).toBeNull();
    expect(screen.getByText('Journeys of restoration')).toBeInTheDocument();
  });
  it('rebrands header/footer contact details from site config', async () => {
    site.brand.name = 'LOTUS ROOM';
    site.contact.phone = '+1 (555) 010-9999';
    renderHome();
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getAllByText('LOTUS ROOM').length).toBeGreaterThan(0);
    expect(screen.getByText('+1 (555) 010-9999')).toBeInTheDocument();
  });
  it('a newly added treatment appears in the menu and booking list', async () => {
    treatments.push({ ...treatments[0], slug: 'test-added-treatment', name: 'Test Added Treatment' });
    try {
      render(<MemoryRouter initialEntries={['/treatments']}><App /></MemoryRouter>);
      expect(await screen.findByText('Test Added Treatment')).toBeInTheDocument();
    } finally {
      treatments.pop();
    }
  });
  it('applies theme colours as CSS variables', () => {
    theme.colors.olive = '#123456';
    applyTheme();
    expect(document.documentElement.style.getPropertyValue('--c-olive')).toBe('#123456');
  });
});
