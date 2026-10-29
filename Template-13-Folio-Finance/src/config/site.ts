import type { Currency, NavItem, Office } from './types';

/**
 * Business-level settings: brand, contact details, SEO, legal copy and template-owner credit.
 * "Folio Finance" is a fictional demo brand — replace every value below for a real client.
 */
export const site = {
  brand: {
    name: 'Folio Finance',
    /** Two letters shown in the built-in logo mark. Set `logoSrc` to use your own logo file instead. */
    monogram: 'FF',
    tagline: 'Advisory, accounting and planning — considered.',
    logoSrc: '' as string,
    faviconPath: '/favicon.svg',
  },
  /** Credit for the template author. Separate from the (fictional) Folio Finance business. */
  owner: {
    name: 'OneStop Infinite',
    templateName: 'Template 13 — Folio Finance',
    showCredit: true,
    url: '',
  },
  /** Canonical origin used for canonical tags, Open Graph URLs and sitemap.xml. Change before deploying. */
  url: 'https://folio-finance.example.com',
  storagePrefix: 'folio-finance',
  locale: 'en',
  currency: { code: 'USD', locale: 'en-US' } as Currency,
  contact: {
    email: 'hello@folio-finance.example.com',
    phone: '+1 (555) 010-0144',
    phoneHref: '+15550100144',
    /** Contact form. Leave `endpoint` empty and nothing is sent anywhere (demo mode). */
    form: {
      endpoint: '' as string,
      categories: [
        'General enquiry',
        'Financial planning',
        'Business advisory',
        'Accounting & bookkeeping',
        'Tax planning',
        'Wealth planning',
        'Plan / pricing question',
        'Media or partnership',
      ],
    },
  },
  offices: [
    {
      id: 'harbour',
      name: 'Harbour Square (demonstration address)',
      address: ['120 Example Quay', 'Fictional City, FC 00000', 'Demoland'],
      note: 'This is a fictional address used for template demonstration. No office exists here.',
      phone: '+1 (555) 010-0144',
      email: 'hello@folio-finance.example.com',
      mapQuery: '',
    },
    {
      id: 'virtual',
      name: 'Virtual consultations',
      address: ['Video call from anywhere', 'Link sent after a real booking'],
      note: 'Demonstration only — no video links are created by this template.',
      phone: '+1 (555) 010-0145',
      email: 'virtual@folio-finance.example.com',
    },
  ] as Office[],
  /** Weekdays: 0 = Sunday … 6 = Saturday. `open`/`close` use 24-hour HH:MM; leave both empty for closed. */
  hours: [
    { days: [1, 2, 3, 4, 5], label: 'Monday – Friday', open: '09:00', close: '17:30' },
    { days: [6], label: 'Saturday', open: '', close: '', note: 'By appointment' },
    { days: [0], label: 'Sunday', open: '', close: '', note: 'Closed' },
  ] as { days: number[]; label: string; open: string; close: string; note?: string }[],
  timezoneLabel: 'Demo Time (local to the visitor)',
  social: [
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { id: 'x', label: 'X', href: 'https://x.com/', icon: 'x' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
  ] as { id: string; label: string; href: string; icon: 'linkedin' | 'x' | 'instagram' }[],
  seo: {
    titleTemplate: '%s — Folio Finance',
    defaultTitle: 'Folio Finance — Considered financial advisory & accounting (template demo)',
    description:
      'Folio Finance is a fictional financial advisory, accounting and consultancy brand that demonstrates a premium website template with planning tools, pricing and demo booking.',
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image',
    /** Set to true on pages you do not want indexed (demo/staging deployments). */
    noindexDemo: false,
  },
  legal: {
    demoNotice:
      'Folio Finance is a fictional brand created for the OneStop Infinite website template. The people, testimonials, statistics, prices and addresses on this site are demonstration content.',
    generalDisclaimer:
      'Content on this site is for general education and template demonstration only. It is not financial, tax, legal or investment advice, and nothing here is an offer or recommendation. Rules, rates and thresholds differ by country and change over time; always confirm details with a suitably qualified, authorised professional.',
    calculatorDisclaimer:
      'These calculators produce illustrative estimates from the numbers you enter. They are not forecasts, personal recommendations or guarantees. Real investment returns vary and can be negative; real loans may include fees, taxes, rate changes and other terms not modelled here. Results use a display currency only — no exchange rates are applied.',
    bookingDisclaimer:
      'This is a demonstration booking. Nothing you enter is sent to any advisory firm, no one will contact you, and the appointment is saved only in this browser on this device.',
    contactDisclaimer:
      'This template has no backend configured. Submitting the form validates your message but does not send it anywhere unless the site owner configures an endpoint.',
    sensitiveDataNotice:
      'Please do not enter bank account numbers, card numbers, passwords, tax identification numbers or account statements on this site.',
    pricingDisclaimer:
      'All prices are demonstration values for template purposes. They are not an offer, quote or invoice, and selecting a plan does not purchase or subscribe you to anything.',
    regulatoryNote:
      'Folio Finance holds no licences, registrations or certifications — it is a fictional brand. Real firms must display their actual regulatory status here.',
    copyright: 'Fictional demonstration brand. Template © OneStop Infinite.',
  },
};

export const footerNav: { heading: string; links: NavItem[] }[] = [
  {
    heading: 'Advisory',
    links: [
      { label: 'Services', to: '/services' },
      { label: 'Who we serve', to: '/industries' },
      { label: 'Engagement plans', to: '/pricing' },
      { label: 'Financial tools', to: '/tools' },
    ],
  },
  {
    heading: 'Firm',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Our team', to: '/team' },
      { label: 'Insights', to: '/insights' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Disclaimers', to: '/disclaimer' },
      { label: 'Book a demo consultation', to: '/book' },
    ],
  },
];
