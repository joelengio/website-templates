import type { Venue } from './types';

/** Restaurants and bars. Menu prices are whole currency units. */
export const venues: Venue[] = [
  {
    slug: 'olive-room', name: 'The Olive Room', kind: 'Restaurant', tagline: 'Seasonal tasting menus from the kitchen garden',
    description: 'Our signature restaurant serves an evening menu cooked over olive wood and built around the kitchen garden, the morning catch and neighbouring farms.',
    story: 'The Olive Room occupies the old stone press house. Long oak tables sit beneath a ceiling of pendant lamps, and the open kitchen runs along one side so you can watch the fire. Menus change with what is ready in the garden — the sample below shows the style rather than a fixed offering.',
    hours: [{ label: 'Dinner', time: 'Tue–Sun · 18:30–22:00' }, { label: 'Closed', time: 'Mondays' }],
    dress: 'Smart casual. Please reserve — walk-ins subject to availability.',
    images: [{ src: '/images/dining-olive-room.webp', alt: 'Illustration of a candlelit dining room with pendant lamps' }, { src: '/images/dining-table.webp', alt: 'Illustration of tables set for dinner at dusk' }, { src: '/images/food-1.webp', alt: 'Illustration of plated dishes from above' }],
    menu: [
      { title: 'To begin', items: [
        { name: 'Charred courgette, whipped ricotta, mint oil', description: 'Garden courgettes grilled over olive wood.', price: 16, tags: ['V'] },
        { name: 'Cured sea bream, citrus, fennel pollen', description: 'Lightly cured the same morning.', price: 21 },
        { name: 'Warm focaccia & estate olive oil', description: 'Baked daily; served with three oils.', price: 9, tags: ['VG'] } ] },
      { title: 'Main courses', items: [
        { name: 'Wood-fired lamb, braised beans, salsa verde', description: 'Slow-cooked shoulder and roasted rack.', price: 38 },
        { name: 'Catch of the day, saffron broth, clams', description: 'Landed at the cove each morning.', price: 36 },
        { name: 'Roasted aubergine, tahini, pomegranate', description: 'Served with garden herbs and grains.', price: 27, tags: ['VG'] } ] },
      { title: 'To finish', items: [
        { name: 'Olive-oil cake, lemon curd', description: 'Served with whipped crème fraîche.', price: 13, tags: ['V'] },
        { name: 'Burnt honey ice cream', description: 'With toasted almonds.', price: 11, tags: ['V'] } ] },
    ],
    highlights: ['Open kitchen cooked over olive wood', 'Menus follow the kitchen garden', 'Vegetarian and vegan tasting available'],
  },
  {
    slug: 'cove-terrace', name: 'Cove Terrace', kind: 'Restaurant', tagline: 'All-day dining above the water',
    description: 'A relaxed terrace for breakfast, long lunches and sunset aperitivo with views over the cove.',
    story: 'Cove Terrace is where days at Haven Stays begin and end. Mornings bring a garden breakfast; lunch is grilled fish, salads and pasta; as the light softens, the terrace becomes a place for spritzes and small plates.',
    hours: [{ label: 'Breakfast', time: 'Daily · 07:30–10:30' }, { label: 'Lunch', time: 'Daily · 12:30–15:30' }, { label: 'Aperitivo', time: 'Daily · 17:00–19:00' }],
    dress: 'Relaxed resort wear.',
    images: [{ src: '/images/dining-terrace.webp', alt: 'Illustration of a terrace overlooking the sea at sunset' }, { src: '/images/dining-breakfast.webp', alt: 'Illustration of a sunlit breakfast terrace' }, { src: '/images/food-2.webp', alt: 'Illustration of dishes on a wooden table' }],
    menu: [
      { title: 'Breakfast', items: [
        { name: 'Garden breakfast', description: 'Fruit, yogurt, pastries, eggs your way, house preserves.', price: 32 },
        { name: 'Lemon ricotta pancakes', description: 'With honey and berries.', price: 17, tags: ['V'] } ] },
      { title: 'Lunch', items: [
        { name: 'Grilled prawns, garlic, chilli', description: 'With charred lemon and bread.', price: 26 },
        { name: 'Tagliatelle, tomato, basil', description: 'Hand-rolled pasta with garden tomatoes.', price: 21, tags: ['VG'] },
        { name: 'Whole grilled fish to share', description: 'Daily catch with roasted potatoes.', price: 62 } ] },
      { title: 'Sunset', items: [
        { name: 'Haven Spritz', description: 'Bitter orange, sparkling wine, soda.', price: 14 },
        { name: 'Marinated olives & almonds', description: 'Warm, with rosemary.', price: 8, tags: ['VG'] } ] },
    ],
    highlights: ['Garden breakfast included on selected rates', 'Sunset aperitivo daily', 'Child-friendly menu on request'],
  },
  {
    slug: 'bronze-bar', name: 'The Bronze Bar', kind: 'Bar', tagline: 'Low light, bronze details and quiet cocktails',
    description: 'A compact bar of bronze, travertine and warm light serving seasonal cocktails, local wines and rare spirits.',
    story: 'Cocktails here are built around ingredients from the garden: bay, fig leaf, blood orange and herbs. A small selection of regional wines and a library of aged spirits sit behind the counter.',
    hours: [{ label: 'Daily', time: '17:00–00:30' }],
    dress: 'Elegant casual.',
    images: [{ src: '/images/dining-bar.webp', alt: 'Illustration of a bar with bottles and bronze shelves' }, { src: '/images/food-3.webp', alt: 'Illustration of small plates from above' }, { src: '/images/terrace-night.webp', alt: 'Illustration of the resort at night' }],
    menu: [
      { title: 'Signatures', items: [
        { name: 'Fig Leaf Martini', description: 'Gin, fig-leaf vermouth, olive brine.', price: 17 },
        { name: 'Bronze Old Fashioned', description: 'Aged rum, burnt honey, bitters.', price: 18 },
        { name: 'Garden Zero', description: 'Non-alcoholic: cucumber, basil, verjus, tonic.', price: 11, tags: ['VG'] } ] },
      { title: 'Small plates', items: [
        { name: 'Marcona almonds & olives', description: 'Warm, with citrus zest.', price: 9, tags: ['VG'] },
        { name: 'Anchovy toast, whipped butter', description: 'Grilled sourdough.', price: 14 } ] },
    ],
    highlights: ['Garden-led cocktails', 'Regional wines by the glass', 'Alcohol-free pairings'],
  },
  {
    slug: 'private-dining', name: 'Private Dining', kind: 'Private dining', tagline: 'A chef’s table for celebrations and gatherings',
    description: 'Dine privately in the walled garden, on the roof terrace or at the chef’s table in the kitchen for up to twelve guests.',
    story: 'Our team will design a menu, wine pairing and table setting for your occasion — from an intimate proposal to a multi-generational family dinner. Please enquire at least 72 hours ahead.',
    hours: [{ label: 'By arrangement', time: 'Daily · lunch or dinner' }],
    dress: 'As you wish.',
    images: [{ src: '/images/exp-dinner.webp', alt: 'Illustration of a private terrace dinner at night' }, { src: '/images/dining-table.webp', alt: 'Illustration of a dining table at dusk' }, { src: '/images/intro-courtyard.webp', alt: 'Illustration of a courtyard with arches and a fountain' }],
    menu: [
      { title: 'Formats (per guest)', items: [
        { name: 'Garden table — four courses', description: 'Seated dinner for up to 12 in the walled garden.', price: 110 },
        { name: 'Chef’s table — seven courses', description: 'Tasting menu at the kitchen counter, up to 8.', price: 165 },
        { name: 'Wine pairing', description: 'Regional pairings for each course.', price: 70 } ] },
    ],
    highlights: ['Up to twelve guests', 'Bespoke menus and pairings', '72 hours’ notice requested'],
  },
];
