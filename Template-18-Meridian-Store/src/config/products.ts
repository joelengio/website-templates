import type { ProductImage, ProductInput, ProductOption, VariantInput } from './types';

/**
 * PRODUCT CATALOGUE — the single place to add, remove or edit products.
 * Prices are in major units (285 = $285.00). Every product needs at least one variant; use `product()` to generate the variant matrix.
 * Demonstration stock is generated deterministically from the SKU so the demo shows a realistic mix of in-stock, low-stock and sold-out items.
 * Replace the whole file (or load your own JSON) to rebrand: nothing outside src/config refers to a specific product.
 */

type ColorDef = [label: string, swatch: string, imageKey: string];
interface SizeDef { name: string; values: (string | [value: string, priceDelta: number])[] }
interface Spec {
  id: string; slug: string; name: string; tagline: string; description: string; category: string;
  price: number; compareAt?: number; sku: string; added: string;
  new?: boolean; featured?: boolean; best?: number; status?: ProductInput['status'];
  /** Colour (or scent) options that also swap the product image. */
  colors?: ColorDef[]; colorOption?: string;
  /** Image key when the product has no colour option. */
  single?: string;
  sizes?: SizeDef;
  /** Override stock for a variant, keyed by option values joined with " / " (e.g. "Ink / M"). `default` applies to every other variant. */
  stock?: Record<string, number>;
  features: string[]; details: [string, string][]; shippingNote?: string;
}

const hash = (s: string): number => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 17);
const slugify = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const img = (slug: string, key: string): string => `/images/products/${slug}-${key}.webp`;

function product(d: Spec): ProductInput {
  const options: ProductOption[] = [];
  const colorName = d.colorOption ?? 'Color';
  if (d.colors) options.push({ name: colorName, type: d.colorOption && d.colorOption !== 'Color' ? 'text' : 'color', values: d.colors.map(([value, swatch]) => ({ value, swatch })) });
  if (d.sizes) options.push({ name: d.sizes.name, type: /size|height|diameter|volume|capacity/i.test(d.sizes.name) ? 'size' : 'text', values: d.sizes.values.map((v) => ({ value: typeof v === 'string' ? v : v[0] })) });

  const deltas: Record<string, number> = {};
  d.sizes?.values.forEach((v) => { if (typeof v !== 'string') deltas[v[0]] = v[1]; });

  let combos: Record<string, string>[] = [{}];
  for (const o of options) combos = combos.flatMap((c) => o.values.map((v) => ({ ...c, [o.name]: v.value })));
  const variants: VariantInput[] = combos.map((options_) => {
    const key = Object.values(options_).join(' / ');
    const sizeValue = d.sizes ? options_[d.sizes.name] : undefined;
    const delta = sizeValue ? (deltas[sizeValue] ?? 0) : 0;
    const stock = d.stock?.[key] ?? d.stock?.default ?? 6 + (hash(d.sku + key) % 30);
    return {
      options: options_, stock, sku: key ? `${d.sku}-${Object.values(options_).map((v) => slugify(v).slice(0, 4).toUpperCase()).join('-')}` : d.sku,
      ...(delta ? { price: +(d.price + delta).toFixed(2), compareAtPrice: d.compareAt ? +(d.compareAt + delta).toFixed(2) : undefined } : {})
    };
  });

  const images: ProductImage[] = d.colors
    ? d.colors.map(([label, , key]) => ({ src: img(d.slug, key), alt: `${d.name} in ${label}`, option: label }))
    : [{ src: img(d.slug, d.single ?? 'default'), alt: d.name }];
  images.push({ src: img(d.slug, 'detail'), alt: `Close-up detail of the ${d.name}` });
  images.push({ src: img(d.slug, 'scene'), alt: `The ${d.name} styled on a stone shelf with small objects` });
  if (d.colors && d.colors.length > 1) images.push({ src: img(d.slug, 'colors'), alt: `The ${d.name} shown in every available ${colorName.toLowerCase()}` });

  return {
    id: d.id, slug: d.slug, name: d.name, tagline: d.tagline, description: d.description, category: d.category,
    price: d.price, compareAtPrice: d.compareAt, sku: d.sku, status: d.status ?? 'active',
    featured: d.featured, bestseller: d.best, isNew: d.new, addedOn: d.added,
    options, imageOption: d.colors ? colorName : undefined, variants, images,
    features: d.features, details: d.details.map(([label, value]) => ({ label, value })), shippingNote: d.shippingNote
  };
}

