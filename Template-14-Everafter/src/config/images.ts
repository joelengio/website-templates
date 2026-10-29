import type { ImageRef } from './types';

/**
 * Image catalogue. Every photograph used on the site is registered here with its alt text and
 * (optionally) a focal point. To swap a picture, drop your file into /public/images and change `file`
 * (or add a new key). Files must exist as `<file>.webp` and `<file>-sm.webp` (a ~720px wide copy).
 */
interface Entry {
  alt: string;
  position?: string;
  file?: string;
}

const catalog = {
  'hero-arch': { alt: 'A white fabric wedding arch framing a still pond at dusk', position: '50% 55%' },
  'arch-lakeside': { alt: 'A rustic timber ceremony arch dressed with blooms beside a lake', position: '50% 60%' },
  'como-gardens': { alt: 'Villa gardens on the shore of Lake Como beneath wooded mountains', position: '50% 90%' },
  'como-villa': { alt: 'A lakeside villa with a tower, covered in ivy, on the shore of an Italian lake', position: '40% 50%' },
  'como-hall': { alt: 'A grand frescoed gallery with polished marble floors and tall windows', position: '50% 50%' },
  'detail-glasses': { alt: 'Rows of crystal glasses and folded napkins on a dressed banquet table', position: '50% 50%' },
  'tuscany-vineyard': { alt: 'Rolling Tuscan hills striped with vineyard rows in warm light', position: '50% 55%' },
  'tuscany-hills': { alt: 'Vineyards on the hills near Siena under a soft sky', position: '50% 60%' },
  'tuscany-harvest': { alt: 'A red-roofed winery among terraced vineyards in Chianti', position: '50% 50%' },
  'tuscany-road': { alt: 'Autumn vine rows climbing a hillside in the Chianti region', position: '50% 55%' },
  'amalfi-town': { alt: 'Pastel houses stacked above the sea along the Amalfi Coast', position: '50% 50%' },
  'amalfi-atrani': { alt: 'The village of Atrani tucked into a cove on the Amalfi Coast', position: '50% 50%' },
  'amalfi-coast': { alt: 'White villages clinging to the cliffs above a calm blue sea', position: '50% 55%' },
  'detail-rings': { alt: 'Two gold wedding bands resting on the pages of an open book', position: '50% 50%' },
  'provence-lavender': { alt: 'Rows of lavender running toward a stone farmhouse in Provence', position: '50% 60%' },
  'provence-field': { alt: 'A lavender field beneath a wide sky at the foot of the Alps', position: '50% 60%' },
  'provence-sunset': { alt: 'Lavender fields glowing under a violet Provençal sunset', position: '50% 60%' },
  'provence-rows': { alt: 'Purple lavender rows with a village on a hill in the distance', position: '50% 60%' },
  'highland-castle': { alt: 'A Highland castle reflected in a still sea loch', position: '50% 55%' },
  'highland-castle-2': { alt: 'A stone castle on a tidal island with mountains behind', position: '50% 55%' },
  'highland-loch': { alt: 'A turreted Scottish country house on the shore of a loch', position: '50% 50%' },
  'detail-candle': { alt: 'A single candle glowing among white roses and greenery on a reception table', position: '50% 50%' },
  'algarve-coast': { alt: 'A long Algarve beach with rolling surf and golden cliffs', position: '50% 55%' },
  'algarve-cliffs': { alt: 'Honey-coloured cliffs above a sheltered Algarve beach', position: '50% 50%' },
  'algarve-cove': { alt: 'A golden cove with turquoise water between sandstone cliffs', position: '50% 50%' },
  'algarve-rock': { alt: 'Sculpted sandstone rock stacks on the Algarve coast', position: '50% 50%' },
  'paris-seine': { alt: 'The Conciergerie and a Seine bridge beneath a coral sunset', position: '50% 55%' },
  'paris-evening': { alt: 'An evening view along the Seine with the Eiffel Tower in the distance', position: '50% 50%' },
  'ballroom-hall': { alt: 'A grand ballroom hung with chandeliers and richly ornamented ceilings', position: '50% 45%' },
  'ballroom-gold': { alt: 'A gilded ceiling with a hanging chandelier', position: '50% 50%' },
  'bali-terrace': { alt: 'Emerald rice terraces stepping down a hillside in Bali', position: '50% 55%' },
  'bali-terrace-2': { alt: 'Sunlit rice terraces and palms in Bali', position: '50% 55%' },
  'bali-fields': { alt: 'Water-filled rice terraces reflecting the sky in Bali', position: '50% 55%' },
  'detail-dress': { alt: 'A ruffled white bridal gown with a small posy of white anemones', position: '50% 40%' },
  'alps-sunset': { alt: 'Golden sunset over a mountain lake in the Swiss Alps', position: '50% 50%' },
  'alps-lake': { alt: 'Snow-dusted peaks above a mirror-calm Alpine lake at sunset', position: '50% 50%' },
  'alps-maloja': { alt: 'An Alpine lake seen from the pass with mountains beyond', position: '50% 50%' },
  'alps-reflection': { alt: 'Peaks reflected in the still water of Lake Sils', position: '50% 50%' },
  'alps-tree': { alt: 'A lone windswept tree silhouetted against a sunset over an Alpine lake', position: '50% 55%' },
  'orangery-exterior': { alt: 'A pale classical orangery with tall arched windows on a sunny afternoon', position: '50% 50%' },
  'orangery-blossom': { alt: 'Spring magnolia branches in front of a glazed orangery', position: '50% 50%' },
  'conservatory-hall': { alt: 'A vast glasshouse hall with white tables set beneath arched ironwork', position: '50% 55%' },
  'conservatory-glass': { alt: 'The glazed roof of a great conservatory over a long, light-filled hall', position: '50% 50%' },
  'vineyard-autumn': { alt: 'Vineyard rows in golden autumn leaf under a clear blue sky', position: '50% 55%' },
  'vineyard-rows': { alt: 'Autumn vines stretching toward a tree-lined horizon', position: '50% 55%' },
  'vineyard-gold': { alt: 'Close view of golden vine leaves in late afternoon light', position: '50% 50%' },
  'vineyard-estate': { alt: 'A vineyard estate with russet leaves and a tall evergreen on the ridge', position: '50% 55%' },
  'rose-arch': { alt: 'A walkway beneath an arch of climbing roses in a public rose garden', position: '50% 50%' },
  'rose-path': { alt: 'A garden path lined with blooming rose beds and a pergola', position: '50% 50%' },
  'rose-gazebo': { alt: 'A wrought-iron gazebo among yellow roses and calla lilies', position: '50% 55%' },
  'rose-fete': { alt: 'A white garden gazebo set in beds of red flowers', position: '50% 55%' },
  'dubrovnik-harbour': { alt: 'The old harbour of Dubrovnik with stone walls and calm water', position: '50% 55%' },
  'dubrovnik-roofs': { alt: 'Terracotta rooftops of Dubrovnik with the sea beyond', position: '50% 50%' },
  'dubrovnik-walls': { alt: 'The walled old town of Dubrovnik meeting the Adriatic', position: '50% 50%' },
  'detail-champagne': { alt: 'Two tall crystal champagne flutes against a soft dark background', position: '50% 50%' },
  'garda-sunset': { alt: 'Sunset over Lake Garda with a golden sky and still water', position: '50% 55%' },
  'bouquet-wild': { alt: 'A loose bridal bouquet of orange, cream and green wildflowers', position: '50% 45%' },
  'bouquet-blush': { alt: 'A romantic bouquet of blush roses and waxflower held against lace', position: '50% 40%' },
  'bouquet-ivory': { alt: 'An ivory and sage garden bouquet held by a bride in a boho gown', position: '50% 40%' },
  'bouquet-burgundy': { alt: 'A burgundy tulip bouquet tied with a dusty pink ribbon', position: '50% 40%' },
  'bouquet-pink': { alt: 'A lush pink and cream bouquet against a magenta backdrop', position: '50% 50%' },
  'peony-wild': { alt: 'A white peony among wildflowers and stones', position: '50% 50%' },
  'florals-dahlia': { alt: 'An autumn arrangement of dahlias, roses and berries in deep colour', position: '50% 50%' },
  'bouquet-bridal': { alt: 'A bridal bouquet of roses and astilbe held in front of a white dress', position: '50% 45%' },
  'bouquet-sweet': { alt: 'A soft bouquet of peach roses and green herbs on a pale ground', position: '50% 50%' },
  'bouquet-roses': { alt: 'A bridal bouquet of cream and peach roses resting on a table', position: '50% 50%' },
  'table-banquet': { alt: 'A round banquet table with pink napkins, glassware and fuchsia votives', position: '50% 50%' },
  'table-tulips': { alt: 'A long reception table with a centrepiece of coral and pink tulips', position: '50% 50%' },
  'table-white': { alt: 'A round table with a tall white floral centrepiece, candles and gold charger plates', position: '50% 45%' },
  'detail-bands': { alt: 'Two matte textured white-gold wedding bands side by side', position: '50% 50%' },
  'florals-lilac': { alt: 'A still life of white peonies and lilac in a basket', position: '50% 50%' },
  'island-sunset': { alt: 'Palm trees silhouetted on a tropical beach at sunset', position: '50% 55%' },
  'riad-arches': { alt: 'Carved plaster arches in a historic palace courtyard in Marrakech', position: '50% 50%' },
  'gallery-hall': { alt: 'A long, light-filled gallery hall with arched windows', position: '50% 50%' }
} satisfies Record<string, Entry>;

export type ImageKey = keyof typeof catalog;

const base = ((import.meta.env?.BASE_URL as string | undefined) || '/').replace(/\/?$/, '/');

/** Builds an ImageRef for a catalogue key. */
export function img(key: ImageKey, overrides: Partial<ImageRef> = {}): ImageRef {
  const entry = catalog[key] as Entry;
  const file = entry.file ?? key;
  return {
    src: `${base}images/${file}.webp`,
    small: `${base}images/${file}-sm.webp`,
    alt: entry.alt,
    position: entry.position,
    ...overrides
  };
}

export const imageKeys = Object.keys(catalog) as ImageKey[];
