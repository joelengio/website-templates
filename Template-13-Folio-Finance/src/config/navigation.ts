import type { Cta, NavItem } from './types';

/** Main navigation. Remove an item to hide it; the page itself is toggled in layout.ts. */
export const mainNav: NavItem[] = [
  { label: 'Services', to: '/services' },
  { label: 'Who we serve', to: '/industries' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Tools', to: '/tools' },
  { label: 'Team', to: '/team' },
  { label: 'Insights', to: '/insights' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const headerCta: Cta = { label: 'Book a consultation', to: '/book' };