const C = {
  cognac: ['Cognac', '#9b5d3a', 'cognac'], ink: ['Ink', '#302d2b', 'ink'], oat: ['Oat', '#d9cdb8', 'oat'], sand: ['Sand', '#cdb998', 'sand'], clay: ['Clay', '#b8704f', 'clay'],
  charcoal: ['Charcoal', '#3b3937', 'charcoal'], chalk: ['Chalk', '#ebe5d8', 'chalk'], sage: ['Sage', '#9ba58d', 'sage'], rust: ['Rust', '#a4583a', 'rust'], ivory: ['Ivory', '#eee7d9', 'ivory'],
  stone: ['Stone', '#c4baa8', 'stone'], natural: ['Natural oak', '#c9a676', 'natural'], walnut: ['Walnut', '#6e4a31', 'walnut']
} satisfies Record<string, ColorDef>;

const care = (text: string): [string, string] => ['Care', text];

export const productInputs: ProductInput[] = [
  // ── Bags & accessories ───────────────────────────────────────────────────────
  product({
    id: 'MER-1001', slug: 'atelier-tote', name: 'Atelier Leather Tote', tagline: 'Full-grain leather, cut to carry a working day.', category: 'bags-accessories', price: 285, sku: 'MER-TOTE', added: '2026-09-18', new: true, featured: true, best: 1,
    description: 'An unlined structured tote with a deep, open interior, reinforced handles and hand-finished edges. The leather softens and darkens with use, taking on the character of the person who carries it.',
    colors: [C.cognac, C.ink, ['Oat', '#cdb998', 'sand']], stock: { 'Ink': 3 },
    features: ['Full-grain vegetable-tanned leather (demonstration description)', 'Fits a 14-inch laptop and a folded jacket', 'Edge-painted and burnished by hand', 'Interior slip pocket with magnetic closure'],
    details: [['Material', 'Full-grain leather, cotton thread, brass hardware'], ['Dimensions', '36 W × 29 H × 14 D cm; handle drop 21 cm'], care('Wipe with a dry cloth. Condition twice a year and keep away from prolonged moisture.')]
  }),
  product({
    id: 'MER-1002', slug: 'fold-crossbody', name: 'Fold Crossbody Bag', tagline: 'A compact flap bag with an adjustable strap.', category: 'bags-accessories', price: 240, sku: 'MER-XBODY', added: '2026-08-20', featured: true,
    description: 'A softly structured crossbody with a deep fold-over flap, a single brass stud closure and an interior zip pocket. The strap adjusts from shoulder to cross-body length.',
    colors: [C.ink, C.clay, ['Oat', '#cdb998', 'sand']],
    features: ['Fold-over flap with brass stud closure', 'Adjustable strap, 70–120 cm', 'Interior zip pocket and card slip', 'Cotton twill lining'],
    details: [['Material', 'Smooth leather, cotton twill lining, brass hardware'], ['Dimensions', '24 W × 17 H × 8 D cm'], care('Spot clean with a barely damp cloth. Store in the supplied dust bag.')]
  }),
  product({
    id: 'MER-1003', slug: 'slim-cardholder', name: 'Slim Leather Cardholder', tagline: 'Four slots, one centre pocket, no bulk.', category: 'bags-accessories', price: 68, compareAt: 85, sku: 'MER-CARD', added: '2026-04-02', best: 3,
    description: 'A pared-back cardholder with four card slots and a centre pocket for folded notes. Made from a single piece of leather with edge stitching in a contrasting thread.',
    colors: [C.cognac, C.ink, ['Sand', '#cdb998', 'sand']], stock: { 'Sand': 0 },
    features: ['Four card slots plus centre pocket', 'Only 6 mm thick when full', 'Hand-burnished edges', 'Gift box included'],
    details: [['Material', 'Full-grain leather, waxed thread'], ['Dimensions', '10 W × 7.5 H cm'], care('Wipe clean with a soft dry cloth.')]
  }),
  product({
    id: 'MER-1004', slug: 'merino-scarf', name: 'Brushed Merino Scarf', tagline: 'Generous, featherlight and lightly brushed.', category: 'bags-accessories', price: 120, sku: 'MER-SCARF', added: '2026-10-05', new: true,
    description: 'A wide scarf in a lightly brushed merino blend with fine tonal stripes and a hand-knotted fringe. Wear it wrapped twice, draped, or open over the shoulders.',
    colors: [['Oat', '#d9cdb8', 'oat'], C.charcoal, C.clay],
    features: ['Brushed merino-blend yarn', 'Hand-knotted fringe', '180 × 60 cm — wide enough to wrap', 'Soft against the skin'],
    details: [['Material', '80% merino wool, 20% polyamide (demonstration composition)'], ['Dimensions', '180 × 60 cm'], care('Hand wash cool with wool detergent. Dry flat.')]
  }),
  product({
    id: 'MER-1005', slug: 'round-sunglasses', name: 'Acetate Round Sunglasses', tagline: 'Soft round frames with a keyhole bridge.', category: 'bags-accessories', price: 155, sku: 'MER-SUN', added: '2026-06-11', featured: true,
    description: 'Round sunglasses with a polished acetate frame and neutral grey lenses. The keyhole bridge sits comfortably and the spring hinges keep them secure.',
    colors: [['Tortoise', '#6e4128', 'tortoise'], ['Black', '#232220', 'black'], ['Sand', '#d8c3a0', 'sand']], stock: { 'Black': 0, 'Tortoise': 4 },
    features: ['Polished acetate frame', 'Neutral grey lenses with UV400 rating (demonstration specification)', 'Spring hinges', 'Hard case and cloth included'],
    details: [['Material', 'Cellulose acetate, metal hinges, polycarbonate lenses'], ['Dimensions', 'Lens width 48 mm; bridge 22 mm; arm 145 mm'], care('Clean with the supplied cloth. Store in the case.')]
  }),
  product({
    id: 'MER-1006', slug: 'zip-pouch', name: 'Canvas Travel Pouch', tagline: 'For chargers, cosmetics and small things.', category: 'bags-accessories', price: 52, sku: 'MER-POUCH', added: '2026-05-14',
    description: 'A heavyweight canvas pouch with a smooth metal zip and a leather pull. Two sizes keep cables, cosmetics or documents organised in a bag or suitcase.',
    colors: [C.stone, C.rust], sizes: { name: 'Size', values: ['Small', ['Large', 18]] },
    features: ['Heavyweight cotton canvas', 'Metal zip with leather pull', 'Wipe-clean lining', 'Two sizes'],
    details: [['Material', 'Cotton canvas, leather pull, coated lining'], ['Dimensions', 'Small 20 × 12 cm; Large 28 × 17 cm'], care('Spot clean. Do not machine wash.')]
  }),
  product({
    id: 'MER-1007', slug: 'weekender-duffel', name: 'Weekender Duffel', tagline: 'Our largest bag — arriving soon.', category: 'bags-accessories', price: 410, sku: 'MER-DUFFEL', added: '2026-10-25', new: true, status: 'coming-soon',
    description: 'A roomy leather weekender with a wide-opening zip, shoe compartment and detachable shoulder strap. This product demonstrates the "coming soon" status: it is visible but cannot be added to the bag.',
    colors: [C.ink, C.cognac], stock: { default: 0 },
    features: ['Wide-opening zip', 'Separate shoe compartment', 'Detachable shoulder strap', 'Trolley sleeve'],
    details: [['Material', 'Full-grain leather, cotton lining'], ['Dimensions', '52 W × 31 H × 24 D cm'], care('Wipe with a dry cloth.')]
  }),

  // ── Apparel ────────────────────────────────────────────────────────────────
  product({
    id: 'MER-2001', slug: 'merino-crew', name: 'Merino Crewneck', tagline: 'A fine-gauge knit for every season.', category: 'apparel', price: 165, sku: 'MER-CREW', added: '2026-10-12', new: true, featured: true, best: 2,
    description: 'A close-fitting crewneck in a fine-gauge merino knit. Light enough to layer, warm enough to wear alone, with ribbed trims that keep their shape.',
    colors: [['Oat', '#d9cdb8', 'oat'], C.charcoal, C.clay], sizes: { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }, stock: { 'Clay / XS': 0, 'Charcoal / XL': 2 },
    features: ['Fine-gauge merino-blend knit', 'Ribbed neck, cuffs and hem', 'Regular fit', 'Lightweight enough to layer'],
    details: [['Material', '100% merino wool (demonstration composition)'], ['Fit', 'Regular; model is 175 cm and wears size M'], care('Hand wash cool or use a wool programme. Dry flat.')]
  }),
  product({
    id: 'MER-2002', slug: 'ribbed-cardigan', name: 'Ribbed Cardigan', tagline: 'A relaxed button-through in a textured rib.', category: 'apparel', price: 195, compareAt: 240, sku: 'MER-CARDI', added: '2026-03-08', best: 5,
    description: 'A relaxed V-neck cardigan in a textured rib with horn-effect buttons. Worn open over a shirt or buttoned like a jumper.',
    colors: [['Camel', '#b88f62', 'camel'], ['Cocoa', '#6b4d3a', 'cocoa'], C.ivory], sizes: { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
    features: ['Textured rib knit', 'Horn-effect buttons', 'Relaxed fit', 'Side pockets'],
    details: [['Material', 'Wool and cotton blend (demonstration composition)'], ['Fit', 'Relaxed; size up for a looser drape'], care('Hand wash cool. Dry flat.')]
  }),
  product({
    id: 'MER-2003', slug: 'linen-shirt', name: 'Washed Linen Shirt', tagline: 'Softened by washing, easy from day one.', category: 'apparel', price: 135, sku: 'MER-LSHIRT', added: '2026-05-30', featured: true, best: 4,
    description: 'A classic collared shirt in garment-washed linen. The fabric is supple from the first wear and creases beautifully; wear it tucked, untucked or as a light layer.',
    colors: [C.ivory, C.sage, ['Blush', '#dcbdab', 'blush']], sizes: { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
    features: ['Garment-washed linen', 'Mother-of-pearl-effect buttons', 'Relaxed shirt fit', 'Curved hem'],
    details: [['Material', '100% linen'], ['Fit', 'Relaxed; model is 175 cm and wears size S'], care('Machine wash cool. Tumble dry low or line dry.')]
  }),
  product({
    id: 'MER-2004', slug: 'twill-overshirt', name: 'Cotton Twill Overshirt', tagline: 'A sturdy layer with two chest pockets.', category: 'apparel', price: 175, sku: 'MER-OVER', added: '2026-09-02', new: true,
    description: 'A substantial overshirt in brushed cotton twill with two patch pockets and a boxy cut. It works as a shirt in spring and a jacket through autumn.',
    colors: [C.stone, C.rust, C.charcoal], sizes: { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
    features: ['Brushed cotton twill', 'Two chest pockets', 'Boxy fit', 'Corozo-effect buttons'],
    details: [['Material', '100% cotton twill'], ['Fit', 'Boxy; true to size'], care('Machine wash cool. Do not tumble dry.')]
  }),
  product({
    id: 'MER-2005', slug: 'wide-leg-trouser', name: 'Wide-Leg Wool Trouser', tagline: 'A pressed crease and a generous leg.', category: 'apparel', price: 210, compareAt: 245, sku: 'MER-TROUSER', added: '2026-02-17',
    description: 'A high-waisted trouser in a mid-weight wool blend with a pressed crease, side pockets and a concealed hook closure. The wide leg falls cleanly from the hip.',
    colors: [C.charcoal, ['Oat', '#d9cdb8', 'oat']], sizes: { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
    features: ['Mid-weight wool blend', 'High waist with concealed closure', 'Pressed front crease', 'Side seam pockets'],
    details: [['Material', 'Wool and polyester blend (demonstration composition)'], ['Fit', 'High rise, wide leg; inseam 78 cm'], care('Dry clean or steam. Do not wash.')]
  }),

  // ── Homeware ───────────────────────────────────────────────────────────────
  product({
    id: 'MER-3001', slug: 'stoneware-vase', name: 'Hand-Glazed Stoneware Vase', tagline: 'A speckled glaze that pools and shifts.', category: 'homeware', price: 98, sku: 'MER-VASE', added: '2026-09-22', new: true, featured: true, best: 6,
    description: 'A sculptural stoneware vase with a speckled satin glaze. Each piece is slightly different; the glaze pools softly at the shoulder and the base is left unglazed.',
    colors: [C.chalk, C.clay, C.charcoal], sizes: { name: 'Size', values: ['Small', ['Large', 40]] },
    features: ['Stoneware with satin speckled glaze', 'Watertight interior', 'Each piece unique', 'Felt-protected base'],
    details: [['Material', 'Glazed stoneware'], ['Dimensions', 'Small 22 cm tall; Large 34 cm tall'], care('Hand wash. Not suitable for dishwashers or microwaves.')]
  }),
  product({
    id: 'MER-3002', slug: 'bud-vase', name: 'Slender Bud Vase', tagline: 'One stem is enough.', category: 'homeware', price: 42, sku: 'MER-BUD', added: '2026-07-04',
    description: 'A slim bud vase with a narrow neck, made for a single stem or dried grasses. This product is fully sold out in the demo to show the sold-out state.',
    colors: [C.chalk, C.sage], stock: { default: 0 },
    features: ['Narrow neck for single stems', 'Satin glaze', 'Watertight', 'Stable weighted base'],
    details: [['Material', 'Glazed stoneware'], ['Dimensions', '26 cm tall, 8 cm wide'], care('Hand wash.')]
  }),
  product({
    id: 'MER-3003', slug: 'stoneware-mugs', name: 'Stoneware Mug Set of Two', tagline: 'Generous mugs with a satin glaze.', category: 'homeware', price: 58, compareAt: 70, sku: 'MER-MUGS', added: '2026-04-19', best: 7,
    description: 'Two hand-finished stoneware mugs with a comfortable thumb-rest handle and a satin glaze. Each holds 350 ml.',
    colors: [C.chalk, C.clay, C.charcoal],
    features: ['Set of two', '350 ml capacity', 'Dishwasher-safe glaze', 'Stackable'],
    details: [['Material', 'Glazed stoneware'], ['Dimensions', '8.5 cm diameter, 9 cm tall'], care('Dishwasher and microwave safe.')]
  }),
  product({
    id: 'MER-3004', slug: 'serving-bowl', name: 'Wide Serving Bowl', tagline: 'Shallow, generous, table-ready.', category: 'homeware', price: 76, sku: 'MER-BOWL', added: '2026-06-25', featured: true,
    description: 'A wide, shallow serving bowl with a speckled glaze that is equally good for salad, fruit or as a catch-all on a console.',
    colors: [C.chalk, C.sage, C.clay], sizes: { name: 'Size', values: ['Medium', ['Large', 24]] },
    features: ['Speckled glaze', 'Food-safe interior', 'Low profile for easy serving', 'Two sizes'],
    details: [['Material', 'Glazed stoneware'], ['Dimensions', 'Medium 26 cm; Large 34 cm diameter'], care('Dishwasher safe on a gentle cycle.')]
  }),
  product({
    id: 'MER-3005', slug: 'lambswool-throw', name: 'Lambswool Throw', tagline: 'Dense, warm and tied with a fringe.', category: 'homeware', price: 185, sku: 'MER-THROW', added: '2026-10-08', new: true, best: 8,
    description: 'A generous woven throw in soft lambswool with fine end stripes and a twisted fringe. Fold it over a sofa arm or layer it on the end of a bed.',
    colors: [['Oat', '#d9cdb8', 'oat'], C.clay, C.charcoal],
    features: ['Soft woven lambswool', 'Twisted fringe', '130 × 180 cm', 'Naturally warm'],
    details: [['Material', '100% lambswool (demonstration composition)'], ['Dimensions', '130 × 180 cm'], care('Dry clean or hand wash cold. Dry flat.')]
  }),
  product({
    id: 'MER-3006', slug: 'linen-cushion', name: 'Linen Cushion Cover', tagline: 'Washed linen with a concealed zip.', category: 'homeware', price: 62, sku: 'MER-CUSH', added: '2026-03-22',
    description: 'A softly washed linen cushion cover with a concealed zip and an envelope back. Insert sold separately.',
    colors: [['Oat', '#d9cdb8', 'oat'], C.rust, C.sage], sizes: { name: 'Size', values: ['45 × 45 cm', ['55 × 55 cm', 8]] },
    features: ['Washed linen', 'Concealed zip', 'Fits standard inserts', 'Machine washable'],
    details: [['Material', '100% linen'], ['Dimensions', '45 × 45 cm or 55 × 55 cm (cover only)'], care('Machine wash cool. Iron on a warm setting if desired.')]
  }),
  product({
    id: 'MER-3007', slug: 'woven-basket', name: 'Woven Storage Basket', tagline: 'Tight weave, sturdy handles.', category: 'homeware', price: 88, sku: 'MER-BASKET', added: '2026-05-06',
    description: 'A hand-woven basket with two sturdy handles. Use it for blankets, logs, laundry or as a planter cover.',
    colors: [['Natural', '#c9a676', 'natural'], ['Smoked', '#6e4a31', 'walnut']], sizes: { name: 'Size', values: ['Small', ['Medium', 14], ['Large', 30]] },
    features: ['Tight natural-fibre weave', 'Two reinforced handles', 'Holds its shape', 'Three sizes'],
    details: [['Material', 'Natural woven fibre'], ['Dimensions', 'Small 28 cm; Medium 36 cm; Large 44 cm wide'], care('Brush or vacuum. Keep dry.')]
  }),
  product({
    id: 'MER-3008', slug: 'oak-serving-tray', name: 'Oak Serving Tray', tagline: 'Solid oak with cut-out handles.', category: 'homeware', price: 92, sku: 'MER-TRAY', added: '2026-07-18',
    description: 'A solid oak tray with a shallow lip and generous cut-out handles. Oiled to a natural finish that ages well.',
    colors: [C.natural, C.walnut], sizes: { name: 'Size', values: ['Medium', ['Large', 22]] },
    features: ['Solid oak', 'Cut-out handles', 'Oiled finish', 'Two sizes'],
    details: [['Material', 'Solid oak, natural oil finish'], ['Dimensions', 'Medium 42 × 28 cm; Large 52 × 34 cm'], care('Wipe clean. Re-oil occasionally. Do not soak.')]
  }),
  product({
    id: 'MER-3009', slug: 'terracotta-planter', name: 'Terracotta Planter', tagline: 'Fired clay with a deep rim.', category: 'homeware', price: 54, sku: 'MER-PLANT', added: '2026-04-28',
    description: 'A deep-rimmed planter in fired clay, with a drainage hole and a matching saucer. The surface develops a patina over time.',
    colors: [['Terracotta', '#b86a47', 'terracotta'], C.chalk], sizes: { name: 'Size', values: ['Small', ['Medium', 16], ['Large', 34]] },
    features: ['Fired clay', 'Drainage hole and saucer', 'Frost-resistant (demonstration claim — verify for your supplier)', 'Three sizes'],
    details: [['Material', 'Fired clay'], ['Dimensions', 'Small 14 cm; Medium 20 cm; Large 28 cm diameter'], care('Wipe with a damp cloth.')]
  }),
  product({
    id: 'MER-3010', slug: 'linen-duvet-set', name: 'Stonewashed Linen Duvet Set', tagline: 'Duvet cover and two pillowcases.', category: 'homeware', price: 320, sku: 'MER-DUVET', added: '2026-08-14', featured: true,
    description: 'A stonewashed linen duvet cover with two matching pillowcases, finished with contrast piping. The fabric softens with every wash.',
    colors: [C.ivory, C.sage, C.clay], sizes: { name: 'Size', values: [['Double', -30], 'Queen', ['King', 40]] },
    features: ['Stonewashed linen', 'Contrast piping', 'Button closure', 'Two pillowcases included'],
    details: [['Material', '100% linen'], ['Dimensions', 'Queen: 230 × 220 cm duvet cover; 50 × 75 cm pillowcases'], care('Machine wash warm. Tumble dry low.')]
  }),

  // ── Furniture & lighting ────────────────────────────────────────────────────
  product({
    id: 'MER-4001', slug: 'ceramic-table-lamp', name: 'Ceramic Table Lamp', tagline: 'A speckled base and a linen shade.', category: 'furniture-lighting', price: 220, sku: 'MER-LAMP', added: '2026-09-09', new: true, featured: true,
    description: 'A table lamp with a hand-glazed ceramic base and a tapered linen shade that casts a warm, diffused glow. Supplied with a braided cord and inline switch.',
    colors: [C.chalk, C.charcoal], stock: { 'Charcoal': 4 },
    features: ['Hand-glazed ceramic base', 'Tapered linen shade', 'Braided cord with inline switch', 'Bulb not included (E27 / E26 fitting)'],
    details: [['Material', 'Glazed ceramic, linen shade, brass fittings'], ['Dimensions', '52 cm tall, 32 cm shade diameter'], care('Dust with a dry cloth. Unplug before cleaning.')],
    shippingNote: 'Electrical items are supplied with a plug for the destination country selected at checkout (demonstration note).'
  }),
  product({
    id: 'MER-4002', slug: 'oak-stool', name: 'Solid Oak Stool', tagline: 'Three legs, one seat, endlessly useful.', category: 'furniture-lighting', price: 260, sku: 'MER-STOOL', added: '2026-07-30', best: 9,
    description: 'A solid oak stool with a gently dished seat and splayed legs. Use it as a side table, a perch in the kitchen or a place to put your shoes on.',
    colors: [C.natural, C.walnut], sizes: { name: 'Height', values: ['Low (45 cm)', ['Counter (65 cm)', 30]] },
    features: ['Solid oak', 'Dished seat', 'Mortise-and-tenon legs', 'Felt feet'],
    details: [['Material', 'Solid oak, natural oil finish'], ['Dimensions', 'Seat diameter 32 cm'], care('Wipe clean. Re-oil occasionally.')],
    shippingNote: 'Furniture ships fully assembled in protective packaging. Delivery times may be longer for large items.'
  }),
  product({
    id: 'MER-4003', slug: 'travertine-side-table', name: 'Travertine Side Table', tagline: 'A pedestal table in natural stone.', category: 'furniture-lighting', price: 490, sku: 'MER-TABLE', added: '2026-06-02',
    description: 'A round side table with a travertine top and a solid pedestal base. Natural variations in the stone mean no two tables are identical.',
    single: 'travertine', sizes: { name: 'Diameter', values: ['40 cm', ['50 cm', 90]] }, stock: { default: 4, '50 cm': 2 },
    features: ['Natural travertine', 'Solid pedestal base', 'Each top is unique', 'Non-marking base'],
    details: [['Material', 'Honed travertine'], ['Dimensions', 'Height 46 cm; diameter 40 cm or 50 cm'], care('Wipe spills immediately. Use coasters; avoid acidic cleaners.')],
    shippingNote: 'Heavy items ship by a specialist carrier with an additional delivery appointment (demonstration note).'
  }),
  product({
    id: 'MER-4004', slug: 'brass-round-mirror', name: 'Round Wall Mirror', tagline: 'A slim metal frame in two finishes.', category: 'furniture-lighting', price: 340, sku: 'MER-MIRROR', added: '2026-08-02',
    description: 'A round wall mirror with a slim brushed metal frame and a bevelled edge. It hangs on a hidden bracket and works in a hallway, bedroom or bathroom.',
    colors: [['Brass', '#b79456', 'brass'], ['Black', '#232220', 'black']], colorOption: 'Finish', sizes: { name: 'Diameter', values: ['60 cm', ['80 cm', 110]] },
    features: ['Brushed metal frame', 'Bevelled mirror glass', 'Hidden wall bracket', 'Vertical or horizontal hanging'],
    details: [['Material', 'Steel frame, mirror glass'], ['Dimensions', '60 cm or 80 cm diameter; depth 3 cm'], care('Clean the glass with a damp cloth. Avoid abrasive cleaners.')],
    shippingNote: 'Mirrors ship in reinforced packaging.'
  }),

  // ── Beauty & fragrance ──────────────────────────────────────────────────────
  product({
    id: 'MER-5001', slug: 'botanical-serum', name: 'Botanical Face Serum', tagline: 'A light, fragrance-free daily serum.', category: 'beauty', price: 62, sku: 'MER-SERUM', added: '2026-10-15', new: true, best: 10,
    description: 'A lightweight botanical serum in a dropper bottle. This is fictional demonstration copy: make no claims about ingredients or results without your own substantiation.',
    single: 'amber', sizes: { name: 'Volume', values: ['30 ml', ['50 ml', 28]] },
    features: ['Dropper bottle in amber glass', 'Fragrance-free (demonstration)', 'Refillable bottle', 'Packed in recyclable materials where possible'],
    details: [['Volume', '30 ml or 50 ml'], ['Ingredients', 'Placeholder — add your INCI list here'], care('Store away from direct sunlight. Patch test before use.')],
    shippingNote: 'Cosmetics may be restricted for some destinations (demonstration note).'
  }),
  product({
    id: 'MER-5002', slug: 'barrier-cream', name: 'Barrier Cream', tagline: 'A rich daily moisturiser in a glass jar.', category: 'beauty', price: 48, sku: 'MER-CREAM', added: '2026-05-21',
    description: 'A rich everyday cream in a weighty glass jar with a brushed lid. Placeholder copy for a fictional product.',
    single: 'creamjar', sizes: { name: 'Volume', values: ['50 ml', ['100 ml', 30]] },
    features: ['Glass jar with metal lid', 'Fragrance-free (demonstration)', 'Suitable for daily use (demonstration)', 'Refill-friendly jar'],
    details: [['Volume', '50 ml or 100 ml'], ['Ingredients', 'Placeholder — add your INCI list here'], care('Keep the lid closed. Use clean hands or a spatula.')]
  }),
  product({
    id: 'MER-5003', slug: 'fig-cedar-parfum', name: 'Fig & Cedar Eau de Parfum', tagline: 'Green fig, warm cedar, soft musk.', category: 'beauty', price: 135, sku: 'MER-EDP', added: '2026-09-27', new: true, featured: true,
    description: 'A fictional eau de parfum with notes of green fig leaf, dry cedar and soft musk. A weighted glass bottle with a magnetic cap.',
    single: 'parfum', sizes: { name: 'Volume', values: ['30 ml', ['50 ml', 55]] },
    features: ['Weighted glass bottle', 'Magnetic cap', 'Notes: fig leaf, cedar, musk (fictional)', 'Presentation box'],
    details: [['Volume', '30 ml or 50 ml'], ['Concentration', 'Eau de parfum'], care('Store in a cool, dry place away from sunlight.')],
    shippingNote: 'Fragrance contains flammable liquid and ships by ground only (demonstration note).'
  }),
  product({
    id: 'MER-5004', slug: 'soy-candle', name: 'Soy Wax Candle', tagline: 'A slow-burning candle in a glass vessel.', category: 'beauty', price: 44, sku: 'MER-CANDLE', added: '2026-08-26', best: 11,
    description: 'A hand-poured soy wax candle in a reusable glass vessel with a cotton wick. Choose from three fictional scents.',
    colors: [['Fig', '#c9b6bb', 'figwax'], ['Cedar', '#d8c6a2', 'cedar'], ['Linen', '#ebe5d6', 'linen']], colorOption: 'Scent',
    features: ['Soy wax blend', 'Cotton wick', 'Approx. 45 hours burn time (demonstration claim)', 'Reusable glass vessel'],
    details: [['Weight', '220 g'], ['Scents', 'Fig · Cedar · Linen (fictional)'], care('Trim the wick to 5 mm. Never leave a burning candle unattended.')]
  }),
  product({
    id: 'MER-5005', slug: 'reed-diffuser', name: 'Reed Diffuser', tagline: 'A quiet, constant scent for a room.', category: 'beauty', price: 58, sku: 'MER-DIFF', added: '2026-07-12',
    description: 'A glass diffuser with natural reeds, filled with a fictional home fragrance. Place away from direct heat for a steady, gentle scent.',
    colors: [['Fig', '#6f8a73', 'fig'], ['Cedar', '#7a4a21', 'cedar'], ['Linen', '#ebe5d6', 'linen']], colorOption: 'Scent',
    features: ['Glass vessel with natural reeds', '100 ml fragrance oil', 'Lasts around 3 months (demonstration claim)', 'Gift-ready packaging'],
    details: [['Volume', '100 ml'], ['Scents', 'Fig · Cedar · Linen (fictional)'], care('Flip the reeds weekly. Keep out of reach of children and pets.')]
  }),
  product({
    id: 'MER-5006', slug: 'nourishing-body-oil', name: 'Nourishing Body Oil', tagline: 'A dry-touch oil in a pump bottle.', category: 'beauty', price: 54, compareAt: 64, sku: 'MER-BODYOIL', added: '2026-04-09',
    description: 'A dry-touch body oil in a green glass bottle with a pump. Placeholder copy for a fictional product.',
    single: 'glassgreen', sizes: { name: 'Volume', values: ['100 ml', ['200 ml', 22]] },
    features: ['Green glass bottle with pump', 'Light, non-greasy feel (demonstration)', 'Refill-friendly', 'Fragrance-free'],
    details: [['Volume', '100 ml or 200 ml'], ['Ingredients', 'Placeholder — add your INCI list here'], care('Store away from sunlight.')]
  }),
  product({
    id: 'MER-5007', slug: 'botanical-hand-wash', name: 'Botanical Hand Wash', tagline: 'A gentle foaming wash for everyday use.', category: 'beauty', price: 28, sku: 'MER-HANDWASH', added: '2026-03-03',
    description: 'A gentle hand wash in a refillable pump bottle. Placeholder copy for a fictional product.',
    single: 'linenwax', sizes: { name: 'Volume', values: ['300 ml', ['500 ml', 10]] },
    features: ['Refillable pump bottle', 'Gentle everyday formula (demonstration)', 'Recyclable packaging', 'Two sizes'],
    details: [['Volume', '300 ml or 500 ml'], ['Ingredients', 'Placeholder — add your INCI list here'], care('Avoid contact with eyes.')]
  })
];
