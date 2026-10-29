import type { Img } from './types';

export interface GalleryItem extends Img {
  category: 'Rooms' | 'Dining' | 'Wellness' | 'Resort' | 'Destination';
  caption: string;
}
const it = (src: string, category: GalleryItem['category'], alt: string, caption = alt): GalleryItem => ({ src: `/images/${src}.webp`, category, alt, caption });

export const galleryCategories = ['All', 'Resort', 'Rooms', 'Dining', 'Wellness', 'Destination'] as const;
export const gallery: GalleryItem[] = [
  it('hero-coast', 'Resort', 'Illustration of terraced villas above the sea at sunset', 'Terraces at dusk'),
  it('hero-pool', 'Resort', 'Illustration of the infinity pool in daylight', 'The infinity pool'),
  it('intro-arches', 'Resort', 'Illustration of arched windows with cypress trees', 'The arcade'),
  it('intro-courtyard', 'Resort', 'Illustration of a courtyard fountain', 'Fountain court'),
  it('terrace-night', 'Resort', 'Illustration of the resort at night', 'Night on the headland'),
  it('room-sea-deluxe-1', 'Rooms', 'Illustration of the Sea View Deluxe bedroom', 'Sea View Deluxe'),
  it('room-terrace-suite-1', 'Rooms', 'Illustration of the Terrace Suite bedroom at sunrise', 'Terrace Suite'),
  it('room-pool-villa-1', 'Rooms', 'Illustration of the Private Pool Villa bedroom', 'Private Pool Villa'),
  it('room-loft-1', 'Rooms', 'Illustration of the Hillside Loft bedroom', 'Hillside Loft'),
  it('room-garden-twin-1', 'Rooms', 'Illustration of the Garden Twin room', 'Garden Twin'),
  it('room-owners-3', 'Rooms', 'Illustration of the Owner’s Suite pool at dawn', 'Owner’s Suite pool'),
  it('dining-terrace', 'Dining', 'Illustration of Cove Terrace at sunset', 'Cove Terrace'),
  it('dining-olive-room', 'Dining', 'Illustration of The Olive Room dining room', 'The Olive Room'),
  it('dining-bar', 'Dining', 'Illustration of The Bronze Bar', 'The Bronze Bar'),
  it('dining-breakfast', 'Dining', 'Illustration of breakfast on the terrace', 'Garden breakfast'),
  it('food-1', 'Dining', 'Illustration of plated dishes from above', 'Seasonal plates'),
  it('spa-hammam', 'Wellness', 'Illustration of the candlelit hammam', 'The hammam'),
  it('spa-bath', 'Wellness', 'Illustration of a tiled spa bathroom', 'Treatment bath'),
  it('exp-yoga', 'Wellness', 'Illustration of sunrise yoga by the pool', 'Sunrise yoga'),
  it('spa-garden', 'Wellness', 'Illustration of leaf textures', 'Spa garden'),
  it('dest-village', 'Destination', 'Illustration of a harbour village', 'Cala Verana Harbour'),
  it('dest-hills', 'Destination', 'Illustration of a hillside at dusk', 'Hillside terraces'),
  it('dest-cove', 'Destination', 'Illustration of a calm cove', 'Silver Cove'),
  it('dest-peak', 'Destination', 'Illustration of a mountain ridge', 'Verde Ridge'),
  it('exp-hiking', 'Destination', 'Illustration of a winding path', 'The ridge path'),
  it('dest-lake', 'Destination', 'Illustration of a lake beneath mountains', 'Lake Alma'),
];
