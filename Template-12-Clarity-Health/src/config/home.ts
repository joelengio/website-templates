import type { HomeSectionConfig } from './types';

/**
 * Homepage composition. Reorder the array to reorder sections; set `enabled: false` to hide one.
 * Copy for each section lives below, so no wording is hard-coded in components.
 */
export const homeSections: HomeSectionConfig[] = [
  { id: 'hero', enabled: true },
  { id: 'intro', enabled: true },
  { id: 'specialties', enabled: true },
  { id: 'doctors', enabled: true },
  { id: 'services', enabled: true },
  { id: 'why', enabled: true },
  { id: 'experience', enabled: true },
  { id: 'facilities', enabled: true },
  { id: 'testimonials', enabled: true },
  { id: 'info', enabled: true },
  { id: 'articles', enabled: true },
  { id: 'contact', enabled: true }
];

export const home = {
  hero: {
    eyebrow: 'Demonstration clinic · Fictional',
    title: 'Healthcare that feels clear, calm and considered.',
    lead: 'CLARITY HEALTH is a fictional multispecialty clinic that shows how a premium medical website can feel: unhurried, well explained and easy to use.',
    primaryCta: { label: 'Book a demo appointment', to: '/book' },
    secondaryCta: { label: 'Explore specialties', to: '/specialties' },
    image: 'hero-main',
    floatingImage: 'hero-card',
    badges: ['Local-only demo booking', 'No real patient data', 'Accessible by design'],
    stats: [
      { value: '8', label: 'demo specialties' },
      { value: '10', label: 'fictional clinicians' },
      { value: '30', label: 'sample services' }
    ]
  },
  intro: {
    eyebrow: 'Welcome to CLARITY HEALTH',
    title: 'A clinic designed around time, clarity and trust.',
    paragraphs: [
      'Imagine a clinic where appointments are not rushed, explanations are written in plain language and every next step is clear before you leave.',
      'That is the spirit of this demonstration. It is a showcase for a website template — the people, prices and services are invented — but every interaction on it works, so you can see exactly how your own clinic could look and behave.'
    ],
    points: ['Longer, unhurried appointments', 'Written summaries of next steps', 'Clear, upfront information'],
    image: 'intro-main',
    cta: { label: 'Read our story', to: '/about' }
  },
  specialties: {
    eyebrow: 'Specialties',
    title: 'Care across eight specialties',
    lead: 'From everyday primary care to focused specialist services, each team works together under one roof.',
    count: 8,
    cta: { label: 'All specialties', to: '/specialties' }
  },
  doctors: {
    eyebrow: 'Our clinicians',
    title: 'Meet some of our fictional team',
    lead: 'Every profile is invented for this demonstration. Filter by specialty, language and availability on the doctors page.',
    /** Doctor ids to feature (in order). */
    featured: ['amara-okafor', 'mateo-lindqvist', 'priya-raman', 'leila-haddad'],
    cta: { label: 'All doctors', to: '/doctors' }
  },
  services: {
    eyebrow: 'Medical services',
    title: 'Services, explained clearly',
    lead: 'Consultations, diagnostics, preventive care, specialist treatments and wellness screenings — each with duration and a demo price.',
    /** Service ids to feature (in order). */
    featured: ['initial-consultation', 'ecg', 'annual-review'],
    cta: { label: 'Browse all services', to: '/services' }
  },
  why: {
    eyebrow: 'Why choose us',
    title: 'Premium does not have to mean complicated',
    items: [
      { icon: 'clock', title: 'Time to talk', text: 'Appointment lengths are designed around conversation, not the clock.' },
      { icon: 'book', title: 'Plain-language summaries', text: 'Every visit ends with written next steps you can actually follow.' },
      { icon: 'users', title: 'Joined-up teams', text: 'Specialists, diagnostics and rehabilitation work together in one place.' },
      { icon: 'shield', title: 'Privacy-minded by design', text: 'This demo asks only for basic details and keeps them in your browser.' }
    ]
  },
  experience: {
    eyebrow: 'Patient experience',
    title: 'From first click to follow-up',
    steps: [
      { title: 'Choose', text: 'Pick a specialty, a doctor or "no preference", and the service that fits.' },
      { title: 'Schedule', text: 'See demonstration availability and select a time that suits you.' },
      { title: 'Review', text: 'Check your details in a clear summary before confirming the demo.' },
      { title: 'Manage', text: 'Reschedule or cancel your local demo appointment whenever you like.' }
    ],
    cta: { label: 'Try the booking demo', to: '/book' }
  },
  facilities: {
    eyebrow: 'Facilities',
    title: 'Spaces that put you at ease',
    lead: 'A preview of the fictional Riverside Centre.',
    count: 3,
    cta: { label: 'About the clinic', to: '/about#facilities' }
  },
  testimonials: {
    eyebrow: 'Patient voices',
    title: 'Clearly fictional testimonials',
    lead: 'These quotes were written for the demonstration. They are not from real patients.'
  },
  info: {
    eyebrow: 'Helpful information',
    title: 'Plan your visit with confidence',
    cards: [
      { icon: 'compass', title: 'Your first visit', text: 'What to bring, how long it takes and what to expect.', to: '/patient-information#first-visit' },
      { icon: 'clock', title: 'Opening hours', text: 'Demonstration hours for the Riverside Centre.', to: '/patient-information#hours' },
      { icon: 'wallet', title: 'Insurance & payment', text: 'Configurable placeholder information.', to: '/patient-information#payment' },
      { icon: 'help', title: 'FAQs', text: 'Answers to common questions about the clinic and this demo.', to: '/patient-information#faqs' }
    ]
  },
  articles: {
    eyebrow: 'Health journal',
    title: 'General health information',
    lead: 'Plain-language educational articles written for this template.',
    count: 3,
    cta: { label: 'Visit the journal', to: '/journal' }
  },
  contact: {
    eyebrow: 'Ready when you are',
    title: 'Try the booking demo, or get in touch',
    text: 'Step through the complete appointment experience in under two minutes. Nothing is sent anywhere — your demo appointment stays in this browser.',
    primaryCta: { label: 'Book a demo appointment', to: '/book' },
    secondaryCta: { label: 'Contact & locations', to: '/contact' },
    image: 'cta-band'
  }
};
