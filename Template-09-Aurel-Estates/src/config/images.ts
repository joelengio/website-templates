import type { PropertyImage } from './types';

/**
 * IMAGE CATALOGUE — every photo used by the template, keyed by a short id.
 * Replace files in /public/images (keep the `-640` thumbnail variant at ~640px wide) or change `src`.
 * Licensing for each file is documented in ASSET_LICENSES.md.
 */
const img = (name: string, alt: string): PropertyImage => ({
  src: `/images/${name}.jpg`,
  thumb: `/images/${name}-640.jpg`,
  alt,
});

export const images = {
  'cedar-ridge-exterior': img('cedar-ridge-exterior', 'Contemporary timber and black-steel house glowing at dusk beneath a mature tree'),
  'cedar-ridge-garden': img('cedar-ridge-garden', 'Timber-clad pavilion and lawn beneath a large eucalyptus tree'),
  'timber-living-room': img('timber-living-room', 'Open-plan living room with a timber feature wall and floor-to-ceiling glazing'),
  'island-kitchen-pendants': img('island-kitchen-pendants', 'Bright kitchen with a long white island, oak stools and black pendant lights'),
  'garden-bedroom': img('garden-bedroom', 'Calm bedroom with tall black-framed glass doors opening to the garden'),
  'terrace-villa-pool': img('terrace-villa-pool', 'Three-storey white villa with a rooftop terrace beside a turquoise pool'),
  'courtyard-pool-house': img('courtyard-pool-house', 'White pavilion with glass walls beside a turquoise pool under a blue sky'),
  'white-cubist-house': img('white-cubist-house', 'Sculptural white house with stepped volumes and a manicured lawn'),
  'sunlit-dining-living': img('sunlit-dining-living', 'Sunlit living and dining space with a red armchair and tall windows'),
  'suite-bedroom': img('suite-bedroom', 'Hotel-style bedroom suite with a blue velvet bench and woven headboard'),
  'pavilion-pool-villa': img('pavilion-pool-villa', 'Modern white villa with a timber-soffit terrace above a long lap pool'),
  'cantilever-pool-house': img('cantilever-pool-house', 'Modern brick and glass house with cantilevered volumes and a lawn'),
  'infinity-pool-terrace': img('infinity-pool-terrace', 'Contemporary timber and glass house beside a glass-fenced pool'),
  'plant-filled-living': img('plant-filled-living', 'Living room with a leather sofa, houseplants and a gallery wall'),
  'stone-bathroom': img('stone-bathroom', 'Dark stone bathroom with a freestanding white bath'),
  'hawthorne-porch-house': img('hawthorne-porch-house', 'Grey shingled house with a wraparound white porch on a green lawn'),
  'bay-window-dining': img('bay-window-dining', 'Dining area with a bay window and warm pendant lights'),
  'marble-kitchen': img('marble-kitchen', 'White kitchen with a marble island, crystal pendants and a gas range'),
  'gray-living-room': img('gray-living-room', 'Grey living room with bookshelves, a pendant lamp and dark wood floors'),
  'lodge-at-dusk': img('lodge-at-dusk', 'Timber lodge glowing at dusk among trees'),
  'timber-house-sunset': img('timber-house-sunset', 'Large timber house on a hillside at sunset'),
  'hex-tile-kitchen': img('hex-tile-kitchen', 'Kitchen with a hexagonal tile backsplash, marble counters and copper stools'),
  'coffered-living-room': img('coffered-living-room', 'Formal living room with a coffered ceiling and built-in shelving'),
  'slate-facade': img('slate-facade', 'Slate-clad apartment building corner against a deep blue sky'),
  'loft-living-room': img('loft-living-room', 'Open loft living room with a tan leather sofa and teal accent wall'),
  'white-kitchen': img('white-kitchen', 'Compact white kitchen with a breakfast bar and stainless appliances'),
  'herringbone-living': img('herringbone-living', 'Living room with herringbone floors, a blue sofa and tall windows'),
  'golden-hour-villa': img('golden-hour-villa', 'Mediterranean-style villa with arched balconies and a pool at golden hour'),
  'palm-pool-house': img('palm-pool-house', 'White two-storey house with a veranda, palm trees and a stone-lined pool'),
  'panoramic-living': img('panoramic-living', 'Living and dining room with panoramic windows and a fireplace'),
  'white-cottage': img('white-cottage', 'Traditional white cottage with a picket fence in autumn'),
  'greenhouse-living': img('greenhouse-living', 'Bright living room filled with plants, shelves and daylight'),
  'craftsman-porch': img('craftsman-porch', 'Craftsman house with a covered porch among autumn trees'),
  'coastal-cottage': img('coastal-cottage', 'Pale grey cottage with dormer windows and a deep porch under palm trees'),
  'ironwood-exterior': img('ironwood-exterior', 'Architectural house with a cedar-clad upper volume and glazed ground floor'),
  'courtyard-house': img('courtyard-house', 'Timber and black-clad house with a screened courtyard and tree'),
  'brick-bungalow': img('brick-bungalow', 'Row of brick bungalows with landscaped front lawns'),
  'stone-front-home': img('stone-front-home', 'Brick and stone family home with a double garage and arched window'),
  'red-roof-cottage': img('red-roof-cottage', 'White country house with a red roof and flower boxes'),
} as const;

export type ImageKey = keyof typeof images;
