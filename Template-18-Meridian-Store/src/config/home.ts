import type { HomeSection } from './types';

/** Homepage sections render in this order; set `enabled: false` to hide one. */
export const homeSections: HomeSection[] = [
  { id: 'hero', enabled: true },
  { id: 'categories', enabled: true },
  { id: 'new-arrivals', enabled: true },
  { id: 'collections', enabled: true },
  { id: 'story', enabled: true },
  { id: 'best-sellers', enabled: true },
  { id: 'editorial', enabled: true },
  { id: 'testimonials', enabled: true },
  { id: 'journal', enabled: true },
  { id: 'newsletter', enabled: true }
];

export const homeContent = {
  hero: {
    eyebrow: 'The autumn edit',
    title: 'Objects for a quieter home',
    text: 'Leather, linen, stoneware and wool — considered pieces designed to be used every day and to improve with age.',
    primaryCta: { label: 'Shop new arrivals', href: '/collections/new-arrivals' },
    secondaryCta: { label: 'Explore collections', href: '/collections' },
    image: '/images/hero-main.webp',
    alt: 'A speckled stoneware vase with dried stems, a terracotta bowl and a stack of books on a stone shelf in soft window light',
    sideImages: [
      { image: '/images/hero-bags.webp', alt: 'A leather tote and tortoise sunglasses on a blush backdrop', label: 'The Leather Atelier', href: '/collections/leather-atelier' },
      { image: '/images/hero-home.webp', alt: 'A ceramic lamp and an oak stool against a sage wall', label: 'Light & Form', href: '/collections/light-and-form' }
    ]
  },
  categories: { eyebrow: 'Shop by category', title: 'Find your focus' },
  newArrivals: { eyebrow: 'Just in', title: 'New arrivals', count: 4, cta: { label: 'View all new arrivals', href: '/collections/new-arrivals' } },
  collections: { eyebrow: 'Curated', title: 'Featured collections', slugs: ['the-slow-home', 'leather-atelier', 'ritual-and-fragrance'], cta: { label: 'All collections', href: '/collections' } },
  story: {
    eyebrow: 'Our approach',
    title: 'Fewer, better things',
    text: 'MERIDIAN STORE is a fictional design-led retailer created to demonstrate this template. Its story is a model for yours: a clear point of view, a short list of materials and an honest account of how things are chosen.',
    points: ['Natural materials, simply finished', 'Small batches and honest pricing', 'Designed to be repaired, refilled and kept'],
    cta: { label: 'Read our story', href: '/about' },
    image: '/images/story-atelier.webp',
    alt: 'A leather tote beside a stack of books and a candle on a shelf in warm window light'
  },
  bestSellers: { eyebrow: 'Most loved', title: 'Best sellers', count: 4, cta: { label: 'Shop best sellers', href: '/shop?sort=bestsellers' } },
  editorial: [
    { eyebrow: 'Materials', title: 'Wool, linen and woven fibre', text: 'A closer look at the textures that shape the collection.', image: '/images/story-materials.webp', alt: 'A folded throw, a woven basket and a scarf on a stone ledge', href: '/journal/the-case-for-natural-fibres', cta: 'Read the story' },
    { eyebrow: 'Craft', title: 'Stoneware, made to be used', text: 'Why we favour a satin glaze and a heavy base.', image: '/images/about-craft.webp', alt: 'Black mugs, a speckled vase and an oak tray on a sage backdrop', href: '/journal/choosing-stoneware', cta: 'Read the guide' }
  ],
  testimonials: { eyebrow: 'Kind words', title: 'What customers say', note: 'Fictional demonstration testimonials.' },
  journal: { eyebrow: 'The Journal', title: 'Stories and styling', count: 3, cta: { label: 'Read the journal', href: '/journal' } }
};
