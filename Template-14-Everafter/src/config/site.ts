import type { NavItem } from './types';

/**
 * Business identity and global settings. Everything the visitor sees as "the company" lives here.
 * The template publisher (OneStop Infinite) is kept separate in `publisher` so it can be kept, edited or removed
 * without touching your own branding.
 */
export const site = {
  brand: {
    name: 'EVERAFTER',
    /** Wordmark split for the typographic logo: [main, descriptor]. */
    descriptor: 'Weddings & Celebrations',
    tagline: 'Weddings composed with intention',
    /** 'typographic' draws the built-in monogram + wordmark from the fields above; 'image' shows `logo` (a file in /public) instead. */
    logoMode: 'typographic' as 'typographic' | 'image',
    logo: '/logo.svg',
    favicon: '/favicon.svg',
    foundedYear: 2011
  },

  /** Public URL used for canonical links, sitemap, robots and Open Graph. Override with VITE_SITE_URL. */
  url: 'https://www.example-everafter.com',

  contact: {
    email: 'hello@example-everafter.com',
    phone: '+1 (555) 014-0140',
    phoneHref: '+15550140140',
    /** Fictional demonstration office. Replace with your real studio address. */
    office: {
      name: 'Demonstration Studio',
      lines: ['14 Linden Row', 'Everton, Exampleshire', 'EX1 4EV'],
      note: 'Fictional address — this is a demonstration studio and cannot be visited.'
    },
    hours: [
      { days: 'Monday – Friday', time: '9:00 – 18:00' },
      { days: 'Saturday', time: '10:00 – 14:00 (by appointment)' },
      { days: 'Sunday', time: 'Closed' }
    ],
    responseTime: 'Within two working days'
  },

  social: [
    // Placeholders point at the platform home pages. Replace each with your own profile URL.
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' }
  ],

  /** Primary navigation. `to` must be an existing route. */
  nav: [
    { label: 'Weddings', to: '/weddings' },
    { label: 'Services', to: '/services' },
    { label: 'Packages', to: '/packages' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'About', to: '/about' },
    { label: 'Journal', to: '/journal' },
    { label: 'Contact', to: '/contact' }
  ] satisfies NavItem[],

  headerCta: { label: 'Plan your day', to: '/plan' },

  footer: {
    blurb:
      'A wedding and event planning studio for couples who want a celebration that feels unmistakably theirs — unhurried, beautifully made, and completely looked after.',
    columns: [
      {
        title: 'Studio',
        links: [
          { label: 'About us', to: '/about' },
          { label: 'Journal', to: '/journal' },
          { label: 'Contact', to: '/contact' },
          { label: 'Demo notice', to: '/demo-notice' },
          { label: 'Photo credits', to: '/credits' }
        ]
      },
      {
        title: 'Explore',
        links: [
          { label: 'Weddings', to: '/weddings' },
          { label: 'Destinations', to: '/destinations' },
          { label: 'Packages', to: '/packages' },
          { label: 'Start an enquiry', to: '/plan' }
        ]
      },
      {
        title: 'Services',
        links: [
          { label: 'Full planning', to: '/services/full-wedding-planning' },
          { label: 'Destination weddings', to: '/services/destination-weddings' },
          { label: 'Day-of coordination', to: '/services/wedding-day-coordination' },
          { label: 'Floral & event design', to: '/services/floral-and-event-design' }
        ]
      }
    ],
    legalLinks: [{ label: 'Demo notice', to: '/demo-notice' }],
    /** Business copyright line (yours). */
    copyright: `© ${new Date().getFullYear()} EVERAFTER Weddings & Celebrations. All rights reserved.`
  },

  currency: { code: 'USD', locale: 'en-US' },

  newsletter: { enabled: true },

  seo: {
    titleSuffix: ' — EVERAFTER',
    defaultTitle: 'EVERAFTER — Luxury Wedding & Event Planning',
    defaultDescription:
      'EVERAFTER is a luxury wedding and event planning studio. Full planning, destination weddings, floral design and day-of coordination for celebrations composed with intention.',
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image',
    themeColor: '#5e1f2e'
  },

  /** Features that depend on a backend. Keep false for the demo; see CUSTOMIZATION_GUIDE.md for wiring one up. */
  backend: {
    enabled: false,
    /** Set to your endpoint when a backend exists; forms POST JSON here when `enabled` is true. */
    inquiryEndpoint: '',
    contactEndpoint: ''
  },

  /** Template publisher identity — NOT your business branding. Safe to edit or hide. */
  publisher: {
    show: true,
    name: 'OneStop Infinite',
    templateName: 'Template 14 — EVERAFTER',
    url: 'https://onestop-infinite.example',
    note: 'Website template by OneStop Infinite.'
  }
};

export type Site = typeof site;
