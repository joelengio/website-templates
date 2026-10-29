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
  item('g1', 'spaces', 'gal-lounge', 1600, 1067, 'Sunlit relaxation lounge with chairs facing tall windows', 'The garden lounge'),
  item('g2', 'rituals', 'gal-candle', 1000, 1300, 'Reed diffuser and candles glowing on an amber shelf', 'Evening candlelight ritual'),
  item('g3', 'nature', 'gal-pool', 1000, 1300, 'Water feature pouring into a turquoise pool beside a stone column', 'The reflection pool'),
  item('g4', 'details', 'gal-oils', 1000, 1300, 'Wooden bath tray with lavender, skincare jar and a towel', 'Botanical formulas'),
  item('g5', 'spaces', 'gal-suite', 1600, 1067, 'Folded white towels on a soft chair', 'Treatment suite linens'),
  item('g6', 'nature', 'gal-bloom', 1200, 1200, 'Hands holding golden grasses in evening light', 'Seasonal bloom'),
  item('g7', 'rituals', 'gal-stones', 1200, 1200, 'Smooth stones balanced in a tall stack against a soft sky', 'Balanced stones'),
  item('g8', 'details', 'gal-towels', 1600, 1067, 'Rolled white towels stacked on a wooden bench', 'Warm towels, always'),
  item('g9', 'nature', 'gal-hills', 1600, 1067, 'Bedroom window opening onto forested mountains', 'Morning over the valley'),
  item('g10', 'rituals', 'gal-sand', 1200, 1200, 'Ceramic teapot and cup on a wooden tray', 'Tea ritual'),
  item('g11', 'nature', 'gal-garden', 1200, 1200, 'Lavender flowers backlit by the sun', 'The herb garden'),
  item('g12', 'spaces', 'about-facility', 2000, 1200, 'Light-filled suite with a bed beneath large windows', 'The relaxation room')
];
