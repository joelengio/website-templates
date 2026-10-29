/**
 * Brand, contact details, social links and SEO defaults.
 * Edit this file first when rebranding the template for another property.
 * "publisher" is the template vendor (OneStop Infinite) and is deliberately separate from the hotel brand.
 */
export const site = {
  brand: {
    name: 'HAVEN STAYS',
    shortName: 'Haven Stays',
    tagline: 'Slow luxury between the olive groves and the sea',
    /** Text shown beside the logo mark. Set showMark to false to use text only. */
    logoText: 'HAVEN STAYS',
    showMark: true,
    logoMark: '/logo-mark.svg',
    favicon: '/favicon.svg',
    appleTouchIcon: '/apple-touch-icon.png',
  },
  /** Public site address, no trailing slash. Used for canonical URLs, sitemap.xml and robots.txt. */
  url: 'https://havenstays.example.com',
  locale: 'en',
  currency: { code: 'USD', locale: 'en-US' },
  contact: {
    propertyName: 'Haven Stays — Cala Verana',
    address: ['12 Via dell’Ulivo', 'Cala Verana', 'Costa Dorata (fictional address)'],
    phone: '+1 (555) 010-0150',
    reservationsEmail: 'reservations@havenstays.example.com',
    email: 'hello@havenstays.example.com',
    frontDeskHours: 'Front desk 24 hours · Reservations 08:00–20:00 daily',
    mapUrl: '',
    coordinates: { lat: 0, lng: 0, note: 'Fictional demonstration location — replace with real coordinates.' },
  },
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/' },
    { label: 'Facebook', url: 'https://www.facebook.com/' },
    { label: 'Pinterest', url: 'https://www.pinterest.com/' },
  ],
  seo: {
    titleTemplate: '%s · Haven Stays',
    defaultTitle: 'Haven Stays — Boutique hotel & resort',
    defaultDescription:
      'Haven Stays is a fictional boutique resort used to demonstrate a luxury hospitality website template with rooms, suites, a local booking demo, dining, wellness and experiences.',
    ogImage: '/images/og-image.webp',
    twitterCard: 'summary_large_image',
  },
  footer: {
    blurb: 'A fictional boutique resort of terraced stone villas, olive groves and a private cove. This website is a template demonstration.',
    legal: '© 2026 Haven Stays (fictional brand).',
    showPublisherCredit: true,
    newsletter: true,
  },
  /** The template vendor — shown only in the footer credit. */
  publisher: { name: 'OneStop Infinite', url: 'https://example.com/onestop-infinite', templateName: 'Template 15' },
  demoNotice:
    'Demonstration only: availability is simulated, no payment is taken and nothing is sent to a real hotel. Reservations live in this browser (localStorage).',
};
