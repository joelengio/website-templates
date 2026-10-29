import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import Home from '../pages/Home';
import { homeSections } from '../config';
import { applyTheme } from '../lib/theme';
import { theme } from '../config/theme';

const original = homeSections.map((s) => ({ ...s }));
afterEach(() => {
  homeSections.splice(0, homeSections.length, ...original.map((s) => ({ ...s })));
});

const order = () => [...document.querySelectorAll('[data-section]')].map((e) => e.getAttribute('data-section'));
const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>);

describe('customization', () => {
  it('renders every enabled home section in configured order', () => {
    renderHome();
    expect(order()).toEqual(original.map((s) => s.id));
  });
  it('hides disabled sections safely', () => {
    homeSections.find((s) => s.id === 'testimonials')!.enabled = false;
    homeSections.find((s) => s.id === 'journal')!.enabled = false;
    renderHome();
    expect(order()).not.toContain('testimonials');
    expect(order()).not.toContain('journal');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
  it('reorders sections', () => {
    const cta = homeSections.splice(homeSections.findIndex((s) => s.id === 'cta'), 1)[0];
    homeSections.unshift(cta);
    renderHome();
    expect(order()[0]).toBe('cta');
  });
  it('ignores unknown section ids and survives an empty configuration', () => {
    (homeSections as { id: string; enabled: boolean }[]).push({ id: 'does-not-exist', enabled: true });
    renderHome();
    expect(order()).not.toContain('does-not-exist');
    homeSections.splice(0, homeSections.length);
    document.body.innerHTML = '';
    renderHome();
    expect(order()).toEqual([]);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
  it('writes theme tokens to CSS custom properties', () => {
    const el = document.createElement('div');
    applyTheme(el);
    expect(el.style.getPropertyValue('--c-burgundy')).toBe(theme.colors.burgundy);
    expect(el.style.getPropertyValue('--font-display')).toBe(theme.fonts.display);
  });
});
