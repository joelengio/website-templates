import type { Award, Chef, Testimonial } from './types';

export const storyContent = {
  eyebrow: 'Our story',
  title: 'A restaurant built around one long table',
  lead: 'Saffron Table is a fictional restaurant. Everything on this page is demonstration content you can rewrite for your own venue.',
  origin: {
    title: 'How it began',
    paragraphs: [
      'Saffron Table began in 2016 as a supper club in a rented loft: one long table, a borrowed grill and a bag of saffron brought home from a trip. Twelve guests became thirty, and the loft became a restaurant.',
      'The name is a promise. Saffron is expensive, delicate and generous in tiny amounts, which is how we like to cook: restraint first, then warmth.',
    ],
    image: 'long-tables',
  },
  philosophy: {
    title: 'Culinary philosophy',
    items: [
      { title: 'Cook over fire', text: 'Embers, copper and cast iron give the menu its depth, and keep the cooking honest.' },
      { title: 'Spice as seasoning', text: 'Persian, Levantine and Mediterranean spice used with restraint to lift the season.' },
      { title: 'Short supply chains', text: 'Fourteen named producers supply most of what reaches the pass. Demo figures; replace with yours.' },
      { title: 'Unhurried service', text: 'We time the evening to your table, not ours.' },
    ],
  },
  atmosphere: {
    title: 'The room',
    text: 'Dark timber, warm copper and low light, with a green banquette along one wall and an open kitchen along another. The room is designed to be loud enough to feel alive and quiet enough to talk.',
    images: ['dining-green', 'open-kitchen', 'dining-dark'],
  },
  approach: {
    title: 'Our approach',
    items: [
      'A menu that changes with the market, often mid-service.',
      'A short wine list that favours small producers.',
      'Dietary needs handled seriously. We ask, we listen, and we never guess.',
      'A team that is trained to answer questions about every plate.',
    ],
  },
};

export const chefs: Chef[] = [
  {
    id: 'elias-marrow',
    name: 'Elias Marrow',
    role: 'Executive Chef & Founder',
    image: 'chef-portrait',
    bio: 'Trained in London and Beirut, Elias founded Saffron Table after a decade cooking over fire. He writes the menus, runs the pass and still makes the saffron bread himself. (Fictional demonstration chef.)',
    signature: 'Ember-glazed short rib',
  },
  {
    id: 'mateo-reyes',
    name: 'Mateo Reyes',
    role: 'Chef de Cuisine',
    image: 'chef-plating',
    bio: 'Mateo leads the daily kitchen and the seafood section. He built the paella cooked to order on the terrace grill. (Fictional demonstration chef.)',
    signature: 'Saffron seafood paella',
  },
  {
    id: 'noor-haddad',
    name: 'Noor Haddad',
    role: 'Head Pastry Chef',
    bio: 'Noor’s desserts are warm, dark and a little salty. She also writes the journal’s dessert column. (Fictional demonstration chef.)',
    signature: 'Dark chocolate ganache cake',
  },
  {
    id: 'lucia-ferrante',
    name: 'Lucia Ferrante',
    role: 'Head Sommelier',
    bio: 'Lucia keeps the wine list short and personal, favouring small producers and bottles that taste of where they come from. (Fictional demonstration team member.)',
    signature: 'The cellar pairing',
  },
];

export const team = [
  { name: 'Daniel Okafor', role: 'General Manager' },
  { name: 'Priya Natarajan', role: 'Front of House Lead' },
  { name: 'Tomás Beltrán', role: 'Sous Chef' },
  { name: 'Hana Sato', role: 'Events Manager' },
];

export const testimonials: Testimonial[] = [
  { quote: 'The saffron salmon was the best plate I ate all year, and the room made a rainy Tuesday feel like a celebration.', author: 'Demo guest — A. Rowan', context: 'Fictional testimonial' },
  { quote: 'They handled our group of fourteen without a hiccup. The mixed grill disappeared in minutes.', author: 'Demo guest — M. Castellanos', context: 'Fictional testimonial' },
  { quote: 'Warm, unhurried and precise. The tasting menu paced itself perfectly.', author: 'Demo guest — J. Whitfield', context: 'Fictional testimonial' },
];

export const awards: Award[] = [
  { title: 'Golden Spoon Award, Best New Restaurant', issuer: 'Fictional Demo Dining Guide', year: '2024' },
  { title: 'Two Copper Pots', issuer: 'Imaginary Restaurant Review', year: '2025' },
  { title: 'Wine List of the Year (short list)', issuer: 'Demonstration Cellar Society', year: '2025' },
];

export const contactContent = {
  eyebrow: 'Contact',
  title: 'Find us, call us, write to us',
  lead: 'Demonstration details for a fictional restaurant. Replace with your own in src/config/site.ts.',
  topics: ['General question', 'Reservation question', 'Feedback', 'Press & partnerships', 'Gift vouchers'],
};
