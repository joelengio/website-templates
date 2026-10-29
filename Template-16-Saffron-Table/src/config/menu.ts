import type { AllergenLabel, DietaryLabel, FeaturedMenuSection, MenuCategory, MenuItem } from './types';

export const currency = { code: 'USD', locale: 'en-US' };

/** Shown above the menu and in the order builder. Edit freely; keep the confirm-with-restaurant instruction. */
export const allergyWarning = {
  title: 'Allergies & dietary needs',
  text: 'Dietary indicators and allergen lists on this demo menu are illustrative and may be incomplete. Our kitchen handles nuts, gluten, dairy, shellfish, sesame and other allergens, and cross-contact can occur. Please confirm ingredients and preparation with the restaurant before ordering. Nothing here is a guarantee that a dish is free from any allergen.',
};

export const dietaryLabels: DietaryLabel[] = [
  { id: 'vegetarian', label: 'Vegetarian', short: 'V', description: 'Made without meat or fish.', filterable: true },
  { id: 'vegan', label: 'Vegan', short: 'VG', description: 'Made without animal products as listed.', filterable: true },
  { id: 'gluten-free', label: 'Gluten-free ingredients', short: 'GF', description: 'No gluten-containing ingredients in the recipe. Cross-contact is possible.', filterable: true },
  { id: 'dairy-free', label: 'Dairy-free ingredients', short: 'DF', description: 'No dairy ingredients in the recipe. Cross-contact is possible.', filterable: true },
  { id: 'nut-free', label: 'Nut-free ingredients', short: 'NF', description: 'No nuts or peanuts in the recipe. Cross-contact is possible.', filterable: true },
];

export const allergenLabels: AllergenLabel[] = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'egg', label: 'Egg' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'nuts', label: 'Tree nuts' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'soy', label: 'Soy' },
  { id: 'sesame', label: 'Sesame' },
  { id: 'celery', label: 'Celery' },
  { id: 'sulphites', label: 'Sulphites' },
];

export const menuCategories: MenuCategory[] = [
  { id: 'starters', label: 'Starters', intro: 'Small, bright plates to begin the evening.' },
  { id: 'mains', label: 'Main Courses', intro: 'Cooked over embers and finished in copper.' },
  { id: 'seafood', label: 'Seafood', intro: 'Line-caught, shell-on and gently spiced.' },
  { id: 'vegetarian', label: 'Vegetarian', intro: 'Vegetable-led dishes, never an afterthought.' },
  { id: 'desserts', label: 'Desserts', intro: 'Warm, dark and a little salty.' },
  { id: 'beverages', label: 'Beverages', intro: 'Cocktails, spirits, coffee and tea.' },
  { id: 'specials', label: 'Chef Specials', intro: 'Limited dishes that change with the market.' },
  { id: 'tasting', label: 'Tasting Menus', intro: 'The whole table, one pace, one story.' },
];

