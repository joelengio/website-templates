/**
 * NAVIGATION, FOOTER & CTA CONFIG.
 * `page` links an item to a switch in src/config/layout.ts; disabling the page hides the item.
 */
export type PageKey = 'home' | 'properties' | 'about' | 'services' | 'journal' | 'contact';

export const mainNav: { label: string; to: string; page: PageKey }[] = [
  { label: 'Home', to: '/', page: 'home' },
  { label: 'Properties', to: '/properties', page: 'properties' },
  { label: 'Services', to: '/services', page: 'services' },
  { label: 'About', to: '/about', page: 'about' },
  { label: 'Journal', to: '/journal', page: 'journal' },
  { label: 'Contact', to: '/contact', page: 'contact' },
];

export const headerCta = { label: 'Book a viewing', to: '/contact', page: 'contact' as PageKey };

export const footer = {
  blurb: 'A fictional boutique agency for considered homes — presented as a premium template demo.',
  columns: [
    {
      title: 'Explore',
      links: [
        { label: 'All properties', to: '/properties', page: 'properties' as PageKey },
        { label: 'Saved homes', to: '/favorites', page: 'properties' as PageKey },
        { label: 'Compare homes', to: '/compare', page: 'properties' as PageKey },
        { label: 'Journal & guides', to: '/journal', page: 'journal' as PageKey },
      ],
    },
    {
      title: 'Agency',
      links: [
        { label: 'About Aurel', to: '/about', page: 'about' as PageKey },
        { label: 'Our team', to: '/about#team', page: 'about' as PageKey },
        { label: 'Services', to: '/services', page: 'services' as PageKey },
        { label: 'Contact', to: '/contact', page: 'contact' as PageKey },
      ],
    },
  ] as { title: string; links: { label: string; to: string; page?: PageKey }[] }[],
  legalLinks: [] as { label: string; to: string }[],
};

export const ctas = {
  primary: { label: 'Browse properties', to: '/properties' },
  secondary: { label: 'Speak with an advisor', to: '/contact' },
  sell: { label: 'Request a valuation', to: '/contact?topic=valuation' },
};
