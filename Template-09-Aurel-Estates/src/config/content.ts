import { images } from './images';
import type { Article } from './types';

/**
 * PAGE CONTENT — all copy for Home, About, Services, Contact and Journal.
 * Edit text here; section order/visibility lives in layout.ts.
 */
export const home = {
  hero: {
    eyebrow: 'Aurel Estates · Northhaven',
    title: 'Homes with a sense of place.',
    lead: 'A small, considered collection of houses, villas and cottages — presented with honest detail and unhurried advice.',
    image: images['cedar-ridge-exterior'],
    primaryCta: { label: 'View all properties', to: '/properties' },
    secondaryCta: { label: 'Arrange a private viewing', to: '/contact' },
  },
  featured: {
    eyebrow: 'Featured',
    title: 'Selected residences',
    lead: 'A hand-picked edit of the homes we are most proud to represent right now.',
    count: 6,
    linkLabel: 'See every property',
  },
  neighborhoods: {
    eyebrow: 'Neighborhoods',
    title: 'Find your corner of Northhaven',
    lead: 'From the shingled coast of Saltmarsh Bay to the quiet lanes of Oakhaven — start with where you want to wake up.',
    items: [
      { name: 'Saltmarsh Bay', blurb: 'Whitewashed villas and long evening light over the tidal flats.', image: images['terrace-villa-pool'] },
      { name: 'Fernhill', blurb: 'Leafy ridgeline streets, architect-designed houses and forest trails.', image: images['cedar-ridge-exterior'] },
      { name: 'Oakhaven', blurb: 'A village green, craftsman porches and generous family gardens.', image: images['hawthorne-porch-house'] },
      { name: 'Marlow Heights', blurb: 'Contemporary landmarks with wide views and pool terraces.', image: images['pavilion-pool-villa'] },
    ],
  },
  approach: {
    eyebrow: 'Our approach',
    title: 'Fewer listings. Better conversations.',
    body: [
      'We take on only a handful of homes each season, so every property receives proper photography, honest measurements and a story worth telling.',
      'Our advisors are paid to listen first. Whether you are buying, selling or simply curious, you will always speak with a person who knows the house and the street.',
    ],
    image: images['timber-living-room'],
    points: ['Honest, measured floor plans', 'One dedicated advisor per client', 'Clear, plain-English guidance'],
  },
  services: {
    eyebrow: 'Services',
    title: 'Guidance at every step',
    linkLabel: 'All services',
  },
  stats: {
    note: 'Demo figures for illustration only.',
    items: [
      { value: '15', label: 'Demo listings' },
      { value: '4', label: 'Neighborhoods' },
      { value: '2009', label: 'Fictional founding year' },
      { value: '12', label: 'Filterable features' },
    ],
  },
  journal: {
    eyebrow: 'Journal',
    title: 'Notes on buying, selling and living well',
    linkLabel: 'Read the journal',
    count: 3,
  },
  cta: {
    title: 'Let’s find the right house.',
    body: 'Tell us what matters most — light, land, location — and an advisor will curate a shortlist.',
  },
};

export const about = {
  intro: {
    eyebrow: 'About Aurel',
    title: 'A boutique agency built on attention.',
    body: [
      'Aurel Estates is a fictional agency we invented to show what a premium real estate website can feel like. In this story, the founders left larger firms to build something smaller and more careful.',
      'The idea is simple: represent fewer homes, know them deeply, and give every client the time they deserve.',
    ],
    image: images['cedar-ridge-garden'],
  },
  values: {
    title: 'What we value',
    items: [
      { title: 'Candour', body: 'We say what a home does well — and where it asks for work.' },
      { title: 'Craft', body: 'Photography, floor plans and copy are made with the same care as the houses.' },
      { title: 'Continuity', body: 'One advisor from first conversation to handing over the keys.' },
      { title: 'Community', body: 'We invest in the neighborhoods we sell, and recommend local makers.' },
    ],
  },
  team: {
    title: 'The team',
    lead: 'Fictional people, shown with initials rather than portraits.',
    members: [
      { name: 'Eleanor Voss', role: 'Founding Partner', bio: 'Twenty years of experience with architectural homes and a quiet obsession with natural light.' },
      { name: 'Marcus Adeyemi', role: 'Head of Sales', bio: 'Guides buyers through negotiations with patience and clear numbers.' },
      { name: 'Priya Raman', role: 'Property Advisor, Coast', bio: 'Specialist in waterfront villas and cottages around Saltmarsh Bay.' },
      { name: 'Tomás Lindqvist', role: 'Property Advisor, Hills', bio: 'Knows every ridge road, planning rule and hidden garden in Fernhill.' },
    ],
  },
  cta: { title: 'Meet the team in person.', body: 'We love a coffee and a conversation — no obligation.' },
};

