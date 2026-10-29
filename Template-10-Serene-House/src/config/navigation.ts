import type { NavItem } from './types';

/** Header navigation, footer columns and shared call-to-action labels. */
export const navigation: NavItem[] = [
  { label: 'Treatments', to: '/treatments' },
  { label: 'Packages', to: '/packages' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Journal', to: '/journal' },
  { label: 'Contact', to: '/contact' }
];

export const ctas = {
  book: { label: 'Book a Visit', to: '/booking' },
  bookTreatment: 'Book this treatment',
  bookPackage: 'Book this package',
  viewTreatments: { label: 'Explore Treatments', to: '/treatments' },
  viewPackages: { label: 'View All Packages', to: '/packages' },
  manage: { label: 'My Bookings', to: '/booking/manage' }
};

export const footerGroups: { title: string; links: NavItem[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Treatments', to: '/treatments' },
      { label: 'Packages', to: '/packages' },
      { label: 'Gallery', to: '/gallery' },
      { label: 'Journal', to: '/journal' }
    ]
  },
  {
    title: 'The House',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Book a Visit', to: '/booking' },
      { label: 'My Bookings', to: '/booking/manage' }
    ]
  },
  {
    title: 'Information',
    links: [{ label: 'Demo Notice & Privacy', to: '/demo-notice' }]
  }
];

export const footerBlurb =
  'A quiet house of warm light, natural materials and unhurried care — created for restoration of body, skin and mind.';
