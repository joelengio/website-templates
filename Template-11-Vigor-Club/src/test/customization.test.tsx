import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { homeSections, plans, programs, site, theme, navigation, home } from '../config';
import { applyTheme } from '../lib/theme';
import { money } from '../lib/format';

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

describe('customization propagates through the site', () => {
  const snapshot = {
    name: site.brand.name, phone: site.contact.phone, plan: plans[1].monthly, hero: [...home.hero.titleLines],
    sections: homeSections.map((s) => ({ ...s })), nav: [...navigation], pName: programs[0].name, lime: theme.colors.lime
  };
  afterEach(() => {
    site.brand.name = snapshot.name; site.contact.phone = snapshot.phone; plans[1].monthly = snapshot.plan;
    home.hero.titleLines = snapshot.hero; homeSections.splice(0, homeSections.length, ...snapshot.sections);
    navigation.splice(0, navigation.length, ...snapshot.nav); programs[0].name = snapshot.pName; theme.colors.lime = snapshot.lime;
  });

  it('brand name and contact details appear in header, footer and contact page', async () => {
    site.brand.name = 'IRON TEMPLE';
    site.contact.phone = '+1 (555) 010-0111';
    renderAt('/contact');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getAllByText('IRON').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('TEMPLE').length).toBeGreaterThanOrEqual(2);
    expect(within(screen.getByRole('contentinfo')).getByText('+1 (555) 010-0111')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: '+1 (555) 010-0111' })[0]).toHaveAttribute('href', 'tel:+15550100111');
  });

  it('homepage copy, section visibility and order are configurable', async () => {
    home.hero.titleLines = ['Lift', 'heavy.'];
    homeSections.find((s) => s.id === 'testimonials')!.visible = false;
    const j = homeSections.findIndex((s) => s.id === 'journal');
    const m = homeSections.findIndex((s) => s.id === 'membership');
    [homeSections[j], homeSections[m]] = [homeSections[m], homeSections[j]];
    renderAt('/');
    expect((await screen.findByRole('heading', { level: 1 })).textContent).toMatch(/lift\s*heavy\./i);
    expect(screen.queryByRole('heading', { name: /in their words/i })).not.toBeInTheDocument();
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings.indexOf('Notes from the floor.')).toBeLessThan(headings.indexOf('Find your plan.'));
  });

  it('plan prices flow to home and membership pages', async () => {
    plans[1].monthly = 111;
    renderAt('/membership');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('article', { name: plans[1].name })).toHaveTextContent(money(111));
  });

  it('program edits flow to the programs page', async () => {
    programs[0].name = 'Iron Fundamentals';
    renderAt('/programs');
    expect(await screen.findByRole('heading', { name: 'Iron Fundamentals', level: 3 })).toBeInTheDocument();
  });

  it('navigation edits flow to the header and mobile menu', async () => {
    navigation.splice(0, navigation.length, { label: 'Only Link', to: '/about' });
    renderAt('/');
    await screen.findByRole('heading', { level: 1 });
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).getAllByRole('link')).toHaveLength(1);
  });

  it('theme colours become CSS variables', () => {
    theme.colors.lime = '#ff00aa';
    applyTheme();
    expect(document.documentElement.style.getPropertyValue('--c-lime')).toBe('#ff00aa');
  });
});
