import type { Article } from './types';

/** Journal articles (fictional demonstration content). `products` blocks link to catalogue slugs. */
export const articles: Article[] = [
  {
    slug: 'the-slow-morning-table', title: 'The slow morning table', category: 'Home', date: '2026-10-14', readMinutes: 4, author: 'The Meridian Studio',
    excerpt: 'Three small changes that make breakfast feel like an occasion without adding any effort.',
    image: '/images/journal-1.webp', alt: 'Two mugs and a folded throw on a sage shelf',
    body: [
      { type: 'p', text: 'Mornings tend to be rushed, and the table is the first casualty. A few considered objects can change that without asking you to wake up earlier.' },
      { type: 'h2', text: 'Start with the mug' },
      { type: 'p', text: 'The object you hold first sets the tone. A mug with a little weight and a rounded rim slows you down in the right way. Stoneware keeps heat well and feels grounded in the hand.' },
      { type: 'p', text: 'Keep a pair on the counter rather than in a cupboard. Objects that are visible get used, and objects that are used become part of the routine.' },
      { type: 'quote', text: 'The best table is the one you do not have to set.' },
      { type: 'h2', text: 'Add one soft thing' },
      { type: 'p', text: 'A folded throw on a chair back or bench invites you to sit a little longer. Choose a neutral tone so it works with every season.' },
      { type: 'products', title: 'Shop the story', slugs: ['stoneware-mugs', 'lambswool-throw', 'oak-serving-tray'] }
    ]
  },
  {
    slug: 'the-case-for-natural-fibres', title: 'The case for natural fibres', category: 'Craft', date: '2026-10-02', readMinutes: 5, author: 'Amara Lindqvist',
    excerpt: 'Wool, linen and woven fibre age differently from synthetics — and, we think, better.',
    image: '/images/journal-2.webp', alt: 'A cardigan, striped scarf and sunglasses on a shelf',
    body: [
      { type: 'p', text: 'Natural fibres have a long record of working well. Wool insulates when it is cold and breathes when it is not. Linen is strong, cool and softens with each wash.' },
      { type: 'h2', text: 'Texture is the point' },
      { type: 'p', text: 'A knit with visible texture catches light differently throughout the day. A brushed scarf reads soft even in a photograph. This is why our palette stays quiet: the material does the talking.' },
      { type: 'h2', text: 'How to look after them' },
      { type: 'p', text: 'Wash less often, and gently. Air wool between wears, dry knitwear flat and steam linen rather than ironing it hard. A little care goes a long way.' },
      { type: 'quote', text: 'Clothes that age well are the ones that were made to be worn.', cite: 'Meridian studio notes (fictional)' },
      { type: 'products', title: 'Natural fibres in the store', slugs: ['merino-crew', 'linen-shirt', 'merino-scarf', 'lambswool-throw'] }
    ]
  },
  {
    slug: 'a-ritual-for-the-evening', title: 'A ritual for the evening', category: 'Home', date: '2026-09-21', readMinutes: 4, author: 'The Meridian Studio',
    excerpt: 'Candles, scent and a few minutes of quiet — how to wind a day down on purpose.',
    image: '/images/journal-3.webp', alt: 'A candle, a reed diffuser and a serum bottle on a blush shelf',
    body: [
      { type: 'p', text: 'Evenings are easy to give away to screens. A short, repeatable ritual helps mark the line between the day and the night.' },
      { type: 'h2', text: 'Dim the room' },
      { type: 'p', text: 'Turn off the overhead light and switch on a lamp or light a candle. Warm, low light signals that the day is over.' },
      { type: 'h2', text: 'Keep it simple' },
      { type: 'p', text: 'Wash, moisturise, and sit for a few minutes. The point is not the products; it is the pause. A scent that you associate only with the evening can quickly become a cue to relax.' },
      { type: 'products', title: 'Evening essentials', slugs: ['soy-candle', 'reed-diffuser', 'barrier-cream'] }
    ]
  },
  {
    slug: 'carrying-less-better', title: 'Carrying less, better', category: 'Styling', date: '2026-09-09', readMinutes: 5, author: 'Amara Lindqvist',
    excerpt: 'A short guide to choosing one great bag and the small goods that live inside it.',
    image: '/images/journal-4.webp', alt: 'A tote, a cardholder and a crossbody bag on a shelf',
    body: [
      { type: 'p', text: 'It is tempting to own a bag for every occasion. We prefer one reliable tote, one small crossbody and a few well-organised pouches.' },
      { type: 'h2', text: 'Choose by how you move' },
      { type: 'p', text: 'If you carry a laptop and a jacket, you need depth and a strong handle. If you travel light, a compact crossbody with a secure closure is more comfortable than a large tote.' },
      { type: 'h2', text: 'Let leather age' },
      { type: 'p', text: 'Full-grain leather darkens and softens. Scratches blend in, and edges burnish. Treat it lightly with a conditioner once or twice a year.' },
      { type: 'quote', text: 'A bag should disappear until you need it.' },
      { type: 'products', title: 'The carry edit', slugs: ['atelier-tote', 'fold-crossbody', 'slim-cardholder', 'zip-pouch'] }
    ]
  },
  {
    slug: 'light-for-every-room', title: 'Light for every room', category: 'Styling', date: '2026-08-27', readMinutes: 4, author: 'The Meridian Studio',
    excerpt: 'Layering lamps, stools and mirrors to make rooms feel finished.',
    image: '/images/journal-5.webp', alt: 'A table lamp and oak stool beside a stack of books',
    body: [
      { type: 'p', text: 'A single ceiling light rarely flatters a room. Layering light sources at different heights creates depth and warmth.' },
      { type: 'h2', text: 'Think in three layers' },
      { type: 'p', text: 'Ambient light fills the room, task light helps with specific jobs and accent light adds character. A table lamp usually does all three at once in a small space.' },
      { type: 'h2', text: 'Use a mirror to borrow light' },
      { type: 'p', text: 'Place a round mirror opposite a window to bounce daylight deeper into the room. A slim frame keeps the effect subtle.' },
      { type: 'products', title: 'Light & form', slugs: ['ceramic-table-lamp', 'oak-stool', 'brass-round-mirror'] }
    ]
  },
  {
    slug: 'choosing-stoneware', title: 'Choosing stoneware', category: 'Craft', date: '2026-08-11', readMinutes: 5, author: 'Amara Lindqvist',
    excerpt: 'Weight, glaze and base: what to look for in ceramics you will use every day.',
    image: '/images/journal-6.webp', alt: 'A dark tall vase, a terracotta bowl and a small vase with dried stems',
    body: [
      { type: 'p', text: 'Stoneware is fired at a high temperature, which makes it dense and durable. That is why it works equally well on the table and in the dishwasher.' },
      { type: 'h2', text: 'Look at the foot' },
      { type: 'p', text: 'Turn a piece over. A clean, slightly rounded foot ring means it was finished with care and will not scratch a surface.' },
      { type: 'h2', text: 'Glaze is personality' },
      { type: 'p', text: 'Satin glazes hide fingerprints and age gracefully. Speckled glazes add texture and make every piece slightly different.' },
      { type: 'quote', text: 'Ceramics should feel better in the hand than they look on the shelf.' },
      { type: 'products', title: 'Stoneware in the store', slugs: ['stoneware-vase', 'serving-bowl', 'stoneware-mugs'] }
    ]
  },
  {
    slug: 'bringing-the-outside-in', title: 'Bringing the outside in', category: 'Home', date: '2026-07-24', readMinutes: 3, author: 'The Meridian Studio',
    excerpt: 'Baskets, planters and soft textiles for rooms that feel closer to the garden.',
    image: '/images/journal-7.webp', alt: 'A woven basket, a rust cushion and a planter on a sage shelf',
    body: [
      { type: 'p', text: 'You do not need a garden to make a room feel connected to the outdoors. Natural materials and a little green go a long way.' },
      { type: 'h2', text: 'Mix textures' },
      { type: 'p', text: 'Combine woven fibre with linen and terracotta. Different textures in the same colour family feel layered rather than busy.' },
      { type: 'products', title: 'Natural textures', slugs: ['woven-basket', 'linen-cushion', 'terracotta-planter'] }
    ]
  },
  {
    slug: 'a-capsule-for-the-season', title: 'A capsule for the season', category: 'Styling', date: '2026-07-06', readMinutes: 4, author: 'Amara Lindqvist',
    excerpt: 'Five pieces that make a week of outfits — and how to wear them together.',
    image: '/images/journal-8.webp', alt: 'A linen shirt, trousers and an oak tray on a stone shelf',
    body: [
      { type: 'p', text: 'A capsule wardrobe is simply a small group of clothes that all work together. Begin with a neutral palette and let texture add interest.' },
      { type: 'h2', text: 'The five pieces' },
      { type: 'p', text: 'A linen shirt, a wide-leg trouser, a fine knit, an overshirt and a scarf. Together they cover work, weekends and travel.' },
      { type: 'h2', text: 'Wear them in different orders' },
      { type: 'p', text: 'Shirt and trouser for the office; knit and trouser for dinner; overshirt over everything when it turns cool.' },
      { type: 'products', title: 'The capsule', slugs: ['linen-shirt', 'wide-leg-trouser', 'merino-crew', 'twill-overshirt', 'merino-scarf'] }
    ]
  }
];
export const journalCategories = ['Home', 'Styling', 'Craft'];
