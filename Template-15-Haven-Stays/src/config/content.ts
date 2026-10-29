import type { Article, Attraction } from './types';

const im = (n: string, alt: string) => ({ src: `/images/${n}.webp`, alt });

export const intro = {
  kicker: 'Welcome to Haven',
  title: 'A hillside of stone, olive and sea — arranged for slowing down',
  paragraphs: [
    'Haven Stays is a fictional boutique resort invented to demonstrate this website template. Imagine twenty-four rooms, suites and villas terraced into an olive grove above a private cove.',
    'Everything is designed around unhurried days: long breakfasts, a spa in the old press house, kitchen-garden dinners and a quiet stretch of shoreline for swimming.',
  ],
  stats: [
    { value: '24', label: 'rooms, suites & villas' },
    { value: '2', label: 'restaurants & a bar' },
    { value: '6', label: 'treatment rooms' },
    { value: '1', label: 'private cove' },
  ],
  images: [im('intro-arches', 'Illustration of arched windows facing cypress trees'), im('intro-courtyard', 'Illustration of a courtyard with a fountain'), im('intro-villa', 'Illustration of villas by the sea')],
};

export const wellness = {
  kicker: 'Wellness',
  title: 'The stone hammam & garden spa',
  text: 'Six treatment rooms, a thermal circuit, a heated pool and a daily programme of yoga and mobility — set in the old press house and its walled garden.',
  image: im('spa-hammam', 'Illustration of a candlelit hammam'),
  points: ['Thermal circuit and hammam', 'Massage, facials and body rituals', 'Sunrise yoga and breathwork'],
  cta: { label: 'Explore wellness experiences', to: '/experiences?category=Wellness' },
};

export const destination = {
  kicker: 'The coast',
  title: 'Cala Verana & beyond',
  text: 'Our fictional home sits between a working harbour village and a wild stretch of hills. These are demonstration places — replace them with your own destination.',
};

export const attractions: Attraction[] = [
  { slug: 'cala-verana-harbour', name: 'Cala Verana Harbour', type: 'Village', distance: '5 min by car', summary: 'A pastel harbour village with fishing boats, bakeries and a Thursday market.', image: im('dest-village', 'Illustration of a harbour village with red roofs') },
  { slug: 'verde-ridge', name: 'Verde Ridge Viewpoint', type: 'Hike', distance: '40 min walk', summary: 'An old mule track climbs to a lookout above the olive terraces.', image: im('dest-peak', 'Illustration of a mountain ridge') },
  { slug: 'silver-cove', name: 'Silver Cove', type: 'Beach', distance: '10 min by boat', summary: 'A pebble cove accessible by boat or kayak, with calm water for swimming.', image: im('dest-cove', 'Illustration of a calm cove') },
  { slug: 'old-town-market', name: 'Old Town Market', type: 'Market', distance: '15 min by car', summary: 'Farmers, cheesemakers and bakers sell from striped stalls every Thursday and Saturday.', image: im('dest-market', 'Illustration of a market with striped awnings') },
  { slug: 'hillside-terraces', name: 'Hillside Terraces', type: 'Walks', distance: 'On site', summary: 'Terraced olive groves linked by short paths and viewpoints.', image: im('dest-hills', 'Illustration of a hillside village at dusk') },
  { slug: 'lake-alma', name: 'Lake Alma', type: 'Lake', distance: '30 min by car', summary: 'A clear mountain lake for paddle boards and a cold swim.', image: im('dest-lake', 'Illustration of a lake beneath mountains') },
];

export const travelTips = [
  { title: 'Getting here', text: 'Fictional example: 45 minutes from the regional airport by private transfer. Arrange transfers with our concierge when you book.' },
  { title: 'Best time to visit', text: 'May–June and September–October are warm, quiet and green. July–August is the peak season; winters are mild with fewer services.' },
  { title: 'Getting around', text: 'The harbour is a short drive; we provide complimentary shuttle runs and can arrange a driver, bicycles or a boat.' },
  { title: 'What to pack', text: 'Light layers, walking shoes, swimwear and a sun hat. Evenings can be cool in spring and autumn.' },
];

export const articles: Article[] = [
  { slug: 'a-morning-in-the-kitchen-garden', title: 'A morning in the kitchen garden', category: 'Dining', date: '2026-03-18', readMinutes: 5, excerpt: 'Before breakfast, our head gardener walks the terraces choosing what will be on the plate by lunch.', image: im('journal-1', 'Illustration of plated dishes'), body: [
    'At six in the morning the terraces are still cool. The head gardener walks the rows with a basket, choosing the first tomatoes, the last of the spring greens and a handful of herbs for the day.',
    'This is a fictional article written for the template. It shows the editorial layout: a lead paragraph, flowing body copy and a calm reading width.',
    'Replace this with your own journal content in src/config/content.ts — titles, dates, images and paragraphs are plain data.' ] },
  { slug: 'a-perfect-day-in-cala-verana', title: 'A perfect day in Cala Verana', category: 'Destination', date: '2026-02-04', readMinutes: 6, excerpt: 'Market stalls, a swim at Silver Cove and a long lunch by the harbour: our concierge team shares a favourite day.', image: im('journal-2', 'Illustration of a harbour at dawn'), body: [
    'Begin at the harbour bakery for something warm, then walk along the quay as the fishing boats come in.',
    'By mid-morning, take the boat to Silver Cove for a swim. Lunch is best taken late, in the shade, with whatever the fisherman landed.',
    'This article is demonstration content for the Haven Stays template; the places are fictional.' ] },
  { slug: 'three-trails-above-the-valley', title: 'Three trails above the valley', category: 'Outdoors', date: '2026-01-21', readMinutes: 4, excerpt: 'From a gentle terrace amble to a full-day ridge walk, our guides choose three routes for every level.', image: im('journal-3', 'Illustration of a winding trail'), body: [
    'The terrace walk takes forty minutes and passes seven viewpoints. The ridge hike climbs 500 metres to a lookout.',
    'For the full-day option, our guides prepare a picnic and arrange a car for the return.',
    'Fictional content for template demonstration purposes.' ] },
  { slug: 'a-guide-to-the-hammam', title: 'A guide to the hammam ritual', category: 'Wellness', date: '2025-12-11', readMinutes: 5, excerpt: 'What to expect from a stone-heat ritual, how to prepare and why it pairs so well with a long afternoon.', image: im('journal-4', 'Illustration of a spa pool'), body: [
    'The hammam begins with warmth: the body relaxes before the scrub.',
    'Plan the ritual for the late afternoon; let the evening be slow.',
    'Fictional wellness content for the template.' ] },
  { slug: 'sunset-spots-on-the-coast', title: 'Five spots for the sunset', category: 'Destination', date: '2025-11-02', readMinutes: 3, excerpt: 'Our team’s short list of places to watch the day end — some with a drink, some with nothing but the view.', image: im('journal-5', 'Illustration of villas at dawn'), body: [
    'The terrace at Haven is the obvious choice, but there are quieter places along the coast.',
    'Bring a blanket, a bottle and someone to share it with.',
    'Fictional content for the template.' ] },
  { slug: 'designing-with-limestone-and-olive', title: 'Designing with limestone and olive', category: 'Design', date: '2025-09-15', readMinutes: 7, excerpt: 'How a palette of limewash, oak and olive wood shaped the architecture of Haven Stays.', image: im('journal-6', 'Illustration of leaf textures'), body: [
    'The architects chose a few honest materials: local limestone, oak, bronze and linen.',
    'Colours were taken directly from the hillside: olive, terracotta and the pale grey of dry stone.',
    'This is demonstration content; swap it for your own story.' ] },
];
