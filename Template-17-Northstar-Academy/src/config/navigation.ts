import type { NavItem } from './types';

export const navigation: NavItem[] = [
  { label: 'Courses', to: '/courses', page: 'courses' },
  { label: 'Paths', to: '/paths', page: 'paths' },
  { label: 'Instructors', to: '/instructors', page: 'instructors' },
  { label: 'Plans', to: '/plans', page: 'plans' },
  { label: 'Journal', to: '/journal', page: 'journal' },
  { label: 'About', to: '/about', page: 'about' },
];

export const headerCta = { label: 'Open demo dashboard', to: '/learn', page: 'learn' as const };

export const footerColumns: { title: string; links: { label: string; to: string; page: NavItem['page'] }[] }[] = [
  {
    title: 'Learn',
    links: [
      { label: 'All courses', to: '/courses', page: 'courses' },
      { label: 'Learning paths', to: '/paths', page: 'paths' },
      { label: 'Plans & pricing', to: '/plans', page: 'plans' },
      { label: 'Demo dashboard', to: '/learn', page: 'learn' },
    ],
  },
  {
    title: 'Academy',
    links: [
      { label: 'Instructors', to: '/instructors', page: 'instructors' },
      { label: 'About', to: '/about', page: 'about' },
      { label: 'Journal', to: '/journal', page: 'journal' },
      { label: 'Contact', to: '/contact', page: 'contact' },
    ],
  },
];
