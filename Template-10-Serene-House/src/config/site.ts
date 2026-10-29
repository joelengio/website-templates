import type { BusinessDay } from './types';
import { images } from './images';

/**
 * ─── BRAND & BUSINESS IDENTITY ────────────────────────────────────────────
 * Edit this file to rebrand the template. SERENE HOUSE is a FICTIONAL demonstration
 * brand. The template itself is owned and published by OneStop Infinite.
 */
export const site = {
  brand: {
    name: 'SERENE HOUSE',
    shortName: 'Serene House',
    tagline: 'Spa & Wellness Sanctuary',
    logo: '/logo.svg',
    favicon: '/favicon.svg',
    /** Letters shown in the monogram fallback / favicon. */
    monogram: 'SH'
  },
  /** Production URL (no trailing slash). Used for canonical links, sitemap and Open Graph. */
  url: 'https://serenehouse.example',
  locale: 'en-US',
  currency: 'USD',
  contact: {
    email: 'hello@serenehouse.example',
    phone: '+1 (555) 010-0142',
    phoneHref: '+15550100142',
    addressLines: ['28 Linden Court', 'Alderbrook Valley', 'Demo State 00000'],
    mapLabel: 'Demonstration location — not a real address',
    /** Optional. Paste an OpenStreetMap/Google embed URL to show a live map instead of the illustration. */
    mapEmbedUrl: '',
    /**
     * Optional contact-form endpoint (e.g. Formspree / your own API). When empty the form runs
     * in DEMO mode: messages are validated but are NOT delivered anywhere.
     */
    formEndpoint: ''
  },
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/' },
    { label: 'Facebook', url: 'https://www.facebook.com/' },
    { label: 'Pinterest', url: 'https://www.pinterest.com/' }
  ],
  hours: [
    { day: 1, label: 'Monday', open: '09:00', close: '19:00' },
    { day: 2, label: 'Tuesday', open: '09:00', close: '19:00' },
    { day: 3, label: 'Wednesday', open: '09:00', close: '20:00' },
    { day: 4, label: 'Thursday', open: '09:00', close: '20:00' },
    { day: 5, label: 'Friday', open: '09:00', close: '20:00' },
    { day: 6, label: 'Saturday', open: '08:30', close: '18:00' },
    { day: 0, label: 'Sunday', open: null, close: null }
  ] satisfies BusinessDay[],
  publisher: {
    name: 'OneStop Infinite',
    templateName: 'OneStop Infinite Template 10 — Serene House',
    notice:
      'SERENE HOUSE is a fictional demonstration brand. This website template is owned and published by OneStop Infinite.'
  },
  seo: {
    titleSuffix: ' | SERENE HOUSE',
    defaultTitle: 'SERENE HOUSE — Luxury Spa & Wellness Sanctuary',
    defaultDescription:
      'SERENE HOUSE is a fictional boutique spa offering massage, facials, body rituals and wellness therapies. A OneStop Infinite website template.',
    ogImage: images.ogImage.src,
    themeColor: '#5F6847',
    twitterCard: 'summary_large_image'
  },
  /** Page-level SEO. Keys match the route names used by each page. */
  pages: {
    home: { title: 'Luxury Spa & Wellness Sanctuary', description: 'Massage, facials, body rituals and restorative spa days in a calm boutique wellness house. Explore treatments and book a demonstration appointment.' },
    treatments: { title: 'Spa Treatments', description: 'Browse massages, facials, body treatments and wellness therapies. Filter by category, search by name and view duration and prices.' },
    packages: { title: 'Spa Packages & Offers', description: 'Wellness journeys, spa day packages, couples experiences and seasonal offers with transparent price breakdowns.' },
    booking: { title: 'Book an Appointment (Demo)', description: 'Try the interactive demonstration booking flow: choose a treatment, therapist, date and time. Demo only — nothing is sent to a real business.' },
    manage: { title: 'My Demo Bookings', description: 'Review, reschedule or cancel demonstration bookings saved in this browser.' },
    about: { title: 'About Us', description: 'The story, philosophy, team, facilities and values behind SERENE HOUSE.' },
    gallery: { title: 'Gallery', description: 'A visual tour of the house, rituals and details of SERENE HOUSE.' },
    journal: { title: 'The Journal', description: 'Fictional demonstration articles on rest, skin, breath and mindful living.' },
    contact: { title: 'Contact & Location', description: 'Opening hours, contact details and a demonstration contact form for SERENE HOUSE.' },
    notice: { title: 'Demo Notice & Privacy', description: 'How demonstration bookings, forms and local storage work in this template.' },
    notFound: { title: 'Page Not Found', description: 'The page you are looking for could not be found.' }
  }
};

export type SiteConfig = typeof site;
