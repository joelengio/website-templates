import type { NavItem } from './types';

export const navigation: NavItem[] = [
  { label: 'Specialties', to: '/specialties' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Services', to: '/services' },
  { label: 'Patient information', to: '/patient-information' },
  { label: 'Journal', to: '/journal' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

export const ctas = {
  book: { label: 'Book demo appointment', to: '/book' },
  bookShort: { label: 'Book appointment', to: '/book' },
  manage: { label: 'My demo appointments', to: '/appointments' },
  contact: { label: 'Contact the clinic', to: '/contact' }
};

export const footerBlurb =
  'A fictional demonstration clinic showing what a calm, premium and accessible healthcare website can be. No real care is provided.';

export const footerGroups: { title: string; links: NavItem[] }[] = [
  {
    title: 'Care',
    links: [
      { label: 'Specialties', to: '/specialties' },
      { label: 'Doctors', to: '/doctors' },
      { label: 'Services', to: '/services' },
      { label: 'Book (demo)', to: '/book' }
    ]
  },
  {
    title: 'Patients',
    links: [
      { label: 'First visit guide', to: '/patient-information#first-visit' },
      { label: 'Opening hours', to: '/patient-information#hours' },
      { label: 'FAQs', to: '/patient-information#faqs' },
      { label: 'My demo appointments', to: '/appointments' }
    ]
  },
  {
    title: 'Clinic',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Health journal', to: '/journal' },
      { label: 'Contact & locations', to: '/contact' },
      { label: 'Demo & privacy notice', to: '/demo-notice' }
    ]
  }
];