export const services = {
  intro: {
    eyebrow: 'Services',
    title: 'Everything around the front door.',
    body: 'Whether you are buying your first cottage or selling a family villa, our services are designed to remove friction and add clarity.',
  },
  list: [
    { title: 'Buying advisory', body: 'Shortlists, private viewings, offer strategy and negotiation by an advisor who works for you.', icon: 'key' },
    { title: 'Selling & valuation', body: 'Honest valuations, editorial photography and a tailored launch plan for your home.', icon: 'tag' },
    { title: 'Off-market access', body: 'Early sight of homes before they are publicly listed, shared with registered clients first.', icon: 'lock' },
    { title: 'Relocation support', body: 'Neighborhood tours, school information and introductions to trusted local professionals.', icon: 'compass' },
    { title: 'Property styling', body: 'Light-touch staging that shows how a home lives, with no clutter.', icon: 'sofa' },
    { title: 'Investment guidance', body: 'Yield, running costs and long-term outlook explained in plain language.', icon: 'chart' },
  ],
  process: {
    title: 'How we work',
    steps: [
      { title: 'Conversation', body: 'We learn what you need and what you love.' },
      { title: 'Curation', body: 'A focused shortlist, never a data dump.' },
      { title: 'Viewings', body: 'Unhurried, private and fully briefed.' },
      { title: 'Completion', body: 'We coordinate the details until you have the keys.' },
    ],
  },
  faq: {
    title: 'Common questions',
    items: [
      { q: 'Are the properties on this site real?', a: 'No. This is a template demonstration. All properties, prices and people are fictional.' },
      { q: 'How do I send an inquiry?', a: 'Use the inquiry form on any property page or the contact page. In the demo, forms only validate input; a reseller connects a real endpoint during setup.' },
      { q: 'Can I compare homes side by side?', a: 'Yes — tick “Compare” on up to three properties, then open the comparison table.' },
      { q: 'Are my saved homes stored online?', a: 'Saved homes are stored only in your browser’s local storage on this device.' },
    ],
  },
  cta: { title: 'Ready to begin?', body: 'A short conversation is the best first step.' },
};

export const contact = {
  title: 'Speak with an advisor',
  lead: 'Ask about a property, request a valuation or arrange a viewing.',
  topics: [
    { value: 'viewing', label: 'Arrange a viewing' },
    { value: 'info', label: 'Property information' },
    { value: 'valuation', label: 'Valuation request' },
    { value: 'other', label: 'Something else' },
  ],
};

export const listingsPage = {
  title: 'Properties',
  lead: 'Search, filter and compare our fictional demo portfolio.',
};

