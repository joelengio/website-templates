import type { Category, PackageCategoryId, SpaPackage } from './types';
import { images } from './images';

/**
 * ─── PACKAGES & OFFERS ─────────────────────────────────────────────────────
 * `items` drive the price breakdown (sum of values vs. package price = saving).
 * `features` reference ids from `packageComparisonRows` and drive the comparison table.
 */
export const packageCategories: Category<PackageCategoryId>[] = [
  { id: 'wellness', name: 'Wellness Journeys', description: 'Multi-step programmes for lasting balance.' },
  { id: 'spa-day', name: 'Spa Days', description: 'Unhurried days with full access to the house.' },
  { id: 'couples', name: 'Couples', description: 'Shared rituals for two, side by side.' },
  { id: 'seasonal', name: 'Seasonal Offers', description: 'Limited-time rituals inspired by the season.' }
];

export const packageComparisonRows = [
  { id: 'massage', label: 'Massage' },
  { id: 'facial', label: 'Facial' },
  { id: 'body', label: 'Body treatment' },
  { id: 'lunch', label: 'Light lunch' },
  { id: 'access', label: 'Thermal & garden access' },
  { id: 'gift', label: 'Take-home gift' }
];

export const packages: SpaPackage[] = [
  {
    slug: 'serene-reset-journey',
    name: 'The Serene Reset',
    category: 'wellness',
    tagline: 'A half-day reset for body and skin',
    description: 'A balanced introduction to the house: a signature massage, a botanical facial and a restful tea ritual.',
    price: 249,
    priceNote: 'per guest',
    duration: '3 hours',
    minutes: 180,
    guests: 1,
    maxGuests: 2,
    items: [
      { label: 'Signature Serene Massage (60 min)', value: 145 },
      { label: 'Luminous Botanical Facial (60 min)', value: 135 },
      { label: 'Herbal tea ritual', value: 20 }
    ],
    features: ['massage', 'facial', 'access'],
    image: images.pkgReset,
    featured: true
  },
  {
    slug: 'deep-renewal-retreat',
    name: 'Deep Renewal Retreat',
    category: 'wellness',
    tagline: 'Our most complete restorative programme',
    description: 'Breathwork, a body wrap, a deep massage and a collagen facial — a full day of renewal with lunch.',
    price: 459,
    priceNote: 'per guest',
    duration: '6 hours',
    minutes: 360,
    guests: 1,
    maxGuests: 2,
    items: [
      { label: 'Guided Breathwork Session', value: 80 },
      { label: 'Warm Clay Body Wrap', value: 175 },
      { label: 'Deep Tissue Restore (60 min)', value: 160 },
      { label: 'Renewal Collagen Facial', value: 190 },
      { label: 'Light seasonal lunch', value: 40 }
    ],
    features: ['massage', 'facial', 'body', 'lunch', 'access', 'gift'],
    image: images.pkgRenewal,
    highlight: true
  },
  {
    slug: 'garden-spa-day',
    name: 'The Garden Spa Day',
    category: 'spa-day',
    tagline: 'A slow day of light, tea and treatments',
    description: 'Arrive in the morning and stay as long as you like: a signature massage, light lunch and full access to the thermal suite and garden.',
    price: 289,
    priceNote: 'per guest',
    duration: 'Full day',
    minutes: 300,
    guests: 1,
    maxGuests: 4,
    items: [
      { label: 'Signature Serene Massage (60 min)', value: 145 },
      { label: 'Light seasonal lunch', value: 40 },
      { label: 'Thermal suite & garden access', value: 85 },
      { label: 'Robe and slippers', value: 10 }
    ],
    features: ['massage', 'lunch', 'access'],
    image: images.pkgDay,
    featured: true
  },
  {
    slug: 'twilight-spa-evening',
    name: 'Twilight Spa Evening',
    category: 'spa-day',
    tagline: 'Wind down after work with candlelit calm',
    description: 'A Thursday to Saturday evening ritual: scalp & foot reset, sound bath and a restorative tea service.',
    price: 139,
    priceNote: 'per guest',
    duration: '2.5 hours',
    minutes: 150,
    guests: 1,
    maxGuests: 4,
    items: [
      { label: 'Scalp & Foot Reset', value: 75 },
      { label: 'Sound Bath Immersion', value: 65 },
      { label: 'Thermal suite access', value: 35 }
    ],
    features: ['access'],
    image: images.pkgTwilight
  },
  {
    slug: 'couples-harmony',
    name: 'Couples Harmony',
    category: 'couples',
    tagline: 'Side-by-side massage with a private bath',
    description: 'Two signature massages in a shared suite, followed by a private rose milk soak and sparkling refreshments.',
    price: 499,
    priceNote: 'per couple',
    duration: '2.5 hours',
    minutes: 150,
    guests: 2,
    maxGuests: 2,
    items: [
      { label: 'Signature Serene Massage ×2 (60 min)', value: 290 },
      { label: 'Rose Milk Bath Soak ×2', value: 190 },
      { label: 'Sparkling refreshments', value: 40 },
      { label: 'Take-home candle', value: 40 }
    ],
    features: ['massage', 'body', 'gift'],
    image: images.pkgCouples,
    highlight: true,
    featured: true
  },
  {
    slug: 'couples-glow-ritual',
    name: 'Couples Glow Ritual',
    category: 'couples',
    tagline: 'Facials for two, with tea in the garden',
    description: 'Two botanical facials in a shared suite plus a garden tea service and a take-home mask each.',
    price: 299,
    priceNote: 'per couple',
    duration: '2 hours',
    minutes: 120,
    guests: 2,
    maxGuests: 2,
    items: [
      { label: 'Luminous Botanical Facial ×2', value: 270 },
      { label: 'Garden tea service', value: 30 },
      { label: 'Take-home mask ×2', value: 40 }
    ],
    features: ['facial', 'gift', 'access'],
    image: images.pkgGlow
  },
  {
    slug: 'autumn-hearth-ritual',
    name: 'Autumn Hearth Ritual',
    category: 'seasonal',
    tagline: 'Warming hot stones and spiced tea',
    description: 'A seasonal ritual built around heat: hot stone massage, sage scrub and a spiced pear tea service.',
    price: 269,
    priceNote: 'per guest',
    duration: '2.5 hours',
    minutes: 150,
    guests: 1,
    maxGuests: 2,
    items: [
      { label: 'Hot Stone Ritual (75 min)', value: 185 },
      { label: 'Sage & Sea Salt Scrub', value: 110 },
      { label: 'Spiced pear tea service', value: 15 }
    ],
    features: ['massage', 'body', 'gift'],
    image: images.pkgSeasonal,
    validUntil: 'Demo offer — valid through 30 November',
    featured: true
  },
  {
    slug: 'winter-glow-escape',
    name: 'Winter Glow Escape',
    category: 'seasonal',
    tagline: 'Hydration for skin that has had enough of the cold',
    description: 'A nourishing facial, scalp massage and a warm clay wrap to protect skin through the colder months.',
    price: 329,
    priceNote: 'per guest',
    duration: '3 hours',
    minutes: 180,
    guests: 1,
    maxGuests: 2,
    items: [
      { label: 'Luminous Botanical Facial (75 min)', value: 170 },
      { label: 'Warm Clay Body Wrap', value: 175 },
      { label: 'Winter skin gift', value: 25 }
    ],
    features: ['facial', 'body', 'gift'],
    image: images.pkgWinter,
    validUntil: 'Demo offer — valid through 28 February'
  }
];

export const getPackage = (slug: string) => packages.find((p) => p.slug === slug);
export const packageSavings = (p: SpaPackage) => Math.max(0, p.items.reduce((s, i) => s + i.value, 0) - p.price);
