import type { Category, GalleryItem } from './types';

/** Gallery categories and items. Add images in public/images and register them here. */
export const galleryCategories: Category[] = [
  { id: 'spaces', name: 'Spaces', description: '' },
  { id: 'rituals', name: 'Rituals', description: '' },
  { id: 'details', name: 'Details', description: '' },
  { id: 'nature', name: 'Nature', description: '' }
];

const item = (id: string, category: string, file: string, width: number, height: number, alt: string, caption: string): GalleryItem => ({
  id,
  category,
  caption,
  image: { src: `/images/${file}.webp`, width, height, alt }
});

export const galleryItems: GalleryItem[] = [
  item('g1', 'spaces', 'gal-lounge', 1600, 1067, 'Warm arched opening glowing with garden light', 'The garden lounge'),
  item('g2', 'rituals', 'gal-candle', 1000, 1300, 'Candlelit bowl of oil and petals on dark wood', 'Evening candlelight ritual'),
  item('g3', 'nature', 'gal-pool', 1000, 1300, 'Still green water with concentric ripples', 'The reflection pool'),
  item('g4', 'details', 'gal-oils', 1000, 1300, 'Amber and sage skincare bottles on a shelf', 'Botanical formulas'),
  item('g5', 'spaces', 'gal-suite', 1600, 1067, 'Soft waves of ivory linen', 'Treatment suite linens'),
  item('g6', 'nature', 'gal-bloom', 1200, 1200, 'A cream and blush flower in full bloom', 'Seasonal bloom'),
  item('g7', 'rituals', 'gal-stones', 1200, 1200, 'Smooth stones stacked on sand', 'Hot stone preparation'),
  item('g8', 'details', 'gal-towels', 1600, 1067, 'Stack of folded towels on natural wood', 'Warm towels, always'),
  item('g9', 'nature', 'gal-hills', 1600, 1067, 'Layered misty hills in sage green', 'Morning over the valley'),
  item('g10', 'nature', 'gal-sand', 1200, 1200, 'Golden dunes beneath a pale sun', 'Sunset calm'),
  item('g11', 'nature', 'gal-garden', 1200, 1200, 'Botanical leaves in soft focus', 'The herb garden'),
  item('g12', 'spaces', 'about-facility', 2000, 1200, 'Quiet room with flowing linen', 'The relaxation room')
];
