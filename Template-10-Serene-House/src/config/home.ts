import type { HomeSectionConfig } from './types';
import { images } from './images';

/**
 * ─── HOME PAGE ─────────────────────────────────────────────────────────────
 * `sections` controls visibility AND ordering of the homepage. Reorder lines or set enabled:false.
 */
export const homeSections: HomeSectionConfig[] = [
  { id: 'hero', enabled: true },
  { id: 'intro', enabled: true },
  { id: 'treatments', enabled: true },
  { id: 'philosophy', enabled: true },
  { id: 'packages', enabled: true },
  { id: 'gallery', enabled: true },
  { id: 'testimonials', enabled: true },
  { id: 'journal', enabled: true },
  { id: 'booking', enabled: true },
  { id: 'newsletter', enabled: true }
];

export const homeContent = {
  hero: {
    eyebrow: 'Spa · Skin · Stillness',
    title: 'A quiet house for restoring body and mind',
    text: 'Warm light, natural materials and unhurried care. Step into Serene House and let the day soften.',
    image: images.heroArch,
    primary: { label: 'Book a Visit', to: '/booking' },
    secondary: { label: 'Explore Treatments', to: '/treatments' },
    highlights: ['Botanical treatments', 'Expert therapists', 'Private suites']
  },
  intro: {
    eyebrow: 'Welcome',
    title: 'Where care is never rushed',
    paragraphs: [
      'Serene House is a boutique wellness sanctuary built around a simple idea: that rest is a practice worth protecting.',
      'Every treatment begins with a conversation, every room is lit by natural light and warmed by wood and linen, and no appointment ends before you are ready.'
    ],
    image: images.introStones,
    secondaryImage: images.introLeaves,
    link: { label: 'Our story', to: '/about' },
    stats: [
      { value: '15+', label: 'Years of practice' },
      { value: '6', label: 'Private suites' },
      { value: '100%', label: 'Botanical formulas' }
    ]
  },
  treatments: {
    eyebrow: 'Featured Treatments',
    title: 'Rituals made for you',
    text: 'A few favourites from our menu. Each is tailored to your needs on the day.',
    count: 3
  },
  philosophy: {
    eyebrow: 'Our Philosophy',
    title: 'Slow down. Return to yourself.',
    text: 'We believe well-being is built from small, repeated acts of care. Our approach rests on three pillars.',
    image: images.philosophy,
    pillars: [
      { title: 'Rest', text: 'Unhurried appointments and quiet spaces that invite the nervous system to settle.' },
      { title: 'Nature', text: 'Plant-based formulas, natural fibres and materials that feel as good as they look.' },
      { title: 'Personal', text: 'Every treatment adapts to your body, your skin and your day.' }
    ]
  },
  packages: {
    eyebrow: 'Packages',
    title: 'Journeys of restoration',
    text: 'Combine treatments into a complete experience at a transparent price.',
    count: 3
  },
  gallery: { eyebrow: 'Inside the House', title: 'A glimpse of the calm', count: 6 },
  testimonials: { eyebrow: 'Kind Words', title: 'What guests say' },
  journal: { eyebrow: 'The Journal', title: 'Notes on slower living', count: 3 },
  booking: {
    eyebrow: 'Reserve your time',
    title: 'Your moment of calm is waiting',
    text: 'Try the demonstration booking experience: choose a treatment, therapist, date and time in minutes.',
    image: images.ctaDunes,
    primary: { label: 'Book a Visit', to: '/booking' },
    secondary: { label: 'Browse Packages', to: '/packages' }
  },
  newsletter: {
    eyebrow: 'Stay in touch',
    title: 'Slow notes, delivered gently',
    text: 'Seasonal rituals, wellness reading and first word of offers.',
    demoNote: 'Demonstration only: your email is not stored or sent anywhere.'
  }
};
