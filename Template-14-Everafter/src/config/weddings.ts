import { img, type ImageKey } from './images';
import type { WeddingProject } from './types';

/**
 * Fictional portfolio. Every couple, venue and story is invented for demonstration.
 * Photographs are illustrative stock images of real landscapes and places; they do not depict these (fictional) weddings.
 */
type Seed = Omit<WeddingProject, 'cover' | 'gallery'> & { images: ImageKey[] };

const seeds: Seed[] = [
  {
    slug: 'villa-serena-lake-como',
    title: 'Villa Serena',
    location: 'Lake Como, Italy',
    region: 'Italy',
    destinationSlug: 'lake-como',
    style: 'Romantic Garden',
    theme: 'Blush, ivory & lake-blue',
    eventType: 'Wedding',
    guests: 90,
    season: 'Late May',
    year: 2025,
    summary: 'A lakeside ceremony among clipped hedges, followed by a long candlelit dinner in a frescoed gallery.',
    story: [
      'Amara and Julien wanted a weekend that felt like a house party with extraordinary scenery. We borrowed the rhythm of an Italian summer: a lazy welcome lunch on the terrace, a ceremony as the afternoon light softened, and dinner that stretched until the lake turned silver.',
      'The floral palette stayed close to the garden itself — garden roses, sweet peas and trailing jasmine in antique bowls — so the house looked dressed, not decorated. Boats carried guests between villages, and a string quartet played from the loggia at dusk.'
    ],
    services: ['Full Wedding Planning', 'Destination Weddings', 'Floral & Event Design'],
    palette: ['#e9d3cf', '#fbf7f0', '#9db4c0'],
    highlights: ['Ceremony on the garden terrace', 'Boat transfers between villages', 'Dinner for 90 in a frescoed gallery'],
    images: ['como-gardens', 'como-villa', 'como-hall', 'detail-glasses']
  },
  {
    slug: 'tuscan-harvest-table',
    title: 'The Harvest Table',
    location: 'Chianti, Tuscany, Italy',
    region: 'Italy',
    destinationSlug: 'tuscany',
    style: 'Rustic Heritage',
    theme: 'Terracotta, olive & candlelight',
    eventType: 'Wedding',
    guests: 120,
    season: 'September',
    year: 2024,
    summary: 'A harvest-season wedding with one very long table set between the vines.',
    story: [
      'Priya and Daniel asked for a wedding that tasted of where it happened. We built the entire weekend around the harvest: grape-picking with family in the morning, a vineyard ceremony at five, and a single table, forty metres long, laid among the rows.',
      'Menus were written with a local cook, linen was washed and pressed on site, and the candles were lit by hand as the sun dropped behind the ridge. Nothing was staged; everything was simply made well.'
    ],
    services: ['Full Wedding Planning', 'Destination Weddings', 'Venue Styling'],
    palette: ['#b9694c', '#a3ad98', '#f4ecdf'],
    highlights: ['Forty-metre vineyard table', 'Morning grape-picking with guests', 'Menu written with a local cook'],
    images: ['tuscany-vineyard', 'tuscany-hills', 'tuscany-harvest', 'tuscany-road']
  },
  {
    slug: 'amalfi-terrace-vows',
    title: 'Terrace Above the Sea',
    location: 'Amalfi Coast, Italy',
    region: 'Italy',
    destinationSlug: 'amalfi-coast',
    style: 'Coastal Elegance',
    theme: 'Lemon, white & Mediterranean blue',
    eventType: 'Wedding',
    guests: 60,
    season: 'June',
    year: 2025,
    summary: 'Sixty guests, one cliffside terrace, and a seaside dinner under lemon trees.',
    story: [
      'Elena and Marcus kept their guest list short so every conversation could be a real one. The ceremony took place at golden hour, on a terrace that seems to hang above the water, with nothing between the couple and the horizon.',
      'We kept the styling quiet — white ranunculus, lemon branches, hand-dyed linen in sea tones — because the view was always going to be the headline. Dinner was served family-style, and the dancing moved down to the harbour at midnight.'
    ],
    services: ['Full Wedding Planning', 'Destination Weddings', 'Wedding Day Coordination'],
    palette: ['#f1e3a6', '#fbf7f0', '#7fa3b8'],
    highlights: ['Cliffside ceremony at golden hour', 'Family-style lemon-grove dinner', 'Midnight harbour dancing'],
    images: ['amalfi-town', 'amalfi-atrani', 'amalfi-coast', 'detail-rings']
  },
  {
    slug: 'lavender-and-linen-provence',
    title: 'Lavender & Linen',
    location: 'Provence, France',
    region: 'France',
    destinationSlug: 'provence',
    style: 'Bohemian Natural',
    theme: 'Lavender, sage & raw linen',
    eventType: 'Wedding',
    guests: 80,
    season: 'July',
    year: 2024,
    summary: 'A relaxed farmhouse wedding among lavender rows, with long tables and a fireside after-party.',
    story: [
      'For Clara and Théo the brief was simple: nothing precious. Guests arrived on Thursday and stayed until Sunday, and the days were stitched together by shared meals, a village market visit and a ceremony beneath an old plane tree.',
      'We worked entirely in linen, wild herbs and cut lavender, with arrangements gathered the same morning. When the evening cooled, the party moved to a fire pit with blankets and a very good record collection.'
    ],
    services: ['Full Wedding Planning', 'Destination Weddings', 'Floral & Event Design'],
    palette: ['#9c88b5', '#a3ad98', '#efe6d6'],
    highlights: ['Ceremony beneath a plane tree', 'Four-day house-party format', 'Same-morning foraged arrangements'],
    images: ['provence-lavender', 'provence-field', 'provence-sunset', 'provence-rows']
  },
  {
    slug: 'highland-hearth',
    title: 'Highland Hearth',
    location: 'Scottish Highlands, Scotland',
    region: 'Scotland',
    destinationSlug: 'scottish-highlands',
    style: 'Heritage Grandeur',
    theme: 'Tartan, heather & firelight',
    eventType: 'Wedding',
    guests: 70,
    season: 'October',
    year: 2024,
    summary: 'An autumn castle weekend of piping, peat fires and a ceilidh that lasted until dawn.',
    story: [
      'Isla and Fraser wanted tradition without stiffness. We leaned into the setting — stone, firelight and long dark evenings — and softened it with deep burgundy florals, candles in every window and a drinks reception in the library.',
      'A piper led the procession to the loch-side ceremony, and the ceilidh band had every generation on the floor by ten. A late-night bacon-roll counter kept the dancers going.'
    ],
    services: ['Full Wedding Planning', 'Destination Weddings', 'Venue Styling'],
    palette: ['#5e1f2e', '#7d8a6a', '#e8d9bf'],
    highlights: ['Loch-side ceremony with a piper', 'Library whisky reception', 'Ceilidh and late-night rolls'],
    images: ['highland-castle', 'highland-castle-2', 'highland-loch', 'detail-candle']
  },
  {
    slug: 'golden-hour-algarve',
    title: 'Golden Hour, Algarve',
    location: 'Algarve, Portugal',
    region: 'Portugal',
    destinationSlug: 'algarve',
    style: 'Coastal Elegance',
    theme: 'Sand, apricot & ocean',
    eventType: 'Wedding',
    guests: 100,
    season: 'May',
    year: 2025,
    summary: 'A clifftop ceremony above a golden cove, with a beach-level dinner as the tide came in.',
    story: [
      'Sofia and Rui grew up an hour from this coastline and wanted to bring friends from four countries to see it. The ceremony faced the sea; the reception was laid directly on the sand above the tide line, with lanterns hung from driftwood poles.',
      'We built the timeline around the light, and shared a printed tide table with the band so nobody was surprised by the water. Grilled fish, vinho verde and a sunrise swim closed the weekend.'
    ],
    services: ['Full Wedding Planning', 'Destination Weddings', 'Venue Styling'],
    palette: ['#e9c79b', '#fbf7f0', '#7a9eaa'],
    highlights: ['Cliff-top ceremony facing the sea', 'Tide-timed beach dinner', 'Sunrise swim brunch'],
    images: ['algarve-coast', 'algarve-cliffs', 'algarve-cove', 'algarve-rock']
  },
  {
    slug: 'seine-at-dusk',
    title: 'The Seine at Dusk',
    location: 'Paris, France',
    region: 'France',
    destinationSlug: 'paris',
    style: 'Modern Classic',
    theme: 'Black tie, gold & Parisian grey',
    eventType: 'Vow Renewal',
    guests: 45,
    season: 'April',
    year: 2025,
    summary: 'A twentieth-anniversary vow renewal: a river walk, a gilded ballroom and a very late supper.',
    story: [
      'After twenty years, Helena and Victor did not want a wedding — they wanted a night. We planned a walk along the river at sunset, the vow exchange in a gilded salon, and a six-course supper for forty-five close friends.',
      'The design was restrained: white tulips, black and gold place settings, and as many candles as the fire marshal would allow. A saxophonist played from the staircase as guests arrived.'
    ],
    services: ['Partial Planning', 'Private Celebrations', 'Floral & Event Design'],
    palette: ['#2a1f22', '#c9ae82', '#e5e1dd'],
    highlights: ['Twilight walk beside the river', 'Vows in a gilded salon', 'Six-course midnight supper'],
    images: ['paris-seine', 'paris-evening', 'ballroom-hall', 'ballroom-gold']
  },
  {
    slug: 'rice-terrace-vows-bali',
    title: 'Vows Among the Terraces',
    location: 'Ubud, Bali, Indonesia',
    region: 'Indonesia',
    destinationSlug: 'bali',
    style: 'Bohemian Natural',
    theme: 'Emerald, frangipani & woven rattan',
    eventType: 'Wedding',
    guests: 55,
    season: 'August',
    year: 2024,
    summary: 'A sunrise blessing and a hillside dinner among the rice terraces, shaped with local artisans.',
    story: [
      'Noor and Kai wanted their families to meet in a place that asked everyone to slow down. We worked with a local team to arrange a traditional blessing at dawn, followed by a quiet ceremony facing the terraces.',
      'Florals were woven from frangipani and orchids on the morning itself, and dinner was cooked over open flame. A small handcrafted palette — rattan, banana leaf, clay — kept the focus on the landscape.'
    ],
    services: ['Full Wedding Planning', 'Destination Weddings', 'Floral & Event Design'],
    palette: ['#4f6b47', '#f1e3c9', '#d6aaa4'],
    highlights: ['Dawn blessing', 'Open-flame hillside dinner', 'Locally made rattan and clay styling'],
    images: ['bali-terrace', 'bali-terrace-2', 'bali-fields', 'detail-dress']
  },
  {
    slug: 'alpine-lake-elopement',
    title: 'The Lake at Sunset',
    location: 'Engadin, Switzerland',
    region: 'Switzerland',
    destinationSlug: 'swiss-alps',
    style: 'Alpine Intimate',
    theme: 'Snow, pine & warm gold',
    eventType: 'Elopement',
    guests: 12,
    season: 'December',
    year: 2024,
    summary: 'Twelve guests, a frozen lake and a mountain-hut supper.',
    story: [
      'Mara and Ines decided early that they wanted almost no one — and everything done properly. The vows were exchanged at the edge of a frozen lake, with the sun dropping behind the peaks, and a hot-chocolate station kept the small group warm.',
      'We handled permissions, a photographer on skis, a rehearsal in the snow and a candlelit supper in a mountain hut with fondue and a violinist. The whole event ran for six hours, and nobody wore gloves in the photographs.'
    ],
    services: ['Wedding Day Coordination', 'Destination Weddings', 'Private Celebrations'],
    palette: ['#dfe6ea', '#a9835a', '#fbf7f0'],
    highlights: ['Lakeside vows at sunset', 'Hot chocolate and fur throws', 'Mountain-hut candlelit supper'],
    images: ['alps-sunset', 'alps-lake', 'alps-maloja', 'alps-reflection']
  },
  {
    slug: 'the-orangery-party',
    title: 'The Orangery',
    location: 'Norfolk, England',
    region: 'England',
    destinationSlug: 'english-countryside',
    style: 'Heritage Grandeur',
    theme: 'Magnolia, white & pale stone',
    eventType: 'Wedding',
    guests: 140,
    season: 'April',
    year: 2025,
    summary: 'A spring wedding in a classical orangery, with magnolia branches and a long garden lunch.',
    story: [
      'Eleanor and Wilf wanted the elegance of a grand house without the stiffness. We worked with the architecture — tall windows, pale stone, light that moves through the day — and added only what it needed: branches of magnolia, white tulips and a hundred beeswax candles.',
      'Guests were welcomed with lemonade in the walled garden, married in the orangery, and fed at long tables. The evening ended on the lawn with sparklers, a brass band and very good cheese.'
    ],
    services: ['Full Wedding Planning', 'Venue Styling', 'Floral & Event Design'],
    palette: ['#f6ede4', '#a3ad98', '#d6aaa4'],
    highlights: ['Magnolia-branch installation', 'Long garden lunch', 'Brass band and lawn sparklers'],
    images: ['orangery-exterior', 'orangery-blossom', 'conservatory-hall', 'conservatory-glass']
  },
  {
    slug: 'autumn-vineyard-weekend',
    title: 'Amber Vines',
    location: 'Willamette Valley, Oregon, USA',
    region: 'USA',
    destinationSlug: 'autumn-vineyards',
    style: 'Rustic Heritage',
    theme: 'Amber, plum & warm wood',
    eventType: 'Wedding',
    guests: 110,
    season: 'October',
    year: 2024,
    summary: 'A harvest-weekend wedding among turning vines, with a barrel-room dinner and bonfire.',
    story: [
      'Jess and Tom are both wine people, so we organised a weekend that guests would actually enjoy: a tasting with the winemaker, a ceremony in the rows as the leaves turned, and dinner in the barrel room with candles on every barrel head.',
      'Florals leaned into the season — dahlias, copper beech and dried grasses — and the weekend ended with a brunch bonfire and cider. Everything was made to feel generous rather than polished.'
    ],
    services: ['Full Wedding Planning', 'Venue Styling', 'Wedding Day Coordination'],
    palette: ['#c98a2b', '#5e1f2e', '#efe6d6'],
    highlights: ['Winemaker-led tasting', 'Ceremony in the vines', 'Barrel-room dinner'],
    images: ['vineyard-autumn', 'vineyard-rows', 'vineyard-gold', 'vineyard-estate']
  },
  {
    slug: 'rose-garden-rehearsal',
    title: 'The Rose Garden Supper',
    location: 'Portland, Oregon, USA',
    region: 'USA',
    destinationSlug: 'garden-estates',
    style: 'Romantic Garden',
    theme: 'Rose, cream & garden green',
    eventType: 'Rehearsal Dinner',
    guests: 40,
    season: 'June',
    year: 2025,
    summary: 'A rehearsal dinner in full bloom, with a rose-arch procession and a candlelit supper.',
    story: [
      'The night before a large wedding deserves its own personality. For Camille and Jonah we set a long table beneath a rose arch, strung lights along the pergola and served a supper of seasonal dishes with toasts between courses.',
      'The guest list was just forty, which allowed the evening to be properly personal — handwritten place cards, a cheese course, and a surprise slideshow from the couple’s oldest friends.'
    ],
    services: ['Partial Planning', 'Venue Styling', 'Private Celebrations'],
    palette: ['#cf8f93', '#a3ad98', '#fbf7f0'],
    highlights: ['Rose-arch procession', 'Handwritten place cards', 'Cheese course and toasts'],
    images: ['rose-arch', 'rose-path', 'rose-gazebo', 'rose-fete']
  },
  {
    slug: 'old-town-celebration-dubrovnik',
    title: 'Stone & Sea',
    location: 'Dubrovnik, Croatia',
    region: 'Croatia',
    destinationSlug: 'dubrovnik',
    style: 'Modern Classic',
    theme: 'Stone, terracotta & deep sea blue',
    eventType: 'Private Celebration',
    guests: 75,
    season: 'September',
    year: 2024,
    summary: 'A fortieth-birthday weekend within sight of the walls, with a harbour supper and a boat party.',
    story: [
      'Our client wanted a weekend for the people who had shaped her life — and no schedule that would feel like a schedule. We organised a walking tour of the old town, a rooftop supper and a boat party along the coast.',
      'The styling was kept minimal: stone-coloured linen, olive branches and candlelight, with the city doing the rest. Guests were housed in three small hotels and moved between them by private launch.'
    ],
    services: ['Private Celebrations', 'Destination Weddings', 'Venue Styling'],
    palette: ['#c9744a', '#3d6a80', '#f2ebdf'],
    highlights: ['Old-town walking tour', 'Rooftop supper above the harbour', 'Coastal boat party'],
    images: ['dubrovnik-harbour', 'dubrovnik-roofs', 'dubrovnik-walls', 'detail-champagne']
  }
];

export const weddings: WeddingProject[] = seeds.map(({ images, ...rest }) => ({
  ...rest,
  cover: img(images[0]),
  gallery: images.map((k) => img(k))
}));

export const weddingFilterOrder = {
  region: ['Italy', 'France', 'Scotland', 'Portugal', 'Indonesia', 'Switzerland', 'England', 'USA', 'Croatia'],
  style: ['Romantic Garden', 'Rustic Heritage', 'Coastal Elegance', 'Bohemian Natural', 'Heritage Grandeur', 'Modern Classic', 'Alpine Intimate'],
  eventType: ['Wedding', 'Elopement', 'Vow Renewal', 'Rehearsal Dinner', 'Private Celebration']
};
