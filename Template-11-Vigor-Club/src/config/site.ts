import type { HoursRow, SocialLink } from './types';

/**
 * ─── SITE ──────────────────────────────────────────────────────────────────
 * Brand, contact details, hours, social links, SEO defaults and form behaviour.
 * VIGOR CLUB is a FICTIONAL business used to demonstrate the template.
 * "OneStop Infinite" is the owner/author of the template and is credited separately in `template`.
 */
export const site = {
  brand: {
    name: 'VIGOR CLUB',
    /** Short name used in tight spaces and ARIA labels. */
    shortName: 'Vigor',
    tagline: 'Strength. Craft. Community.',
    logo: '/logo.svg',
    favicon: '/favicon.svg',
    /** Text-based logo mark (used by the header/footer so the wordmark follows `name`). */
    monogram: 'V'
  },
  /** Public site URL – used for canonical URLs, sitemap.xml and Open Graph. Override with VITE_SITE_URL at build time. */
  url: 'https://vigorclub.example',
  contact: {
    phone: '+1 (555) 010-0199',
    email: 'hello@vigorclub.example',
    addressLines: ['100 Example Street', 'Sampletown, ST 00000', 'Demonstration location'],
    /** Shown beside the address so nobody mistakes the demo for a real venue. */
    locationNote: 'Fictional demonstration address. Replace with your real venue details.',
    mapUrl: ''
  },
  hours: [
    { days: 'Monday – Friday', hours: '05:30 – 22:00' },
    { days: 'Saturday', hours: '07:00 – 20:00' },
    { days: 'Sunday', hours: '08:00 – 18:00' }
  ] as HoursRow[],
  holidayNote: 'Public-holiday hours are published on the website and at the front desk.',
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/' },
    { label: 'YouTube', url: 'https://www.youtube.com/' },
    { label: 'Facebook', url: 'https://www.facebook.com/' }
  ] as SocialLink[],
  seo: {
    defaultTitle: 'VIGOR CLUB — Premium Strength & Conditioning Club',
    titleSuffix: ' | VIGOR CLUB',
    defaultDescription:
      'VIGOR CLUB is a fictional premium gym template: strength, conditioning, boxing, mobility and personal training with a demo class booking system.',
    ogImage: '/images/og-image.webp',
    themeColor: '#0C0D0E',
    twitterCard: 'summary_large_image'
  },
  /**
   * Form behaviour. Leave `endpoint` empty to run in DEMONSTRATION mode (validated but never sent).
   * Set it to a form service URL that accepts JSON POST to deliver real enquiries.
   */
  forms: {
    endpoint: '',
    successNote: 'Thank you — your message has been sent.'
  },
  /** Credit for the template author. Not part of the fictional Vigor Club business. */
  template: {
    ownerName: 'OneStop Infinite',
    productName: 'Template 11 — VIGOR CLUB',
    creditLabel: 'Website template by OneStop Infinite',
    creditUrl: '',
    showCredit: true
  },
  legal: {
    year: 2026,
    demoDisclaimer:
      'VIGOR CLUB is a fictional business created to demonstrate a website template. Classes, prices, trainers, reviews and credentials are fictional. Bookings and enquiries are stored only in your browser.',
    healthDisclaimer:
      'Content on this site is general information, not medical advice. Speak with a qualified professional before starting or changing an exercise programme.'
  }
};

export type SiteConfig = typeof site;