export const articles: Article[] = [
  {
    slug: 'how-to-read-a-floor-plan',
    title: 'How to read a floor plan like an architect',
    excerpt: 'Five quick checks that reveal how a house will really live.',
    category: 'Buying guide',
    date: '2025-09-20',
    readMinutes: 5,
    image: images['herringbone-living'],
    body: [
      'A floor plan is the most honest document in a listing. It shows proportion, circulation and light long before you step inside.',
      'Start with the route from the front door: where do you put your coat, your shopping, your muddy boots? Homes that handle these small moments well tend to feel effortless.',
      'Next, trace the sun. Note which rooms face south and west, and imagine them at breakfast and at dusk. Kitchens love morning light; living rooms often prefer the afternoon.',
      'Look for rooms that can change purpose. A study beside a bathroom can become a guest suite; a loft can become a studio.',
      'Finally, count the walls. More openings mean more flexibility, but fewer places for furniture. The best plans balance both.',
    ],
  },
  {
    slug: 'preparing-your-home-for-sale',
    title: 'Preparing your home for sale: a calm checklist',
    excerpt: 'Light, repairs and storytelling — what really matters before photography day.',
    category: 'Selling guide',
    date: '2025-08-28',
    readMinutes: 6,
    image: images['white-kitchen'],
    body: [
      'Buyers respond to homes that feel cared for. You do not need a renovation — you need clarity.',
      'Begin with repairs: dripping taps, sticking doors and chipped paint are small things that create doubt.',
      'Then clear surfaces. Fewer objects make rooms feel larger and let architecture speak.',
      'Open curtains, replace tired bulbs and add one or two plants. Natural light is the cheapest upgrade there is.',
      'Finally, gather the paperwork: warranties, service records and utility costs. A well-organised file signals a well-kept house.',
    ],
  },
  {
    slug: 'coastal-vs-hills',
    title: 'Coast or hills? Choosing your Northhaven neighborhood',
    excerpt: 'A fictional field guide to four very different places to live.',
    category: 'Neighborhoods',
    date: '2025-08-10',
    readMinutes: 4,
    image: images['terrace-villa-pool'],
    body: [
      'Saltmarsh Bay is for people who want to see the weather arrive. Expect sea light, salt air and homes that open to terraces.',
      'Fernhill rewards walkers. Streets curve with the ridge, gardens are generous and the forest is moments away.',
      'Oakhaven has the village green, the bakery and neighbors who know your name. It is a community first and a postcode second.',
      'Marlow Heights is architecture-forward, with newer houses taking full advantage of its views.',
    ],
  },
  {
    slug: 'sustainable-upgrades-that-pay-off',
    title: 'Sustainable upgrades that genuinely pay off',
    excerpt: 'Insulation, heat pumps and solar — in the order that makes sense.',
    category: 'Living well',
    date: '2025-07-15',
    readMinutes: 7,
    image: images['ironwood-exterior'],
    body: [
      'Start with the envelope. Draught-proofing and insulation reduce demand before you spend on generation.',
      'Next, consider heating. A well-sized heat pump can dramatically reduce running costs in a well-insulated home.',
      'Solar panels make the most sense on south-facing roofs with unshaded exposure. Battery storage is a bonus rather than a necessity.',
      'Always check local regulations and consult qualified installers; the details of every home differ. This article is general information, not professional advice.',
    ],
  },
  {
    slug: 'first-viewing-questions',
    title: 'Twelve questions to ask at a first viewing',
    excerpt: 'Go beyond the obvious and learn how a house has really been lived in.',
    category: 'Buying guide',
    date: '2025-06-22',
    readMinutes: 4,
    image: images['sunlit-dining-living'],
    body: [
      'Ask why the owners are moving, and what they will miss most.',
      'Ask about the neighbors, the traffic at rush hour and the noise at night.',
      'Ask what has been updated and when — roof, boiler, wiring, windows.',
      'Ask for energy costs across a full year, not just the summer.',
      'Finally, ask yourself: could I picture a Tuesday evening here? If you can, you are probably in the right place.',
    ],
  },
  {
    slug: 'styling-with-natural-materials',
    title: 'Styling with natural materials',
    excerpt: 'Timber, linen and stone: the quiet palette behind our favorite interiors.',
    category: 'Living well',
    date: '2025-05-30',
    readMinutes: 3,
    image: images['plant-filled-living'],
    body: [
      'Natural materials age gracefully. A timber table gains character with each ring and scratch; linen softens with every wash.',
      'Keep your palette narrow — two woods at most — and let texture provide variety.',
      'Bring the outdoors in with plants of varied scale, and leave windows uncovered when privacy allows.',
    ],
  },
];
