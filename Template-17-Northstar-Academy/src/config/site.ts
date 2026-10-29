/**
 * Brand, contact details, social links, SEO defaults and the owner credit.
 * Everything here is demonstration data for the fictional "Northstar Academy" brand.
 */
const envUrl = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_SITE_URL;

export const site = {
  name: 'Northstar Academy',
  shortName: 'Northstar',
  tagline: 'Learn with direction.',
  /** Public URL used for canonical tags, Open Graph URLs, sitemap.xml and robots.txt. */
  url: (envUrl || 'https://northstar-academy.example.com').replace(/\/$/, ''),
  currency: 'USD',
  locale: 'en-US',
  /** localStorage namespace for the demo learner. Change it per client to avoid collisions on shared domains. */
  storagePrefix: 'northstar-academy',
  logo: { mark: 'N', alt: 'Northstar Academy' },
  favicon: '/favicon.svg',
  contact: {
    email: 'hello@northstar-academy.example.com',
    phone: '+1 (555) 010-0172',
    address: ['200 Meridian Row, Suite 12', 'Portland, OR 97201', 'United States (fictional address)'],
    hours: 'Mon–Fri, 9:00–17:00 Pacific',
    /** Optional form endpoint; empty = clearly labelled demo mode (nothing is sent). */
    formEndpoint: (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_FORM_ENDPOINT ?? '',
  },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
  seo: {
    titleTemplate: '%s · Northstar Academy',
    defaultTitle: 'Northstar Academy — Learn with direction',
    description:
      'Northstar Academy is a demonstration online learning academy template: course catalogue, learning paths, instructors, pricing and a fully working local learning dashboard.',
    ogImage: '/images/og-cover.png',
    twitterCard: 'summary_large_image',
  },
  /** Template owner credit — kept separate from the demo brand. */
  owner: {
    name: 'OneStop Infinite',
    url: 'https://onestopinfinite.example.com',
    showCredit: true,
    label: 'Template 17 by OneStop Infinite',
  },
  disclosure:
    'Northstar Academy is a fictional demonstration brand. Courses, instructors, ratings, testimonials and prices are sample data. No real enrollments, payments or accredited certificates exist.',
};

export type SiteConfig = typeof site;
