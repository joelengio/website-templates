// Art direction data for every demonstration product image (drives scripts/art/generate-images.mjs).
// File names produced here are referenced from src/config/products.ts:
//   products/<slug>-<colorKey>.webp (studio, one per colour/scent), -detail, -scene and -colors (group shot).

export const K = {
  cognac: { a: '#9b5d3a', b: '#e0c690', d: '#3d2619' }, ink: { a: '#302d2b', b: '#b89f72', d: '#141211' }, oat: { a: '#d9cdb8', b: '#8d7a58', d: '#5a4a35' },
  sand: { a: '#cdb998', b: '#8a7452', d: '#4c3d2a' }, stone: { a: '#c4baa8', b: '#7d6f5a', d: '#4a4034' }, charcoal: { a: '#3b3937', b: '#a79b86', d: '#1c1b1a' },
  clay: { a: '#b8704f', b: '#e3c3a3', d: '#5a3322' }, rust: { a: '#a4583a', b: '#e0b99a', d: '#4d2616' }, sage: { a: '#9ba58d', b: '#e7e1cf', d: '#4c5640' },
  ivory: { a: '#eee7d9', b: '#cbbfa6', d: '#7a6c55' }, camel: { a: '#b88f62', b: '#6e5230', d: '#4a3520' }, cocoa: { a: '#6b4d3a', b: '#c9a98c', d: '#2f2018' },
  blush: { a: '#dcbdab', b: '#a07965', d: '#6b4a3b' }, chalk: { a: '#ebe5d8', b: '#9a8d78', d: '#4a4034' }, olive: { a: '#7a7a52', b: '#d6cfae', d: '#3c3c26' },
  tortoise: { a: '#6e4128', b: '#d6a566', d: '#2b170c' }, black: { a: '#232220', b: '#8a7f6c', d: '#0d0c0b' }, natural: { a: '#c9a676', b: '#8b6a3f', d: '#5b4125' },
  walnut: { a: '#6e4a31', b: '#3f2a1b', d: '#2e1d12' }, brass: { a: '#b79456', b: '#8d6e38', d: '#5e4620' }, travertine: { a: '#d9c9ac', b: '#b39b74', d: '#7d6a4a' },
  terracotta: { a: '#b86a47', b: '#e4c4a2', d: '#5d311d' }, amber: { a: '#7a4a21', b: '#f1e8d5', d: '#25180d' }, glassgreen: { a: '#6f8a73', b: '#f1ece0', d: '#202a22' },
  figwax: { a: '#c9b6bb', b: '#f1e8e4', d: '#6a4b52' }, cedarwax: { a: '#d8c6a2', b: '#f1e8d5', d: '#6b5230' }, linenwax: { a: '#ebe5d6', b: '#f1e8d5', d: '#7a7058' },
  parfum: { a: '#d9b58a', b: '#f1e8d5', d: '#3d2c1c' }, creamjar: { a: '#e8e0d0', b: '#f1ece0', d: '#6a5a45' }
};

export const BG = {
  ivory: { wall: ['#f5efe4', '#e9e0d0'], floor: ['#dfd4c0', '#cfc2aa'] },
  stone: { wall: ['#e3dccd', '#d4cab7'], floor: ['#cdc1ac', '#bdb099'] },
  sage: { wall: ['#dadccb', '#c8ccb6'], floor: ['#c2c4ac', '#b2b59b'] },
  blush: { wall: ['#ecdfd3', '#ddc9ba'], floor: ['#d1bba9', '#c1a995'] },
  dusk: { wall: ['#5a534b', '#443e38'], floor: ['#38332f', '#2a2623'] },
  clay: { wall: ['#e6cfbc', '#d4b69f'], floor: ['#c7a68c', '#b69273'] }
};

const stripesOat = [[0.1, 0.16, 'b'], [0.2, 0.22, 'b'], [0.82, 0.88, 'b']];
const stripesThrow = [[0.12, 0.16, 'b'], [0.2, 0.22, 'b'], [0.78, 0.8, 'b'], [0.84, 0.88, 'b']];

