import type { Cta, NavItem } from './types';

/** Primary navigation (desktop bar + mobile menu). Order here = order on screen. */
export const navigation: NavItem[] = [
  { label: 'Programs', to: '/programs' },
  { label: 'Schedule', to: '/schedule' },
  { label: 'Trainers', to: '/trainers' },
  { label: 'Membership', to: '/membership' },
  { label: 'Facilities', to: '/facilities' },
  { label: 'About', to: '/about' },
  { label: 'Journal', to: '/journal' },
  { label: 'Contact', to: '/contact' }
];

/** Labels and destinations of recurring calls to action. */
export const ctas = {
  join: { label: 'Join the club', to: '/membership' } as Cta,
  trial: { label: 'Request a free trial', to: '/contact?topic=membership' } as Cta,
  schedule: { label: 'View timetable', to: '/schedule' } as Cta,
  programs: { label: 'Explore programs', to: '/programs' } as Cta,
  contact: { label: 'Get in touch', to: '/contact' } as Cta,
  trainerInquiry: { label: 'Ask about training', to: '/contact?topic=training' } as Cta
};

export const footerBlurb =
  'A fictional premium training club built to showcase a commercial website template: coaching-led strength, conditioning, boxing and recovery.';

export const footerGroups: { title: string; links: NavItem[] }[] = [
  {
    title: 'Train',
    links: [
      { label: 'Programs', to: '/programs' },
      { label: 'Class schedule', to: '/schedule' },
      { label: 'Trainers', to: '/trainers' },
      { label: 'Facilities', to: '/facilities' }
    ]
  },
  {
    title: 'Club',
    links: [
      { label: 'Membership', to: '/membership' },
      { label: 'About', to: '/about' },
      { label: 'Journal', to: '/journal' },
      { label: 'Contact', to: '/contact' }
    ]
  },
  {
    title: 'Info',
    links: [
      { label: 'Demo notice', to: '/demo-notice' },
      { label: 'My reservations', to: '/schedule#reservations' }
    ]
  }
];
