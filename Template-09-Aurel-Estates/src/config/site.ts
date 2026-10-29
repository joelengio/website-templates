/**
 * SITE CONFIG — brand, contact details, owner credit, SEO defaults and form behaviour.
 * Everything a reseller edits first lives here. See CUSTOMIZATION_GUIDE.md.
 */
const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;

export const site = {
  brand: {
    name: 'Aurel Estates',
    shortName: 'Aurel',
    tagline: 'Considered homes, quietly curated.',
    /**
     * logo.type = 'monogram' draws an SVG monogram + wordmark from the values below.
     * logo.type = 'image' uses imageSrc (any file in /public, e.g. '/brand/logo.svg') instead.
     */
    logo: {
      type: 'monogram' as 'monogram' | 'image',
      monogram: 'A',
      wordmark: 'Aurel',
      wordmarkSub: 'Estates',
      imageSrc: '',
      imageAlt: 'Aurel Estates',
    },
  },

  /** Public URL — used for canonical tags, sitemap.xml and robots.txt. Replace before launch. */
  url: env?.VITE_SITE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SITE_URL : '') || 'https://aurel-estates.example.com',
  locale: 'en-US',
  currency: 'USD',
  /** 'metric' shows m², 'imperial' shows sq ft. Property data is stored in m². */
  units: 'imperial' as 'metric' | 'imperial',

  contact: {
    email: 'hello@aurel-estates.example.com',
    phone: '+1 (555) 010-0142',
    phoneHref: '+15550100142',
    addressLines: ['14 Alder Row', 'Alder Cove, Northhaven'],
    hours: 'Mon–Fri 9:00–18:00 · Sat by appointment',
  },

  /** Add { label, href } entries to show social links in the footer. Empty = none shown. */
  social: [] as { label: string; href: string }[],

  /** Template ownership credit — separate from the demo brand above. */
  owner: {
    name: 'OneStop Infinite',
    product: 'OneStop Infinite Template 09 — Aurel Estates',
    url: '',
    showCredit: true,
  },

  /** Demo-content transparency. Set showBanner:false once real content replaces the demo data. */
  demo: {
    showBanner: true,
    bannerText:
      'Template demo — Aurel Estates is a fictional brand. All listings, people and figures are made up.',
    footerDisclaimer:
      'Aurel Estates is a fictional brand created to demonstrate a website template. Properties, prices, people, addresses and statistics are invented and do not describe real homes or services. Photography is licensed stock imagery.',
  },

  forms: {
    /** Set VITE_FORM_ENDPOINT (see .env.example) to a real endpoint to send inquiries. Empty = demo mode. */
    endpoint: env?.VITE_FORM_ENDPOINT || '',
    demoNotice:
      'Demo mode: no email service is connected, so nothing you enter here is sent or stored. The form only validates your input.',
  },

  seo: {
    titleTemplate: '%s | Aurel Estates',
    defaultTitle: 'Aurel Estates — Considered homes, quietly curated',
    description:
      'Aurel Estates is a fictional real estate brand demonstrating a premium listings website template: search, filters, compare, favorites and inquiry forms.',
    ogImage: '/images/cedar-ridge-exterior.jpg',
  },

  /** localStorage namespace — change when running several templates on one domain. */
  storagePrefix: 'aurel',
};

export type SiteConfig = typeof site;
