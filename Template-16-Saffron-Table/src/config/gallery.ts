import type { GalleryItem } from './types';

export const galleryCategories = ['The Plate', 'The Room', 'The Kitchen', 'Gatherings'];

export const galleryContent = {
  eyebrow: 'Gallery',
  title: 'The plates, the room, the evenings',
  lead: 'Use the arrow keys or swipe to move through photographs. Press Escape to close.',
};

export const galleryItems: GalleryItem[] = [
  { image: 'salmon-curry', category: 'The Plate', caption: 'Saffron salmon with lemon' },
  { image: 'paella', category: 'The Plate', caption: 'Seafood paella from the terrace grill' },
  { image: 'ribs-board', category: 'The Plate', caption: 'Ember-glazed short rib' },
  { image: 'steak-fries', category: 'The Plate', caption: 'Dry-aged sirloin and fries' },
  { image: 'chocolate-cake', category: 'The Plate', caption: 'Dark chocolate ganache cake' },
  { image: 'tarts', category: 'The Plate', caption: 'Seasonal fruit tartlets' },
  { image: 'prawn-spaghetti', category: 'The Plate', caption: 'Chilli prawn spaghetti' },
  { image: 'buddha-bowl', category: 'The Plate', caption: 'Charred cauliflower and chickpea bowl' },
  { image: 'cocktail', category: 'The Plate', caption: 'Saffron old fashioned' },
  { image: 'dining-dark', category: 'The Room', caption: 'The main room at dusk' },
  { image: 'dining-green', category: 'The Room', caption: 'The green banquette' },
  { image: 'dining-tables', category: 'The Room', caption: 'The Cellar Table' },
  { image: 'dining-teal', category: 'The Room', caption: 'The Saffron Room' },
  { image: 'dining-window', category: 'The Room', caption: 'Window tables, lunchtime' },
  { image: 'terrace', category: 'The Room', caption: 'The terrace' },
  { image: 'open-kitchen', category: 'The Kitchen', caption: 'The open kitchen' },
  { image: 'chef-plating', category: 'The Kitchen', caption: 'Plating at the pass' },
  { image: 'kitchen-pass', category: 'The Kitchen', caption: 'Service at the pass' },
  { image: 'cooking-team', category: 'The Kitchen', caption: 'Prep in the morning kitchen' },
  { image: 'chopping', category: 'The Kitchen', caption: 'Herbs and mushrooms for the ragù' },
  { image: 'group-dinner', category: 'Gatherings', caption: 'A group dinner' },
  { image: 'friends-dinner', category: 'Gatherings', caption: 'Sharing plates' },
  { image: 'hero-table', category: 'Gatherings', caption: 'A table set for celebration' },
  { image: 'long-tables', category: 'Gatherings', caption: 'Long tables for large parties' },
];
