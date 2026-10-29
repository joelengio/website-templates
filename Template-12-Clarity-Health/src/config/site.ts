import type { BusinessDay, ClinicLocation, DepartmentContact } from './types';

/**
 * Central business configuration. Everything here is FICTIONAL demonstration data:
 * the clinic, address, phone numbers (555-01xx range) and e-mail (reserved ".example" domain) do not exist.
 */
export const site = {
  brand: {
    name: 'CLARITY HEALTH',
    shortName: 'Clarity Health',
    tagline: 'Considered care, clearly explained',
    /** Files in /public. Replace the SVGs (keep the paths) or change the paths here. */
    logo: '/logo.svg',
    favicon: '/favicon.svg',
    showWordmark: true
  },
  /** Deployed origin used for canonical URLs, Open Graph and the sitemap. Override with VITE_SITE_URL at build time. */
  url: 'https://clarity-health-demo.example',
  seo: {
    titleSuffix: ' | CLARITY HEALTH',
    defaultTitle: 'CLARITY HEALTH — Premium Medical Clinic Website Template (Demo)',
    defaultDescription:
      'CLARITY HEALTH is a fictional demonstration clinic: a premium, customizable medical clinic website template with specialties, doctors, services and a local-only demo booking flow.',
    ogImage: '/images/og-image.webp',
    twitterCard: 'summary_large_image',
    themeColor: '#0e2a47'
  },
  contact: {
    phone: '+1 (555) 010-0142',
    phoneHref: '+15550100142',
    email: 'hello@clarity-health.example',
    addressLines: ['Riverside Centre, 120 Meridian Row', 'Northvale, NV 00000', 'Fictional address — not a real location']
  },
  /** Opening hours of the primary clinic. The booking calendar is generated from these. */
  hours: [
    { day: 1, label: 'Monday', open: '08:00', close: '18:00' },
    { day: 2, label: 'Tuesday', open: '08:00', close: '18:00' },
    { day: 3, label: 'Wednesday', open: '08:00', close: '18:00' },
    { day: 4, label: 'Thursday', open: '08:00', close: '19:00' },
    { day: 5, label: 'Friday', open: '08:00', close: '17:00' },
    { day: 6, label: 'Saturday', open: '09:00', close: '13:00' },
    { day: 0, label: 'Sunday' }
  ] satisfies BusinessDay[],
  hoursNote: 'Demonstration hours for a fictional clinic. Closed on public holidays.',
  departments: [
    { name: 'Appointments desk', phone: '+1 (555) 010-0143', phoneHref: '+15550100143', email: 'appointments@clarity-health.example', note: 'Demo contact — nobody will answer.' },
    { name: 'Patient accounts & billing', phone: '+1 (555) 010-0144', phoneHref: '+15550100144', email: 'billing@clarity-health.example', note: 'Placeholder details for payment questions.' },
    { name: 'Diagnostics & imaging', phone: '+1 (555) 010-0145', phoneHref: '+15550100145', email: 'diagnostics@clarity-health.example', note: 'Placeholder details for scan and test scheduling.' },
    { name: 'Patient experience', phone: '+1 (555) 010-0146', phoneHref: '+15550100146', email: 'feedback@clarity-health.example', note: 'Placeholder details for compliments and concerns.' }
  ] satisfies DepartmentContact[],
  locations: [
    {
      id: 'riverside',
      name: 'Riverside Centre',
      addressLines: ['120 Meridian Row', 'Northvale, NV 00000'],
      phone: '+1 (555) 010-0142',
      phoneHref: '+15550100142',
      email: 'hello@clarity-health.example',
      hoursSummary: ['Mon–Wed: 08:00–18:00', 'Thu: 08:00–19:00', 'Fri: 08:00–17:00', 'Sat: 09:00–13:00', 'Sun: closed'],
      facilities: ['Consultation suites', 'Diagnostics floor', 'Rehabilitation studio', 'Step-free entrance'],
      directions: 'Demonstration directions: two minutes on foot from the fictional Riverside tram stop. Accessible parking is shown here as a placeholder.',
      image: 'map-riverside'
    },
    {
      id: 'annex',
      name: 'Garden Annex — Diagnostics & Dental',
      addressLines: ['18 Linden Court', 'Northvale, NV 00000'],
      phone: '+1 (555) 010-0145',
      phoneHref: '+15550100145',
      email: 'diagnostics@clarity-health.example',
      hoursSummary: ['Mon–Fri: 08:30–17:00', 'Sat: closed', 'Sun: closed'],
      facilities: ['Imaging suite', 'Dental surgery', 'Phlebotomy room'],
      directions: 'Demonstration directions: a short walk from the Riverside Centre through the fictional Linden Court garden.',
      image: 'map-annex'
    }
  ] satisfies ClinicLocation[],
  social: [] as { label: string; url: string }[],
  publisher: {
    name: 'OneStop Infinite',
    notice: 'CLARITY HEALTH is a fictional demonstration clinic.',
    templateCredit: 'Website template by OneStop Infinite — Template 12.'
  },
  /** Prominent notices. Edit the wording, but keep an emergency message and a demonstration disclosure on a real site. */
  notices: {
    demoBar: 'Demonstration website — CLARITY HEALTH is fictional. Nothing here is real medical care, advice or booking.',
    emergency: 'In an emergency call your local emergency number (for example 911, 112 or 999) or go to the nearest emergency department. Do not use this website.',
    medical: 'Information on this website is general and educational. It is not medical advice, diagnosis or treatment, and it does not replace advice from a qualified clinician.',
    privacy:
      'This is a demonstration. Appointment details you enter are saved only in this browser (localStorage) so you can view, reschedule or cancel them. Nothing is sent to a server, and no real clinic receives it. Please never enter real medical information.',
    booking:
      'DEMONSTRATION BOOKING — this does not create a real medical appointment. Do not use it to book care. Entries stay in this browser only.',
    doctor: 'Fictional demonstration profile — not a real clinician. Names, photographs and qualifications are invented.',
    contactForm: 'Demonstration form — there is no backend, so nothing is sent or delivered. Please do not enter medical details.',
    articles: 'General educational content written for this template. It has not been reviewed by a clinician and is not medical advice.'
  }
};
