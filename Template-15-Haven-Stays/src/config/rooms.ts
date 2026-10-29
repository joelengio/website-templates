import type { Room } from './types';

const imgs = (base: string, alts: [string, string, string]) =>
  alts.map((alt, i) => ({ src: `/images/${base}-${i + 1}.webp`, alt }));

/**
 * Room & suite catalogue. `baseRate` is the nightly starting rate before seasonal multipliers, rate plans,
 * promotions, fees and taxes (see booking.ts). `units` is the number of rooms of that type — it drives the
 * simulated availability, so setting units: 0 hides a room from booking without deleting it.
 */
export const rooms: Room[] = [
  {
    id: 'garden-king', slug: 'garden-king-room', name: 'Garden King Room', category: 'Rooms', tagline: 'Olive-grove calm, a king bed and a private terrace.',
    baseRate: 245, maxAdults: 2, maxChildren: 1, maxOccupancy: 3, beds: '1 king bed', areaSqm: 38, view: 'Olive garden', units: 8,
    description: 'Limewashed walls, oak floors and a deep linen-dressed bed open onto a shaded terrace in the olive garden. A softly lit dressing nook leads to a stone bathroom with a rain shower.',
    highlights: ['Private shaded terrace', 'Stone bathroom with rain shower', 'Quiet garden location'],
    amenities: ['wifi', 'ac', 'balcony', 'rainshower', 'minibar', 'espresso', 'workspace', 'breakfast'],
    images: imgs('room-garden-king', ['Illustration of a king bedroom with a garden view', 'Illustration of a stone bathroom with a round window', 'Illustration of arched terrace windows']),
  },
  {
    id: 'garden-twin', slug: 'garden-twin-room', name: 'Garden Twin Room', category: 'Rooms', tagline: 'Two generous beds for friends and companions.',
    baseRate: 225, maxAdults: 2, maxChildren: 1, maxOccupancy: 3, beds: '2 twin beds (can be joined)', areaSqm: 36, view: 'Olive garden', units: 6,
    description: 'The same calm palette as our king rooms, arranged with two single beds that can be joined into a super-king on request. Ideal for friends, a parent with a young child, or a restful twin stay.',
    highlights: ['Beds can be joined on request', 'Garden terrace', 'Step-free access available'],
    amenities: ['wifi', 'ac', 'balcony', 'rainshower', 'espresso', 'workspace', 'accessible', 'breakfast'],
    images: imgs('room-garden-twin', ['Illustration of a twin bedroom with garden view', 'Illustration of a tiled bathroom', 'Illustration of an arched walkway']),
  },
  {
    id: 'sea-deluxe', slug: 'sea-view-deluxe', name: 'Sea View Deluxe', category: 'Rooms', tagline: 'Wake to the cove from a king bed.',
    baseRate: 340, maxAdults: 2, maxChildren: 1, maxOccupancy: 3, beds: '1 king bed', areaSqm: 45, view: 'Sea and cove', units: 8, featured: true,
    description: 'A sunlit corner room with floor-to-ceiling sliding doors that frame the cove. Linen drapes, a writing desk and a terrace with two loungers make it the quintessential Haven room.',
    highlights: ['Floor-to-ceiling sea views', 'Terrace with loungers', 'Freestanding bath'],
    amenities: ['wifi', 'ac', 'seaview', 'balcony', 'bathtub', 'rainshower', 'minibar', 'espresso', 'workspace', 'breakfast'],
    images: imgs('room-sea-deluxe', ['Illustration of a bedroom with a sunset sea view', 'Illustration of a coastal terrace and villas', 'Illustration of a bathroom with a bath']),
  },
  {
    id: 'wellness-suite', slug: 'wellness-suite', name: 'Wellness Suite', category: 'Suites', tagline: 'Spa access, a deep soaking bath and quiet design.',
    baseRate: 480, maxAdults: 2, maxChildren: 1, maxOccupancy: 3, beds: '1 king bed', areaSqm: 64, view: 'Kitchen garden', units: 4,
    description: 'Positioned beside the spa, this suite pairs a spacious bedroom with a stone soaking bath, a yoga corner and a private tea station. Daily access to the hammam and thermal circuit is included.',
    highlights: ['Hammam and thermal circuit access', 'Yoga corner and mats', 'Stone soaking bath'],
    amenities: ['wifi', 'ac', 'balcony', 'bathtub', 'rainshower', 'spa-access', 'minibar', 'espresso', 'breakfast'],
    images: imgs('room-wellness', ['Illustration of a bedroom beside the garden', 'Illustration of the candlelit hammam', 'Illustration of a leafy garden texture']),
  },
  {
    id: 'terrace-suite', slug: 'terrace-suite', name: 'Terrace Suite', category: 'Suites', tagline: 'A separate living room and a sun-drenched terrace.',
    baseRate: 520, maxAdults: 3, maxChildren: 2, maxOccupancy: 4, beds: '1 king bed + sofa bed', areaSqm: 72, view: 'Sea and sunrise', units: 5, featured: true,
    description: 'The Terrace Suite spreads across an upper floor with a lounge, a king bedroom and a wraparound terrace that catches the sunrise. A sofa bed accommodates a third adult or children.',
    highlights: ['Wraparound terrace', 'Separate lounge', 'Sunrise view'],
    amenities: ['wifi', 'ac', 'seaview', 'balcony', 'bathtub', 'rainshower', 'kitchenette', 'minibar', 'espresso', 'workspace', 'butler', 'breakfast'],
    images: imgs('room-terrace-suite', ['Illustration of a suite with sunrise over the sea', 'Illustration of villas on the headland', 'Illustration of the suite bathroom']),
  },
  {
    id: 'hillside-loft', slug: 'hillside-loft', name: 'Hillside Loft', category: 'Rooms', tagline: 'A double-height loft for couples, with views up the valley.',
    baseRate: 295, maxAdults: 2, maxChildren: 0, maxOccupancy: 2, beds: '1 king bed', areaSqm: 55, view: 'Hills and valley', units: 4,
    description: 'Timber beams, a mezzanine reading nook and tall windows over the valley give this adults-only loft a cabin-meets-villa feel. A wood-burning stove warms cooler evenings.',
    highlights: ['Double-height ceilings', 'Wood-burning stove', 'Mezzanine reading nook'],
    amenities: ['wifi', 'ac', 'fireplace', 'rainshower', 'espresso', 'minibar', 'workspace', 'breakfast'],
    images: imgs('room-loft', ['Illustration of a loft bedroom with mountain view', 'Illustration of mountains and a lodge', 'Illustration of a loft bathroom at night']),
  },
  {
    id: 'orchard-cabin', slug: 'orchard-cabin', name: 'Orchard Cabin', category: 'Villas', tagline: 'A free-standing cabin among the fruit trees.',
    baseRate: 380, maxAdults: 2, maxChildren: 2, maxOccupancy: 4, beds: '1 king bed + bunk nook', areaSqm: 58, view: 'Orchard and hills', units: 6,
    description: 'A private cabin with a deck, a small kitchenette and a bunk nook for children. Perfect for a relaxed family stay with a little more independence.',
    highlights: ['Free-standing with private deck', 'Kitchenette', 'Bunk nook for children'],
    amenities: ['wifi', 'ac', 'balcony', 'kitchenette', 'fireplace', 'rainshower', 'espresso', 'accessible', 'breakfast'],
    images: imgs('room-cabin', ['Illustration of a cabin bedroom with a valley view', 'Illustration of a lodge by a lake', 'Illustration of a cabin bathroom at dusk']),
  },
  {
    id: 'family-residence', slug: 'family-residence', name: 'Family Residence', category: 'Family', tagline: 'Two bedrooms, a garden and space to spread out.',
    baseRate: 610, maxAdults: 4, maxChildren: 4, maxOccupancy: 6, beds: '1 king + 2 twin beds', areaSqm: 98, view: 'Gardens and fountain court', units: 3,
    description: 'A two-bedroom residence with a living room, kitchenette and its own garden terrace. Interconnected sleeping areas give parents peace while children stay close.',
    highlights: ['Two bedrooms and a living room', 'Private garden terrace', 'Family welcome kit'],
    amenities: ['wifi', 'ac', 'balcony', 'kitchenette', 'bathtub', 'rainshower', 'minibar', 'espresso', 'accessible', 'breakfast'],
    images: imgs('room-family', ['Illustration of a family bedroom with garden views', 'Illustration of the fountain courtyard arches', 'Illustration of a bathroom']),
  },
  {
    id: 'pool-villa', slug: 'private-pool-villa', name: 'Private Pool Villa', category: 'Villas', tagline: 'Your own plunge pool above the cove.',
    baseRate: 980, maxAdults: 4, maxChildren: 2, maxOccupancy: 4, beds: '1 king + 1 twin room', areaSqm: 140, view: 'Cove and horizon', units: 3, featured: true,
    description: 'A standalone villa of stone and timber with a heated plunge pool, an outdoor shower, a lounge and a dedicated butler. Two bedrooms open to a long terrace that faces the horizon.',
    highlights: ['Private heated plunge pool', 'Butler service', 'Outdoor shower and dining terrace'],
    amenities: ['wifi', 'ac', 'seaview', 'balcony', 'plunge', 'bathtub', 'rainshower', 'kitchenette', 'minibar', 'espresso', 'butler', 'breakfast'],
    images: imgs('room-pool-villa', ['Illustration of a villa bedroom facing the sea', 'Illustration of a pool terrace at dusk', 'Illustration of a villa bathroom']),
  },
  {
    id: 'owners-suite', slug: 'owners-suite', name: 'The Owner’s Suite', category: 'Suites', tagline: 'Our one-of-a-kind signature residence.',
    baseRate: 1450, maxAdults: 4, maxChildren: 2, maxOccupancy: 4, beds: '1 king + 1 queen bedroom', areaSqm: 190, view: 'Panoramic cove', units: 1,
    description: 'The most private address at Haven Stays: two bedrooms, a library lounge, a plunge pool and a rooftop dining terrace with panoramic views. Includes airport transfers and a dedicated butler.',
    highlights: ['Rooftop dining terrace', 'Private plunge pool', 'Dedicated butler and transfers'],
    amenities: ['wifi', 'ac', 'seaview', 'balcony', 'plunge', 'bathtub', 'rainshower', 'kitchenette', 'minibar', 'espresso', 'workspace', 'butler', 'spa-access', 'breakfast'],
    images: imgs('room-owners', ['Illustration of the suite bedroom at dusk', 'Illustration of the resort and pool at dusk', 'Illustration of a pool at dawn']),
  },
];

export const roomCategories = ['Rooms', 'Suites', 'Family', 'Villas'] as const;