// u = nominal size as a fraction of canvas height; props pick from category prop recipes.
export const PRODUCT_ART = [
  { slug: 'atelier-tote', type: 'tote', bg: 'ivory', u: 0.62, colors: [['cognac', 'cognac'], ['ink', 'ink'], ['oat', 'sand']], cat: 'bags' },
  { slug: 'fold-crossbody', type: 'crossbody', bg: 'stone', u: 0.58, colors: [['ink', 'ink'], ['clay', 'clay'], ['oat', 'sand']], cat: 'bags' },
  { slug: 'slim-cardholder', type: 'cardholder', bg: 'ivory', u: 0.52, colors: [['cognac', 'cognac'], ['ink', 'ink'], ['sand', 'sand']], cat: 'bags' },
  { slug: 'merino-scarf', type: 'scarf', bg: 'stone', u: 0.58, colors: [['oat', 'oat', { stripes: stripesOat }], ['charcoal', 'charcoal', { stripes: [[0.1, 0.14, 'b']] }], ['clay', 'clay', { stripes: stripesOat }]], cat: 'apparel' },
  { slug: 'round-sunglasses', type: 'sunglasses', bg: 'blush', u: 0.5, colors: [['tortoise', 'tortoise'], ['black', 'black'], ['sand', 'sand']], cat: 'bags' },
  { slug: 'zip-pouch', type: 'pouch', bg: 'sage', u: 0.5, colors: [['stone', 'stone'], ['rust', 'rust']], cat: 'bags' },
  { slug: 'weekender-duffel', type: 'tote', o: { wide: 1.15, tall: 0.62 }, bg: 'ivory', u: 0.6, colors: [['ink', 'ink'], ['cognac', 'cognac']], cat: 'bags' },
  { slug: 'merino-crew', type: 'knit', bg: 'ivory', u: 0.6, colors: [['oat', 'oat'], ['charcoal', 'charcoal'], ['clay', 'clay']], cat: 'apparel' },
  { slug: 'ribbed-cardigan', type: 'knit', o: { cardigan: true }, bg: 'stone', u: 0.6, colors: [['camel', 'camel'], ['cocoa', 'cocoa'], ['ivory', 'ivory']], cat: 'apparel' },
  { slug: 'linen-shirt', type: 'shirt', bg: 'sage', u: 0.6, colors: [['ivory', 'ivory'], ['sage', 'sage'], ['blush', 'blush']], cat: 'apparel' },
  { slug: 'twill-overshirt', type: 'shirt', o: { pockets: true }, bg: 'ivory', u: 0.6, colors: [['stone', 'stone'], ['rust', 'rust'], ['charcoal', 'charcoal']], cat: 'apparel' },
  { slug: 'wide-leg-trouser', type: 'trouser', bg: 'stone', u: 0.62, colors: [['charcoal', 'charcoal'], ['oat', 'oat']], cat: 'apparel' },
  { slug: 'stoneware-vase', type: 'vase', o: { shape: 'round', speckle: true }, bg: 'ivory', u: 0.5, colors: [['chalk', 'chalk'], ['clay', 'clay'], ['charcoal', 'charcoal']], cat: 'home' },
  { slug: 'bud-vase', type: 'vase', o: { shape: 'bud', stems: 3 }, bg: 'blush', u: 0.4, colors: [['chalk', 'chalk'], ['sage', 'sage']], cat: 'home' },
  { slug: 'stoneware-mugs', type: 'mugs', bg: 'ivory', u: 0.55, colors: [['chalk', 'chalk'], ['clay', 'clay'], ['charcoal', 'charcoal']], cat: 'home' },
  { slug: 'serving-bowl', type: 'bowl', o: { speckle: true }, bg: 'stone', u: 0.62, colors: [['chalk', 'chalk'], ['sage', 'sage'], ['clay', 'clay']], cat: 'home' },
  { slug: 'lambswool-throw', type: 'throw', o: { stripes: stripesThrow }, bg: 'ivory', u: 0.66, colors: [['oat', 'oat'], ['clay', 'clay'], ['charcoal', 'charcoal']], cat: 'home' },
  { slug: 'linen-cushion', type: 'cushion', o: {}, bg: 'sage', u: 0.56, colors: [['oat', 'oat'], ['rust', 'rust'], ['sage', 'sage']], cat: 'home' },
  { slug: 'woven-basket', type: 'basket', bg: 'ivory', u: 0.56, colors: [['natural', 'natural'], ['walnut', 'walnut']], cat: 'home' },
  { slug: 'oak-serving-tray', type: 'tray', bg: 'stone', u: 0.64, colors: [['natural', 'natural'], ['walnut', 'walnut']], cat: 'home' },
  { slug: 'terracotta-planter', type: 'planter', o: { leaf: '#6d7a55' }, bg: 'ivory', u: 0.62, colors: [['terracotta', 'terracotta'], ['chalk', 'chalk']], cat: 'home' },
  { slug: 'linen-duvet-set', type: 'throw', o: { piping: true }, bg: 'sage', u: 0.7, colors: [['ivory', 'ivory'], ['sage', 'sage'], ['clay', 'clay']], cat: 'home' },
  { slug: 'ceramic-table-lamp', type: 'lamp', o: { speckle: true }, bg: 'blush', u: 0.7, colors: [['chalk', 'chalk', { shade: '#e6d6b8' }], ['charcoal', 'charcoal', { shade: '#e6d6b8' }]], cat: 'light' },
  { slug: 'oak-stool', type: 'stool', bg: 'ivory', u: 0.5, colors: [['natural', 'natural'], ['walnut', 'walnut']], cat: 'light' },
  { slug: 'travertine-side-table', type: 'sidetable', o: { stone: true }, bg: 'stone', u: 0.56, colors: [['travertine', 'travertine']], cat: 'light' },
  { slug: 'brass-round-mirror', type: 'mirror', bg: 'ivory', u: 0.62, colors: [['brass', 'brass'], ['black', 'black']], cat: 'light' },
  { slug: 'botanical-serum', type: 'bottle', o: { kind: 'dropper' }, bg: 'clay', u: 0.46, colors: [['amber', 'amber']], cat: 'beauty' },
  { slug: 'barrier-cream', type: 'jar', bg: 'ivory', u: 0.5, colors: [['creamjar', 'creamjar']], cat: 'beauty' },
  { slug: 'fig-cedar-parfum', type: 'perfume', bg: 'blush', u: 0.5, colors: [['parfum', 'parfum']], cat: 'beauty' },
  { slug: 'soy-candle', type: 'candle', bg: 'stone', u: 0.48, colors: [['figwax', 'figwax'], ['cedarwax', 'cedar'], ['linenwax', 'linen']], cat: 'beauty' },
  { slug: 'reed-diffuser', type: 'diffuser', bg: 'sage', u: 0.62, colors: [['glassgreen', 'fig'], ['amber', 'cedar'], ['linenwax', 'linen']], cat: 'beauty' },
  { slug: 'nourishing-body-oil', type: 'bottle', o: { kind: 'pump' }, bg: 'blush', u: 0.5, colors: [['glassgreen', 'glassgreen']], cat: 'beauty' },
  { slug: 'botanical-hand-wash', type: 'bottle', o: { kind: 'pump' }, bg: 'stone', u: 0.46, colors: [['linenwax', 'linenwax']], cat: 'beauty' }
];