export const menuItems: MenuItem[] = [
  // Starters
  { id: 'whipped-feta-fennel', name: 'Shaved Fennel & Whipped Feta', description: 'Raw fennel, red onion, whipped sheep’s feta, lemon oil and za’atar.', price: 16, category: 'starters', image: 'dark-salad', dietary: ['vegetarian', 'gluten-free', 'nut-free'], allergens: ['dairy', 'sesame'], available: true },
  { id: 'soft-egg-sourdough', name: 'Soft Egg on Charred Sourdough', description: 'Slow egg, smashed avocado, pea shoots and chilli oil on grilled sourdough.', price: 15, category: 'starters', image: 'egg-toast', dietary: ['vegetarian', 'nut-free'], allergens: ['gluten', 'egg'], available: true, spicy: true },
  { id: 'seared-tuna-tomato', name: 'Seared Tuna, Rocket & Heritage Tomato', description: 'Lightly seared tuna, soft egg, rocket and sweet tomato with a preserved-lemon dressing.', price: 19, category: 'starters', image: 'tuna-salad', dietary: ['gluten-free', 'dairy-free', 'nut-free'], allergens: ['fish', 'egg', 'sulphites'], available: true },
  { id: 'lamb-kofta', name: 'Lamb Kofta, Pomegranate Yoghurt', description: 'Charcoal-grilled lamb kofta on rocket with pomegranate yoghurt and toasted sesame.', price: 18, category: 'starters', image: 'meatballs', dietary: ['gluten-free', 'nut-free'], allergens: ['dairy', 'sesame'], available: true },
  { id: 'saffron-carrot-soup', name: 'Roasted Carrot & Saffron Soup', description: 'Ember-roasted carrot, saffron cream and toasted cumin.', price: 13, category: 'starters', dietary: ['vegetarian', 'gluten-free', 'nut-free'], allergens: ['dairy', 'celery'], available: true },

  // Main courses
  { id: 'roast-pork-chop', name: 'Roasted Heritage Pork Chop', description: 'Thick-cut chop, crushed potatoes, charred broccoli and a sage-butter jus.', price: 34, category: 'mains', image: 'pork-chop', dietary: ['gluten-free', 'nut-free'], allergens: ['dairy', 'sulphites'], available: true },
  { id: 'ember-short-rib', name: 'Ember-Glazed Short Rib', description: 'Twelve-hour short rib glazed with saffron and honey, charred tomato and pickled shallot.', price: 38, category: 'mains', image: 'ribs-board', dietary: ['dairy-free', 'nut-free'], allergens: ['soy', 'celery', 'sulphites'], available: true, featured: true },
  { id: 'aged-sirloin', name: 'Dry-Aged Sirloin & Hand-Cut Fries', description: 'Thirty-day dry-aged sirloin, peppercorn butter and crisp fries.', price: 46, category: 'mains', image: 'steak-fries', dietary: ['gluten-free', 'nut-free'], allergens: ['dairy'], available: true },
  { id: 'charcoal-mixed-grill', name: 'Charcoal Mixed Grill', description: 'Lamb, chicken thigh and spiced sausage with roasted vegetables, toum and chilli sauce.', price: 92, priceNote: 'for two', category: 'mains', image: 'grill-platter', dietary: ['nut-free'], allergens: ['egg', 'sesame', 'gluten'], available: true, spicy: true },
  { id: 'pappardelle-ragu', name: 'Hand-Rolled Pappardelle, Slow Ragù', description: 'Egg pappardelle, slow-cooked beef and pork ragù, aged pecorino.', price: 29, category: 'mains', image: 'pasta-table', dietary: ['nut-free'], allergens: ['gluten', 'egg', 'dairy', 'celery', 'sulphites'], available: true },
  { id: 'duck-plum', name: 'Roasted Duck Breast, Spiced Plum', description: 'Dry-aged duck breast, spiced plum, braised red cabbage and a bay jus.', price: 41, category: 'mains', dietary: ['gluten-free', 'dairy-free', 'nut-free'], allergens: ['sulphites', 'celery'], available: true },

  // Seafood
  { id: 'saffron-salmon', name: 'Saffron Salmon, Lemon & Coconut', description: 'Pan-roasted salmon in a golden saffron-coconut sauce with preserved lemon.', price: 34, category: 'seafood', image: 'salmon-curry', dietary: ['gluten-free', 'dairy-free', 'nut-free'], allergens: ['fish'], available: true, featured: true },
  { id: 'citrus-salmon', name: 'Pan-Roasted Salmon, Citrus Salsa', description: 'Crisp-skinned salmon, blood-orange salsa and beurre blanc.', price: 36, category: 'seafood', image: 'salmon-salsa', dietary: ['gluten-free', 'nut-free'], allergens: ['fish', 'dairy', 'sulphites'], available: true },
  { id: 'saffron-seafood-paella', name: 'Saffron Seafood Paella', description: 'Bomba rice, mussels, prawns and white fish cooked over embers with saffron and lemon. Cooked to order, allow 30 minutes.', price: 42, category: 'seafood', image: 'paella', dietary: ['gluten-free', 'dairy-free', 'nut-free'], allergens: ['shellfish', 'fish', 'celery'], available: true, featured: true },
  { id: 'miso-salmon', name: 'Miso-Glazed Salmon, Wilted Greens', description: 'White-miso glazed salmon, wilted greens and toasted sesame.', price: 35, category: 'seafood', image: 'salmon-dark', dietary: ['dairy-free', 'nut-free'], allergens: ['fish', 'soy', 'sesame'], available: true },
  { id: 'chilli-prawn-spaghetti', name: 'Chilli Prawn Spaghetti', description: 'Spaghetti, king prawns, cherry tomato, garlic and Aleppo chilli.', price: 33, category: 'seafood', image: 'prawn-spaghetti', dietary: ['dairy-free', 'nut-free'], allergens: ['gluten', 'shellfish', 'sulphites'], available: true, spicy: true },
  { id: 'prawn-saffron-stew', name: 'Prawn & Saffron Stew', description: 'Tiger prawns in a saffron-tomato broth with herbed rice.', price: 37, category: 'seafood', image: 'seafood-stew', dietary: ['gluten-free', 'dairy-free', 'nut-free'], allergens: ['shellfish', 'fish', 'celery'], available: true },

  // Vegetarian
  { id: 'cauliflower-chickpea-bowl', name: 'Charred Cauliflower & Chickpea Bowl', description: 'Ember-roasted cauliflower, spiced chickpeas, avocado, pickled radish and tahini.', price: 24, category: 'vegetarian', image: 'buddha-bowl', dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'], allergens: ['sesame'], available: true },
  { id: 'pomegranate-avocado', name: 'Avocado, Pomegranate & Winter Leaves', description: 'Ripe avocado, bitter leaves, pomegranate and citrus dressing.', price: 17, category: 'vegetarian', image: 'pomegranate-salad', dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'], allergens: [], available: true },
  { id: 'heritage-grains', name: 'Heritage Grains & Roasted Tomato', description: 'Warm farro, roasted tomato, green beans, herb oil and toasted seeds.', price: 23, category: 'vegetarian', image: 'grain-plate', dietary: ['vegetarian', 'vegan', 'dairy-free', 'nut-free'], allergens: ['gluten', 'sesame'], available: true },
  { id: 'burnt-butter-farfalle', name: 'Farfalle, Burnt Butter & Garden Herbs', description: 'Fresh farfalle, brown butter, tomato, basil and aged cheese.', price: 25, category: 'vegetarian', image: 'farfalle', dietary: ['vegetarian', 'nut-free'], allergens: ['gluten', 'egg', 'dairy'], available: true },
  { id: 'mushroom-risotto', name: 'Wild Mushroom Risotto', description: 'Carnaroli rice, wild mushrooms, thyme and aged parmesan.', price: 28, category: 'vegetarian', dietary: ['vegetarian', 'gluten-free', 'nut-free'], allergens: ['dairy', 'sulphites', 'celery'], available: true },

  // Desserts
  { id: 'chocolate-ganache-cake', name: 'Dark Chocolate Ganache Cake', description: 'Dense chocolate cake, ganache, cream rosettes and sea salt.', price: 14, category: 'desserts', image: 'chocolate-cake', dietary: ['vegetarian'], allergens: ['gluten', 'dairy', 'egg', 'nuts'], available: true, featured: true },
  { id: 'raspberry-layer-cake', name: 'Raspberry & Vanilla Layer Cake', description: 'Vanilla sponge, raspberry curd and whipped mascarpone.', price: 13, category: 'desserts', image: 'raspberry-cake', dietary: ['vegetarian', 'nut-free'], allergens: ['gluten', 'dairy', 'egg'], available: true },
  { id: 'fruit-tartlets', name: 'Seasonal Fruit Tartlets', description: 'Almond-free pastry, vanilla cream and the best fruit of the week.', price: 13, category: 'desserts', image: 'tarts', dietary: ['vegetarian', 'nut-free'], allergens: ['gluten', 'dairy', 'egg'], available: true },
  { id: 'saffron-sundae', name: 'Saffron Table Sundae', description: 'Saffron ice cream, chocolate sauce, biscuit crumb and whipped cream.', price: 12, category: 'desserts', image: 'sundae', dietary: ['vegetarian', 'nut-free'], allergens: ['gluten', 'dairy', 'egg'], available: true },
  { id: 'warm-brownie', name: 'Warm Chocolate Brownie', description: 'Warm fudgy brownie, salted caramel and crème fraîche.', price: 12, category: 'desserts', image: 'brownie', dietary: ['vegetarian'], allergens: ['gluten', 'dairy', 'egg', 'nuts'], available: true },

  // Beverages
  { id: 'saffron-old-fashioned', name: 'Saffron Old Fashioned', description: 'Bourbon, saffron syrup, orange bitters and an orange peel. Contains alcohol.', price: 17, category: 'beverages', image: 'cocktail', dietary: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], allergens: ['sulphites'], available: true },
  { id: 'single-malt', name: 'Single Malt, Neat or Over Ice', description: 'Ask your server for today’s pours. Contains alcohol.', price: 19, category: 'beverages', image: 'whisky', dietary: ['vegan', 'dairy-free', 'nut-free'], allergens: ['sulphites'], available: true },
  { id: 'pour-over-coffee', name: 'Pour-Over Coffee', description: 'Single-origin filter coffee, brewed to order.', price: 6, category: 'beverages', image: 'coffee-pour', dietary: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], allergens: [], available: true },
  { id: 'espresso', name: 'Espresso', description: 'Rich, dark espresso. Make it a double for one dollar more.', price: 4.5, category: 'beverages', image: 'espresso', dietary: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], allergens: [], available: true },
  { id: 'cardamom-mint-tea', name: 'Fresh Mint & Cardamom Tea', description: 'Fresh mint and crushed cardamom, served in a pot.', price: 6, category: 'beverages', dietary: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], allergens: [], available: true },
  { id: 'saffron-lemonade', name: 'Sparkling Saffron Lemonade', description: 'House lemonade, saffron and sparkling water. Alcohol-free.', price: 7, category: 'beverages', dietary: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], allergens: [], available: true },

  // Chef specials
  { id: 'saffron-brioche-pancakes', name: 'Saffron Brioche Pancakes', description: 'Stacked pancakes, saffron honey, banana and toasted seeds.', price: 21, category: 'specials', image: 'pancakes', dietary: ['vegetarian', 'nut-free'], allergens: ['gluten', 'dairy', 'egg', 'sesame'], available: true, availabilityNote: 'Sunday lunch only' },
  { id: 'truffle-egg-brioche', name: 'Truffle Egg on Toasted Brioche', description: 'Fried egg, avocado and shaved truffle on toasted brioche.', price: 21, category: 'specials', image: 'egg-toast-two', dietary: ['vegetarian', 'nut-free'], allergens: ['gluten', 'dairy', 'egg'], available: true },
  { id: 'weekend-brunch-table', name: 'Weekend Brunch Table', description: 'A shared spread of pancakes, eggs, salads and pastry for the whole table.', price: 38, priceNote: 'per person', category: 'specials', image: 'brunch-spread', dietary: ['vegetarian'], allergens: ['gluten', 'dairy', 'egg', 'nuts'], available: true, availabilityNote: 'Sunday lunch only' },
  { id: 'catch-of-the-day', name: 'Catch of the Day', description: 'Whole fish from the morning market, cooked over embers and served with charred lemon.', price: 52, category: 'specials', dietary: ['gluten-free', 'dairy-free', 'nut-free'], allergens: ['fish'], available: false, availabilityNote: 'Sold out today' },

  // Tasting menus
  {
    id: 'saffron-tasting',
    name: 'The Saffron Tasting',
    description: 'Seven courses that follow the kitchen’s fire, from first bite to last. Offered to the whole table.',
    price: 135,
    priceNote: 'per person',
    category: 'tasting',
    image: 'chef-plating',
    dietary: [],
    allergens: ['gluten', 'dairy', 'egg', 'fish', 'shellfish', 'nuts', 'sesame', 'celery', 'sulphites'],
    available: true,
    featured: true,
    courses: ['Warm saffron bread, whipped butter', 'Tuna, heritage tomato', 'Charred fennel, whipped feta', 'Saffron salmon, lemon & coconut', 'Ember-glazed short rib', 'Cheese & honeycomb', 'Dark chocolate ganache cake'],
    pairing: { label: 'Wine pairing', price: 75 },
    availabilityNote: 'Tuesday – Sunday dinner',
  },
  {
    id: 'garden-tasting',
    name: 'The Garden Tasting',
    description: 'A vegetarian seven-course menu led by the best of the market, with vegan adaptations on request.',
    price: 118,
    priceNote: 'per person',
    category: 'tasting',
    image: 'veg-board',
    dietary: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'egg', 'nuts', 'sesame', 'celery', 'sulphites'],
    available: true,
    courses: ['Warm saffron bread, olive oil', 'Avocado, pomegranate & winter leaves', 'Roasted carrot & saffron soup', 'Charred cauliflower, chickpea & tahini', 'Wild mushroom risotto', 'Seasonal fruit tartlet', 'Warm chocolate brownie'],
    pairing: { label: 'Wine pairing', price: 70 },
  },
  {
    id: 'chefs-table',
    name: 'Chef’s Counter Menu',
    description: 'Ten courses cooked and served at the counter, with Chef Elias at the pass. Eight seats, two sittings.',
    price: 195,
    priceNote: 'per person',
    category: 'tasting',
    image: 'open-kitchen',
    dietary: [],
    allergens: ['gluten', 'dairy', 'egg', 'fish', 'shellfish', 'nuts', 'sesame', 'celery', 'sulphites'],
    available: true,
    courses: ['Welcome bite', 'Oyster, saffron, lemon', 'Tuna, heritage tomato', 'Prawn & saffron stew', 'Charred fennel', 'Saffron seafood paella', 'Dry-aged duck', 'Cheese course', 'Raspberry layer cake', 'Petit fours'],
    pairing: { label: 'Reserve pairing', price: 110 },
    availabilityNote: 'Thursday – Saturday, counter seating only',
  },
];

/** Optional featured sections shown at the top of the Menus page. Set to [] to hide them. */
export const featuredMenuSections: FeaturedMenuSection[] = [
  {
    id: 'house-favourites',
    title: 'House favourites',
    intro: 'What regulars order first.',
    itemIds: ['saffron-salmon', 'ember-short-rib', 'saffron-seafood-paella', 'chocolate-ganache-cake'],
  },
];

export const menuPageContent = {
  eyebrow: 'The menus',
  title: 'From the fire & the pantry',
  lead: 'Prices are in US dollars. Menus are demonstration content and change with the season.',
  searchPlaceholder: 'Search dishes, ingredients or drinks',
  showFeaturedSections: true,
};
