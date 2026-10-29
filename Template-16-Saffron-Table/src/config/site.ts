import type { CtaLink, PageSeo } from './types';

export const site = {
  brand: {
    name: 'Saffron Table',
    shortName: 'Saffron',
    tagline: 'Fire, spice and the long evening',
    /** Text beside the logo mark. The mark itself is src/components/Logo.tsx and public/favicon.svg. */
    logoMark: 'S',
    cuisine: 'Modern European cooking with Levantine and Persian spice, finished over open fire.',
    description:
      'Saffron Table is a fictional chef-led restaurant used to demonstrate the OneStop Infinite restaurant template.',
  },
  /** Production URL used for canonical links, sitemap.xml and Open Graph. Replace before launch. */
  url: 'https://saffron-table.example',
  locale: 'en_US',
  demo: {
    /** Shown in the footer and key flows. Set `enabled: false` once real services are connected. */
    enabled: true,
    banner: 'Fictional demonstration restaurant. Reservations, enquiries and orders are simulated locally and are never sent anywhere.',
  },
  contact: {
    phone: '+1 (555) 010-2024',
    phoneHref: 'tel:+15550102024',
    email: 'hello@saffron-table.example',
    address: {
      line1: '14 Copper Lane',
      line2: 'Old Market Quarter',
      city: 'Demoville',
      region: 'CA',
      postcode: '90000',
      country: 'United States',
    },
    /** Demonstration location. Replace with the real address and map link. */
    mapLabel: 'Fictional address for demonstration only',
    mapHref: '',
    directions: [
      { mode: 'By metro', text: 'Demo Line, Market Square station, a four-minute walk along Copper Lane.' },
      { mode: 'By car', text: 'Valet by the door on weekend evenings. The Market Street garage is a two-minute walk.' },
      { mode: 'By bike', text: 'Secure racks sit beside the entrance on Copper Lane.' },
      { mode: 'Accessibility', text: 'Step-free entrance, accessible restroom and a quiet table on request.' },
    ],
  },
  /** Display copy for opening hours; booking rules live in reservations.ts. */
  hoursDisplay: [
    { days: 'Monday', hours: 'Closed' },
    { days: 'Tuesday – Thursday', hours: 'Dinner 5:30 pm – 10:00 pm' },
    { days: 'Friday – Saturday', hours: 'Dinner 5:00 pm – 11:00 pm' },
    { days: 'Sunday', hours: 'Lunch 12:00 – 3:30 pm · Dinner 5:30 – 9:30 pm' },
  ],
  hoursNote: 'Kitchen closes 45 minutes before the room.',
  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Facebook', href: 'https://facebook.com/' },
    { label: 'Pinterest', href: 'https://pinterest.com/' },
  ],
  policies: [
    { title: 'Reservations', text: 'Tables are held for 15 minutes after the booking time. Please call if you are running late.' },
    { title: 'Cancellations', text: 'Please give at least 24 hours’ notice for parties of six or more.' },
    { title: 'Dietary needs & allergies', text: 'Tell us about allergies when you book and again to your server. Our kitchen handles nuts, gluten, dairy, shellfish and other allergens, so we cannot guarantee any dish is free from them.' },
    { title: 'Dress', text: 'Smart casual. Nothing is required, but evenings tend to be dressed up.' },
    { title: 'Children', text: 'Welcome at lunch and early evening. A children’s menu is available on request.' },
    { title: 'Corkage', text: 'Corkage is available Tuesday – Thursday. Please ask when booking.' },
  ],
  nav: [
    { label: 'Menus', to: '/menus' },
    { label: 'Experiences', to: '/experiences' },
    { label: 'Private Dining', to: '/private-dining' },
    { label: 'Our Story', to: '/our-story' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Journal', to: '/journal' },
    { label: 'Contact', to: '/contact' },
  ] satisfies CtaLink[],
  headerCta: { label: 'Reserve', to: '/reserve' } satisfies CtaLink,
  footer: {
    columns: [
      {
        title: 'Dine',
        links: [
          { label: 'Menus', to: '/menus' },
          { label: 'Reserve a table', to: '/reserve' },
          { label: 'My reservations', to: '/reserve/manage' },
          { label: 'Order builder (demo)', to: '/order' },
        ],
      },
      {
        title: 'Gather',
        links: [
          { label: 'Experiences', to: '/experiences' },
          { label: 'Private dining', to: '/private-dining' },
          { label: 'Gallery', to: '/gallery' },
        ],
      },
      {
        title: 'Discover',
        links: [
          { label: 'Our story', to: '/our-story' },
          { label: 'Journal', to: '/journal' },
          { label: 'Contact & directions', to: '/contact' },
        ],
      },
    ],
    legal: 'Demonstration content. All names, reviews, awards, prices and addresses are fictional.',
  },
  /** Publisher credit; kept separate from the restaurant brand. */
  publisher: {
    name: 'OneStop Infinite',
    label: 'Template 16 — Saffron Table',
    url: 'https://onestopinfinite.example',
    showCredit: true,
  },
};

/** Page-level SEO. Titles are combined as "<title> | Saffron Table" except for the home page. */
export const seo: Record<string, PageSeo> = {
  '/': {
    title: 'Saffron Table — Fine Dining, Fire & Spice (Demo Restaurant)',
    description:
      'Saffron Table is a fictional chef-led restaurant: open-fire cooking, tasting menus, private dining and a local reservation demo built with React and Vite.',
    image: '/images/hero-table.jpg',
  },
  '/menus': {
    title: 'Menus',
    description: 'Browse starters, mains, seafood, vegetarian dishes, desserts, drinks and tasting menus with dietary and allergen information.',
    image: '/images/steak-fries.jpg',
  },
  '/reserve': {
    title: 'Reserve a Table (Demo)',
    description: 'Try the interactive reservation demo: choose a date, party size, seating area and time. Bookings are simulated locally.',
    image: '/images/pasta-table.jpg',
  },
  '/reserve/manage': {
    title: 'My Reservations (Demo)',
    description: 'View, modify or cancel the demonstration reservations saved in this browser.',
  },
  '/experiences': {
    title: 'Experiences',
    description: 'Chef’s tasting menu, private celebrations, group dining, seasonal events and culinary experiences at Saffron Table.',
    image: '/images/chef-plating.jpg',
  },
  '/private-dining': {
    title: 'Private Dining & Events',
    description: 'Three private spaces, set packages, example menus and a group dining enquiry form.',
    image: '/images/dining-teal.jpg',
  },
  '/our-story': {
    title: 'Our Story',
    description: 'The origin, culinary philosophy and team behind Saffron Table, a fictional demonstration restaurant.',
    image: '/images/chef-portrait.jpg',
  },
  '/gallery': {
    title: 'Gallery',
    description: 'Dishes, dining rooms, kitchen and gatherings: browse the Saffron Table photo gallery.',
    image: '/images/dining-green.jpg',
  },
  '/journal': {
    title: 'Journal',
    description: 'Food articles, chef stories, seasonal menu notes and culinary guides from Saffron Table.',
    image: '/images/chopping.jpg',
  },
  '/contact': {
    title: 'Contact, Hours & Directions',
    description: 'Opening hours, location, policies, directions and a demo contact form for Saffron Table.',
    image: '/images/terrace.jpg',
  },
  '/order': {
    title: 'Order Builder (Demo)',
    description: 'Plan an order with quantities, tax and service charge. A local demonstration: nothing is submitted.',
  },
};
