import type { Category, Collection } from './types';

export const categories: Category[] = [
  { id: 'bags-accessories', name: 'Bags & Accessories', description: 'Leather bags, small goods, scarves and eyewear.', image: '/images/cat-bags-accessories.webp' },
  { id: 'apparel', name: 'Apparel', description: 'Knitwear, shirting and tailoring in natural fibres.', image: '/images/cat-apparel.webp' },
  { id: 'homeware', name: 'Homeware', description: 'Stoneware, textiles, baskets and objects for the table.', image: '/images/cat-homeware.webp' },
  { id: 'furniture-lighting', name: 'Furniture & Lighting', description: 'Considered pieces in oak, stone, ceramic and metal.', image: '/images/cat-furniture-lighting.webp' },
  { id: 'beauty', name: 'Beauty & Fragrance', description: 'Skincare, scent and candles for daily rituals.', image: '/images/cat-beauty.webp' }
];

/** Curated collections. `products` lists product slugs in display order. */
export const collections: Collection[] = [
  {
    slug: 'the-slow-home', name: 'The Slow Home', tagline: 'Stoneware, wool and linen for unhurried rooms.',
    description: 'Tactile objects for the kitchen, the sofa and the bed — chosen to be used daily and to look better for it.',
    story: 'Our home pieces start with how a room is lived in: the mug you reach for first, the throw that is always within reach, the bowl that moves from the table to the shelf and back again.',
    heroImage: '/images/collection-the-slow-home.webp', heroAlt: 'Stoneware mugs, a vase and a folded throw on a stone shelf',
    products: ['stoneware-vase', 'stoneware-mugs', 'lambswool-throw', 'serving-bowl', 'linen-cushion', 'woven-basket', 'oak-serving-tray', 'linen-duvet-set', 'terracotta-planter']
  },
  {
    slug: 'leather-atelier', name: 'The Leather Atelier', tagline: 'Full-grain leather goods that age with you.',
    description: 'Totes, crossbodies and small goods in full-grain leather with burnished edges and brass hardware.',
    story: 'Leather rewards patience. These pieces are cut simply, stitched carefully and designed to darken, soften and gain character over years of use.',
    heroImage: '/images/collection-leather-atelier.webp', heroAlt: 'A leather tote, cardholder and crossbody bag on a stone shelf',
    products: ['atelier-tote', 'fold-crossbody', 'slim-cardholder', 'weekender-duffel', 'zip-pouch']
  },
  {
    slug: 'linen-and-wool', name: 'Linen & Wool', tagline: 'Natural fibres, woven and knitted with care.',
    description: 'Breathable linen and warm wool for the wardrobe and the home, in a palette of oat, clay and sage.',
    story: 'Two of the oldest textile fibres, treated simply. Linen for the warmer months and wool for the cooler ones, with a soft, lived-in hand from the first wear.',
    heroImage: '/images/collection-linen-and-wool.webp', heroAlt: 'Cushions, a striped scarf and a linen shirt arranged on a shelf',
    products: ['linen-shirt', 'merino-scarf', 'lambswool-throw', 'linen-cushion', 'linen-duvet-set', 'ribbed-cardigan', 'wide-leg-trouser']
  },
  {
    slug: 'ritual-and-fragrance', name: 'Ritual & Fragrance', tagline: 'Small daily rituals in glass and wax.',
    description: 'Skincare, candles, diffusers and fragrance with restrained packaging and quiet scents.',
    story: 'A ritual does not need to be elaborate. A few good things in reach of the sink and the bedside table are often enough.',
    heroImage: '/images/collection-ritual-and-fragrance.webp', heroAlt: 'A candle, perfume, serum bottle and reed diffuser on a shelf',
    products: ['botanical-serum', 'barrier-cream', 'fig-cedar-parfum', 'soy-candle', 'reed-diffuser', 'nourishing-body-oil', 'botanical-hand-wash']
  },
  {
    slug: 'light-and-form', name: 'Light & Form', tagline: 'Sculptural pieces for corners and walls.',
    description: 'Lamps, stools, tables and mirrors that work as furniture and as sculpture.',
    story: 'We choose pieces with a clear silhouette and honest materials — oak, travertine, ceramic and metal — and let the light do the rest.',
    heroImage: '/images/collection-light-and-form.webp', heroAlt: 'A lamp, oak stool, stone side table and dark vase',
    products: ['ceramic-table-lamp', 'oak-stool', 'travertine-side-table', 'brass-round-mirror', 'stoneware-vase', 'bud-vase']
  },
  {
    slug: 'quiet-essentials', name: 'Quiet Essentials', tagline: 'A small wardrobe of well-made basics.',
    description: 'Knitwear, shirting, tailoring and eyewear — pieces that work together and do not shout.',
    story: 'A wardrobe built on fewer, better things. Every piece here is designed to be worn with every other piece.',
    heroImage: '/images/collection-quiet-essentials.webp', heroAlt: 'A knit, trousers, a shirt and sunglasses on a shelf',
    products: ['merino-crew', 'ribbed-cardigan', 'wide-leg-trouser', 'linen-shirt', 'twill-overshirt', 'round-sunglasses', 'merino-scarf']
  },
  {
    slug: 'gifts-under-100', name: 'Gifts Under $100', tagline: 'Thoughtful objects at a gentle price.',
    description: 'Candles, mugs, small leather goods and ceramics that make easy, considered gifts.',
    story: 'A good gift is useful, a little surprising and not too precious. These are the pieces we reach for when choosing for someone else.',
    heroImage: '/images/collection-gifts-under-100.webp', heroAlt: 'A candle, mugs, a bud vase and a cardholder arranged on a shelf',
    products: ['slim-cardholder', 'soy-candle', 'stoneware-mugs', 'reed-diffuser', 'serving-bowl', 'zip-pouch', 'terracotta-planter', 'botanical-hand-wash', 'nourishing-body-oil', 'barrier-cream']
  },
  {
    slug: 'new-arrivals', name: 'New Arrivals', tagline: 'The latest additions to the store.',
    description: 'Fresh arrivals across bags, apparel, homeware and beauty.',
    story: 'New pieces arrive in small batches. When something sells out, it is gone until the next batch — or retired for good.',
    heroImage: '/images/collection-new-arrivals.webp', heroAlt: 'A crossbody bag, clay vase, cardigan and planter on a shelf',
    products: ['merino-crew', 'atelier-tote', 'merino-scarf', 'lambswool-throw', 'stoneware-vase', 'ceramic-table-lamp', 'fig-cedar-parfum', 'botanical-serum', 'twill-overshirt', 'weekender-duffel']
  }
];
